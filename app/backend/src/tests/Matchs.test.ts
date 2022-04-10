import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import Match from '../database/models/matchs';
import matchMocks from './mocks/matchMocks';
import { app } from '../app';
import { Response } from 'superagent';
import IFullMatch from '../database/interfaces/FullMatch';
import Token from '../database/utils/Token';
import userMock from './mocks/userMock';
import { match } from 'assert';

const { expect } = chai;

chai.use(chaiHttp);

const validToken = Token.create(userMock[0]);

describe('Verifies all things MatchEs', () => {
  let chaiHttpResponse: Response;
  describe('can get all Matches from endpoint GET /matchs', () => {
    before(() => {
      sinon.stub(Match, 'findAll').resolves(matchMocks as Array < IFullMatch >)
    });

    after(() => {
      (Match.findAll as sinon.SinonStub).restore();
    });

    it('returns a Status 200 and All Matches', async () => {
      chaiHttpResponse = await chai.request(app).get('/matchs');
      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(matchMocks);
    })
  });

  describe('Can create a Match at endpoint POST /matchs', () => {
    const correctTemplate = {
      homeTeam: 1, awayTeam: 2, homeTeamGoals: 3, awayTeamGoals: 0, inProgress: true
    }
    describe('When all data is correct', () => {
      before(() => {
        sinon.stub(Match, 'create').resolves({ id: 3, ...correctTemplate } as IFullMatch);
        sinon.stub(Match, 'findAll')
      });

      after(() => { (Match.create as sinon.SinonStub).restore() });

      it('returns a Status 201 and the created Match', async () => {
        chaiHttpResponse = await chai.request(app).post('/matchs')
        .set({ authorization: Token.create({ email: 'some@thing.com', role: 'user' }) })
        .send(correctTemplate);

        expect(chaiHttpResponse.status).to.be.equal(201);
        expect(chaiHttpResponse.body).to.be.deep.equal({
          id: 3, ...correctTemplate,
        });

      })
    });
  })

  describe('Can update an ongoing match through endpoint PATCH /matchs/:id', () => {
    describe('Successfully updates it with all the correct credentials and data', () => {
      const upData = { homeTeamGoals: 1, awayTeamGoals: 2 }
      const updatedMatch = { ...matchMocks[1], ...upData }
      before(() => {
        sinon.stub(Match, 'update').resolves([2, [{ ...matchMocks[1], ...updatedMatch } as IFullMatch]]);
      });

      after(() => { (Match.update as sinon.SinonStub).restore() });

      it('returns a status 200 after success', async () => {
        chaiHttpResponse = await chai
          .request(app)
          .patch('/matchs/2')
          .set({ authorization: validToken });
        expect(chaiHttpResponse.status).to.be.equal(200);
      });
    });
  });

  describe('Can finish an ongoing match through endpoint PATCH /matchs/:id/finish', () => {
    describe('When all the data is valid', () => {
      const upData = { homeTeamGoals: 1, awayTeamGoals: 2, inProgress: false }
      const updatedMatch = { ...matchMocks[1], ...upData }

      before(() => {
        sinon.stub(Match, 'update').resolves([2, [{ ...matchMocks[1], ...updatedMatch } as IFullMatch]]);
        sinon.stub(Match, 'findByPk').resolves(updatedMatch as IFullMatch);
      });

      after(() => { 
        (Match.update as sinon.SinonStub).restore();
        (Match.findByPk as sinon.SinonStub).restore();
      });

      it('Returns status 200 and finished match', async () => {
        chaiHttpResponse = await chai
          .request(app)
          .patch('/matchs/2/finish')
          .set({ authorization: validToken });
        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(updatedMatch);
      })
      
    });
  });
  
})