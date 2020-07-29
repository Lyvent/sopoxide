// Get a specific story test.
import test from 'ava';
import sinon from 'sinon';
import faker from 'faker';
import { mockRequest, mockResponse } from 'mock-req-res';

import StoryHandler from '../../src/handlers/storyHandler';
import Story from '../../src/models/Story';

const handler = new StoryHandler();

// Create fake data
const lorem = faker.lorem;
const storyID: string = '5ae14d2e124da839884ff939';

const StoryDoc = new Story({
  content: lorem.paragraph(2),
});

// Setup Mocks
const StoryMock = sinon.mock(Story);

test.afterEach('Verify and Restore mock.', () => {
  StoryMock.verify();
  StoryMock.restore();
});

/* @TODO:
  - Inject fake user data into request.
*/
test('should pass if story is not found', async t => {
  const req = mockRequest({
    params: {
      storyID
    }
  });

  const res = mockResponse();

  // Mock story DB request.
  StoryMock.expects('findById')
           .withArgs(storyID)
           .returns(null);

  // Wait for request to resolve.
  await handler.get(req, res);

  t.true(res.status.calledWith(404));
  t.true(res.json.calledWithMatch({
    error: 'story_404'
  }));
});

test('should pass if story is found', async t => {
  const req = mockRequest({
    params: {
      storyID
    }
  });

  const res = mockResponse();

  // Mock Story DB request.
  StoryMock.expects('findById')
           .withArgs(storyID)
           .returns(StoryDoc);

  // Wait for request to resolve.
  await handler.get(req, res);

  t.true(res.status.calledWith(200));
  t.true(res.json.calledWithMatch({
    message: 'Story data sent.'
  }));
});