import { Providers } from "./GlobalRedux/provider";

import "./globals.css";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

export const metadata = {
  title: "Империя сияния",
  description: "Лазерная эпиляция в Алуште «Империя сияния»",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
            <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#bf6850" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="description" content={metadata.description} />
        <meta name="yandex-verification" content="512035b8fa9ffe03" />
        <meta name="google-site-verification" content="MGRXVFZa8QmzFBb_6RVFRNI7Z1hZC7dfAer6zbks_bI" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://imperia-siyaniya.ru" />
        <meta property="og:title" content="Империя сияния" />
        <meta property="og:description" content="Лазерная эпиляция в Алуште" />
        <meta property="og:image" content="https://imperia-siyaniya.ru/image.webp" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://imperia-siyaniya.ru" />
        <meta property="twitter:title" content="Империя сияния" />
        <meta property="twitter:description" content="Лазерная эпиляция в Алуште" />
        <meta property="twitter:image" content="https://imperia-siyaniya.ru/image.webp" />

        <script
            dangerouslySetInnerHTML={{
              __html: `
                const style = document.createElement('style')
                style.innerHTML = '@layer tailwind-base, tailwind-utilities;'
                style.setAttribute('type', 'text/css')
                document.querySelector('head').prepend(style)
              `,
            }}
          />
      </head>
      <body
        className='w-full box-border antialiased bg-gradient-to-r from-mainBgStart  via-mainBgMiddle to-mainBg'
      >
        <Providers>
        <MantineProvider>
          <Notifications />
          {children}
          </MantineProvider>
        </Providers>
      </body>
    </html>
  );
}