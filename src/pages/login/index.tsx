import happyLogoLight from '@/assets/logos/happy-logo-light.png';
import config from '@/config/config';
import { poppinsFont } from '@/lib/nextFonts';
import {
  useAppDispatch,
  useAppSelector,
} from '@/redux-app/redux-typed-hook/typedHooks';
import {
  authSelector,
  setEmail,
  setFullname,
  setId,
  setUsername,
} from '@/redux-app/slices/authSlice';
import type { UserCredential, WebResponse } from '@/types/types';
import axios from 'axios';
import cn from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import isLowercase from 'validator/lib/isLowercase';

export default function Login() {
  const [username, setUsernameInput] = useState<string>(() => '');
  const [uPassword, setUPasswordInput] = useState<string>(() => '');
  const [regAlert, setRegAlert] = useState<string>(() => '');
  const [loginLoading, setLoginLoading] = useState<boolean>(() => false);

  const usernameInputRef = useRef<HTMLInputElement | null>(null);

  const nextRouter = useRouter();
  const reduxDispatch = useAppDispatch();
  const { id } = useAppSelector(authSelector);

  const registerInputInvalid =
    !isLength(uPassword, {
      min: 8,
    }) ||
    !isLowercase(username) ||
    isEmpty(username);

  const usernameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.split(' ').join('').toLowerCase();
    (usernameInputRef.current as HTMLInputElement).value = inputValue;
    setUsernameInput(() => inputValue);
  };

  const passwordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUPasswordInput(() => inputValue);
  };

  const loginHandler = async () => {
    if (loginLoading) return;

    try {
      setLoginLoading(() => true);

      const loginReq = await axios.post<WebResponse<UserCredential>>(
        `${config.HAPPY_BASE_URL_API}/login`,
        {
          username: username,
          password: uPassword,
        },
        {
          withCredentials: true,
        }
      );

      const loginRes = loginReq.data;
      const loginResData = loginRes.data;

      reduxDispatch(setId(loginResData.id.toString()));
      reduxDispatch(setUsername(loginResData.username));
      reduxDispatch(setFullname(loginResData.fullname));
      reduxDispatch(setEmail(loginResData.email));

      await nextRouter.replace('/');
    } catch (error) {
      setLoginLoading(() => false);
      if (axios.isAxiosError(error)) {
        setRegAlert(() => 'Username atau password salah');
      }
    }

    return;
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
                <label htmlFor="login-username" className="inline-block w-full">
                  <input
                    className="inline-block w-full rounded-md bg-zinc-800 p-4 placeholder:text-zinc-600 md:placeholder:text-lg"
                    type="text"
                    placeholder="Username"
                    id="login-username"
                    onChange={usernameHandler}
                    ref={usernameInputRef}
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
                className="inline-block w-full rounded-md bg-rose-600 py-3 text-center font-poppins font-semibold disabled:bg-zinc-600 disabled:text-zinc-500 md:text-2xl"
                type="button"
                onClick={loginHandler}
                disabled={registerInputInvalid || loginLoading}
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
