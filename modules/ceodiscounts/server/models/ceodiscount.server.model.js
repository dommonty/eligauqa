'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ceodiscount Schema
 */
var CeodiscountSchema = new Schema({
  discount: {
    type: Number,
    required: 'Please fill the discount percentage',
    min: 0,
    max: 100
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

mongoose.model('Ceodiscount', CeodiscountSchema);
