import test from 'ava';
import sinon from 'sinon';
import faker from 'faker';

import { Document } from 'mongoose';
import Story from '../../src/models/Story';

// Create Mock interface(s).
interface MockStoryDoc extends Document {
  status?: boolean;
  story?: object;
};

// Setup faker data.
const lorem = faker.lorem;

const fakeStoryData = {
  title: lorem.word(),
  content: lorem.paragraph(2),
  // Example object ID from Mongo's docs.
  author: '5ae14d2e124da839884ff939',
  category: lorem.word(),
}

// Setup Mocks.
const StoryDoc: MockStoryDoc = new Story(fakeStoryData);

const StoryMock = sinon.mock(Story);
const StoryDocMock = sinon.mock(StoryDoc);

test.afterEach('Verify and Restore mock.', () => {
  StoryMock.verify();
  StoryMock.restore();
});

// Multiple story tests.
test('should pass if it returns all stories', async t => {
  const expectedResult = {
    status: true,
    stories: []
  };

  StoryMock.expects('find').yields(null, expectedResult);
  await Story.find((_, res: MockStoryDoc) => {
    t.is(res.status, true);
  });
});

test('should pass if it returns an error (no stories found).', async t => {
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  }

  StoryMock.expects('find').yields(expectedResult, null);
  await Story.find((err, _) => {
    t.false(false);
    t.is(err.message, expectedResult.message);
  });
});


// Specific story tests
test('should pass if story is found', async t => {
  const expectedResult = {
    status: true,
    story: {}
  };

  StoryMock.expects('find').withArgs({ _id: 69420 }).yields(null, expectedResult);
  await Story.find({ _id: 69420 }, (_, res: MockStoryDoc) => {
    t.true(res.status);
    t.is(typeof res.story, 'object');
  });
});

test('should pass if story is not found', async t => {
  const expectedResult = {
    status: false,
    message: 'Story not found'
  };

  StoryMock.expects('find').withArgs({ _id: 69420 }).yields(expectedResult, null);
  await Story.find({ _id: 69420 }, (err, _) => {
    t.false(err.status);
    t.is(err.message, expectedResult.message);
  });
});

// Story creation tests
test('should pass if a new story is created', async t => {
  const expectedResult = {
    status: true,
    story: {}
  }

  StoryDocMock.expects('save').yields(null, expectedResult);
  await StoryDoc.save((_, res: MockStoryDoc) => {
    t.true(res.status);
    t.is(typeof res.story, 'object')
  });

  StoryDocMock.verify();
  StoryDocMock.restore();
});

test('should pass if story is not saved', async t => {
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  };

  StoryDocMock.expects('save').yields(expectedResult, null);
  await StoryDoc.save((err, _) => {
    t.false(err.status);
    t.is(err.message, expectedResult.message);
  });

  StoryDocMock.verify();
  StoryDocMock.restore();
});

// Story updating
test('should pass if story gets updated by', async t => {
  const expectedResult = {
    status: true,
  };

  StoryMock.expects('update')
           .withArgs({ _id: 1 }, { content: 'proper content' })
           .yields(null, expectedResult);

  await Story.update({ _id: 1 }, { content: 'proper content' }, (_, raw) => {
    t.true(raw.status);
  });
});

test('should pass if update action failed', async t => {
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  }

  StoryMock.expects('update').withArgs({ _id: 1 }).yields(expectedResult, null);
  await Story.update({ _id: 1}, { content: 'bad content' }, (err, _) => {
    t.false(err.status);
    t.is(err.message, expectedResult.message);
  });
});

// Delete story
test('should delete story by id', async t => {
  const expectedResult = {
    status: true,
    message: 'Story deleted'
  };

  StoryMock.expects('remove').withArgs({ _id: 1 }).yields(null, expectedResult);
  await Story.remove({ _id: 1 }, err => {
    t.is(err, null);
  });
});

test('should error if delete story by id fails', async t => {
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  };

  StoryMock.expects('remove').withArgs({ _id: 1 }).yields(expectedResult, null);
  await Story.remove({ _id: 1 }, err => {
    t.false(err.status);
    t.is(err.message, expectedResult.message);
  });
});

test('should pass if story creation validates properly', async t => {
  const error = StoryDoc.validateSync();

  t.is(error, undefined);
});