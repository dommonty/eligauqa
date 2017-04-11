'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Supportplan Schema
 */
var SupportplanSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Supportplan name',
    trim: true
  },
  premium: {
    type: Number,
    required: 'Please fill the premium percentage',
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

mongoose.model('Supportplan', SupportplanSchema);
