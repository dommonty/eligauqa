'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contractterm Schema
 */
var ContracttermSchema = new Schema({
  contractTerm: {
    type: Number,
    default: 3,
    required: 'Please fill contract term',
    trim: true
  },
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

mongoose.model('Contractterm', ContracttermSchema);
