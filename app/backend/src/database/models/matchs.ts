import { DataTypes, Model } from 'sequelize';
import db from '.';

class Match extends Model {
  public id! : number;

  public homeTeam! : number;

  public homeTeamGoals! : number;

  public awayTeam! : number;

  public awayTeamGoals! : number;

  public inProgress! : boolean;
}

Match.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  homeTeam: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'home_team',
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'home_team_goals',
  },
  awayTeam: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'away_team',
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'away_team_goals',
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'in_progress',
  },
}, {
  underscored: true,
  modelName: 'matchs',
  // tableName: 'matchs',
  sequelize: db,
  timestamps: false,
});

export default Match;
