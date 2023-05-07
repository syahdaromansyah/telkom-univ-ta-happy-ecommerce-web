import NavPage from '@/components/NavPage';
import TransactionCard from '@/components/TransactionCard';
import config from '@/config/config';
import { poppinsFont } from '@/lib/nextFonts';
import useAuth from '@/lib/use-custom-hooks/useAuth';
import { useAppSelector } from '@/redux-app/redux-typed-hook/typedHooks';
import { authSelector } from '@/redux-app/slices/authSlice';
import type { OrderData, WebResponse } from '@/types/types';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import isEmpty from 'validator/lib/isEmpty';

const swrFetcher = (url: string) =>
  axios
    .get<WebResponse<OrderData[]>>(url, {
      withCredentials: true,
    })
    .then((res) => res.data);

export default function Transaction() {
  const nextRouter = useRouter();
  const authFailed = useAuth();

  const { data: ordersGetResponse, isLoading } = useSWR(
    `${config.HAPPY_BASE_URL_API}/orders/orderByIdUser`,
    swrFetcher
  );
  const { id } = useAppSelector(authSelector);

  useEffect(() => {
    const redirect = async () => nextRouter.replace('/login');
    if (authFailed) {
      void redirect();
    }
  }, [authFailed, nextRouter]);

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

      {!isEmpty(id) && !isLoading && (
        <>
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
                  {ordersGetResponse && (
                    <>
                      {ordersGetResponse.data.length === 0 ? (
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
                      ) : (
                        <div>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {ordersGetResponse.data.map((order) => {
                              return (
                                <TransactionCard
                                  key={order.idOrder}
                                  idOrder={order.idOrder}
                                  brand={order.brand}
                                  name={order.name}
                                  expiredDate={order.expiredDate}
                                  orderedDate={order.orderedDate}
                                  priceName={order.priceName}
                                  price={order.price}
                                  statusPayment={order.statusPayment}
                                  totalPrice={order.totalPrice}
                                  quantity={order.quantity}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
