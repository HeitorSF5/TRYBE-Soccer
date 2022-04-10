import { Router } from 'express';
import LeaderBControl from '../controllers/LeaderBoard';

const leaderBoardRoutes = Router();

leaderBoardRoutes.route('/leaderboard/home').get(LeaderBControl.getHome);
leaderBoardRoutes.route('/leaderboard/away').get(LeaderBControl.getAway);
leaderBoardRoutes.route('/leaderboard').get(LeaderBControl.getBoth);

export default leaderBoardRoutes;
