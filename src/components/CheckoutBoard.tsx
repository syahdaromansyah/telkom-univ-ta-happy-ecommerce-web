import happyLogoLight from '@/assets/logos/happy-logo-light.png';
import config from '@/config/config';
import type { WebResponse } from '@/types/types';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface CheckoutBoardProps {
  openCheckout: boolean;
  closeCheckoutHandler: () => void;
  productId: number;
  productName: string;
  productPriceName: string;
  productPrice: number;
  totalProduct: number;
}

export default function CheckoutBoard({
  openCheckout,
  closeCheckoutHandler,
  productId,
  productName,
  productPriceName,
  productPrice,
  totalProduct,
}: CheckoutBoardProps) {
  const nextRouter = useRouter();

  const checkoutHandler = async () => {
    document.body.classList.remove('overflow-hidden');

    try {
      await axios.post(
        `${config.HAPPY_BASE_URL_API}/orders`,
        {
          idProduct: productId,
          quantity: totalProduct,
        },
        {
          withCredentials: true,
        }
      );

      await nextRouter.replace('/transactions');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse:
          | AxiosResponse<WebResponse<string>, string>
          | undefined = error.response;
        const errorResData = errorResponse?.data;
        const errorResCode = errorResData?.code;

        if (errorResCode === 401) {
          await nextRouter.replace('/login');
        }
      }
    }
  };

  return (
    <section
      className={cn('fixed top-0 left-0 z-[100] h-screen w-full', {
        hidden: !openCheckout,
      })}
    >
      <div className="flex h-full w-full items-center justify-center bg-zinc-800/80 px-4 backdrop-blur-md">
        <div className="max-w-xl rounded-md bg-zinc-800 px-6 py-6">
          <div className="mb-4 text-center">
            <div className="mb-2 md:mb-4">
              <Image
                className="mx-auto h-8 w-max md:h-12"
                src={happyLogoLight}
                alt="Logo e-Commerce Happy"
              />
            </div>

            <h2 className="font-poppins text-2xl font-bold">
              Checkout Pembayaran
            </h2>
          </div>

          <div className="mb-8">
            <div className="mb-2 lg:mb-4 lg:grid lg:gap-y-2">
              <h3 className="font-poppins text-xl font-bold lg:text-4xl">
                {productName}
              </h3>

              <p className="lg:text-lg">({productPriceName})</p>
            </div>

            <div className="mb-2 lg:grid lg:gap-y-2">
              <h4 className="mb-1 font-poppins font-bold lg:text-3xl">
                Total Pembelian
              </h4>
              <p className="lg:text-xl">{totalProduct}</p>
            </div>

            <div className="mb-2 lg:grid lg:gap-y-2">
              <h4 className="mb-1 font-poppins font-bold lg:text-3xl">
                Total Harga
              </h4>
              <p className="lg:text-xl">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(productPrice * totalProduct)}
              </p>
            </div>
          </div>

          <div className="grid gap-y-2">
            <button
              className="inline-block w-full rounded-md bg-rose-600 py-3 text-center font-poppins text-lg font-semibold lg:text-xl"
              type="button"
              onClick={checkoutHandler}
            >
              Buat Pembayaran
            </button>

            <button
              className="inline-block w-full rounded-md border-2 border-zinc-100 py-3 text-center font-poppins text-lg font-semibold lg:text-xl"
              type="button"
              onClick={closeCheckoutHandler}
            >
              Batalkan Pembayaran
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
