import NavPage from '@/components/NavPage';
import ProductCard from '@/components/ProductCard';
import config from '@/config/config';
import { poppinsFont } from '@/lib/nextFonts';
import type { ProductData, WebResponse } from '@/types/types';
import axios from 'axios';
import Head from 'next/head';
import { ChangeEvent, useState } from 'react';
import useSWR from 'swr';

const swrFetcher = (url: string) =>
  axios
    .get<WebResponse<ProductData[]>>(url, {
      withCredentials: true,
    })
    .then((res) => res.data);

export default function Home() {
  const [searchProduct, setSearchProduct] = useState<string>(() => '');

  const { data: productsGetResponse, isLoading } = useSWR(
    `${config.HAPPY_BASE_URL_API}/products`,
    swrFetcher
  );

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchProduct(() => inputValue);
  };

  const products = () => {
    if (productsGetResponse) {
      return productsGetResponse.data.filter((product) =>
        product.name.toLowerCase().startsWith(searchProduct.toLowerCase())
      );
    } else {
      return [];
    }
  };

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
                  value={searchProduct}
                  onChange={searchHandler}
                />
              </label>
            </div>

            {isLoading && (
              <div className="py-48">
                <p className="mx-auto max-w-max rounded-md bg-zinc-800 py-1 px-3 md:text-lg">
                  Memuat semua produk...
                </p>
              </div>
            )}

            {!isLoading && (
              <>
                {products().length > 0 && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {products().map((product) => {
                      return (
                        <ProductCard
                          key={product.id}
                          productId={product.id}
                          productBrand={product.brand}
                          productName={product.name}
                          productPriceName={product.priceName}
                          productPrice={product.productPrice}
                          productStock={product.productStock}
                        />
                      );
                    })}
                  </div>
                )}

                {products().length === 0 && (
                  <div className="pt-48">
                    <p className="mx-auto max-w-max rounded-md bg-zinc-800 py-1 px-3 md:text-lg">
                      Produk tidak ditemukan
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
