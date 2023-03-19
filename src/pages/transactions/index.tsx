import NavPage from '@/components/NavPage';
import { poppinsFont } from '@/lib/nextFonts';
import Head from 'next/head';
import Link from 'next/link';

export default function Transaction() {
  return (
    <div className={`${poppinsFont.variable}`}>
      <Head>
        <title>Transaksi Pemesanan | Happy</title>
        <link
          rel="icon"
          href="/assets/icons/happy-icon-light-24.svg"
          type="image/svg+xml"
        />
      </Head>

      <header>
        <NavPage />
      </header>

      <main>
        <div className="container mx-auto max-w-6xl px-6 lg:px-0">
          <div className="pt-8 pb-10 lg:pt-16">
            <h1 className="mb-4 text-center font-poppins text-2xl font-bold md:mb-8 lg:mb-16 lg:text-4xl">
              Transaksi Pemesanan
            </h1>

            <div>
              <div className="">
                <p className="mx-auto max-w-max rounded-md bg-zinc-800 p-2 text-center">
                  Transaksi Anda kosong.{' '}
                  <span className="text-rose-600 underline">
                    <Link href="/">
                      Ayo pesan voucher permainan Anda sekarang!
                    </Link>
                  </span>
                </p>
              </div>

              <div className="hidden">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
