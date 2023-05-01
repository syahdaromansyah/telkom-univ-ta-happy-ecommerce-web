import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../redux-store/store';

interface AuthProps {
  id: string;
  fullname: string;
  username: string;
  email: string;
}

const initialState: AuthProps = {
  id: '',
  fullname: '',
  username: '',
  email: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setFullname: (state, action: PayloadAction<string>) => {
      state.fullname = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const { setId, setFullname, setUsername, setEmail } = authSlice.actions;

export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
