import test from 'ava';
import sinon from 'sinon';
import faker from 'faker';
import { mockRequest, mockResponse } from 'mock-req-res';

import AuthHandler from '../../src/handlers/authHandler';
import User from '../../src/models/User';
import { issueJWT } from '../../src/middleware/auth';

const handler = new AuthHandler();

const internet = faker.internet;

const fakeUserData = {
  email: internet.email(),
  fullName: faker.name.findName(),
  username: internet.userName(),
  password: internet.password(),
};

test('should have a 400 error code response', t => {
  const incompleteData = {
    email: fakeUserData.email,
    fullName: fakeUserData.fullName
    // Username/Password missing.
  };

  const req = mockRequest({
    body: incompleteData
  });

  const res = mockResponse();

  return handler.signUp(req, res).then(() => {
    t.true(res.status.calledWith(400));
    t.true(res.json.calledWithMatch({
      message: 'Registration failed.',
    }));
  });
});

test('should have a 201 response after creating user.', t => {
  const fakeUserLikeMyFriends = new User(fakeUserData);
  const req = mockRequest({
    body: fakeUserData
  });
  const res = mockResponse();

  const UserMock = sinon.mock(fakeUserLikeMyFriends);

  UserMock.expects('save').returns(fakeUserLikeMyFriends);

  return handler.signUp(req, res).then(() => {
    UserMock.verify();
    UserMock.restore();

    t.true(res.status.calledWith(201));
  });
});