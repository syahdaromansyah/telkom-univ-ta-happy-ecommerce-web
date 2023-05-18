import { serverMsw } from '@/mocks/msw/server';
import OrderDetailPage from '@/pages/order-detail/[orderid]';
import { renderWithProviders } from '@/utils/test-render-redux';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import nextRouterMock from 'next-router-mock';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('next/router', () => require('next-router-mock'));

jest.mock('@/config/config', () => ({
  HAPPY_BASE_URL_API: '',
}));

nextRouterMock.useParser(createDynamicRouteParser(['/orders/[orderid]']));

const setupOrderDetailPage = async () => {
  const utils = renderWithProviders(<OrderDetailPage />);
  await screen.findByText(/^detail pemesanan$/i);

  return { ...utils };
};

beforeAll(() => {
  serverMsw.listen();
});

beforeEach(() => {
  serverMsw.resetHandlers();
});

afterAll(() => {
  serverMsw.close();
});

describe('Order detail page', () => {
  it.each([
    {
      orderId: 'abc123',
      status: 'have not been paid and expired.',
      expected: 'Pembayaran kadaluarsa',
    },
    {
      orderId: 'abc234',
      status: 'have not been paid and have not expired.',
      expected: 'Batalkan pemesanan',
    },
    {
      orderId: 'abc345',
      status: 'paid and have not filled in the feedback',
      expected: 'Beri ulasan',
    },
    {
      orderId: 'abc456',
      status: 'paid and have filled in the feedback',
      expected: 'Sudah diulas',
    },
  ])(
    'Should show "$expected" button when order status is "$status"',
    async ({ orderId, expected }) => {
      await nextRouterMock.push(`/orders/${orderId}`);
      await setupOrderDetailPage();

      expect(
        await screen.findByText(new RegExp(`^${expected}$`, 'i'))
      ).toBeInTheDocument();
    }
  );

  it('Should redirect to URL page "/transactions" when cancel the order', async () => {
    await nextRouterMock.push('/orders/abc234');
    await setupOrderDetailPage();

    const cancelOrderBtn = await screen.findByText(/^batalkan pemesanan$/i);

    fireEvent.click(cancelOrderBtn);

    await waitFor(
      () => {
        expect(nextRouterMock).toMatchObject({
          pathname: '/transactions',
        });
      },
      {
        timeout: 1500,
      }
    );
  });

  it('Should show review board content when click review button', async () => {
    await nextRouterMock.push('/orders/abc345');
    await setupOrderDetailPage();

    const reviewOrderBtn = await screen.findByText(/^beri ulasan$/i);

    fireEvent.click(reviewOrderBtn);

    const reviewBoardTitle = await screen.findByText(/^ulasan produk$/i);

    expect(reviewBoardTitle).toBeInTheDocument();

    const sendReviewBtn = await screen.findByText(/^kirim ulasan$/i);

    expect(sendReviewBtn).toBeInTheDocument();

    const cancelReviewBtn = await screen.findByText(/^batalkan ulasan$/i);

    expect(cancelReviewBtn).toBeInTheDocument();
  });

  it('Should close review board content when click close review board button', async () => {
    await nextRouterMock.push('/orders/abc345');
    await setupOrderDetailPage();

    const reviewOrderBtn = await screen.findByText(/^beri ulasan$/i);

    fireEvent.click(reviewOrderBtn);

    const reviewBoardTitle = await screen.findByText(/^ulasan produk$/i);

    expect(reviewBoardTitle).toBeInTheDocument();

    const sendReviewBtn = await screen.findByText(/^kirim ulasan$/i);

    expect(sendReviewBtn).toBeInTheDocument();

    const cancelReviewBtn = await screen.findByText(/^batalkan ulasan$/i);

    fireEvent.click(cancelReviewBtn);

    expect(screen.queryByText(/^ulasan produk$/i)).not.toBeInTheDocument();
  });
});
