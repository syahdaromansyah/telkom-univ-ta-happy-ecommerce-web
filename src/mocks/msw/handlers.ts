import { rest } from 'msw';

interface LoginRequestBody {
  username: string;
  password: string;
}

export const handlers = [
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
];
