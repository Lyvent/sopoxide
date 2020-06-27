import test from 'ava';
import { mockResponse } from 'mock-req-res'

import { serverErrResponse, badRequestResponse } from '../src/helpers/response';
import { emailRegex, usernameRegex, nameRegex } from '../src/helpers/regex';
import minutes from '../src/helpers/minutes';

test('should pass if the amount of minutes is generated correctly.', t => {
  const expected: number = 5 * 60000
  t.is(minutes(5), expected);
});

test('should pass if regex matches', t => {
  t.regex('valid@email.com', emailRegex);
  t.regex('valid._.username', usernameRegex);
  t.regex('Lenovo ThinkPad', nameRegex);
});

test('should pass if regex fails', t => {
  t.notRegex('invalid.com@email', emailRegex);
  t.notRegex('invalid@username', usernameRegex);
  t.notRegex('Sean 101', nameRegex);
});

test('should pass if server responds with 500 status code', t => {
  const res = mockResponse();

  serverErrResponse(res);

  t.true(res.status.calledWith(500));
  t.true(res.json.calledWith({
    message: 'An error occured!',
    error: 'server_error'
  }));
});

test('should pass if server response with 400 status code', t => {
  const res = mockResponse();
  const message: string = 'A test message';

  badRequestResponse(res, message);

  t.true(res.status.calledWith(400));
  t.true(res.json.calledWith({
    message: message,
    error: 'data_incomplete'
  }));
});