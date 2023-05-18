import { rest } from 'msw';

interface LoginRequestBody {
  username: string;
  password: string;
}

interface RegisterRequestBody {
  username: string;
  fullname: string;
  email: string;
  password: string;
}

export const handlers = [
  rest.get('/products', async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(2000),
      ctx.json({
        code: 200,
        status: 'success',
        data: [
          {
            id: 1,
            brand: 'google-play',
            type: 'Voucher Game',
            name: 'Kode Voucher Google Play',
            priceName: 'IDR10000',
            productStock: 1000,
            productPrice: 11000,
            reservation: 0,
          },
          {
            id: 2,
            brand: 'google-play',
            type: 'Voucher Game',
            name: 'Kode Voucher Google Play',
            priceName: 'IDR20000',
            productStock: 1000,
            productPrice: 22000,
            reservation: 0,
          },
          {
            id: 3,
            brand: 'google-play',
            type: 'Voucher Game',
            name: 'Kode Voucher Google Play',
            priceName: 'IDR50000',
            productStock: 1000,
            productPrice: 52000,
            reservation: 0,
          },
          {
            id: 4,
            brand: 'google-play',
            type: 'Voucher Game',
            name: 'Kode Voucher Google Play',
            priceName: 'IDR120000',
            productStock: 1000,
            productPrice: 120000,
            reservation: 0,
          },
          {
            id: 5,
            brand: 'steam',
            type: 'Voucher Game',
            name: 'Kode Voucher Steam',
            priceName: 'IDR12000',
            productStock: 1000,
            productPrice: 13000,
            reservation: 0,
          },
          {
            id: 6,
            brand: 'steam',
            type: 'Voucher Game',
            name: 'Kode Voucher Steam',
            priceName: 'IDR45000',
            productStock: 1000,
            productPrice: 48000,
            reservation: 0,
          },
          {
            id: 7,
            brand: 'steam',
            type: 'Voucher Game',
            name: 'Kode Voucher Steam',
            priceName: 'IDR60000',
            productStock: 1000,
            productPrice: 64000,
            reservation: 0,
          },
          {
            id: 8,
            brand: 'steam',
            type: 'Voucher Game',
            name: 'Kode Voucher Steam',
            priceName: 'IDR90000',
            productStock: 1000,
            productPrice: 92000,
            reservation: 0,
          },
          {
            id: 9,
            brand: 'steam',
            type: 'Voucher Game',
            name: 'Kode Voucher Steam',
            priceName: 'IDR120000',
            productStock: 1000,
            productPrice: 122000,
            reservation: 0,
          },
        ],
      })
    );
  }),
  rest.get('/products/:productId', async (req, res, ctx) => {
    const { productId } = req.params;

    const productIdInt = parseInt(productId as string, 10);

    const products = [
      {
        id: 1,
        brand: 'google-play',
        type: 'Voucher Game',
        name: 'Kode Voucher Google Play',
        priceName: 'IDR10000',
        productStock: 1000,
        productPrice: 11000,
        reservation: 0,
        feedbacks: [],
      },
      {
        id: 2,
        brand: 'google-play',
        type: 'Voucher Game',
        name: 'Kode Voucher Google Play',
        priceName: 'IDR20000',
        productStock: 1000,
        productPrice: 22000,
        reservation: 0,
        feedbacks: [
          {
            id: 1,
            fullName: 'Garry Doe',
            feedback: 'Nice!!!',
            createdAt: '2023-05-07T14:45:28Z',
          },
          {
            id: 2,
            fullName: 'Mariana Doe',
            feedback: 'Good!!!',
            createdAt: '2023-05-07T17:45:28Z',
          },
          {
            id: 3,
            fullName: 'Mariana Doe',
            feedback: 'Good!!!',
            createdAt: '2023-05-07T17:45:28Z',
          },
          {
            id: 4,
            fullName: 'Mariana Doe',
            feedback: 'Good!!!',
            createdAt: '2023-05-07T17:45:28Z',
          },
        ],
      },
      {
        id: 3,
        brand: 'steam',
        type: 'Voucher Game',
        name: 'Kode Voucher Steam',
        priceName: 'IDR50000',
        productStock: 1000,
        productPrice: 54000,
        reservation: 0,
        feedbacks: [
          {
            id: 5,
            fullName: 'Garry Doe',
            feedback: 'Nice!!!',
            createdAt: '2023-05-07T14:45:28Z',
          },
          {
            id: 6,
            fullName: 'Mariana Doe',
            feedback: 'Good!!!',
            createdAt: '2023-05-07T17:45:28Z',
          },
        ],
      },
    ];

    const productNotFound = products[productIdInt - 1];

    if (productNotFound === undefined) {
      return res(
        ctx.status(404),
        ctx.json({
          code: 404,
          status: 'failed',
          data: 'product is not found',
        })
      );
    } else {
      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          status: 'success',
          data: products[productIdInt - 1],
        })
      );
    }
  }),
  rest.get('/orders/:orderId', async (req, res, ctx) => {
    const { orderId } = req.params;

    const oneYearInMs = 31556952000;
    const fiveHourInMs = 18000000;

    const orders = [
      {
        idOrder: 'abc123',
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
        idOrder: 'abc234',
        idProduct: 1,
        brand: 'google-play',
        type: 'Voucher Game',
        name: 'Kode Voucher Google Play',
        priceName: 'IDR10000',
        price: 11000,
        quantity: 8,
        totalPrice: 88000,
        orderedDate: new Date(Date.now() + oneYearInMs).toISOString(),
        expiredDate: new Date(
          Date.now() + oneYearInMs + fiveHourInMs
        ).toISOString(),
        statusPayment: false,
        feedbackDone: false,
      },
      {
        idOrder: 'abc345',
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
        idOrder: 'abc456',
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
    ];

    const orderNotFound =
      orders.find((order) => order.idOrder === orderId) === undefined;

    if (orderNotFound) {
      return res(
        ctx.status(404),
        ctx.json({
          code: 404,
          status: 'failed',
          data: 'order is not found',
        })
      );
    } else {
      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          status: 'success',
          data: orders.find((order) => order.idOrder === orderId),
        })
      );
    }
  }),
  rest.get('/auth', async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        status: 'success',
        data: {
          id: 1,
          fullname: 'Foo Bar',
          username: 'foobar',
          email: 'foobar@acme.com',
        },
      })
    );
  }),
  rest.get('/logout', async (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post('/login', async (req, res, ctx) => {
    const { username, password } = await req.json<LoginRequestBody>();

    const loginSuccess = username === 'foobar' && password === 'foobarpass';

    if (loginSuccess) {
      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          status: 'success',
          data: {
            id: 1,
            fullname: 'Foo Bar',
            username: 'foobar',
            email: 'foobar@acme.com',
          },
        })
      );
    } else {
      return res(
        ctx.status(403),
        ctx.json({
          code: 403,
          status: 'failed',
          data:
            username === 'foobar'
              ? 'password is unmatched'
              : 'username account is not registered',
        })
      );
    }
  }),
  rest.post('/register', async (req, res, ctx) => {
    const { username, email } = await req.json<RegisterRequestBody>();
    const registerIsSuccess =
      username !== 'foobar' && email !== 'foobar@acme.com';

    if (registerIsSuccess) {
      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          status: 'success',
        })
      );
    }

    if (username === 'foobar') {
      return res(
        ctx.status(409),
        ctx.json({
          code: 409,
          status: 'failed',
          data: 'username has been used',
        })
      );
    }

    if (email === 'foobar@acme.com') {
      return res(
        ctx.status(409),
        ctx.json({
          code: 409,
          status: 'failed',
          data: 'email has been used',
        })
      );
    }
  }),
  rest.delete('/orders/:orderId', async (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
