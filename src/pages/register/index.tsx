import happyLogoLight from '@/assets/logos/happy-logo-light.png';
import config from '@/config/config';
import { poppinsFont } from '@/lib/nextFonts';
import { useAppSelector } from '@/redux-app/redux-typed-hook/typedHooks';
import { authSelector } from '@/redux-app/slices/authSlice';
import type { WebResponse } from '@/types/types';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import cn from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import isLowercase from 'validator/lib/isLowercase';

export default function Register() {
  const [username, setUsername] = useState<string>(() => '');
  const [uFullname, setUFullname] = useState<string>(() => '');
  const [uEmail, setUEmail] = useState<string>(() => '');
  const [uPassword, setUPassword] = useState<string>(() => '');
  const [regLoading, setRegLoading] = useState<boolean>(() => false);
  const [regAlert, setRegAlert] = useState<string>(() => '');

  const nextRouter = useRouter();
  const { id } = useAppSelector(authSelector);

  const registerInputInvalid =
    !isEmail(uEmail) ||
    !isLength(uPassword, {
      min: 8,
    }) ||
    !isLowercase(username) ||
    isEmpty(uFullname);

  const usernameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.split(' ').join('');
    setUsername(() => inputValue);
  };

  const fullnameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUFullname(() => inputValue);
  };

  const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUEmail(() => inputValue);
  };

  const passwordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUPassword(() => inputValue);
  };

  const registerHandler = async () => {
    if (regLoading) return;

    try {
      setRegLoading(() => true);

      await axios.post(`${config.HAPPY_BASE_URL_API}/register`, {
        username: username,
        fullname: uFullname,
        email: uEmail,
        password: uPassword,
      });

      await nextRouter.replace('/login');
    } catch (error) {
      setRegLoading(() => false);
      if (axios.isAxiosError(error)) {
        const errorRes: AxiosResponse<WebResponse<string>, string> | undefined =
          error.response;
        const errorResData = errorRes?.data;
        const errorMsg = errorResData?.data;

        if (errorMsg === 'username has been used') {
          setRegAlert(() => 'Username telah digunakan');
        } else {
          setRegAlert(() => 'Email telah digunakan');
        }
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(id)) {
      const redirect = async () => await nextRouter.replace('/');
      void redirect();
    }
  }, [id, nextRouter]);

  return (
    <div className={`${poppinsFont.variable}`}>
      <Head>
        <title>Daftar Akun | Happy</title>
        <link
          rel="icon"
          href="/assets/icons/happy-icon-light-24.svg"
          type="image/svg+xml"
        />
      </Head>

      <div className="flex h-screen w-full items-center justify-center px-4 md:px-0">
        <div className="max-w-xl flex-1">
          <header>
            <div className="mb-2 text-center">
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
                Daftar Akun
              </h1>
              <p className="md:text-lg">
                Sudah memiliki akun?{' '}
                <Link
                  className="inline-block text-rose-600 underline"
                  href="/login"
                >
                  Masuk akun
                </Link>
              </p>
            </div>
          </header>

          <main>
            <div
              className={cn({
                invisible: isEmpty(regAlert),
              })}
            >
              <div className="mb-3">
                <p className="mx-auto max-w-max rounded-md bg-rose-600 px-3 py-1">
                  {regAlert}
                </p>
              </div>
            </div>

            <form>
              <div className="mb-8 grid gap-y-4">
                <label
                  htmlFor="register-username"
                  className="inline-block w-full"
                >
                  <input
                    className="inline-block w-full rounded-md bg-zinc-800 p-4 placeholder:text-zinc-600 md:placeholder:text-lg"
                    type="text"
                    placeholder="Username"
                    id="register-username"
                    onChange={usernameHandler}
                  />
                </label>

                <label
                  htmlFor="register-fullname"
                  className="inline-block w-full"
                >
                  <input
                    className="inline-block w-full rounded-md bg-zinc-800 p-4 placeholder:text-zinc-600 md:placeholder:text-lg"
                    type="text"
                    placeholder="Nama lengkap"
                    id="register-fullname"
                    onChange={fullnameHandler}
                  />
                </label>

                <label htmlFor="register-email" className="inline-block w-full">
                  <input
                    className="inline-block w-full rounded-md bg-zinc-800 p-4 placeholder:text-zinc-600 md:placeholder:text-lg"
                    type="email"
                    placeholder="Email"
                    id="register-email"
                    onChange={emailHandler}
                  />
                </label>

                <label
                  htmlFor="register-password"
                  className="inline-block w-full"
                >
                  <input
                    className="inline-block w-full rounded-md bg-zinc-800 p-4 placeholder:text-zinc-600 md:placeholder:text-lg"
                    type="password"
                    placeholder="Password"
                    id="register-password"
                    onChange={passwordHandler}
                  />
                </label>
              </div>

              <button
                className="inline-block w-full rounded-md bg-rose-600 py-3 text-center font-poppins font-semibold disabled:bg-zinc-600 disabled:text-zinc-500 md:text-2xl"
                type="button"
                onClick={registerHandler}
                disabled={registerInputInvalid || regLoading}
              >
                Buat Akun
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
