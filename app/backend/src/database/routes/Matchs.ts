import { Router } from 'express';
import MatchControl from '../controllers/Matchs';

const matchRoutes = Router();

matchRoutes.route('/matchs/:id/finish').patch(MatchControl.finish);
matchRoutes.route('/matchs/:id').patch(MatchControl.update);
matchRoutes.route('/matchs').get(MatchControl.getAll);
matchRoutes.route('/matchs').post(MatchControl.create);

export default matchRoutes;
