import { Router } from 'express';
import ClubControl from '../controllers/Clubs';

const clubRoutes = Router();

clubRoutes.route('/clubs/:id').get(ClubControl.getById);
clubRoutes.route('/clubs').get(ClubControl.getAll);

export default clubRoutes;
