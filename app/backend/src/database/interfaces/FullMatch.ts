import Match from '../models/matchs';

export default interface IFullMatch extends Match {
  homeClub: { clubName: string },
  awayClub: { clubName: string },
}
// This is a smarter(?) way to circumvent my shortcoming in the Model association without having to actually edit any Model.
