import Image from 'next/image';
import Link from 'next/link';
import type { UrlObject } from 'url';
import googlePlayLogo from '../assets/logos/google-play-logo.png';
import steamLogo from '../assets/logos/steam-logo.png';

interface ProductCardProps {
  productBrand: 'google-play' | 'steam';
  productName: string;
  productPriceName: string;
  productStock: number;
  productPrice: number;
  productLink: string | UrlObject;
}

export default function ProductCard({
  productBrand,
  productName,
  productPriceName,
  productStock,
  productPrice,
  productLink,
}: ProductCardProps) {
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
        <div className="mb-2 flex items-center justify-between">
          <div className="rounded-md bg-rose-600 p-1">
            <p className="text-sm">Kode Voucher</p>
          </div>

          <div className="rounded-md bg-rose-600 p-1">
            <p className="text-sm">
              Stok: {productStock === 0 ? 'Habis' : productStock}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-poppins text-xl font-bold">{productName}</h2>
          <p>({productPriceName})</p>
        </div>

        <div>
          <h3 className="font-poppins font-bold">Harga</h3>
          <p>
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(productPrice)}
          </p>
        </div>
      </div>

      <div>
        <Link
          className="inline-block w-full bg-rose-600 py-4 text-center font-poppins font-semibold"
          href={productLink}
        >
          Detail Produk
        </Link>
      </div>
    </article>
  );
}
