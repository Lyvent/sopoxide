import chai, { expect } from 'chai';
import sinon from 'sinon';

// Import user model
import User from '../src/models/User';

// Get all users.
describe('Get all users', () => {
  // Test will pass if we get all users
  it('should return all users', done => {
    const UserMock = sinon.mock(User);
    const expectedResult = {
      status: true,
      user: []
    };

    UserMock.expects('find').yields(null, expectedResult);
    User.find((_, res) => {
      UserMock.verify();
      UserMock.restore();
      expect((res as any).status).to.be.true;
      done();
    });
  });

  // Test will pass if we fail to get a todo
  it('should return error', done => {
    const UserMock = sinon.mock(User);
    const expectedResult = {
      status: false,
      error: 'Something went wrong'
    };

    UserMock.expects('find').yields(expectedResult, null);
    User.find((err, _) => {
      UserMock.verify();
      UserMock.restore();
      expect(err.status).to.not.be.true;
      done();
    });
  });
});

// Get (1) user.
describe('Get a user', () => {
  it('should return a user by id', done => {
    const UserMock = sinon.mock(User);
    const expectedResult = { status: true };

    UserMock.expects('find').withArgs({ _id: 69420 }).yields(null, expectedResult);
    User.find({ _id: 69420 }, (_, res) => {
      UserMock.verify();
      UserMock.restore();

      expect((res as any).status).to.be.true;
      done();
    });
  });

  it('should return error if it fails to get user by id', done => {
    const UserMock = sinon.mock(User);
    const expectedResult = { status: false };

    UserMock.expects('find').withArgs({ _id: 69421 }).yields(expectedResult, null);
    User.find({ _id: 69421 }, (err, _) => {
      UserMock.verify();
      UserMock.restore();

      expect(err.status).to.not.be.true;
      done();
    });
  });
});

// Create user.
describe('Create a new user', () => {
  it('should verify create a new user', done => {
    const user = new User({
      username: 'mock.user'
    });

    const UserMock = sinon.mock(user);
    const expectedResult = { status: true };

    UserMock.expects('save').yields(null, expectedResult);
    user.save((_, res) => {
      UserMock.verify();
      UserMock.restore();

      expect((res as any).status).to.be.true;
      done();
    });
  });

  it('should return error if user is not saved.', done => {
    const user = new User({
      username: 'mock.user'
    });

    const UserMock = sinon.mock(user);
    const expectedResult = { status: false };

    UserMock.expects('save').yields(expectedResult, null);
    user.save((err, _) => {
      UserMock.verify();
      UserMock.restore();

      expect(err.status).to.not.be.true;
      done();
    });
  });
});

// Update user.
describe('Update a user by id', () => {
  it('should update a user by id', done => {
    const UserMock = sinon.mock(User);
    const expectedResult = { status: true };

    UserMock.expects('update').withArgs({ _id: 69420 }).yields(null, expectedResult);
    User.update({ _id: 69420}, { username: 'mock.user' }, (_, raw) => {
      UserMock.verify();
      UserMock.restore();
      
      expect(raw.status).to.be.true;
      done();
    });
  });

  it('should return error if update action is failed', done => {
    const UserMock = sinon.mock(User);
    const expectedResult = { status: false };

    UserMock.expects('update').withArgs({ _id: 69421 }).yields(expectedResult, null);
    User.update({ _id: 69421 }, { username: 'mock.user' }, (err, _) => {
      UserMock.verify();
      UserMock.restore();
      
      expect(err.status).to.not.be.true;
      done();
    });
  });
});

// Delete user.
describe('Delete a user by id', () => {
  it('should delete a todo by id', done => {
    const UserMock = sinon.mock(User);
    const expectedResult = { status: true };

    UserMock.expects('remove').withArgs({ _id: 69420 }).yields(null, expectedResult);
    User.remove({ _id: 69420 }, err => {
      UserMock.verify();
      UserMock.restore();

      expect(err).to.be.null;
      done();
    });
  });

  it('should return error if delete action is failed', done => {
    const UserMock = sinon.mock(User);
    const expectedResult = { status: true };

    UserMock.expects('remove').withArgs({ _id: 69420 }).yields(expectedResult, null);
    User.remove({ _id: 69420 }, err => {
      UserMock.verify();
      UserMock.restore();

      expect(err.status).to.be.true;
      done();
    });
  });
});

describe('Checking user password', () => {
  it('should check user password is right', done => {
    const user = new User({
      password: 'test1234'
    });

    const UserMock = sinon.mock(user);
    const expectedResult = true;

    UserMock.expects('isValidPassword').withArgs('test1234').resolves(expectedResult);
    done();
  });
});