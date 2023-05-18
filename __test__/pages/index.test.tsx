import { serverMsw } from '@/mocks/msw/server';
import CatalogPage from '@/pages/index';
import { renderWithProviders } from '@/utils/test-render-redux';
import { fireEvent, screen, waitFor } from '@testing-library/react';

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

describe('Catalog page', () => {
  it('Should show a loading text', () => {
    renderWithProviders(<CatalogPage />);

    const loadingText = screen.queryByText(/memuat semua produk/i);

    expect(loadingText).toBeInTheDocument();
  });

  it('Should show all products', async () => {
    renderWithProviders(<CatalogPage />);

    await waitFor(
      () => {
        const products = screen.getAllByText(/detail produk/i);
        expect(products.length).toBe(9);
      },
      {
        timeout: 2500,
      }
    );
  });

  it.each([
    {
      productName: 'Kode Voucher',
      expected: 9,
    },
    {
      productName: 'Kode Voucher Google Play',
      expected: 4,
    },
    {
      productName: 'Kode Voucher Goo',
      expected: 4,
    },
    {
      productName: 'Kode Voucher Steam',
      expected: 5,
    },
    {
      productName: 'Kode Voucher St',
      expected: 5,
    },
    {
      productName: 'Kode Voucher XYZ',
      expected: 0,
    },
  ])(
    'Should filter the products by name',
    async ({ productName, expected }) => {
      renderWithProviders(<CatalogPage />);

      await waitFor(
        () => {
          const products = screen.getAllByText(/detail produk/i);

          expect(products.length).toBe(9);
        },
        {
          timeout: 2500,
        }
      );

      const filterProdInput = screen.getByPlaceholderText(/cari produk/i);

      fireEvent.change(filterProdInput, {
        target: {
          value: productName,
        },
      });

      const filteredProducts = screen.queryAllByText(/detail produk/i);

      expect(filteredProducts.length).toBe(expected);
    }
  );

  it('Should show a product is not found text', async () => {
    renderWithProviders(<CatalogPage />);

    await waitFor(
      () => {
        const products = screen.getAllByText(/detail produk/i);

        expect(products.length).toBe(9);
      },
      {
        timeout: 2500,
      }
    );

    const filterProdInput = screen.getByPlaceholderText(/cari produk/i);

    fireEvent.change(filterProdInput, {
      target: {
        value: 'Kode Voucher XYZ',
      },
    });

    const productsNotFoundText = screen.queryByText(/produk tidak ditemukan/i);

    expect(productsNotFoundText).toBeInTheDocument();
  });
});
