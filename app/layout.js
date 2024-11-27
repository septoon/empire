import { Providers } from "./GlobalRedux/provider";
import "./globals.css";

export const metadata = {
  title: "Империя сияния",
  description: "Студия красоты «Империя сияния»",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
            <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        {/* <meta name="yandex-verification" content="78aa700c47bf7bf0" /> */}
        {/* <meta name="google-site-verification" content="et7FgAkduvH-MnEIr8xMcwPIO216XHQhmPvcTg778Rk" /> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://empire-zeta.vercel.app" />
        <meta property="og:title" content="Империя сияния" />
        <meta property="og:description" content="Лазерная эпиляция в Алуште" />
        {/* <meta property="og:image" content="https://shashlichny-dom.ru/image.jpg" /> */}
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://empire-zeta.vercel.app" />
        <meta property="twitter:title" content="Империя сияния" />
        <meta property="twitter:description" content="азерная эпиляция в Алуште" />
        {/* <meta property="twitter:image" content="https://shashlichny-dom.ru/image.jpg" /> */}

        <script
            dangerouslySetInnerHTML={{
              __html: `
                const style = document.createElement('style')
                style.innerHTML = '@layer tailwind-base, primereact, tailwind-utilities;'
                style.setAttribute('type', 'text/css')
                document.querySelector('head').prepend(style)
              `,
            }}
          />
      </head>
      <body
        className='antialiased bg-gradient-to-r from-pink-300  via-purple-300 to-indigo-400'
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}