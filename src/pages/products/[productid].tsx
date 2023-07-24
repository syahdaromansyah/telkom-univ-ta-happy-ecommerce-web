import CheckoutBoard from '@/components/CheckoutBoard';
import FeedbackCard from '@/components/FeedbackCard';
import NavPage from '@/components/NavPage';
import config from '@/config/config';
import { poppinsFont } from '@/lib/nextFonts';
import { useAppSelector } from '@/redux-app/redux-typed-hook/typedHooks';
import { authSelector } from '@/redux-app/slices/authSlice';
import type { ProductData, WebResponse } from '@/types/types';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';
import useSWR from 'swr';
import googlePlayLogo from '../../assets/logos/google-play-logo.png';
import pointBlankLogo from '../../assets/logos/point-blank-logo.png';
import steamLogo from '../../assets/logos/steam-logo.png';

type TotalProductOps = 'minus' | 'plus';

const productBrand = {
  'google-play': googlePlayLogo,
  steam: steamLogo,
  'point-blank': pointBlankLogo,
};

const swrFetcher = (url: string) =>
  axios
    .get<WebResponse<ProductData>>(url, {
      withCredentials: true,
    })
    .then((res) => res.data);

export default function ProductDetail() {
  const [totalProduct, setTotalProduct] = useState<number>(() => 1);
  const [openCheckout, setOpenCheckout] = useState<boolean>(() => false);
  const nextRouter = useRouter();
  const { data: productResponse, isLoading } = useSWR(
    nextRouter.query.productid
      ? `${config.HAPPY_BASE_URL_API}/products/${
          nextRouter.query.productid as string
        }`
      : null,
    swrFetcher
  );

  const { id } = useAppSelector(authSelector);

  const productData = productResponse?.data;

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
    setOpenCheckout(() => true);
    document.body.classList.add('overflow-hidden');
  };

  const closeCheckoutHandler = () => {
    setOpenCheckout(() => false);
    document.body.classList.remove('overflow-hidden');
  };

  return (
    <>
      {isLoading ? null : (
        <div className={`${poppinsFont.variable}`}>
          <Head>
            {productData && (
              <title>
                Jual {productData.name} {productData.priceName} | Happy
              </title>
            )}

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
              <div className="pb-10 pt-8 lg:pt-16">
                <h1 className="mb-4 text-center font-poppins text-2xl font-bold md:mb-8 lg:mb-16 lg:text-4xl">
                  Detail Produk
                </h1>

                <article className="mb-8 md:grid md:grid-cols-2 md:gap-x-4 lg:mb-12">
                  <div className="mb-4 md:h-full">
                    <div className="rounded-md bg-zinc-100 py-10 md:flex md:h-full md:items-center md:justify-center md:py-0">
                      {productData && (
                        <Image
                          className="mx-auto h-24 w-max md:h-24 lg:h-32"
                          src={productBrand[productData.brand]}
                          alt={`Logo ${productData.name} beserta teks`}
                          priority
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between gap-x-4 md:justify-start">
                      <div className="rounded-md bg-rose-600 p-1 md:max-w-max">
                        <p className="text-sm md:text-lg">
                          {productData && productData.type}
                        </p>
                      </div>

                      <div className="rounded-md bg-rose-600 p-1 md:max-w-max">
                        <p className="text-sm md:text-lg">
                          Stok:{' '}
                          {productData && (
                            <>
                              {productData.productStock === 0
                                ? 'Kosong'
                                : productData.productStock}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="rounded-md bg-indigo-600 p-1 md:max-w-max">
                        <p className="text-sm md:text-lg">
                          Reservasi:{' '}
                          {productData && (
                            <>
                              {productData.reservation ===
                              productData.productStock
                                ? 'Penuh'
                                : productData.reservation}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mb-2 lg:mb-4 lg:grid lg:gap-y-2">
                      <h3 className="font-poppins text-xl font-bold lg:text-4xl">
                        {productData?.name}
                      </h3>

                      <p className="lg:text-lg">
                        ({productData && productData.priceName})
                      </p>
                    </div>

                    <div className="mb-2 lg:grid lg:gap-y-2">
                      <h4 className="mb-1 font-poppins font-bold lg:text-3xl">
                        Harga
                      </h4>

                      {productData && (
                        <p className="lg:text-xl">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(productData.productPrice)}
                        </p>
                      )}
                    </div>

                    <div className="mb-8">
                      <h4 className="mb-1 font-poppins font-bold lg:text-3xl">
                        Jumlah Pembelian
                      </h4>
                      <div className="grid w-max grid-cols-3 gap-x-2">
                        <label
                          className="absolute left-[-9999px] top-[-9999px] inline-block"
                          htmlFor="subtract-total-product"
                        >
                          Kurangi satu dari total produk
                        </label>

                        <button
                          className="inline-block rounded-md bg-zinc-800 disabled:text-zinc-600"
                          type="button"
                          onClick={totalProductHandler}
                          data-total-product-ops="minus"
                          disabled={id === ''}
                          id="subtract-total-product"
                        >
                          <span aria-hidden="true" className="inline-block">
                            -
                          </span>
                        </button>

                        <div>
                          <p className="absolute left-[-9999px] top-[-9999px] inline-block">
                            Total produk saat ini adalah {totalProduct}
                          </p>

                          <span
                            className="flex h-10 w-10 select-none items-center justify-center rounded-md bg-zinc-600"
                            aria-hidden="true"
                          >
                            {totalProduct}
                          </span>
                        </div>

                        <label
                          className="absolute left-[-9999px] top-[-9999px] inline-block"
                          htmlFor="add-total-product"
                        >
                          Tambahi satu dari total produk
                        </label>

                        <button
                          className="inline-block h-10 w-10 rounded-md bg-zinc-800 text-xl disabled:text-zinc-600"
                          type="button"
                          onClick={totalProductHandler}
                          data-total-product-ops="plus"
                          disabled={id === ''}
                          id="add-total-product"
                        >
                          <span aria-hidden="true" className="inline-block">
                            +
                          </span>
                        </button>
                      </div>
                    </div>

                    {id ? (
                      <button
                        className="inline-block w-full rounded-md bg-rose-600 py-3 text-center font-poppins text-lg font-semibold lg:text-xl"
                        type="button"
                        onClick={orderHandler}
                      >
                        Pesan Produk
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className="inline-block w-full rounded-md bg-zinc-600 py-3 text-center font-poppins text-lg font-semibold lg:text-xl"
                      >
                        Silakan Login
                      </Link>
                    )}
                  </div>
                </article>

                {id !== '' && productData && openCheckout && (
                  <CheckoutBoard
                    openCheckout={openCheckout}
                    closeCheckoutHandler={closeCheckoutHandler}
                    productId={productData.id}
                    productName={productData.name}
                    productPriceName={productData.priceName}
                    productPrice={productData.productPrice}
                    totalProduct={totalProduct}
                  />
                )}

                <section>
                  <h2 className="font-poppins text-xl font-bold lg:text-3xl">
                    Ulasan Produk
                  </h2>

                  {!productData?.feedbacks && (
                    <div className="pb-6 pt-4">
                      <p>Belum ada ulasan mengenai produk ini.</p>
                    </div>
                  )}

                  {productData && (
                    <div className="pt-4 lg:pt-6">
                      <div className="grid gap-y-4">
                        {productData.feedbacks &&
                          productData.feedbacks
                            .sort((fbOne, fbTwo) => {
                              const fbOneDate = Date.parse(fbOne.createdAt);
                              const fbTwoDate = Date.parse(fbTwo.createdAt);

                              if (fbOneDate > fbTwoDate) {
                                return -1;
                              }

                              if (fbOneDate < fbTwoDate) {
                                return 1;
                              }

                              return 0;
                            })
                            .map((feedback) => {
                              return (
                                <FeedbackCard
                                  key={feedback.id}
                                  fullname={feedback.fullName}
                                  feedbackText={feedback.feedback}
                                  feedbackDate={feedback.createdAt}
                                />
                              );
                            })}
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
