import test from "ava";
import sinon from 'sinon';
import faker from 'faker';
import { mockRequest, mockResponse } from 'mock-req-res';

import User from '../../src/models/User';
import AuthHandler from '../../src/handlers/authHandler';

const handler = new AuthHandler();

const internet = faker.internet;

const fakeUserData = {
  email: internet.email(),
  username: internet.userName(),
  password: internet.password(),
}

test('should pass if it returns a bad response', t => {
  const req = mockRequest({
    body: {
      // No email (Incomplete data).
      password: fakeUserData.password
    }
  });
  const res = mockResponse();

  return handler.logIn(req, res).then(() => {
    t.true(res.status.calledWith(400));
    t.true(res.json.calledWith({
      message: 'Login credentials is incomplete!',
      error: 'data_incomplete'
    }));
  });
});

test('should pass if it doesn\'t find the user with the email', async t => {
  const fakeBody = {
    email: fakeUserData.email,
    password: fakeUserData.password
  };

  const req = mockRequest({ body: fakeBody });
  const res = mockResponse();

  const UserMock = sinon.mock(User);

  UserMock.expects('findOne')
          .withArgs({ email: fakeBody.email })
          .returns(null);

  await handler.logIn(req, res);

  UserMock.verify();
  UserMock.restore();

  t.true(res.status.calledWith(404));
  t.true(res.json.calledWithMatch({
    message: 'There are no accounts that exist with this email.'
  }));
});

test('should pass if it fails to validate user password', async t => {
  const fakeBody = {
    email: fakeUserData.email,
    password: fakeUserData.password
  };

  const req = mockRequest({ body: fakeBody });
  const res = mockResponse();

  const fakeUser = new User({
    email: fakeUserData.email,
    password: fakeUserData.password,
    fullName: faker.name.findName(),
    username: fakeUserData.username,
  });

  const UserMock = sinon.mock(User);
  const FakeUserMock = sinon.mock(fakeUser);

  UserMock.expects('findOne')
          .withArgs({ email: fakeBody.email })
          .returns(fakeUser);

  FakeUserMock.expects('isValidPassword')
              .withArgs(fakeBody.password)
              .returns(false);

  // Wait for handler to resolve.
  await handler.logIn(req, res);

  UserMock.verify();
  UserMock.restore();

  FakeUserMock.verify();
  FakeUserMock.restore();

  t.true(res.status.calledWith(404));
  t.true(res.json.calledWithMatch({
    message: 'Incorrect password, check login credentials.',
    error: 'password_incorrect'
  }));
});