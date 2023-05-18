import TransactionsPage from '@/pages/transactions/index';
import { renderWithProviders } from '@/utils/test-render-redux';
import { screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('next/router', () => require('next-router-mock'));

jest.mock('@/config/config', () => ({
  HAPPY_BASE_URL_API: '',
}));

describe('Transactions page', () => {
  describe('Transactions is empty', () => {
    const serverMsw = setupServer(
      rest.get('/auth', async (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            code: 200,
            status: 'success',
            data: {
              id: 1,
              fullname: 'Garry Doe',
              username: 'garrydoe',
              email: 'garrydoe@acme.com',
            },
          })
        );
      }),
      rest.get('/orders/orderByIdUser', async (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.delay(1000),
          ctx.json({
            code: 200,
            status: 'success',
            data: [],
          })
        );
      })
    );

    beforeAll(() => {
      serverMsw.listen();
    });

    beforeEach(() => {
      serverMsw.resetHandlers();
    });

    afterAll(() => {
      serverMsw.close();
    });

    it('Should show alert text that transactions is empty', async () => {
      renderWithProviders(<TransactionsPage />);

      await waitFor(
        () => {
          expect(
            screen.getByText(/transaksi anda kosong/i)
          ).toBeInTheDocument();
        },
        {
          timeout: 1500,
        }
      );
    });
  });
});
