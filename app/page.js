import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen font-[family-name:var(--font-geist-sans)] text-white font-comfortaa">
      <header className="w-full flex justify-between items-center px-4">
        <Image
          src="/logo.png"
          alt="Логотип Империи сияния"
          width={60}
          height={60}
          priority
        />
        <h1 className="text-2xl  text-white">
         Империя сияния
        </h1>
      </header>
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <div className="w-full flex flex-col justify-between p-8 h-[500px] bg-main bg-cover bg-no-repeat bg-center">
          <h2 className="text-5xl drop-shadow-lg">Лазерная эпиляция всего тела</h2>
          <div className="flex">
          <p className="text-5xl font-bold drop-shadow-lg">3990 ₽/ </p>
          <p className="text-2xl drop-shadow-lg"><s>9990 ₽</s></p>
          </div>
          <button className="w-full py-2 text-xl font-bold bg-primary rounded-lg ">Записаться</button>
        </div>
        <p className="text-center sm:text-left text-lg">
          Мы предлагаем широкий спектр услуг для вашей красоты и здоровья.
        </p>
        <ul className="list-disc list-inside text-left space-y-2">
          <li>🌟 Парикмахерские услуги</li>
          <li>💅 Маникюр и педикюр</li>
          <li>💆 Косметология</li>
          <li>🌺 Массаж и спа-процедуры</li>
        </ul>
        <a
          className="mt-8 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-full transition duration-300 shadow-lg transform hover:scale-105"
          href="/contact"
        >
          Связаться с нами
        </a>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center mt-16">
        <p>© 2023 Империя сияния</p>
      </footer>
    </div>
  );
}