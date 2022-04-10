import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import Club from '../database/models/clubs';
import clubMocks from './mocks/clubMocks';
import { app } from '../app';
import { Response } from 'superagent';

const { expect } = chai;

chai.use(chaiHttp);

describe('Verifies all things Club related', () => {
  let chaiHttpResponse: Response;
  describe('Can get all Clubs from endpoint GET /clubs', () => {
    before(() => {
      sinon
        .stub(Club, 'findAll')
        .resolves(clubMocks as Array < Club >);
    });

    after(() => {
      (Club.findAll as sinon.SinonStub).restore();
    });

    it('returns a Status 200 and all Clubs', async () => {
      chaiHttpResponse = await chai.request(app).get('/clubs');
      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(clubMocks);
    })
  });

  describe('Can get a Club with a specific id from GET /clubs/:id', () => {
    describe('With a valid id', () => {
      before(() => {
        sinon
          .stub(Club, 'findByPk')
          .resolves(clubMocks[0] as Club);
      });

      after(() => {
        (Club.findByPk as sinon.SinonStub).restore();
      });

      it('returns a Status 200 and the correct Club', async () => {
        chaiHttpResponse = await chai.request(app).get('/clubs/1');
        expect(chaiHttpResponse.status).to.be.equal(200);
        expect(chaiHttpResponse.body).to.be.deep.equal(clubMocks[0]);
      })
    })
  })
})