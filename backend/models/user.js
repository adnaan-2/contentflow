const mongoose = require('mongoose');

const socialConnectionsSchema = new mongoose.Schema({
  facebook: {
    connected: Boolean,
    accessToken: String,
    refreshToken: String,
    expiresIn: Date,
    userData: {
      id: String,
      name: String,
      email: String,
      pages: [{ id: String, name: String, accessToken: String }]
    }
  },
  instagram: {
    connected: Boolean,
    accessToken: String,
    refreshToken: String,
    expiresIn: Date,
    userData: {
      id: String,
      username: String,
      accountType: String,
      mediaCount: Number
    }
  },
  twitter: {
    connected: Boolean,
    accessToken: String,
    refreshToken: String,
    expiresIn: Date,
    userData: {
      id: String,
      username: String,
      name: String
    }
  },
  linkedin: {
    connected: Boolean,
    accessToken: String,
    refreshToken: String,
    expiresIn: Date,
    userData: {
      id: String,
      email: String,
      profileUrl: String
    }
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  socialConnections: {
    type: socialConnectionsSchema,
    default: {
      facebook: { connected: false },
      instagram: { connected: false },
      twitter: { connected: false },
      linkedin: { connected: false }
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Add index for email
userSchema.index({ email: 1 });

// Method to safely return user data without sensitive information
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.socialConnections.facebook.accessToken;
  delete obj.socialConnections.instagram.accessToken;
  delete obj.socialConnections.twitter.accessToken;
  delete obj.socialConnections.linkedin.accessToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
