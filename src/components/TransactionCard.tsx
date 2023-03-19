import cn from 'classnames';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import type { UrlObject } from 'url';
import googlePlayLogo from '../assets/logos/google-play-logo.png';
import steamLogo from '../assets/logos/steam-logo.png';

interface TransactionCardProps {
  orderedId: string;
  productBrand: 'google-play' | 'steam';
  productName: string;
  productPriceName: string;
  orderedDate: string;
  statusPayment: boolean;
  totalPayment: number;
  paymentDetailLink: string | UrlObject;
}

export default function TransactionCard({
  orderedId,
  productBrand,
  productName,
  productPriceName,
  orderedDate,
  statusPayment,
  totalPayment,
  paymentDetailLink,
}: TransactionCardProps) {
  return (
    <article className="overflow-hidden rounded-md bg-zinc-800">
      <div className="mb-2 bg-zinc-100 py-10">
        <div className="h-16">
          <Image
            className="mx-auto h-full w-max"
            src={productBrand === 'google-play' ? googlePlayLogo : steamLogo}
            alt={
              productBrand === 'google-play'
                ? 'Logo Google Play beserta teks'
                : 'Logo Steam'
            }
          />
        </div>
      </div>

      <div className="mb-6 px-2">
        <div className="mb-2">
          <div className="max-w-max rounded-md bg-rose-600 p-1">
            <p className="text-sm">Kode Voucher</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-poppins text-xl font-bold">{productName}</h2>
          <p>({productPriceName})</p>
        </div>

        <div className="grid gap-y-2">
          <div>
            <h3 className="font-poppins font-bold">ID Pemesanan</h3>
            <p>{orderedId}</p>
          </div>

          <div>
            <h3 className="font-poppins font-bold">Tanggal Pemesanan</h3>
            <p>{format(new Date(orderedDate), 'dd-MM-yyyy')}</p>
          </div>

          <div>
            <h3 className="font-poppins font-bold">Status Pembayaran</h3>
            <p
              className={cn('max-w-max rounded-md px-2 py-1', {
                'bg-amber-600': !statusPayment,
                'bg-emerald-600': statusPayment,
              })}
            >
              {statusPayment ? 'Sudah Bayar' : 'Belum Bayar'}
            </p>
          </div>

          <div>
            <h3 className="font-poppins font-bold">Total Pembayaran</h3>
            <p>
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(totalPayment)}
            </p>
          </div>
        </div>
      </div>

      <div>
        <Link
          className="inline-block w-full bg-rose-600 py-4 text-center font-poppins font-semibold"
          href={paymentDetailLink}
        >
          Detail Pembayaran
        </Link>
      </div>
    </article>
  );
}
