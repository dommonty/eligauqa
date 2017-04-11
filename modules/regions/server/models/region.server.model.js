'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Region Schema
 */
var RegionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Region name',
    unique: true,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Region', RegionSchema);
