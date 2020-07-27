import test from 'ava';
import sinon from 'sinon';
import faker from 'faker';
import { mockRequest, mockResponse } from 'mock-req-res';

import AuthHandler from '../../src/handlers/authHandler';
import User from '../../src/models/User';

const handler = new AuthHandler();

const internet = faker.internet;

// Create a Mongo User for mocking.
const fakeUserData = {
  email: internet.email(),
  fullName: faker.name.findName(),
  username: 'fake.user',
  password: internet.password(),
};

const fakeUser = new User(fakeUserData);

// Setup mocks
const FakeUserMock = sinon.mock(fakeUser);

test('should have a 400 error code response', async t => {
  const incompleteData = {
    email: fakeUserData.email,
    fullName: fakeUserData.fullName
    // Username/Password missing.
  };

  const req = mockRequest({
    body: incompleteData
  });

  const res = mockResponse();

  // Wait for Sign up to resolve.
  await handler.signUp(req, res);

  t.true(res.status.calledWith(400));
  t.true(res.json.calledWithMatch({
    message: 'Registration failed.'
  }));
});

test('should have a 201 response after creating user.', async t => {
  const req = mockRequest({
    body: fakeUserData
  });
  const res = mockResponse();

  // Use proxyquire to override issueJWT method.

  FakeUserMock.expects('validateSync').returns(undefined);
  FakeUserMock.expects('save').returns(fakeUser);

  await handler.signUp(req, res);

  FakeUserMock.verify();
  FakeUserMock.restore();

  t.true(res.status.calledWith(201));
});