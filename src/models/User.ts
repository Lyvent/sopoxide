import { Schema, Document, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const nameRegex = /^[A-Za-z]+((\s)?(('||\.)?([A-Za-z])+))*$/;
const usernameRegex = /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is a required value.'],
    unique: true,
    lowercase: true,
    maxlength: [254, 'Email must not be greater than 254.'],
    validate: {
      validator: emailRegex,
      message: 'Email is not valid!',
    }
  },

  username: {
    type: String,
    required: [true, 'Username is a required value.'],
    unique: true,
    maxlength: 15,
    validate: {
      validator: usernameRegex,
      message: 'Invalid username.'
    }
  },

  fullName: {
    type: String,
    required: [true, 'Full name is a required value.'],
    maxlength: [69, 'Full name should not exceed 69 characters.'],
    validate: {
      validator: nameRegex,
      message: 'Invalid full name.'
    }
  },

  password: {
    type: String,
    required: [true, 'What\'s the password? Password is a required value.'],
  },


  joinedAt: {
    type: Date,
    required: true,
    default: Date.now
  },


  // Social Handles - Supported.
  instaHandle: {
    type: String,
  },

  facebookLink: {
    type: String,
  },

  twitterHandle: {

    type: String,
  },
});

// Hooks/Middleware
UserSchema.pre('save', async function(next) {
  // @ts-ignore
  const hash = await bcrypt.hash(this.password, 10);

  // @ts-ignore
  this.password = hash;

  next();
});

// Methods and Plugins
UserSchema.methods.isValidPassword = async function(password: string): Promise<boolean> {
  // Compares hashed password and user password to see if it matches.
  const matches: boolean = await bcrypt.compare(password, this.password);
  return matches;
}

UserSchema.plugin(uniqueValidator);

// Extend User Document
interface UserDoc extends Document {
  isValidPassword(password: string): Promise<boolean>;
}

const User = model<UserDoc>('User', UserSchema);

export default User;
export { UserSchema, UserDoc };
