import { serverMsw } from '@/mocks/msw/server';
import LoginPage from '@/pages/login/index';
import { renderWithProviders } from '@/utils/test-render-redux';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import nextRouterMock from 'next-router-mock/async';

const setupLoginPage = () => {
  const utils = renderWithProviders(<LoginPage />);
  const usernameInput: HTMLInputElement =
    screen.getByPlaceholderText(/username/i);
  const passwordInput: HTMLInputElement =
    screen.getByPlaceholderText(/password/i);
  const loginButton: HTMLButtonElement = screen.getByRole('button', {
    name: /masuk/i,
  });

  return {
    usernameInput,
    passwordInput,
    loginButton,
    ...utils,
  };
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('next/router', () => require('next-router-mock/async'));

jest.mock('../../../src/config/config', () => ({
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

describe('Login Page', () => {
  describe('Username is "foobar" and password is "foobarpass"', () => {
    describe('Failed Login', () => {
      const invalidAccounts = [
        {
          username: 'foobarwrong',
          password: 'foobarpass',
        },
        {
          username: 'foobar',
          password: 'foobarpasswrong',
        },
        {
          username: 'foobarwrong',
          password: 'foobarpasswrong',
        },
      ];

      it.each(invalidAccounts)(
        'Should stay in login page URL path when username is "$username" and password is "$password"',
        async ({ username, password }) => {
          await nextRouterMock.push('/login');

          const { usernameInput, passwordInput, loginButton } =
            setupLoginPage();

          fireEvent.change(usernameInput, {
            target: {
              value: username,
            },
          });

          fireEvent.change(passwordInput, {
            target: {
              value: password,
            },
          });

          fireEvent.click(loginButton);

          await waitFor(() => {
            expect(nextRouterMock).toMatchObject({
              pathname: '/login',
            });
          });
        }
      );

      it.each(invalidAccounts)(
        'Should show an error login text alert when username is "$username" and password is "$password"',
        async ({ username, password }) => {
          await nextRouterMock.push('/login');

          const { usernameInput, passwordInput, loginButton } =
            setupLoginPage();

          fireEvent.change(usernameInput, {
            target: {
              value: username,
            },
          });

          fireEvent.change(passwordInput, {
            target: {
              value: password,
            },
          });

          fireEvent.click(loginButton);

          await waitFor(() => {
            const alertText = screen.queryByText(
              /username atau password salah/i
            );

            expect(alertText).toBeInTheDocument();
          });
        }
      );
    });

    describe('Success Login', () => {
      it('Should redirect to catalog page URL path or "/"', async () => {
        await nextRouterMock.push('/login');

        const { usernameInput, passwordInput, loginButton } = setupLoginPage();

        fireEvent.change(usernameInput, {
          target: {
            value: 'foobar',
          },
        });

        fireEvent.change(passwordInput, {
          target: {
            value: 'foobarpass',
          },
        });

        fireEvent.click(loginButton);

        await waitFor(() => {
          expect(nextRouterMock).toMatchObject({
            pathname: '/',
          });
        });
      });
    });
  });
});
