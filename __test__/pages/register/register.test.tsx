import { serverMsw } from '@/mocks/msw/server';
import RegisterPage from '@/pages/register/index';
import { renderWithProviders } from '@/utils/test-render-redux';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import nextRouterMock from 'next-router-mock/async';

const setupRegisterPage = () => {
  const utils = renderWithProviders(<RegisterPage />);
  const usernameInput: HTMLInputElement =
    screen.getByPlaceholderText(/username/i);

  const fullnameInput: HTMLInputElement =
    screen.getByPlaceholderText(/nama lengkap/i);

  const emailInput: HTMLInputElement = screen.getByPlaceholderText(/email/i);

  const passwordInput: HTMLInputElement =
    screen.getByPlaceholderText(/password/i);

  const registerButton: HTMLButtonElement = screen.getByRole('button', {
    name: /buat akun/i,
  });

  return {
    usernameInput,
    fullnameInput,
    emailInput,
    passwordInput,
    registerButton,
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

describe('Register Page', () => {
  describe('Failed Register', () => {
    const invalidRegister = [
      { username: 'foobar', email: 'foobar@acme.com' },
      { username: 'foobarrr', email: 'foobar@acme.com' },
      { username: 'foobar', email: 'foobarrr@acme.com' },
    ];

    it.each(invalidRegister)(
      'Should stay in register URL page when username or email has been used',
      async ({ username, email }) => {
        await nextRouterMock.push('/register');

        const {
          usernameInput,
          emailInput,
          fullnameInput,
          passwordInput,
          registerButton,
        } = setupRegisterPage();

        fireEvent.change(usernameInput, {
          target: {
            value: username,
          },
        });

        fireEvent.change(fullnameInput, {
          target: {
            value: 'Foo Bar',
          },
        });

        fireEvent.change(emailInput, {
          target: {
            value: email,
          },
        });

        fireEvent.change(passwordInput, {
          target: {
            value: '12345678',
          },
        });

        fireEvent.click(registerButton);

        await waitFor(() => {
          expect(nextRouterMock).toMatchObject({
            pathname: '/register',
          });
        });
      }
    );

    it('Should show an error register text when username has been used', async () => {
      await nextRouterMock.push('/register');

      const {
        usernameInput,
        emailInput,
        fullnameInput,
        passwordInput,
        registerButton,
      } = setupRegisterPage();

      fireEvent.change(usernameInput, {
        target: {
          value: 'foobar',
        },
      });

      fireEvent.change(fullnameInput, {
        target: {
          value: 'Foo Bar',
        },
      });

      fireEvent.change(emailInput, {
        target: {
          value: 'foobar@acme.com',
        },
      });

      fireEvent.change(passwordInput, {
        target: {
          value: '12345678',
        },
      });

      fireEvent.click(registerButton);

      await waitFor(() => {
        const alertRegErrText = screen.getByText(/username telah digunakan/i);

        expect(alertRegErrText).toBeInTheDocument();
      });
    });

    it('Should show an error register text when email has been used', async () => {
      await nextRouterMock.push('/register');

      const {
        usernameInput,
        emailInput,
        fullnameInput,
        passwordInput,
        registerButton,
      } = setupRegisterPage();

      fireEvent.change(usernameInput, {
        target: {
          value: 'foobarrr',
        },
      });

      fireEvent.change(fullnameInput, {
        target: {
          value: 'Foo Bar',
        },
      });

      fireEvent.change(emailInput, {
        target: {
          value: 'foobar@acme.com',
        },
      });

      fireEvent.change(passwordInput, {
        target: {
          value: '12345678',
        },
      });

      fireEvent.click(registerButton);

      await waitFor(() => {
        const alertRegErrText = screen.getByText(/email telah digunakan/i);

        expect(alertRegErrText).toBeInTheDocument();
      });
    });
  });

  describe('Success Register', () => {
    it('Should redirect to URL path "/login"', async () => {
      await nextRouterMock.push('/register');

      const {
        usernameInput,
        emailInput,
        fullnameInput,
        passwordInput,
        registerButton,
      } = setupRegisterPage();

      fireEvent.change(usernameInput, {
        target: {
          value: 'reytaz',
        },
      });

      fireEvent.change(fullnameInput, {
        target: {
          value: 'Rey Taz',
        },
      });

      fireEvent.change(emailInput, {
        target: {
          value: 'reytaz@acme.com',
        },
      });

      fireEvent.change(passwordInput, {
        target: {
          value: '12345678',
        },
      });

      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(nextRouterMock).toMatchObject({
          pathname: '/login',
        });
      });
    });
  });
});
