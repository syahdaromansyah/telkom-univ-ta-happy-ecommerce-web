import NavPage from '@/components/NavPage';
import ReviewBoard from '@/components/ReviewBoard';
import config from '@/config/config';
import { poppinsFont } from '@/lib/nextFonts';
import useAuth from '@/lib/use-custom-hooks/useAuth';
import type { OrderData, WebResponse } from '@/types/types';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import cn from 'classnames';
import { format } from 'date-fns';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  default as googlePlayLogo,
  default as steamLogo,
} from '../../assets/logos/google-play-logo.png';
import whatsappMeLogo from '../../assets/logos/whatsapp-button-green-large.png';

const productBrand = {
  'google-play': googlePlayLogo,
  steam: steamLogo,
};

const swrFetcher = (url: string) =>
  axios
    .get<WebResponse<OrderData>>(url, {
      withCredentials: true,
    })
    .then((res) => res.data);

export default function OrderDetail() {
  const { authFailed, authLoading } = useAuth();

  const [openReview, setOpenReview] = useState<boolean>(() => false);
  const [disableReview, setDisableReview] = useState<boolean>(() => false);

  const nextRouter = useRouter();
  const { data: orderGetResponse } = useSWR(
    !authLoading && !authFailed && nextRouter.query.orderid
      ? `${config.HAPPY_BASE_URL_API}/orders/${
          nextRouter.query.orderid as string
        }`
      : null,
    swrFetcher
  );

  const orderResData = orderGetResponse?.data;
  const adminWhatsappPhone = '6285795702195';
  const adminWhatsappLink = `https://wa.me/${adminWhatsappPhone}?text=Halo!%20Saya%20ingin%20melakukan%20verifikasi%20pembayaran%20dan%20berikut%20detail%20pemesanan%20saya%3A%0A%0A**ID%20Pemesanan**%0AABC123%0A%0A**Total%20Pembayaran**%0ARp%2011.000%2C00%0A%0ABerikut%20bukti%20gambar%20hasil%20transaksi%20pembayaran%20saya...%0ATerima%20kasih.`;

  const isExpired = () => {
    if (orderResData) {
      return (
        Date.now() - Date.parse(orderResData.expiredDate) > 0 &&
        !orderResData.statusPayment
      );
    } else return false;
  };

  const cancelPaymentHandler = async () => {
    if (!orderResData) return;

    await axios.delete<AxiosResponse<WebResponse<string>>>(
      `${config.HAPPY_BASE_URL_API}/orders/${orderResData.idOrder}`,
      {
        withCredentials: true,
      }
    );

    await nextRouter.replace('/transactions');
  };

  const openReviewHandler = () => {
    setOpenReview(() => true);
    document.body.classList.add('overflow-hidden');
    return;
  };

  const disableReviewHandler = () => {
    setDisableReview(() => true);
  };

  const closeReviewHandler = () => {
    setOpenReview(() => false);
    document.body.classList.remove('overflow-hidden');
  };

  useEffect(() => {
    const redirect = async () => nextRouter.replace('/login');

    if (authFailed) {
      void redirect();
    }
  }, [authFailed, nextRouter]);

  return (
    <>
      {orderResData && (
        <div className={`${poppinsFont.variable}`}>
          <Head>
            <title>Detail Pemesanan | Happy</title>
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
                  Detail Pemesanan
                </h1>

                <article className="mb-8 md:grid md:grid-cols-2 md:gap-x-4 lg:mb-12">
                  <div className="mb-4 md:h-full">
                    <div className="rounded-md bg-zinc-100 py-10 md:flex md:h-full md:items-center md:justify-center md:py-0">
                      <Image
                        className="mx-auto h-24 w-max md:h-24 lg:h-32"
                        src={productBrand[orderResData.brand]}
                        alt={`Logo ${orderResData.name} beserta teks`}
                        priority
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between md:grid md:gap-y-2">
                      <div className="rounded-md bg-rose-600 p-1 md:max-w-max">
                        <p className="text-sm md:text-lg">Voucher Game</p>
                      </div>

                      <div
                        className={cn('rounded-md p-1 md:max-w-max', {
                          'bg-amber-600':
                            !isExpired() && !orderResData.statusPayment,
                          'bg-emerald-600': orderResData.statusPayment,
                          'bg-rose-600': isExpired(),
                        })}
                      >
                        <p className="text-sm md:text-lg">
                          Status: {isExpired() && 'Kadaluarsa'}
                          {orderResData.statusPayment && 'Sudah Bayar'}
                          {!isExpired() &&
                            !orderResData.statusPayment &&
                            'Belum Bayar'}
                        </p>
                      </div>
                    </div>

                    <div className="mb-2 lg:mb-4 lg:grid lg:gap-y-2">
                      <h3 className="font-poppins text-xl font-bold lg:text-4xl">
                        {orderResData.name}
                      </h3>

                      <p className="lg:text-lg">({orderResData.priceName})</p>
                    </div>

                    <div className="mb-6">
                      <div className="mb-2 lg:grid lg:gap-y-2">
                        <h4 className="mb-1 font-poppins font-bold lg:text-3xl">
                          ID Pemesanan
                        </h4>
                        <p className="lg:text-xl">{orderResData.idOrder}</p>
                      </div>

                      <div className="mb-2 lg:grid lg:gap-y-2">
                        <h4 className="mb-1 font-poppins font-bold lg:text-3xl">
                          Tanggal Pemesanan
                        </h4>

                        <p className="lg:text-xl">
                          <time dateTime={orderResData.orderedDate}>
                            {format(
                              new Date(orderResData.orderedDate),
                              'dd-MM-yyyy, HH:mm:ss'
                            )}
                          </time>
                        </p>
                      </div>

                      <div className="mb-2 lg:grid lg:gap-y-2">
                        <h4 className="mb-1 font-poppins font-bold lg:text-3xl">
                          Tanggal Kadaluarsa
                        </h4>

                        <p className="lg:text-xl">
                          <time dateTime={orderResData.expiredDate}>
                            {format(
                              new Date(orderResData.expiredDate),
                              'dd-MM-yyyy, HH:mm:ss'
                            )}
                          </time>
                        </p>
                      </div>

                      <div className="mb-2 lg:grid lg:gap-y-2">
                        <h4 className="mb-1 font-poppins font-bold lg:text-3xl">
                          Harga Produk
                        </h4>

                        <p className="lg:text-xl">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(orderResData.price)}
                        </p>
                      </div>

                      <div className="mb-2 lg:grid lg:gap-y-2">
                        <h4 className="mb-1 font-poppins font-bold lg:text-3xl">
                          Jumlah Pembelian
                        </h4>

                        <p className="lg:text-xl">{orderResData.quantity}</p>
                      </div>

                      <div className="mb-2 lg:grid lg:gap-y-2">
                        <h4 className="mb-1 font-poppins font-bold lg:text-3xl">
                          Total Pembayaran
                        </h4>

                        <p className="lg:text-xl">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(orderResData.totalPrice)}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isExpired() && (
                        <button
                          className="inline-block w-full rounded-md bg-gray-600 py-3 text-center font-poppins text-lg font-semibold text-zinc-400 lg:text-xl"
                          type="button"
                          onClick={() => {
                            return;
                          }}
                          disabled={isExpired()}
                        >
                          Pembayaran kadaluarsa
                        </button>
                      )}
                      {!isExpired() && !orderResData.statusPayment && (
                        <button
                          className="inline-block w-full rounded-md bg-rose-600 py-3 text-center font-poppins text-lg font-semibold lg:text-xl"
                          type="button"
                          onClick={cancelPaymentHandler}
                          disabled={isExpired()}
                        >
                          Batalkan pemesanan
                        </button>
                      )}

                      {!isExpired() && orderResData.statusPayment && (
                        <button
                          className="w-full rounded-md bg-rose-600 py-3 text-center font-poppins text-lg font-semibold text-gray-200 disabled:bg-gray-600 disabled:text-zinc-400 lg:text-xl"
                          type="button"
                          onClick={openReviewHandler}
                          disabled={orderResData.feedbackDone || disableReview}
                        >
                          {orderResData.feedbackDone || disableReview
                            ? 'Sudah diulas'
                            : 'Beri ulasan'}
                        </button>
                      )}
                    </div>
                  </div>
                </article>

                {openReview && orderResData.statusPayment && (
                  <ReviewBoard
                    openReview={openReview}
                    closeReviewHandler={closeReviewHandler}
                    disableReviewHandler={disableReviewHandler}
                    productName={orderResData.name}
                    productPriceName={orderResData.priceName}
                    productId={orderResData.idProduct}
                  />
                )}

                <section>
                  <h2 className="mb-4 font-poppins text-2xl font-bold lg:text-3xl">
                    Cara Pembayaran
                  </h2>

                  <div className="md:grid md:grid-cols-2 md:gap-x-4">
                    <div className="mb-4 grid gap-y-2 rounded-md bg-zinc-800 p-2">
                      <section>
                        <h3 className="font-poppins text-lg font-bold">
                          Nama Bank
                        </h3>
                        <p>BNI</p>
                      </section>

                      <section>
                        <h3 className="font-poppins text-lg font-bold">
                          Nomor Rekening
                        </h3>
                        <p>1234567890</p>
                      </section>

                      <section>
                        <h3 className="font-poppins text-lg font-bold">
                          Nama Pemilik Rekening
                        </h3>
                        <p>Foo Bar Baz</p>
                      </section>
                    </div>

                    <div>
                      <section className="mb-4 max-w-max rounded-md bg-zinc-800 p-2 italic">
                        <h3 className="font-poppins text-lg font-bold">
                          Catatan:
                        </h3>
                        <p className="max-w-lg">
                          Mohon sertakan bukti pembayaran Anda setelah melakukan
                          transaksi pembayaran beserta ID pemesanan kepada
                          Whatsapp Admin, terima kasih.
                        </p>
                      </section>

                      <a className="inline-block" href={adminWhatsappLink}>
                        <Image
                          className="w-60"
                          src={whatsappMeLogo}
                          alt="Tautan menuju percakapan ke Whatsapp Admin mengenai verifikasi pembayaran"
                          priority
                        />
                      </a>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
