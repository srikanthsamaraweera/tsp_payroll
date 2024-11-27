import { faComputer, faDashboard, faMoneyBill1Wave, faMoneyCheckDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[60vh] p-8  gap-16  font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center">
        {/* <div className="flex text-center m-auto">
          <FontAwesomeIcon className="text-9xl" icon={faMoneyCheckDollar} />
        </div> */}


        <h1 className="text-6xl">TSP Manpower: Payroll system</h1>
        <div className="flex text-center m-auto">
          <Link href={'/admin-dashboard'}>
            <div className="border-green-500 border-4 p-4 rounded-xl text-green-500 hover:text-white hover:bg-green-500">
              <FontAwesomeIcon className="text-9xl cursor-pointer " icon={faComputer} />
              <p className="text-7xl">Start</p>
            </div>

          </Link>


        </div>


      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://designx.solutions"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to DesignX.Solutions →
        </a>
      </footer>
    </div>
  );
}
