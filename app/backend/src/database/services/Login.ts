import ILoginTemplate from '../interfaces/LoginTemplate';
import ITokenFormat from '../interfaces/TokenVerify';
import User from '../models/users';
import Authentications from '../utils/Authentications';
import Token from '../utils/Token';

export default class LoginService {
  public static async login(credentials : ILoginTemplate) {
    const { email, password } = credentials;
    if (email.length < 1 || password.length < 1) {
      return { status: 401, error: 'All fields must be filled' };
    }
    const getUser = await User.findOne({ where: { email } });
    if (!getUser) return { status: 401, error: 'Incorrect email or password' };

    const validPass = Authentications.verifyAuth({ password, hash: getUser.password });
    if (!validPass) return { status: 401, error: 'Incorrect email or password' };
    const { id, username, role } = getUser;
    const token = Token.create({ email, role, id, username });
    const user = { id, email, username, role };
    return { user, token };
  }

  public static async validate(authorization : string | undefined) {
    if (!authorization) return { status: 401, error: 'invalid token' };
    const checkToken = Token.verify(authorization);
    if (checkToken === false) return { status: 401, error: 'invalid token' };
    const { data } = checkToken as ITokenFormat;
    const { role } = data;
    return { role };
  }
}
