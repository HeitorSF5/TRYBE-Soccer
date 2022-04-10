import * as express from 'express';
import clubRoutes from './database/routes/Clubs';
import leaderBoardRoutes from './database/routes/LeaderBoard';
import loginRoutes from './database/routes/Login';
import matchRoutes from './database/routes/Matchs';
// import loginRoutes from './database/routes/Login';
// import allRoutes from './database/routes';

class App {
  public app: express.Express;
  // ... A

  constructor() {
    this.app = express();
    // ...
    this.config();
    // ...
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };
    this.app.use(express.json());
    this.app.use(accessControl);
    this.app.use(loginRoutes);
    this.app.use(clubRoutes);
    this.app.use(matchRoutes);
    this.app.use(leaderBoardRoutes);
    // ...
  }

  // ...
  public start(PORT: string | number):void {
    // ...
    this.app.listen(PORT, () => console.log(`LISTENING TO ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
