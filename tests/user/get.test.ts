// Get a specific user test.
import test from 'ava';
import sinon from 'sinon';
import { mockRequest, mockResponse } from 'mock-req-res';

import UserHandler from '../../src/handlers/userHandler';
import User from '../../src/models/User';

const handler = new UserHandler();
const username: string = 'test.user';

const UserMock = sinon.mock(User);

test('should pass if user is not found', async t => {
  const req = mockRequest({
    params: {
      username
    }
  });
  const res = mockResponse();

  // Mock user DB request.
  UserMock.expects('findOne')
          .withArgs({ username })
          .returns(null);

  // Wait for request to resolve.
  await handler.get(req, res);

  UserMock.verify();
  UserMock.restore();

  t.true(res.status.calledWith(404));
  t.true(res.json.calledWithMatch({
    message: 'There are no user associated with this username',
    error: 'user_404'
  }));
});

test('should pass if user is found', async t => {
  const req = mockRequest({
    params: {
      username
    }
  });
  const res = mockResponse();

  // Mock user DB request.
  const fakeUser = new User({ username });

  UserMock.expects('findOne')
          .withArgs({ username })
          .returns(fakeUser);

  await handler.get(req, res);

  UserMock.verify();
  UserMock.restore();

  t.true(res.status.calledWith(200));
  t.true(res.json.calledWithMatch({
    message: `${username} data sent.`
  }));
});