import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] text-white">
      <header className="flex flex-col items-center">
        <Image
          src="/logo.png"
          alt="Логотип Империи сияния"
          width={180}
          height={180}
          priority
        />
        <h1 className="text-5xl mt-4 font-bold text-pink-500 drop-shadow-lg">
          Добро пожаловать в «Империю сияния»
        </h1>
      </header>
      <main className="flex flex-col gap-8 items-center sm:items-start">
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