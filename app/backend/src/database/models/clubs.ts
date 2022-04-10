import { DataTypes, Model } from 'sequelize';
import db from '.';
import Match from './matchs';

class Club extends Model {
  public id! : number;

  public clubName! : string;
}

Club.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  clubName: {
    field: 'club_name',
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  timestamps: false,
  modelName: 'clubs',
  // tableName: 'clubs',
});

Club.hasMany(Match, { foreignKey: 'id', as: 'homeClub' });
Club.hasMany(Match, { foreignKey: 'id', as: 'awayClub' });
Match.belongsTo(Club, { foreignKey: 'homeTeam', as: 'homeClub' });
Match.belongsTo(Club, { foreignKey: 'awayTeam', as: 'awayClub' });

export default Club;
