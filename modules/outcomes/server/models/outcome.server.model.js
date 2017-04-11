'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Outcome Schema
 */
var OutcomeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Outcome name',
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  outcomeTeam: {
    type: Schema.ObjectId,
    ref: 'Outcometeam',
    required: 'Please select the outcome team'
  },
  measurementUnit: {
    type: String
  },
  target: {
    type: Number
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
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Outcome', OutcomeSchema);
