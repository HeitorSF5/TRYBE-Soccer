import IErrorRes from '../interfaces/ErrorRes';
import IMatchUpdate from '../interfaces/MatchUpdate';
import INewMatch from '../interfaces/NewMatch';
import Club from '../models/clubs';
import Match from '../models/matchs';

export default class MatchService {
  private static async checkDuplicate(hmTm : number, awTm : number) : Promise < true | IErrorRes > {
    const duplicateTeam = 'It is not possible to create a match with two equal teams';
    const noTeamFound = 'There is no team with such id!';
    if (hmTm === awTm) return { code: 401, error: duplicateTeam };
    const checkHome = await Club.findAll({ where: { id: [hmTm, awTm] } });
    if (checkHome.length < 2) return { code: 401, error: noTeamFound };
    return true;
  }
  // I would create a Schema / Validation file for checking this stuff, but I have been told it is bad practice for anything else other than the Service / Model to access the database, so I'm keeping the verifications within the class. Also tried to make a new class but the file has a limit of 1 class per file, so... ¯\_(ツ)_/¯

  public static async getAll() : Promise < Array < Match > > {
    const allMatches = await Match.findAll({
      include: [
        { model: Club, attributes: ['clubName'], as: 'homeClub' },
        { model: Club, attributes: ['clubName'], as: 'awayClub' },
      ],
    });
    return allMatches;
  }

  public static async getFiltered(inProgress : boolean) {
    const filtMatches = await Match.findAll({
      where: { inProgress },
      include: [
        { model: Club, attributes: ['clubName'], as: 'homeClub' },
        { model: Club, attributes: ['clubName'], as: 'awayClub' },
      ],
    });
    return filtMatches;
  }

  public static async create({
    homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
  } : INewMatch) : Promise < Match | IErrorRes > {
    const teamCheck = await this.checkDuplicate(homeTeam, awayTeam);
    if (teamCheck !== true) return teamCheck;
    const newMatch = await Match.create({
      homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
    });
    return newMatch;
  }

  public static async getById(id : number) : Promise < Match | null > {
    const result = await Match.findByPk(id);
    return result;
  }

  public static async finish(id : number) : Promise < Match | null > {
    await Match.update(
      { inProgress: false },
      { where: { id } },
    );
    const patched = await this.getById(id);
    return patched;
  }

  public static async update(upData : IMatchUpdate) : Promise < true | IErrorRes > {
    try {
      const { id, homeTeamGoals, awayTeamGoals } = upData;
      await Match.update(
        { inProgress: true, homeTeamGoals, awayTeamGoals },
        { where: { id } },
      );
      return true;
    } catch (err) {
      console.log(err);
      return { code: 501, error: 'something went wrong' };
    }
  }
}
