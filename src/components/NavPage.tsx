import happyLightLogo from '@/assets/logos/happy-logo-light.png';
import config from '@/config/config';
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
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function NavPage() {
  const [openNavBoard, setOpenNavBoard] = useState<boolean>(() => false);

  const nextRouter = useRouter();

  const { id, fullname } = useAppSelector(authSelector);
  const reduxDispatch = useAppDispatch();

  const navBoardHandler = () => setOpenNavBoard((prevValue) => !prevValue);
  const logoutHandler = async () => {
    await axios.get(`${config.HAPPY_BASE_URL_API}/logout`, {
      withCredentials: true,
    });

    reduxDispatch(setId(''));
    reduxDispatch(setFullname(''));
    reduxDispatch(setUsername(''));
    reduxDispatch(setEmail(''));

    await nextRouter.replace('/login');
  };

  return (
    <nav>
      <div className="w-full bg-zinc-800">
        <div className="container relative mx-auto max-w-6xl px-6 lg:px-0">
          <div className="relative flex items-center justify-between py-2">
            <div className="flex items-center justify-center">
              <Link
                className="relative -left-2 inline-block px-4 py-2"
                href="/"
              >
                <Image
                  className="w-8 md:w-10"
                  src={happyLightLogo}
                  alt="Logo e-Commerce Happy"
                />
              </Link>
            </div>

            <button
              className="absolute -right-4 inline-block p-4"
              onClick={navBoardHandler}
            >
              <div className="h-6 w-6 md:h-10 md:w-10">
                <div className="flex h-full w-full items-center justify-center">
                  <FontAwesomeIcon className="h-full" icon={faUserCircle} />
                </div>
              </div>
            </button>
          </div>

          <div
            className={cn(
              'absolute top-full right-0 z-50 min-w-[172px] p-2 lg:px-0',
              {
                hidden: !openNavBoard,
              }
            )}
          >
            <div className="rounded-md border-2 border-zinc-600 bg-zinc-800 px-2 py-4 md:border-4">
              {id !== '' && (
                <>
                  <div className="mb-4 rounded-md px-3 py-2">
                    <p className="text-center font-poppins text-lg font-semibold">
                      Halo! {fullname}
                    </p>
                    <p></p>
                  </div>
                </>
              )}

              <div>
                <ul className="grid gap-y-3">
                  {id === '' && (
                    <>
                      <li>
                        <Link
                          className="inline-block w-full rounded-md bg-zinc-700 py-2 text-center font-poppins font-semibold text-zinc-100 md:text-lg"
                          href="/login"
                        >
                          Masuk
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="inline-block w-full rounded-md bg-zinc-700 py-2 text-center font-poppins font-semibold text-zinc-100 md:text-lg"
                          href="/register"
                        >
                          Daftar Akun
                        </Link>
                      </li>
                    </>
                  )}

                  {id !== '' && (
                    <>
                      <li>
                        <Link
                          className="inline-block w-full rounded-md bg-zinc-700 py-2 text-center font-poppins font-semibold text-zinc-100 md:text-lg"
                          href="/transactions"
                        >
                          Invoices
                        </Link>
                      </li>

                      <li>
                        <button
                          type="button"
                          className="inline-block w-full rounded-md bg-rose-700 py-2 text-center font-poppins font-semibold text-zinc-100 md:text-lg"
                          disabled={id === ''}
                          onClick={logoutHandler}
                        >
                          Keluar
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
