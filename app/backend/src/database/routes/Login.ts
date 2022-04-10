import { Router } from 'express';
import LoginControl from '../controllers/Login';

const loginRoutes = Router();

loginRoutes.route('/login/validate').get(LoginControl.validate);
loginRoutes.route('/login').post(LoginControl.login);

export default loginRoutes;
