import cn from 'classnames';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import googlePlayLogo from '../assets/logos/google-play-logo.png';
import pointBlankLogo from '../assets/logos/point-blank-logo.png';
import steamLogo from '../assets/logos/steam-logo.png';

interface TransactionCardProps {
  idOrder: string;
  brand: 'google-play' | 'steam' | 'point-blank';
  name: string;
  priceName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  orderedDate: string;
  expiredDate: string;
  statusPayment: boolean;
}

const productBrand = {
  'google-play': googlePlayLogo,
  steam: steamLogo,
  'point-blank': pointBlankLogo,
};

export default function TransactionCard({
  idOrder,
  brand,
  name,
  priceName,
  quantity,
  price,
  totalPrice,
  orderedDate,
  expiredDate,
  statusPayment,
}: TransactionCardProps) {
  const isExpired = Date.now() - Date.parse(expiredDate) > 0;

  return (
    <article className="overflow-hidden rounded-md bg-zinc-800">
      <div className="mb-2 bg-zinc-100 py-10">
        <div className="h-16">
          <Image
            className="mx-auto h-full w-max"
            src={productBrand[brand]}
            alt={`Logo ${name} beserta teks`}
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
          <h2 className="font-poppins text-xl font-bold">{name}</h2>
          <p>({priceName})</p>
        </div>

        <div className="grid gap-y-2">
          <div>
            <h3 className="font-poppins font-bold">ID Pemesanan</h3>
            <p className="w-full break-all rounded-md bg-zinc-600 px-2 py-1">
              {idOrder}
            </p>
          </div>

          <div>
            <h3 className="font-poppins font-bold">Tanggal Pemesanan</h3>
            <p>{format(new Date(orderedDate), 'dd-MM-yyyy, HH:mm:ss')}</p>
          </div>

          <div>
            <h3 className="font-poppins font-bold">Tanggal Kadaluarsa</h3>
            {format(new Date(expiredDate), 'dd-MM-yyyy, HH:mm:ss')}
          </div>

          <div>
            <h3 className="font-poppins font-bold">Status Pembayaran</h3>
            <p
              className={cn('max-w-max rounded-md px-2 py-1', {
                'bg-amber-600': !statusPayment && !isExpired,
                'bg-emerald-600': statusPayment,
                'bg-rose-600': !statusPayment && isExpired,
              })}
            >
              {!statusPayment && !isExpired && 'Belum Acc'}
              {statusPayment && 'Sudah Acc'}
              {!statusPayment && isExpired && 'Kadaluarsa'}
            </p>
          </div>

          <div>
            <h3 className="font-poppins font-bold">Harga Produk</h3>
            <p>
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(price)}
            </p>
          </div>

          <div>
            <h3 className="font-poppins font-bold">Jumlah Pembelian</h3>
            <p>{quantity}</p>
          </div>

          <div>
            <h3 className="font-poppins font-bold">Total Pembayaran</h3>
            <p>
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(totalPrice)}
            </p>
          </div>
        </div>
      </div>

      <div>
        <Link
          className="inline-block w-full bg-rose-600 py-4 text-center font-poppins font-semibold"
          href={`/order-detail/${idOrder}`}
        >
          Detail Pemesanan
        </Link>
      </div>
    </article>
  );
}
