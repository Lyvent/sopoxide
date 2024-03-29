import { Schema, Document, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

import {
  emailRegex,
  usernameRegex,
  nameRegex
} from '../helpers/regex';

// Roles config.
const roles = {
  default: 'user',
  options: ['user', 'moderator', 'admin']
}

// Auth provider
const provider = {
  default: 'local',
  options: ['local', 'google']
};

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

  // @TODO: Implement user confirmation system.
  confirmed: {
    type: Boolean,
    default: false
  },

  role: {
    type: String,
    required: true,
    default: roles.default,
    enum: roles.options
  },

  provider: {
    type: String,
    required: true,
    default: provider.default,
    enum: provider.options
  },

  // Used by external providers to identify the user.
  providerSub: String,

  // Social Handles - Supported.
  socialMediaHandles: {
    type: Map,
    of: String
  }

}, {
  // Assign timestamps to track changes.
  timestamps: {
    createdAt: 'joinedAt',
  }
});

// Hooks/Middleware
/* istanbul ignore next */
UserSchema.pre('save', async function(next) {
  // INFO: This hashes the password before saving the document into the DB.
  // @ts-ignore
  const hash = await bcrypt.hash(this.password, 10);

  // @ts-ignore
  this.password = hash;

  next();
});

// Methods and Plugins
UserSchema.methods.isValidPassword = async function(password: string): Promise<boolean> {
  const matches: boolean = await bcrypt.compare(password, this.password);
  return matches;
}

UserSchema.methods.isAdmin = function(): boolean {
  const isAdmin: boolean = (this.role === 'admin' ? true : false);
  return isAdmin;
}

/* istanbul ignore next */
UserSchema.set('toJSON', {
  getters: true,
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.provider;
    delete ret.providerSub;
    delete ret.id;

    return ret;
  }
});

UserSchema.plugin(uniqueValidator);

// Extend User Document
interface UserDoc extends Document {
  isValidPassword(password: string): Promise<boolean>;
  isAdmin(): boolean;
  role: string;
}

const User = model<UserDoc>('User', UserSchema);

export default User;
export { UserSchema, UserDoc, roles };