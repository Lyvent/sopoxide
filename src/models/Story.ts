import mongoose, { Schema } from 'mongoose';

const StorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  // TODO: Add more related fields with validations.
});

// TODO: Add DAO.

module.exports = mongoose.model('Story', StorySchema);
