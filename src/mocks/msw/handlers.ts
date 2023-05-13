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
];
