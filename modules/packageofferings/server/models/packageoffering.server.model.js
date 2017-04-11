'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Packageoffering Schema
 */
var PackageofferingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Packageoffering name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  discount: {
    type: Number,
    required: 'Please enter the discount percentage'
  },
  description: String
});

mongoose.model('Packageoffering', PackageofferingSchema);
