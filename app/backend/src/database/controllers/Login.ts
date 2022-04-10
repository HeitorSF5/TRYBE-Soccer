import { Request, Response } from 'express';
import LoginService from '../services/Login';

export default class LoginControl {
  public static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await LoginService.login({ email, password });
    if (result.error) {
      const { status, error } = result;
      return res.status(status).json({ message: error });
    }
    return res.status(200).json(result);
  }

  public static async validate(req: Request, res: Response) {
    const { authorization } = req.headers;
    const result = await LoginService.validate(authorization);
    if (result.error) {
      const { status, error } = result;
      return res.status(status).json({ message: error });
    }
    return res.status(200).json(result.role);
  }
}
