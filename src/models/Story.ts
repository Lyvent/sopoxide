import { Schema, model } from 'mongoose';

const StorySchema = new Schema({
  title: {
    type: String,
    maxlength: 100,
    required: true,
  },

  content: {
    type: String,
    required: true
  },

  // Author Reference.
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Boosts [User] (They are equivalent to likes).
  boosts: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  tags: [String],

}, {
  // Assign timestamps to track changes.
  timestamps: true
});

// Model
const Story = model('Story', StorySchema);

export default Story;
export { StorySchema };
