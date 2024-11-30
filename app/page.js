import Image from "next/image";
import Services from "./components/Services";
import DialogForm from "./components/DialogForm";
import FooterComponent from "./components/FooterComponent";
import { FaHeart, FaHandHoldingWater } from "react-icons/fa";
import { BsDropletFill } from "react-icons/bs";
import { RiNumber5 } from "react-icons/ri";


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
        <div className="flex flex-col items-end">
          <h1 className="text-2xl text-white">Империя сияния</h1>
          <p>Алушта</p>
        </div>
      </header>
      <main className="flex flex-col gap-8 px-4 items-center">
        <div className="w-full flex flex-col justify-between p-4 h-[500px] bg-main bg-cover bg-no-repeat bg-center rounded-2xl">
          <div className="flex flex-col">
            <h2 className="text-4xl drop-shadow-lg mb-2">Лазерная эпиляция от</h2>
            <p className="text-5xl font-bold drop-shadow-lg">300 ₽ </p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl drop-shadow-lg mb-2">Эпиляция нового поколения с апаратом</h2>
            <p className="text-5xl font-extrabold drop-shadow-lg">MLG LASER </p>
          </div>
          <DialogForm />
        </div>
        <section className="flex flex-col items-start w-full px-4 py-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-lg">
          <h2 className="text-4xl font-bold mb-6 text-white">Преимущества:</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <FaHeart className="text-pink-400 text-2xl" />
              <p className="text-lg">
                Безболезненно — благодаря оптимальной длине волны
              </p>
            </li>
            <li className="flex items-center gap-4">
              <RiNumber5 className="text-yellow-400 text-2xl" />
              <p className="text-lg">Результат от процедур до 5 лет</p>
            </li>
            <li className="flex items-center gap-4">
              <BsDropletFill className="text-blue-400 text-2xl" />
              <p className="text-lg">
                Подходит для любого фототипа кожи и структуры волос
              </p>
            </li>
            <li className="flex items-center gap-4">
              <FaHandHoldingWater className="text-green-400 text-2xl" />
              <p className="text-lg">
                Без риска ожогов и негативного влияния на кожу
              </p>
            </li>
          </ul>
        </section>
        <Services />
      </main>
      <FooterComponent />
    </div>
  );
}