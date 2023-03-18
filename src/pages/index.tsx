import NavPage from '@/components/NavPage';
import { poppinsFont } from '@/lib/nextFonts';
import Head from 'next/head';

export default function Home() {
  return (
    <div className={`${poppinsFont.variable}`}>
      <Head>
        <title>Situs Penjualan Voucher Games Online | Happy</title>
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
        <div className="container relative mx-auto max-w-6xl px-6 lg:px-0">
          <div className="pt-4 pb-6">
            <div className="mb-8">
              <label htmlFor="search-product" className="inline-block w-full">
                <input
                  className="inline-block w-full rounded-md bg-zinc-800 p-4 placeholder:text-zinc-600 md:placeholder:text-lg"
                  type="text"
                  placeholder="Cari produk"
                  id="search-product"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
