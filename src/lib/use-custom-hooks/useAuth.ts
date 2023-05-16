import config from '@/config/config';
import { useAppDispatch } from '@/redux-app/redux-typed-hook/typedHooks';
import {
  setEmail,
  setFullname,
  setId,
  setUsername,
} from '@/redux-app/slices/authSlice';
import type { UserCredential, WebResponse } from '@/types/types';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [authOnce, setAuthOnce] = useState<boolean>(() => false);
  const [authFailed, setAuthFailed] = useState<boolean>(() => false);
  const [authLoading, setAuthLoading] = useState<boolean>(() => true);

  const nextRouter = useRouter();
  const reduxDispatch = useAppDispatch();

  useEffect(() => {
    const getAuthRequest = async () => {
      try {
        const authReq = await axios.get<
          WebResponse<UserCredential | 'unauthorized'>
        >(`${config.HAPPY_BASE_URL_API}/auth`, {
          withCredentials: true,
        });

        const authDataRes = authReq.data;
        const authData = authDataRes.data as UserCredential;

        reduxDispatch(setId(authData.id.toString(10)));
        reduxDispatch(setFullname(authData.fullname));
        reduxDispatch(setUsername(authData.username));
        reduxDispatch(setEmail(authData.email));
      } catch (error) {
        setAuthFailed(() => true);
        console.info(error);
      } finally {
        setAuthLoading(() => false);
      }
    };

    if (!authOnce) {
      setAuthOnce(() => true);
      void getAuthRequest();
    }
  }, [authOnce, nextRouter, reduxDispatch]);

  return { authFailed, authLoading };
};

export default useAuth;
