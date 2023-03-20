import happyLogoLight from '@/assets/logos/happy-logo-light.png';
import cn from 'classnames';
import Image from 'next/image';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

interface ReviewBoardProps {
  openReview: boolean;
  closeReviewHandler: () => void;
  productName: string;
  productPriceName: string;
}

interface ReviewInputs {
  review: string;
}

export default function ReviewBoard({
  openReview,
  closeReviewHandler,
  productName,
  productPriceName,
}: ReviewBoardProps) {
  const { register, handleSubmit } = useForm<ReviewInputs>();

  const submitReviewHandler: SubmitHandler<ReviewInputs> = (data) => {
    console.info(
      data.review
        .trim()
        .replace(/[\r\n]/gm, ' ')
        .split(' ')
        .filter((word) => word !== '')
        .join(' ')
    );
  };

  const reviewHandler = () => {
    return;
  };

  return (
    <section
      className={cn('fixed top-0 left-0 z-[100] h-screen w-full', {
        hidden: !openReview,
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

            <h2 className="font-poppins text-2xl font-bold">Ulasan Produk</h2>
          </div>

          <div className="mb-8">
            <div className="mb-2 lg:mb-4 lg:grid lg:gap-y-2">
              <h3 className="font-poppins text-xl font-bold lg:text-4xl">
                {productName}
              </h3>

              <p className="lg:text-lg">({productPriceName})</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(submitReviewHandler)}
            className="mb-2 grid gap-y-4"
          >
            <label className="inline-block w-full" htmlFor="review-product">
              <textarea
                className="min-h-[128px] w-full resize-none rounded-md bg-zinc-600 p-2 md:text-lg"
                id="review-product"
                placeholder="Ulasan Anda"
                {...register('review')}
              ></textarea>
            </label>

            <button
              className="inline-block w-full rounded-md bg-rose-600 py-3 text-center font-poppins text-lg font-semibold lg:text-xl"
              type="submit"
              onClick={reviewHandler}
            >
              Kirim Ulasan
            </button>
          </form>

          <button
            className="inline-block w-full rounded-md border-2 border-zinc-100 py-3 text-center font-poppins text-lg font-semibold lg:text-xl"
            type="button"
            onClick={closeReviewHandler}
          >
            Batalkan Ulasan
          </button>
        </div>
      </div>
    </section>
  );
}
