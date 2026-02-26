import {
  YANDEX_METRIKA_CURRENCY,
  YANDEX_METRIKA_DATALAYER,
} from './metrikaConfig';

const MAX_DATALAYER_PAYLOAD_SIZE = 8192;
const OPTIONAL_PRODUCT_FIELDS = ['category', 'list', 'position', 'variant'];

const COLLECTION_PATHS = [
  ['ecommerce', 'impressions'],
  ['ecommerce', 'detail', 'products'],
  ['ecommerce', 'add', 'products'],
  ['ecommerce', 'remove', 'products'],
  ['ecommerce', 'purchase', 'products'],
  ['ecommerce', 'promoView', 'promotions'],
  ['ecommerce', 'promoClick', 'promotions'],
];

const isBrowser = () => typeof window !== 'undefined';

const toSafeString = (value, maxLength = 250) => {
  if (value === null || value === undefined) return null;
  const stringValue = String(value).trim();
  if (!stringValue) return null;
  return stringValue.slice(0, maxLength);
};

const toSafeNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const normalizedString = String(value)
    .replace(',', '.')
    .replace(/\s+/g, '')
    .replace(/[^\d.-]/g, '');
  const numericValue = Number(normalizedString);

  if (!Number.isFinite(numericValue)) return null;

  return Math.round(numericValue * 100) / 100;
};

const toSafeInteger = (value, fallback = 1) => {
  const parsedValue = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) return fallback;
  return parsedValue;
};

const normalizeCurrency = (currency) => {
  const normalizedCurrency = toSafeString(currency, 8);
  return normalizedCurrency ? normalizedCurrency.toUpperCase() : YANDEX_METRIKA_CURRENCY;
};

const fallbackProductId = (name) => {
  const normalizedName = name
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '');

  return normalizedName || null;
};

const getByPath = (target, path) => {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), target);
};

const clonePayload = (payload) => {
  try {
    return JSON.parse(JSON.stringify(payload));
  } catch (error) {
    console.warn('[Metrika][Ecommerce] Unable to clone payload:', error);
    return null;
  }
};

const getPayloadSize = (payload) => {
  try {
    return JSON.stringify(payload).length;
  } catch (error) {
    return Number.POSITIVE_INFINITY;
  }
};

const isYmDebugEnabled = () => {
  if (!isBrowser()) return false;

  const params = new URLSearchParams(window.location.search);
  return params.get('_ym_debug') === '2';
};

const debugLog = (message, payload) => {
  if (!isYmDebugEnabled()) return;
  console.info(`[Metrika][Ecommerce] ${message}`, payload);
};

const ensureDataLayer = () => {
  if (!isBrowser()) return null;

  if (!Array.isArray(window[YANDEX_METRIKA_DATALAYER])) {
    window[YANDEX_METRIKA_DATALAYER] = [];
  }

  return window[YANDEX_METRIKA_DATALAYER];
};

const fitPayloadToLimit = (payload, eventName) => {
  const draft = clonePayload(payload);
  if (!draft) return null;

  if (getPayloadSize(draft) <= MAX_DATALAYER_PAYLOAD_SIZE) {
    return draft;
  }

  COLLECTION_PATHS.forEach((path) => {
    const collection = getByPath(draft, path);
    if (!Array.isArray(collection)) return;

    collection.forEach((item) => {
      if (!item || typeof item !== 'object') return;

      OPTIONAL_PRODUCT_FIELDS.forEach((fieldName) => {
        delete item[fieldName];
      });
    });
  });

  if (getPayloadSize(draft) <= MAX_DATALAYER_PAYLOAD_SIZE) {
    draft.eventMeta = {
      truncated: true,
      strategy: 'drop_optional_fields',
    };
    return draft;
  }

  while (getPayloadSize(draft) > MAX_DATALAYER_PAYLOAD_SIZE) {
    const candidates = COLLECTION_PATHS
      .map((path) => ({
        path,
        items: getByPath(draft, path),
      }))
      .filter(({ items }) => Array.isArray(items) && items.length > 1)
      .sort((a, b) => b.items.length - a.items.length);

    if (!candidates.length) {
      break;
    }

    candidates[0].items.pop();
  }

  if (getPayloadSize(draft) <= MAX_DATALAYER_PAYLOAD_SIZE) {
    draft.eventMeta = {
      truncated: true,
      strategy: 'drop_tail_items',
    };
    return draft;
  }

  console.warn(
    `[Metrika][Ecommerce] Event dropped because payload still exceeds ${MAX_DATALAYER_PAYLOAD_SIZE} chars`,
    eventName
  );

  return null;
};

const pushEcommerceEvent = (eventName, ecommercePayload) => {
  const dataLayer = ensureDataLayer();
  if (!dataLayer) return false;

  const payload = {
    event: eventName,
    ecommerce: ecommercePayload,
  };

  const fittedPayload = fitPayloadToLimit(payload, eventName);
  if (!fittedPayload) return false;

  dataLayer.push({ ecommerce: null });
  dataLayer.push(fittedPayload);

  debugLog(`Pushed ${eventName}`, fittedPayload);

  return true;
};

export const normalizeProduct = (product, defaults = {}) => {
  if (!product || typeof product !== 'object') {
    return null;
  }

  const source = { ...defaults, ...product };
  const productName = toSafeString(source.name ?? source.title);
  const productId =
    toSafeString(source.id ?? source.sku ?? source.code, 120) ||
    (productName ? fallbackProductId(productName) : null);
  const productPrice = toSafeNumber(source.price);

  if (!productId || !productName || productPrice === null || productPrice < 0) {
    return null;
  }

  const normalizedProduct = {
    id: productId,
    name: productName,
    price: productPrice,
    quantity: toSafeInteger(source.quantity, 1),
  };

  const category = toSafeString(source.category, 120);
  const list = toSafeString(source.list, 120);
  const variant = toSafeString(source.variant, 120);
  const position = toSafeInteger(source.position, 0);

  if (category) normalizedProduct.category = category;
  if (list) normalizedProduct.list = list;
  if (variant) normalizedProduct.variant = variant;
  if (position > 0) normalizedProduct.position = position;

  return normalizedProduct;
};

const normalizeProducts = (products, defaults = {}) => {
  const sourceProducts = Array.isArray(products) ? products : [products];

  return sourceProducts
    .map((product) => normalizeProduct(product, defaults))
    .filter(Boolean);
};

const calculateRevenue = (products) => {
  return products.reduce((sum, product) => {
    return sum + product.price * (product.quantity || 1);
  }, 0);
};

const createProductDefaults = (options) => {
  const defaults = {};

  const list = toSafeString(options.list, 120);
  const category = toSafeString(options.category, 120);
  const variant = toSafeString(options.variant, 120);

  if (list) defaults.list = list;
  if (category) defaults.category = category;
  if (variant) defaults.variant = variant;

  return defaults;
};

export const trackImpressions = (products, options = {}) => {
  const defaults = createProductDefaults(options);
  const normalizedProducts = normalizeProducts(products, defaults);

  if (!normalizedProducts.length) {
    console.warn('[Metrika][Ecommerce] impressions skipped: empty/invalid payload');
    return false;
  }

  return pushEcommerceEvent('ecommerce.impressions', {
    currencyCode: normalizeCurrency(options.currency),
    impressions: normalizedProducts,
  });
};

export const trackDetail = (product, options = {}) => {
  const defaults = createProductDefaults(options);
  const normalizedProducts = normalizeProducts(product, defaults);

  if (!normalizedProducts.length) {
    console.warn('[Metrika][Ecommerce] detail skipped: empty/invalid payload');
    return false;
  }

  return pushEcommerceEvent('ecommerce.detail', {
    currencyCode: normalizeCurrency(options.currency),
    detail: {
      products: normalizedProducts,
    },
  });
};

export const trackAdd = (products, options = {}) => {
  const defaults = createProductDefaults(options);
  const normalizedProducts = normalizeProducts(products, defaults);

  if (!normalizedProducts.length) {
    console.warn('[Metrika][Ecommerce] add skipped: empty/invalid payload');
    return false;
  }

  return pushEcommerceEvent('ecommerce.add', {
    currencyCode: normalizeCurrency(options.currency),
    add: {
      products: normalizedProducts,
    },
  });
};

export const trackRemove = (products, options = {}) => {
  const defaults = createProductDefaults(options);
  const normalizedProducts = normalizeProducts(products, defaults);

  if (!normalizedProducts.length) {
    console.warn('[Metrika][Ecommerce] remove skipped: empty/invalid payload');
    return false;
  }

  return pushEcommerceEvent('ecommerce.remove', {
    currencyCode: normalizeCurrency(options.currency),
    remove: {
      products: normalizedProducts,
    },
  });
};

export const trackPurchase = ({
  orderId,
  products,
  revenue,
  affiliation,
  coupon,
  shipping,
  tax,
  currency,
  list,
  category,
  variant,
}) => {
  const normalizedOrderId = toSafeString(orderId, 120);
  const defaults = createProductDefaults({ list, category, variant });
  const normalizedProducts = normalizeProducts(products, defaults);

  if (!normalizedOrderId || !normalizedProducts.length) {
    console.warn('[Metrika][Ecommerce] purchase skipped: empty/invalid payload');
    return false;
  }

  const computedRevenue = toSafeNumber(revenue);
  const totalRevenue = computedRevenue ?? calculateRevenue(normalizedProducts);

  const actionField = {
    id: normalizedOrderId,
    revenue: totalRevenue,
  };

  const normalizedAffiliation = toSafeString(affiliation, 120);
  const normalizedCoupon = toSafeString(coupon, 64);
  const normalizedShipping = toSafeNumber(shipping);
  const normalizedTax = toSafeNumber(tax);

  if (normalizedAffiliation) actionField.affiliation = normalizedAffiliation;
  if (normalizedCoupon) actionField.coupon = normalizedCoupon;
  if (normalizedShipping !== null) actionField.shipping = normalizedShipping;
  if (normalizedTax !== null) actionField.tax = normalizedTax;

  return pushEcommerceEvent('ecommerce.purchase', {
    currencyCode: normalizeCurrency(currency),
    purchase: {
      actionField,
      products: normalizedProducts,
    },
  });
};

const normalizePromotion = (promotion) => {
  if (!promotion || typeof promotion !== 'object') return null;

  const id = toSafeString(promotion.id, 120);
  const name = toSafeString(promotion.name, 120);

  if (!id && !name) return null;

  const normalizedPromotion = {};

  if (id) normalizedPromotion.id = id;
  if (name) normalizedPromotion.name = name;

  const creative = toSafeString(promotion.creative, 120);
  const position = toSafeString(promotion.position, 120);

  if (creative) normalizedPromotion.creative = creative;
  if (position) normalizedPromotion.position = position;

  return normalizedPromotion;
};

const normalizePromotions = (promotions) => {
  const sourcePromotions = Array.isArray(promotions) ? promotions : [promotions];

  return sourcePromotions.map(normalizePromotion).filter(Boolean);
};

export const trackPromoView = (promotions) => {
  const normalizedPromotions = normalizePromotions(promotions);

  if (!normalizedPromotions.length) {
    console.warn('[Metrika][Ecommerce] promoView skipped: empty/invalid payload');
    return false;
  }

  return pushEcommerceEvent('ecommerce.promoView', {
    promoView: {
      promotions: normalizedPromotions,
    },
  });
};

export const trackPromoClick = (promotions) => {
  const normalizedPromotions = normalizePromotions(promotions);

  if (!normalizedPromotions.length) {
    console.warn('[Metrika][Ecommerce] promoClick skipped: empty/invalid payload');
    return false;
  }

  return pushEcommerceEvent('ecommerce.promoClick', {
    promoClick: {
      promotions: normalizedPromotions,
    },
  });
};
