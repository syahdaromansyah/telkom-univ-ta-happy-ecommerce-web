import NavPage from '@/components/NavPage';
import { serverMsw } from '@/mocks/msw/server';
import { renderWithProviders } from '@/utils/test-render-redux';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import nextRouterMock from 'next-router-mock';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('next/router', () => require('next-router-mock'));

jest.mock('../../src/config/config', () => ({
  HAPPY_BASE_URL_API: '',
}));

beforeAll(() => {
  serverMsw.listen();
});

afterEach(() => {
  serverMsw.resetHandlers();
});

afterAll(() => {
  serverMsw.close();
});

describe('NavPage component', () => {
  describe('Not login', () => {
    it('Should show "Masuk" button link', () => {
      renderWithProviders(<NavPage />);
      const loginBtnLink = screen.queryByText(/masuk/i);
      expect(loginBtnLink).toBeInTheDocument();
    });

    it('Should show "Daftar Akun" button link', () => {
      renderWithProviders(<NavPage />);
      const registerBtnLink = screen.queryByText(/daftar akun/i);
      expect(registerBtnLink).toBeInTheDocument();
    });

    it('Should not show a greeting of the full name', () => {
      renderWithProviders(<NavPage />);
      const fullNameGreetingText = screen.queryByText(/halo!.*/i);
      expect(fullNameGreetingText).not.toBeInTheDocument();
    });

    it('Should not show an "Invoices" button link', () => {
      renderWithProviders(<NavPage />);
      const invoicesBtnLink = screen.queryByText(/invoices/i);
      expect(invoicesBtnLink).not.toBeInTheDocument();
    });

    it('Should not show a "Keluar" or logout button', () => {
      renderWithProviders(<NavPage />);
      const logoutBtn = screen.queryByText(/keluar/i);
      expect(logoutBtn).not.toBeInTheDocument();
    });
  });

  describe('Is login', () => {
    const authMocked = {
      id: '1',
      username: 'manray',
      fullname: 'Man Ray',
      email: 'manray@acme.com',
    };

    it('Should show a greeting of the full name', () => {
      renderWithProviders(<NavPage />, {
        preloadedState: {
          auth: authMocked,
        },
      });
      const fullNameGreetingText = screen.queryByText(/halo! man ray/i);
      expect(fullNameGreetingText).toBeInTheDocument();
    });

    it('Should show an "Invoices" button link', () => {
      renderWithProviders(<NavPage />, {
        preloadedState: {
          auth: authMocked,
        },
      });

      const invoicesBtnLink = screen.queryByText(/invoices/i);
      expect(invoicesBtnLink).toBeInTheDocument();
    });

    it('Should show a "Keluar" or logout button', () => {
      renderWithProviders(<NavPage />, {
        preloadedState: {
          auth: authMocked,
        },
      });

      const logoutBtn = screen.queryByText(/keluar/i);
      expect(logoutBtn).toBeInTheDocument();
    });

    it('Should not show a "Masuk" button link', () => {
      renderWithProviders(<NavPage />, {
        preloadedState: {
          auth: authMocked,
        },
      });

      const loginBtnLink = screen.queryByText(/masuk/i);
      expect(loginBtnLink).not.toBeInTheDocument();
    });

    it('Should not show a "Daftar Akun" button link', () => {
      renderWithProviders(<NavPage />, {
        preloadedState: {
          auth: authMocked,
        },
      });

      const registerBtnLink = screen.queryByText(/daftar akun/i);
      expect(registerBtnLink).not.toBeInTheDocument();
    });

    it('Should redirect to URL path "/login" when clicking "Keluar" or logout button', async () => {
      await nextRouterMock.push('/');

      renderWithProviders(<NavPage />, {
        preloadedState: {
          auth: authMocked,
        },
      });

      const logoutBtn = screen.getByText<HTMLButtonElement>(/keluar/i);

      fireEvent.click(logoutBtn);

      await waitFor(() => {
        expect(nextRouterMock).toMatchObject({
          pathname: '/login',
        });
      });
    });
  });
});
