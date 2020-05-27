import mongoose, { Schema } from 'mongoose';

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

  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }

  // TODO: Add more related fields with validations.
});

// Model
const Story = mongoose.model('Story', StorySchema);

export default Story;
export { StorySchema };
