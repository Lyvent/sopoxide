import mongoose, { Schema } from 'mongoose';

const StorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  }

  // TODO: Add more related fields with validations.
});

// Model
const Story = mongoose.model('Story', StorySchema);

export default Story;
export { Story, StorySchema };
