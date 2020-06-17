process.env.NODE_ENV = 'test';

// Require dev-deps
import chai from 'chai';
import chaiHttp from 'chai-http';

import { clearDatabase } from './db-handler';

import app from '../src/app';

const should = chai.should();

chai.use(chaiHttp);

// Auth unit test
describe('auth', () => {
  beforeEach((done) => {
    clearDatabase();
    done();
  });

  // Test Register Route
  describe('/POST auth', () => {
    it('It should POST registration data and register user.', (done) => {
      const signUpData = {
        email: 'test@user.com',
        password: 'test1234',
        fullName: 'Test User',
        username: 'test.user',
      }

      chai.request(app)
          .post('/auth/signup')
          .send(signUpData)
          .end((err, res) => {
            console.log(res);
          });

          done();
    });
  });

});