import mongoose, { Schema } from 'mongoose';

const ThoughtSchema = new Schema({
  // TODO: Fill this out.
  // Author Reference.
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  message: {
    type: String,
    required: true
  }
});

const Thought = mongoose.model('Thought', ThoughtSchema);

export default Thought;
export { ThoughtSchema };