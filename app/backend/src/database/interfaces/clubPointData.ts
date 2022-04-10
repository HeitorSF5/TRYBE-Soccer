import IClubMatchData from './clubMatchData';

export default interface IClubPointsData extends IClubMatchData {
  totalPoints : number;
  goalsBalance: number,
  efficiency: number,
}
