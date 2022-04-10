import IErrorRes from '../interfaces/ErrorRes';
import Club from '../models/clubs';

export default class ClubService {
  public static async getAll() : Promise < Array < Club > > {
    const allClubs = await Club.findAll();
    return allClubs;
  }

  public static async getByPk(id: number) : Promise < Club | IErrorRes > {
    const getClub = await Club.findByPk(id);
    const error : IErrorRes = { code: 404, error: 'Club not found' };
    return getClub === null ? error : getClub;
  }
}
