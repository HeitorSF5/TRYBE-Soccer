import { Request, Response } from 'express';
import IErrorRes from '../interfaces/ErrorRes';
import MatchService from '../services/Matchs';
import Token from '../utils/Token';

export default class MatchControl {
  public static async getAll(req: Request, res: Response) {
    try {
      const { inProgress } = req.query;
      if (inProgress) {
        const param = inProgress !== 'false';
        const result = await MatchService.getFiltered(param);
        return res.status(200).json(result);
      }
      const result = await MatchService.getAll();
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      return res.status(501).json(err);
    }
  }

  public static async create(req: Request, res: Response) {
    const { authorization } = req.headers;
    if (!authorization || !Token.verify(authorization)) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = req.body;
    const result = await MatchService
      .create({
        homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
      });
    if ((result as IErrorRes).error) {
      const { error, code } = result as IErrorRes;
      return res.status(code).json({ message: error });
    }
    return res.status(201).json(result);
  }

  public static async finish(req: Request, res: Response) {
    const { id } = req.params;
    const result = await MatchService.finish(parseInt(id, 10));
    if (result === null) return res.status(404).json({ message: 'Match not found' });
    return res.status(200).json(result);
  }

  public static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const upData = { id: parseInt(id, 10), homeTeamGoals, awayTeamGoals };
    const result = await MatchService.update(upData);
    if ((result as IErrorRes).error) {
      const { error, code } = result as IErrorRes;
      return res.status(code).json({ messsage: error });
    }
    return res.status(200).json(result);
  }
}
