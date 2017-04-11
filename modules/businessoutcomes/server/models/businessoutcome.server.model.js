'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Businessoutcome Schema
 */
var BusinessoutcomeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Business outcome name',
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  businessUnit: {
    type: Schema.ObjectId,
    ref: 'Businessunit',
    required: 'Please select the Business Unit'
  },
  measurementUnit: {
    type: String
  },
  target: {
    type: Number,
    default: 0
  },
  actual: {
    type: Number,
    default: 0
  },
  businessPeriod: {
    type: Schema.ObjectId,
    ref: 'Period',
    required: 'Please select the business period'
  },
  core: {
    type: Boolean,
    default: false,
    required: 'Core must be selected'
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

mongoose.model('Businessoutcome', BusinessoutcomeSchema);
