import CheckoutBoard from '@/components/CheckoutBoard';
import NavPage from '@/components/NavPage';
import { poppinsFont } from '@/lib/nextFonts';
import Head from 'next/head';
import Image from 'next/image';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import googlePlayLogo from '../../assets/logos/google-play-logo.png';

type TotalProductOps = 'minus' | 'plus';

export default function ProductDetail() {
  const [totalProduct, setTotalProduct] = useState<number>(() => 1);
  const [openCheckout, setOpenCheckout] = useState<boolean>(() => false);

  const totalProductHandler = (e: MouseEvent<HTMLButtonElement>) => {
    const totalProductOps = e.currentTarget.dataset
      .totalProductOps as TotalProductOps;

    if (totalProductOps === 'minus' && totalProduct > 1) {
      setTotalProduct((prevValue) => prevValue - 1);
    }

    if (totalProductOps === 'plus' && totalProduct <= totalProduct) {
      setTotalProduct((prevValue) => prevValue + 1);
    }
  };

  const orderHandler = () => {
    return;
  };

  const closeCheckoutHandler = () => {
    setOpenCheckout(() => false);
    document.body.classList.remove('overflow-hidden');
  };

  return (
    <div className={`${poppinsFont.variable}`}>
      <Head>
        <title>Jual Kode Voucher Google Play IDR5000 | Happy</title>
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
              Detail Produk
            </h1>

            <article className="mb-8 md:grid md:grid-cols-2 md:gap-x-4 lg:mb-12">
              <div className="mb-4 md:h-full">
                <div className="rounded-md bg-zinc-100 py-10 md:flex md:h-full md:items-center md:justify-center md:py-0">
                  <Image
                    className="mx-auto h-24 w-max md:h-24 lg:h-32"
                    src={googlePlayLogo}
                    alt="Logo Google Play beserta teks"
                    priority
                  />
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between md:grid md:gap-y-2">
                  <div className="rounded-md bg-rose-600 p-1 md:max-w-max">
                    <p className="text-sm">Kode Voucher</p>
                  </div>

                  <div className="rounded-md bg-rose-600 p-1 md:max-w-max">
                    <p className="text-sm">Stok: 100</p>
                  </div>
                </div>

                <div className="mb-2 lg:mb-4 lg:grid lg:gap-y-2">
                  <h3 className="font-poppins text-xl font-bold lg:text-4xl">
                    Kode Voucher Google Play
                  </h3>

                  <p className="lg:text-lg">(IDR 5000)</p>
                </div>

                <div className="mb-2 lg:grid lg:gap-y-2">
                  <h4 className="mb-1 font-poppins font-bold lg:text-3xl">
                    Harga
                  </h4>
                  <p className="lg:text-xl">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(5500)}
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="mb-1 font-poppins font-bold lg:text-3xl">
                    Jumlah Pembelian
                  </h4>
                  <div className="grid w-max grid-cols-3 gap-x-2">
                    <button
                      className="inline-block rounded-md bg-zinc-800"
                      type="button"
                      onClick={totalProductHandler}
                      data-total-product-ops="minus"
                      aria-label="Tombol mengurangi satu pembelian produk"
                    >
                      <span>-</span>
                    </button>

                    <p
                      className="flex h-10 w-10 select-none items-center justify-center rounded-md bg-zinc-600"
                      aria-label={`Total pembelian saat ini berjumlah ${totalProduct}`}
                    >
                      {totalProduct}
                    </p>

                    <button
                      className="inline-block h-10 w-10 rounded-md bg-zinc-800 text-xl"
                      type="button"
                      onClick={totalProductHandler}
                      data-total-product-ops="plus"
                      aria-label="Tombol menambahkan satu pembelian produk"
                    >
                      <span>+</span>
                    </button>
                  </div>
                </div>

                <button
                  className="inline-block w-full rounded-md bg-rose-600 py-3 text-center font-poppins text-lg font-semibold lg:text-xl"
                  type="button"
                  onClick={orderHandler}
                >
                  Beli
                </button>
              </div>
            </article>

            <CheckoutBoard
              openCheckout={openCheckout}
              closeCheckoutHandler={closeCheckoutHandler}
              productName="Kode Voucher Google Play"
              productPriceName="IDR 5000"
              totalProduct={2}
              totalPrice={5500}
            />

            <section>
              <h2 className="font-poppins text-xl font-bold lg:text-3xl">
                Ulasan Produk
              </h2>

              <div className="pt-4 pb-6">
                <p>Belum ada ulasan mengenai produk ini.</p>
              </div>

              <div className="hidden pt-4 lg:pt-6">
                <div className="grid gap-y-4"></div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
