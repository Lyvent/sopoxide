import test from 'ava';
import sinon from 'sinon';

import User, { UserDoc } from '../src/models/User';

interface MockUserDoc extends UserDoc {
  status?: boolean;
  user?: object;
}

test('should return all users', t => {
  const UserMock = sinon.mock(User);
  const expectedResult = {
    status: true,
    users: []
  }

  UserMock.expects('find').yields(null, expectedResult);
  User.find((_, res: MockUserDoc) => {
    UserMock.verify();
    UserMock.restore();

    t.is(res.status, true);
  });
});

test('should return error if no users are found', t => {
  const UserMock = sinon.mock(User);
  const expectedResult = {
    status: false,
    error: 'Something went wrong'
  }

  UserMock.expects('find').yields(expectedResult, null);
  User.find((err, _) => {
    UserMock.verify();
    UserMock.restore();

    t.is(err.status, false);
    t.is(err.error, 'Something went wrong');
  });
});

// Specific user tests.
test('should pass if user is found.', t => {
  const UserMock = sinon.mock(User);
  const expectedResult = {
    status: true,
    user: {}
  };

  UserMock.expects('find').withArgs({ _id: 69420 }).yields(null, expectedResult);
  User.find({ _id: 69420 }, (_, res: MockUserDoc) => {
    UserMock.verify();
    UserMock.restore()

    t.true(res.status);
    t.is(typeof res.user, 'object')
  });
});

test('should fail if user is not found', t => {
  const UserMock = sinon.mock(User);
  const expectedResult = {
    status: false,
    message: 'User not found'
  }

  UserMock.expects('find').withArgs({ _id: 69420 }).yields(expectedResult, null);
  User.find({ _id: 69420 }, (err, _) => {
    UserMock.verify();
    UserMock.restore();

    t.false(err.status);
    t.is(err.message, 'User not found');
  });
});

// User creation tests
test('should pass if a new user is created', t => {
  const user = new User({
    username: 'mock.user'
  });

  const UserMock = sinon.mock(user);
  const expectedResult = {
    status: true,
    user: {}
  };

  UserMock.expects('save').yields(null, expectedResult);
  user.save((_, res: MockUserDoc) => {
    UserMock.verify();
    UserMock.restore();

    t.true(res.status);
    t.is(typeof res.user, 'object');
  });
});

test('should error if user is not saved', t => {
  const user = new User({
    username: 'mock.user'
  });

  const UserMock = sinon.mock(user);
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  };

  UserMock.expects('save').yields(expectedResult, null);
  user.save((err, _) => {
    UserMock.verify();
    UserMock.restore();

    t.false(err.status);
    t.is(err.message, 'Something went wrong');
  });
});

// User updating
test('should update a user by id', t => {
  const UserMock = sinon.mock(User);
  const expectedResult = {
    status: true,
    user: {}
  };

  UserMock.expects('update').withArgs({ _id: 69420 }).yields(null, expectedResult);
  User.update({ _id: 69420 }, { username: 'mock.user' }, (_, raw) => {
    UserMock.verify();
    UserMock.restore();

    t.true(raw.status);
  });
});

test('should return error if update action failed', t => {
  const UserMock = sinon.mock(User);
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  };

  UserMock.expects('update').withArgs({ _id: 69420 }).yields(expectedResult, null);
  User.update({ _id: 69420 }, { username: 'mock.user' }, (err, _) => {
    UserMock.verify();
    UserMock.restore();

    t.false(err.status);
    t.is(err.message, 'Something went wrong');
  });
});

// Delete user
test('should delete a user by id', t => {
  const UserMock = sinon.mock(User);
  const expectedResult = {
    status: true,
    message: 'User deleted'
  };

  UserMock.expects('remove').withArgs({ _id: 1 }).yields(null, expectedResult);
  User.remove({ _id: 1 }, err => {
    UserMock.verify();
    UserMock.restore();

    t.is(err, null);
  });
});

test('should error out if delete user by id failed', t => {
  const UserMock = sinon.mock(User);
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  };

  UserMock.expects('remove').withArgs({ _id: 1 }).yields(expectedResult, null);
  User.remove({ _id: 1 }, err => {
    UserMock.verify();
    UserMock.restore();

    t.is(err.status, false);
    t.is(err.message, 'Something went wrong');
  });
});

// User password checking
test('should pass if user password is right', async (t) => {
  const user = new User({
    password: 'test1234'
  });

  const UserMock = sinon.mock(user);

  UserMock.expects('isValidPassword').withArgs('test1234').returns(true);

  const isValid = await user.isValidPassword('test1234');

  UserMock.verify();
  UserMock.restore();

  t.true(isValid);
});

test('should pass if user password is wrong', async (t) => {
  const user = new User({
    password: 'test1234'
  });

  const UserMock = sinon.mock(user);

  UserMock.expects('isValidPassword').withArgs('wrongpass').returns(false);

  const isValid = await user.isValidPassword('wrongpass');

  UserMock.verify();
  UserMock.restore();

  t.false(isValid);
});

test('should pass if user creation validates properly', t => {
  const user = new User({
    email: 'mock@user.com',
    fullName: 'Mock User',
    username: 'mock.user',
    password: 'mock1234'
  });

  const error = user.validateSync();

  t.is(error, undefined);
});

test('should pass if the validation errors properly', t => {
  const user = new User({
    fullName: 'Mock User',
    password: 'mock1234'
  });

  const error = user.validateSync();

  t.is(error?.errors['email'].message, 'Email is a required value.');
  t.is(error?.errors['username'].message, 'Username is a required value.');
});