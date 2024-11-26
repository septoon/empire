import Image from "next/image";
import Services from "./components/Services";
import DialogForm from "./components/DialogForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen text-white font-comfortaa">
      <header className="w-full flex justify-between items-center py-2 px-4">
        <div className="w-[62px] h-[62px] bg-white rounded-full flex items-center justify-center backdrop-shadow-md">
          <Image
            src="/logo.png"
            alt="Логотип Империи сияния"
            width={60}
            height={60}
            priority
          />
        </div>
        <h1 className="text-2xl  text-white">
         Империя сияния
        </h1>
      </header>
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <div className="w-full flex flex-col justify-between p-4 h-[500px] bg-main bg-cover bg-no-repeat bg-center">
          <h2 className="text-5xl drop-shadow-lg">Лазерная эпиляция всего тела</h2>
          <div className="flex">
          <p className="text-5xl font-bold drop-shadow-lg">3990 ₽/ </p>
          <p className="text-2xl drop-shadow-lg"><s>9990 ₽</s></p>
          </div>
        <DialogForm />
        </div>
        <p className="text-center sm:text-left text-lg">
          Мы предлагаем широкий спектр услуг для вашей красоты и здоровья.
        </p>
        <Services />
        <DialogForm />
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center mt-16">
        <p>© 2023 Империя сияния</p>
      </footer>
    </div>
  );
}