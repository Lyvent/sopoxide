import test from 'ava';
import faker from 'faker';

import { issueJWT, VerificationError } from '../../src/middleware/auth';
import User from '../../src/models/User';

const internet = faker.internet;

const fakeUserDoc = new User({
  email: internet.email(),
  password: internet.password()
});

test('should generate and issue JWT token', t => {
  const jwt = issueJWT(fakeUserDoc);
  
  t.is(typeof jwt.token, 'string');
  t.is(jwt.expires, '1d');
});

test('should construct proper verification error', t => {
  const err = new VerificationError('Test');

  t.is(err.message, 'Test');
  t.is(err.name, 'VerificationError');
});