import { Request, Response } from 'express';
import ClubService from '../services/Clubs';
import IErrorRes from '../interfaces/ErrorRes';

export default class ClubControl {
  public static async getAll(req: Request, res: Response) {
    try {
      const result = await ClubService.getAll();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(501).json(err);
    }
  }

  public static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const parseId = parseInt(id, 10);
    const result = await ClubService.getByPk(parseId) as IErrorRes;
    if (result.error) {
      const { code, error } = result;
      return res.status(code).json({ message: error });
    }
    return res.status(200).json(result);
  }
}
