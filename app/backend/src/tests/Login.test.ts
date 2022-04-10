import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import User from '../database/models/users';
import userMock from './mocks/userMock';
import { app } from '../app';
import { Response } from 'superagent';
import Token from '../database/utils/Token';

const { expect } = chai;

chai.use(chaiHttp);

describe('Verifies all things related to Login', () => {
  let chaiHttpResponse: Response;
  const { id, username, role, email } = userMock[0];
  const result = {
    user: { id, username, role, email }, token: 'averyverylongstringofcharacters'
  }
  describe('Valid email and password', () => {
    before(() => {
      sinon
        .stub(User, "findOne")
        .resolves(userMock[0] as User);
    })
    after(()=>{
      (User.findOne as sinon.SinonStub).restore();
    })
    it('Returns the 200 Status and a Token', async () => {

      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_admin' });
      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body.user).to.be.deep.equal(result.user);
      expect(chaiHttpResponse.body).to.have.property('token');
    })
  })
  // describe('Invalid Email', () =>{

  // })
  describe('login/validate route', () => {
    describe('with a working token', () => {
      before(() => {
        sinon
          .stub(User, 'findOne')
          .resolves(userMock[0] as User)
      });

      after(() => {
        (User.findOne as sinon.SinonStub).restore();
      });

      it('returns a 200 Status and the Role of the user', async () => {
        chaiHttpResponse = await chai
          .request(app)
          .get('/login/validate')
          .set({ authorization: Token.create(result.user) })
          expect(chaiHttpResponse.status).to.be.equal(200);
          expect(chaiHttpResponse.body).to.be.equal(userMock[0].role);
      })
    })
  })
});
