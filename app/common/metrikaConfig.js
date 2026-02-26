export const YANDEX_METRIKA_ENV_KEY = 'NEXT_PUBLIC_YANDEX_METRIKA_ID';
export const YANDEX_METRIKA_DATALAYER = 'dataLayer';
export const YANDEX_METRIKA_CURRENCY = 'RUB';

export function getRequiredMetrikaCounterId() {
  const rawCounterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

  if (!rawCounterId) {
    throw new Error(
      `[Metrika] Missing required environment variable: ${YANDEX_METRIKA_ENV_KEY}`
    );
  }

  if (!/^\d+$/.test(rawCounterId)) {
    throw new Error(
      `[Metrika] ${YANDEX_METRIKA_ENV_KEY} must be a positive integer string`
    );
  }

  return Number(rawCounterId);
}
