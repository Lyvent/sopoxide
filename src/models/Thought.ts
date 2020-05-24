import mongoose, { Schema } from 'mongoose';

const ThoughtSchema = new Schema({
  // TODO: Fill this out.
});

const Thought = mongoose.model('Thought', ThoughtSchema);

export default Thought;
export { ThoughtSchema };