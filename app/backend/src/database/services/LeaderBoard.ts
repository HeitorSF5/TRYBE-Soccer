import IClubLeaderBoard from '../interfaces/ClubLeaderBoard';
import Club from '../models/clubs';
import Match from '../models/matchs';
import LeaderBoardLogic from '../utils/LeaderBoardLogic';

export default class LeaderBService {
  public static async getHome() : Promise < IClubLeaderBoard[] > {
    const allClubs = await Club.findAll();
    const allMatches = await Match.findAll({ where: { inProgress: false } });
    const getHomeLeaderBoard = LeaderBoardLogic.TeamLeaderBoard(allClubs, allMatches, true);
    const sortByRank = LeaderBoardLogic.sortByRank(getHomeLeaderBoard);
    return sortByRank;
  }

  public static async getAway() : Promise < IClubLeaderBoard[] > {
    const allClubs = await Club.findAll();
    const allMatches = await Match.findAll({ where: { inProgress: false } });
    const getAwayLeaderBoard = LeaderBoardLogic.TeamLeaderBoard(allClubs, allMatches, false);
    const sortByRank = LeaderBoardLogic.sortByRank(getAwayLeaderBoard);
    return sortByRank;
  }

  public static async getBoth() : Promise < IClubLeaderBoard[] > {
    const allClubs = await Club.findAll();
    const allMatches = await Match.findAll({ where: { inProgress: false } });
    const getLeaderBoard = LeaderBoardLogic.TeamLeaderBoard(allClubs, allMatches, null);
    const sortByRank = LeaderBoardLogic.sortByRank(getLeaderBoard);
    return sortByRank;
  }
}
