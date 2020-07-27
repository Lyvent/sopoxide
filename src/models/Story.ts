import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const StorySchema = new Schema({
  title: {
    type: String,
    maxlength: 50,
    required: [true, 'Story needs to have a title.'],
  },

  content: {
    type: String,
    required: [true, 'Content not found! boring...'],
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

  category: {
    type: String,
    enum: [
      // TODO: Add category enums.
    ],
    required: [true, 'Category is a required value.'],
  }

}, {
  // Assign timestamps to track changes.
  timestamps: true
});

// Plugins
StorySchema.plugin(mongoosePaginate);

// Model
const Story = model('Story', StorySchema);

// Allowed changes
const allowedChanges: string[] = ['title', 'content', 'category'];

export default Story;
export { StorySchema, allowedChanges };