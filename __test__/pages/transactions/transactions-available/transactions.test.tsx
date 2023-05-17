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
  describe('Transactions is available', () => {
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
            data: [
              {
                idOrder: 'asd123',
                idProduct: 1,
                brand: 'google-play',
                type: 'Voucher Game',
                name: 'Kode Voucher Google Play',
                priceName: 'IDR10000',
                price: 11000,
                quantity: 8,
                totalPrice: 88000,
                orderedDate: '2023-05-07T14:36:54Z',
                expiredDate: '2023-05-07T19:36:54Z',
                statusPayment: false,
                feedbackDone: false,
              },
              {
                idOrder: 'asd234',
                idProduct: 1,
                brand: 'google-play',
                type: 'Voucher Game',
                name: 'Kode Voucher Google Play',
                priceName: 'IDR10000',
                price: 11000,
                quantity: 8,
                totalPrice: 88000,
                orderedDate: '2023-05-07T14:36:54Z',
                expiredDate: '2023-05-07T19:36:54Z',
                statusPayment: true,
                feedbackDone: false,
              },
              {
                idOrder: 'asd345',
                idProduct: 1,
                brand: 'google-play',
                type: 'Voucher Game',
                name: 'Kode Voucher Google Play',
                priceName: 'IDR10000',
                price: 11000,
                quantity: 8,
                totalPrice: 88000,
                orderedDate: '2023-05-07T14:36:54Z',
                expiredDate: '2023-05-07T19:36:54Z',
                statusPayment: true,
                feedbackDone: true,
              },
            ],
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

    it('Should show all transactions', async () => {
      renderWithProviders(<TransactionsPage />);

      await waitFor(
        () => {
          expect(
            screen.queryByText(/transaksi anda kosong/i)
          ).not.toBeInTheDocument();
        },
        {
          timeout: 1500,
        }
      );

      await waitFor(
        () => {
          expect(screen.getAllByText(/detail pemesanan/i).length).toBe(3);
        },
        {
          timeout: 1500,
        }
      );
    });
  });
});
