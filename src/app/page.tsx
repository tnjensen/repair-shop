import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black bg-home-img bg-cover bg-center">

      <main className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh">
        <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/90 w-4/5 sm:max-w-96 mx-auto text-white">
          <h1 className="text-4xl font-bold">Dan&apos;s Computer<br />Repair Shop</h1>
          <address>
            Trondheimsveien 55<br />
            7000 Trondheim
          </address>
          <p>
            Open Daily: 9am to 5pm
          </p>
          <Link href="tel:73003700" className="hover:underline"></Link>
        </div>
      </main>

    </div>
  );
}
