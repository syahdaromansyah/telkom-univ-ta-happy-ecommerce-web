import { serverMsw } from '@/mocks/msw/server';
import ProductDetailPage from '@/pages/products/[productid]';
import { renderWithProviders } from '@/utils/test-render-redux';
import { fireEvent, screen } from '@testing-library/react';
import nextRouterMock from 'next-router-mock';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('next/router', () => require('next-router-mock'));

jest.mock('@/config/config', () => ({
  HAPPY_BASE_URL_API: '',
}));

nextRouterMock.useParser(createDynamicRouteParser(['/products/[productid]']));

const setupProdDetailPage = async ({
  mockedTotalProduct = 1,
  mockedAuth = false,
}: {
  mockedTotalProduct?: number;
  mockedAuth?: boolean;
} = {}) => {
  const utils = renderWithProviders(
    <ProductDetailPage />,
    mockedAuth
      ? {
          preloadedState: {
            auth: {
              id: '1',
              username: 'johndoe',
              fullname: 'John Doe',
              email: 'johndoe@acme.com',
            },
          },
        }
      : {}
  );

  await screen.findByText(/^detail produk$/i);

  const subTotalProdBtn: HTMLButtonElement = screen.getByLabelText(
    /^kurangi satu dari total produk$/i
  );
  const addTotalProdBtn: HTMLButtonElement = screen.getByLabelText(
    /^tambahi satu dari total produk$/i
  );
  const totalProdText = screen.getByText(
    new RegExp(`^total produk saat ini adalah ${mockedTotalProduct}`, 'i')
  );
  const loginDescProdBtn: HTMLButtonElement | null =
    screen.queryByText(/silakan login/i);

  const orderDescProdBtn: HTMLButtonElement | null =
    screen.queryByText(/pesan produk/i);

  const feedbackCards = screen.queryAllByText(/diulas pada/i);

  const paymentCheckoutBoard = screen.queryByText(/^checkout pembayaran$/i);

  return {
    subTotalProdBtn,
    addTotalProdBtn,
    totalProdText,
    loginDescProdBtn,
    orderDescProdBtn,
    feedbackCards,
    paymentCheckoutBoard,
    ...utils,
  };
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

describe('Product detail page', () => {
  describe('Not login', () => {
    describe('Product desc section', () => {
      it('Should not add and subtract the total product', async () => {
        await nextRouterMock.push('/products/1');

        const { subTotalProdBtn, addTotalProdBtn, totalProdText } =
          await setupProdDetailPage();

        fireEvent.click(addTotalProdBtn);
        fireEvent.click(addTotalProdBtn);
        fireEvent.click(addTotalProdBtn);
        fireEvent.click(addTotalProdBtn);

        fireEvent.click(subTotalProdBtn);
        fireEvent.click(subTotalProdBtn);

        expect(totalProdText).toHaveTextContent(
          /^total produk saat ini adalah 1$/i
        );
      });

      it('Should show login button at product description', async () => {
        await nextRouterMock.push('/products/1');

        const { loginDescProdBtn } = await setupProdDetailPage();

        expect(loginDescProdBtn).toBeInTheDocument();
      });

      it('Should not show order button at product description', async () => {
        await nextRouterMock.push('/products/1');

        const { orderDescProdBtn } = await setupProdDetailPage();

        expect(orderDescProdBtn).not.toBeInTheDocument();
      });
    });
  });

  describe('Is login', () => {
    describe('Product desc section', () => {
      it('Should add and subtract the total product', async () => {
        await nextRouterMock.push('/products/1');

        const { subTotalProdBtn, addTotalProdBtn, totalProdText } =
          await setupProdDetailPage({
            mockedAuth: true,
          });

        fireEvent.click(addTotalProdBtn);
        fireEvent.click(addTotalProdBtn);
        fireEvent.click(addTotalProdBtn);
        fireEvent.click(addTotalProdBtn);

        fireEvent.click(subTotalProdBtn);

        expect(totalProdText).toHaveTextContent(
          /^total produk saat ini adalah 4$/i
        );
      });

      it('Should not show login button at product description', async () => {
        await nextRouterMock.push('/products/1');

        const { loginDescProdBtn } = await setupProdDetailPage({
          mockedAuth: true,
        });

        expect(loginDescProdBtn).not.toBeInTheDocument();
      });

      it('Should show order button at product description', async () => {
        await nextRouterMock.push('/products/1');

        const { orderDescProdBtn } = await setupProdDetailPage({
          mockedAuth: true,
        });

        expect(orderDescProdBtn).toBeInTheDocument();
      });

      it('Should show payment checkout board content element', async () => {
        await nextRouterMock.push('/products/1');

        await setupProdDetailPage({
          mockedAuth: true,
        });

        const orderDescProdBtn = await screen.findByText(/^pesan produk$/i);

        fireEvent.click(orderDescProdBtn);

        const checkoutPaymentBoard = await screen.findByText(
          /checkout pembayaran/i
        );

        expect(checkoutPaymentBoard).toBeInTheDocument();

        const createPaymentBtn: HTMLButtonElement = await screen.findByText(
          /^buat pembayaran$/i
        );

        expect(createPaymentBtn).toBeInTheDocument();

        const cancelPaymentBtn: HTMLButtonElement = await screen.findByText(
          /^batalkan pembayaran$/i
        );

        expect(cancelPaymentBtn).toBeInTheDocument();
      });
    });
  });

  it.each([
    {
      productId: 1,
      expected: 0,
    },
    {
      productId: 2,
      expected: 4,
    },
    {
      productId: 3,
      expected: 2,
    },
  ])('Should show feedback cards', async ({ productId, expected }) => {
    await nextRouterMock.push(`/products/${productId}`);

    const { feedbackCards } = await setupProdDetailPage();

    expect(feedbackCards.length).toBe(expected);
  });
});
