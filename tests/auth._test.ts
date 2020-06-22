// @TODO: Refactor
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';

import { mockRequest, mockResponse } from 'mock-req-res';
import AuthHandler from '../src/handlers/authHandler';

const handler = new AuthHandler();

describe('login', () => {
  it('should 400 if email is missing from the body', async (done) => {
    const req = mockRequest({
      body: { password: 'test1234' }
    });
    const res = mockResponse();

    await handler.logIn(req, res);
    
    done();

  }).timeout(10000);
});