// Get a specific story test.
import test from 'ava';
import sinon from 'sinon';
import { mockRequest, mockResponse } from 'mock-req-res';

import StoryHandler from '../../src/handlers/storyHandler';
import Story from '../../src/models/Story';

const handler = new StoryHandler();

// Setup Mocks

/* @TODO:
  - Inject fake user data into request.
  - Create fake story and mocks.
*/
test('Not implemented', t => {
  t.pass();
});