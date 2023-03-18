import happyLogoLight from '@/assets/logos/happy-logo-light.png';
import { poppinsFont } from '@/lib/nextFonts';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

export default function Login() {
  const [uEmail, setUEmail] = useState<string>(() => '');
  const [uPassword, setUPassword] = useState<string>(() => '');

  const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUEmail(() => inputValue);
  };

  const passwordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUPassword(() => inputValue);
  };

  const loginHandler = () => {
    return;
  };

  return (
    <div className={`${poppinsFont.variable}`}>
      <Head>
        <title>Masuk Akun | Happy</title>
        <link
          rel="icon"
          href="/assets/icons/happy-icon-light-24.svg"
          type="image/svg+xml"
        />
      </Head>

      <div className="flex h-screen w-full items-center justify-center px-4 md:px-0">
        <div className="max-w-xl flex-1">
          <header>
            <div className="mb-6 text-center">
              <div className="mb-2 md:mb-4">
                <Link className="inline-block" href="/">
                  <Image
                    className="h-8 w-max md:h-12"
                    src={happyLogoLight}
                    alt="Logo e-Commerce Happy"
                  />
                </Link>
              </div>

              <h1 className="font-poppins text-2xl font-bold md:mb-1 md:text-4xl">
                Masuk Akun
              </h1>
              <p className="md:text-lg">
                Belum memiliki akun?{' '}
                <Link
                  className="inline-block text-rose-600 underline"
                  href="/register"
                >
                  Buat akun
                </Link>
              </p>
            </div>
          </header>

          <main>
            <form>
              <div className="mb-8 grid gap-y-4">
                <label htmlFor="login-email" className="inline-block w-full">
                  <input
                    className="inline-block w-full rounded-md bg-zinc-800 p-4 placeholder:text-zinc-600 md:placeholder:text-lg"
                    type="email"
                    placeholder="Email"
                    id="login-email"
                    onChange={emailHandler}
                  />
                </label>

                <label htmlFor="login-password" className="inline-block w-full">
                  <input
                    className="inline-block w-full rounded-md bg-zinc-800 p-4 placeholder:text-zinc-600 md:placeholder:text-lg"
                    type="password"
                    placeholder="Password"
                    id="login-password"
                    onChange={passwordHandler}
                  />
                </label>
              </div>

              <button
                className="inline-block w-full rounded-md bg-rose-600 py-3 text-center font-poppins font-semibold md:text-2xl"
                type="button"
                onClick={loginHandler}
              >
                Masuk
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}