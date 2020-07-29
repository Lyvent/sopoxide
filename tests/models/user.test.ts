import test from 'ava';
import sinon from 'sinon';
import faker from 'faker';

import User, { UserDoc } from '../../src/models/User';

// Create Mock interface(s).
interface MockUserDoc extends UserDoc {
  status?: boolean;
  user?: object;
}

// Setup faker data.
const internet = faker.internet;
const fullName: string = faker.name.firstName() + faker.name.lastName();

const fakeUserData = {
  email: internet.email(),
  username: 'fake.user',
  fullName,
  password: internet.password(),
}

// Setup Mocks.
const UserDoc: MockUserDoc = new User(fakeUserData);

const UserMock = sinon.mock(User);
const UserDocMock = sinon.mock(UserDoc);

test.afterEach('Verify and Restore mock.', () => {
  UserMock.verify();
  UserMock.restore();
});

// Begin unit tests.
// Multiple user method tests.
test('should return all users', async t => {
  const expectedResult = {
    status: true,
    users: []
  };

  UserMock.expects('find').yields(null, expectedResult);
  await User.find((_, res: MockUserDoc) => {
    t.true(res.status);
  });
});

test('should return error if no users are found', async t => {
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  }

  UserMock.expects('find').yields(expectedResult, null);
  await User.find((err, _) => {
    t.false(false);
    t.is(err.message, expectedResult.message);
  });
});

// Specific user tests.
test('should pass if user is found.', async t => {
  const expectedResult = {
    status: true,
    user: {}
  };

  UserMock.expects('find').withArgs({ _id: 69420 }).yields(null, expectedResult);
  await User.find({ _id: 69420 }, (_, res: MockUserDoc) => {
    t.true(res.status);
    t.is(typeof res.user, 'object')
  });
});

test('should fail if user is not found', async t => {
  const expectedResult = {
    status: false,
    message: 'User not found.'
  }

  UserMock.expects('find').withArgs({ _id: 69420 }).yields(expectedResult, null);
  await User.find({ _id: 69420 }, (err, _) => {
    t.false(err.status);
    t.is(err.message, expectedResult.message);
  });
});

// User creation tests
test('should pass if a new user is created', async t => {
  const expectedResult = {
    status: true,
    user: {}
  };

  UserDocMock.expects('save').yields(null, expectedResult);
  await UserDoc.save((_, res: MockUserDoc) => {
    t.true(res.status);
    t.is(typeof res.user, 'object');
  });

  UserDocMock.verify();
  UserDocMock.restore();
});

test('should error if user is not saved', async t => {
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  };

  UserDocMock.expects('save').yields(expectedResult, null);
  await UserDoc.save((err, _) => {
    t.false(err.status);
    t.is(err.message, expectedResult.message);
  });

  UserDocMock.verify();
  UserDocMock.restore();
});

// User updating
test('should update a user by id', async t => {
  const expectedResult = {
    status: true,
  };

  UserMock.expects('update')
          .withArgs({ _id: 69420 }, { username: 'mock.user' })
          .yields(null, expectedResult);

  await User.update({ _id: 69420 }, { username: 'mock.user' }, (_, raw) => {
    t.true(raw.status);
  });
});

test('should return error if update action failed', async t => {
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  };

  UserMock.expects('update')
          .withArgs({ _id: 69420 }, { username: 'mock.user' })
          .yields(expectedResult, null);

  await User.update({ _id: 69420 }, { username: 'mock.user' }, (err, _) => {
    t.false(err.status);
    t.is(err.message, expectedResult.message);
  });
});

// Delete user
test('should delete a user by id', async t => {
  const expectedResult = {
    status: true,
    message: 'User deleted'
  };

  UserMock.expects('remove').withArgs({ _id: 1 }).yields(null, expectedResult);
  await User.remove({ _id: 1 }, err => {
    t.is(err, null);
  });
});

test('should error out if delete user by id failed', async t => {
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  };

  UserMock.expects('remove').withArgs({ _id: 1 }).yields(expectedResult, null);
  await User.remove({ _id: 1 }, err => {
    t.is(err.status, false);
    t.is(err.message, expectedResult.message);
  });
});

// User password checking
test('should pass if user password is right', async t => {
  UserDocMock.expects('isValidPassword').withArgs(fakeUserData.password).returns(true);

  const isValid = await UserDoc.isValidPassword(fakeUserData.password);

  UserDocMock.verify();
  UserDocMock.restore();

  t.true(isValid);
});

test('should pass if user password is wrong', async t => {
  UserDocMock.expects('isValidPassword').withArgs('wrongpass').returns(false);

  const isValid = await UserDoc.isValidPassword('wrongpass');

  UserDocMock.verify();
  UserDocMock.restore();

  t.false(isValid);
});

test('should return false if user is not an admin', t => {
  const isAdmin = UserDoc.isAdmin();

  t.false(isAdmin);
});

test('should return true if user is an admin', t => {
  UserDoc.role = 'admin';
  const isAdmin = UserDoc.isAdmin();

  t.true(isAdmin);
});

test('should pass if user creation validates properly', t => {
  const error = UserDoc.validateSync();

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