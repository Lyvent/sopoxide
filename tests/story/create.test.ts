import test from 'ava';
import sinon from 'sinon';
import faker from 'faker';
import { mockRequest, mockResponse } from 'mock-req-res';

import StoryHandler, { CreateData } from '../../src/handlers/storyHandler';
import Story from '../../src/models/Story';

const handler = new StoryHandler();

// Create fake data
const lorem = faker.lorem;

const fakeCreateData: CreateData = {
  title: lorem.words(3),
  content: lorem.paragraph(2),
  category: lorem.word(),
}

const StoryDoc = new Story(fakeCreateData);

// Setup Mocks
const StoryMock = sinon.mock(Story);
const StoryDocMock = sinon.mock(StoryDoc);

test('should pass if create data is not found and returns 400', async t => {
  const req = mockRequest();
  const res = mockResponse();

  await handler.create(req, res);

  t.true(res.status.calledWith(400));
  t.true(res.json.calledWithMatch({
    message: 'Create data not found!',
  }));
});

test('should pass if user is not eligible and returns 403', async t => {
  const req = mockRequest({
    body: fakeCreateData,
    user: {
      confirmed: false
    }
  });
  const res = mockResponse();

  await handler.create(req, res);

  t.true(res.status.calledWith(403));
  t.true(res.json.calledWithMatch({
    message: 'You are not eligible to create posts.'
  }));
});

// Fix and update.
test.skip('should pass if story is created', async t => {
  const fakeUserData = {
    _id: '5ae14d2e124da839884ff939',
    confirmed: true,
    username: 'fake._.name'
  }

  const req = mockRequest({
    body: fakeCreateData,
    user: fakeUserData
  });
  const res = mockResponse();

  await handler.create(req, res);

  t.log(res.json.getCalls());
  t.log(res.status.getCalls());
});