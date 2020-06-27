import test from 'ava';
import sinon from 'sinon';
import faker, { fake } from 'faker';

import { Document } from 'mongoose';
import Story from '../../src/models/Story';

interface MockStoryDoc extends Document {
  status?: boolean;
  story?: object;
};

const lorem = faker.lorem;

const fakeStoryData = {
  title: lorem.word(),
  content: lorem.paragraph(2),
  // Example object ID from Mongo's docs.
  author: '507f1f77bcf86cd799439011',
  category: lorem.word(),
}

// Multiple story tests.
test('should pass if it returns all stories', t => {
  const StoryMock = sinon.mock(Story);
  const expectedResult = {
    status: true,
    stories: []
  };

  StoryMock.expects('find').yields(null, expectedResult);
  Story.find((_, res: MockStoryDoc) => {
    StoryMock.verify();
    StoryMock.restore();

    t.is(res.status, true);
  });
});

test('should pass if it returns an error (no stories found).', t => {
  const StoryMock = sinon.mock(Story);
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  }

  StoryMock.expects('find').yields(expectedResult, null);
  Story.find((err, _) => {
    StoryMock.verify();
    StoryMock.restore();

    t.false(false);
    t.is(err.message, expectedResult.message);
  });
});


// Specific story tests
test('should pass if story is found', t => {
  const StoryMock = sinon.mock(Story);
  const expectedResult = {
    status: true,
    story: {}
  };

  StoryMock.expects('find').withArgs({ _id: 69420 }).yields(null, expectedResult);
  Story.find({ _id: 69420 }, (_, res: MockStoryDoc) => {
    StoryMock.verify();
    StoryMock.restore();

    t.true(res.status);
    t.is(typeof res.story, 'object');
  });
});

test('should pass if story is not found', t => {
  const StoryMock = sinon.mock(Story);
  const expectedResult = {
    status: false,
    message: 'Story not found'
  };

  StoryMock.expects('find').withArgs({ _id: 69420 }).yields(expectedResult, null);
  Story.find({ _id: 69420 }, (err, _) => {
    StoryMock.verify();
    StoryMock.restore();

    t.false(err.status);
    t.is(err.message, expectedResult.message);
  });
});

// Story creation tests
test('should pass if a new story is created', t => {
  const story: MockStoryDoc = new Story({
    content: 'good content'
  });

  const StoryMock = sinon.mock(story);
  const expectedResult = {
    status: true,
    story: {}
  }

  StoryMock.expects('save').yields(null, expectedResult);
  story.save((_, res: MockStoryDoc) => {
    StoryMock.verify();
    StoryMock.restore();

    t.true(res.status);
    t.is(typeof res.story, 'object')
  });
});

test('should pass if story is not saved', t => {
  const story: MockStoryDoc = new Story({
    content: 'good content'
  });

  const StoryMock = sinon.mock(story);
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  };

  StoryMock.expects('save').yields(expectedResult, null);
  story.save((err, _) => {
    StoryMock.verify();
    StoryMock.restore();

    t.false(err.status);
    t.is(err.message, expectedResult.message);
  });
});

// Story updating
test('should pass if story gets updated by', t => {
  const StoryMock = sinon.mock(Story);
  const expectedResult = {
    status: true,
  };

  StoryMock.expects('update')
           .withArgs({ _id: 1 }, { content: 'proper content' })
           .yields(null, expectedResult);

  Story.update({ _id: 1 }, { content: 'proper content' }, (_, raw) => {
    StoryMock.verify();
    StoryMock.restore();

    t.true(raw.status);
  });
});

test('should pass if update action failed', t => {
  const StoryMock = sinon.mock(Story);
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  }

  StoryMock.expects('update').withArgs({ _id: 1 }).yields(expectedResult, null);
  Story.update({ _id: 1}, { content: 'bad content' }, (err, _) => {
    StoryMock.verify();
    StoryMock.restore();

    t.false(err.status);
    t.is(err.message, expectedResult.message);
  });
});

// Delete story
test('should delete story by id', t => {
  const StoryMock = sinon.mock(Story);
  const expectedResult = {
    status: true,
    message: 'Story deleted'
  };

  StoryMock.expects('remove').withArgs({ _id: 1 }).yields(null, expectedResult);
  Story.remove({ _id: 1 }, err => {
    StoryMock.verify();
    StoryMock.restore();

    t.is(err, null);
  });
});

test('should error if delete story by id fails', t => {
  const StoryMock = sinon.mock(Story);
  const expectedResult = {
    status: false,
    message: 'Something went wrong'
  };

  StoryMock.expects('remove').withArgs({ _id: 1 }).yields(expectedResult, null);
  Story.remove({ _id: 1 }, err => {
    StoryMock.verify();
    StoryMock.restore();

    t.false(err.status);
    t.is(err.message, expectedResult.message);
  });
});

test('should pass if story creation validates properly', t => {
  const story: MockStoryDoc = new Story(fakeStoryData);

  const error = story.validateSync();

  t.is(error, undefined);
});