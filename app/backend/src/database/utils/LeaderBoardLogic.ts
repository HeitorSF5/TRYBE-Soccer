import { firstBy } from 'thenby';
import IClubLeaderBoard from '../interfaces/ClubLeaderBoard';
import IClubMatchData from '../interfaces/clubMatchData';
import IClubPointsData from '../interfaces/clubPointData';
import Club from '../models/clubs';
import Match from '../models/matchs';

// I was having a tough time on how to properly arrange and filter everything, but then I saw and liked how Paulo Renan did it: https://github.com/tryber/sd-014-a-trybe-futebol-clube/pull/11

// Originally I was planning on creating a single BIG filter within a filter within a filter etc etc until it became a cascading hell for reading and borderline unmanageable. And I just saw that he made a bunch of tiny filter functions at the top of his file. Brilliant.

// I then thought of making each filter a static method, but that would pollute and bloat the entire class, and putting it on a different file would make reading this a nightmare by jumping back and forth between folders and files. So yeah, I just made a list of functions OUTSIDE the class that will do everything I want and call them from within the methods that need them here.

const wonMatches = (matches: Match[], id : number) : number => {
  const victories = matches.filter((eachMatch) => {
    const isHome = eachMatch.homeTeamGoals > eachMatch.awayTeamGoals && id === eachMatch.homeTeam;
    const isAway = eachMatch.homeTeamGoals < eachMatch.awayTeamGoals && id === eachMatch.awayTeam;
    if (isHome || isAway) return true;
    return false;
  });
  return victories.length;
};

const lostMatches = (matches: Match[], id : number) : number => {
  const losses = matches.filter((eachMatch) => {
    const isHome = eachMatch.homeTeamGoals < eachMatch.awayTeamGoals && id === eachMatch.homeTeam;
    const isAway = eachMatch.homeTeamGoals > eachMatch.awayTeamGoals && id === eachMatch.awayTeam;
    if (isHome || isAway) return true;
    return false;
  });

  return losses.length;
};

const drawMatches = (matches: Match[]) : number => {
  const draws = matches
    .filter((eachMatch) => eachMatch.awayTeamGoals === eachMatch.homeTeamGoals);
  return draws.length;
};

const goalScored = (matches : Match[], id: number) : number => {
  let goals = 0;
  matches.forEach((eachMatch) => {
    if (id === eachMatch.homeTeam) goals += eachMatch.homeTeamGoals;
    if (id === eachMatch.awayTeam) goals += eachMatch.awayTeamGoals;
  });
  return goals;
};

const goalTaken = (matches: Match[], id : number) : number => {
  let goals = 0;
  matches.forEach((eachMatch) => {
    if (id === eachMatch.homeTeam) goals += eachMatch.awayTeamGoals;
    if (id === eachMatch.awayTeam) goals += eachMatch.homeTeamGoals;
  });
  return goals;
};

export default class LeaderBoardLogic {
  public static clubMatchData(clubMatches : Match[], id : number)
    : IClubMatchData {
    const totalVictories = wonMatches(clubMatches, id);
    const totalLosses = lostMatches(clubMatches, id);
    const totalDraws = drawMatches(clubMatches);
    const totalGames = clubMatches.length;
    const goalsFavor = goalScored(clubMatches, id);
    const goalsOwn = goalTaken(clubMatches, id);
    return { totalVictories, totalLosses, totalDraws, goalsFavor, goalsOwn, totalGames };
  }

  public static pointCalculator(data : IClubMatchData) : IClubPointsData {
    const { totalVictories, totalLosses, totalDraws, totalGames, goalsFavor, goalsOwn } = data;
    const totalPoints = (totalVictories * 3) + totalDraws;
    const efficiency = Number(
      ((totalPoints / (totalGames * 3)) * 100).toFixed(2),
    );
    const goalsBalance = goalsFavor - goalsOwn;
    const pointsData = {
      totalPoints,
      totalGames,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency,
    };
    return pointsData;
  }

  public static sortByRank(leadBoard : IClubLeaderBoard[]) : IClubLeaderBoard[] {
    const sorted = leadBoard.sort(
      firstBy('totalPoints', 'desc')
        .thenBy('totalVictories', 'desc')
        .thenBy('goalsBalance', 'desc')
        .thenBy('goalsFavor', 'desc')
        .thenBy('goalsOwn', 'asc'),
    );
    return sorted;
  }
  // https://www.npmjs.com/package/thenby
  // never again suffer the vanilla .sort()

  public static TeamLeaderBoard(allClubs : Club[], allMatches: Match[], teamIsHome : boolean | null)
    : IClubLeaderBoard[] {
    const leaderBoard = allClubs.map((team) => {
      let clubMatches : Match[];
      switch (teamIsHome) {
        case true: clubMatches = allMatches.filter((eachMatch) =>
          eachMatch.homeTeam === team.id); break;

        case false: clubMatches = allMatches.filter((eachMatch) =>
          eachMatch.awayTeam === team.id); break;

        default: clubMatches = allMatches.filter((eachMatch) =>
          eachMatch.homeTeam === team.id || eachMatch.awayTeam === team.id);
      }
      const rawData = this.clubMatchData(clubMatches, team.id);
      const clubData = this.pointCalculator(rawData);
      return { name: team.clubName, ...clubData };
    });
    return leaderBoard;
  }
}
