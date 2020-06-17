process.env.NODE_ENV = 'test';

// Require dev-deps
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

import User from '../src/models/User';

// Assertions
chai.use(chaiHttp);

const should = chai.should();
const expect = chai.expect;

// @TODO: Use faker.

// Auth unit test
describe('Auth router unit test.', () => {
  beforeEach((done) => {
    User.deleteMany({}, err => done());
  });

  describe('/login ROUTE', () => {
    it('Should POST login data and receive a JWT token', done => {
      // @TODO: Implement login unit test.
      done();
    });
  }); // Login

  // Test signup route
  describe('/signup ROUTE', () => {
    it('Should POST registration data and register user.', done => {
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
            res.should.have.status(201);
            expect(res.body.user).to.be.a('object');
            expect(res.body.jwt).to.be.a('object');

            done();
          }); // Request end.
    }); // Signup
  });
});