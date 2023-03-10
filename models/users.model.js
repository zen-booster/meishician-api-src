/* eslint-disable consistent-return */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },

    email: {
      type: String,
      required: [true, 'email is required'],
      index: true,
      unique: true,
      dropDups: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },

    password: {
      type: String,
      required: [true, 'password is required'],
      select: false,
    },

    // safetyQuestion: {
    //   type: String,
    //   enum: ['Q1_FIRST_PET_NAME', 'Q2_PARENTS_CITY'],
    //   required: [true],
    // },
    // safetyAnswer: {
    //   type: String,
    //   required: [true],
    // },

    avatar: String,
  },
  { strictQuery: false, timestamps: true }
);

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  try {
    // When password is hashed already, no need to be hashed
    if (!this.isModified('password')) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  } catch (err) {
    return next(err);
  }
});

// Hashing data before updating into database
userSchema.pre('findOneAndUpdate', async function (next) {
  try {
    if (this._update.password) {
      const hashed = await bcrypt.hash(this._update.password, 10);
      this._update.password = hashed;
    }
    next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
