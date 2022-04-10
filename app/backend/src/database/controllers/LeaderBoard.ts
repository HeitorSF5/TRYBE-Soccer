import { Request, Response } from 'express';
// import IErrorRes from '../interfaces/ErrorRes';
import LeaderBService from '../services/LeaderBoard';

export default class LeaderBControl {
  public static async getHome(req: Request, res: Response) {
    try {
      const result = await LeaderBService.getHome();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(501).json({ err });
    }
  }

  public static async getAway(req: Request, res: Response) {
    try {
      const result = await LeaderBService.getAway();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(501).json({ err });
    }
  }

  public static async getBoth(req: Request, res: Response) {
    try {
      const result = await LeaderBService.getBoth();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(501).json({ err });
    }
  }
}
