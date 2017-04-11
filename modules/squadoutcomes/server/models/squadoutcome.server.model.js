'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Squadoutcome Schema
 */
var SquadoutcomeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Squadoutcome name',
    trim: true
  },
  core: {
    type: Boolean,
    default: false
  },
  usedForScoring: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  description: {
    type: String,
    default: ''
  },
  squad: {
    type: Schema.ObjectId,
    ref: 'Squad',
    required: 'Please select the Squad'
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
});

mongoose.model('Squadoutcome', SquadoutcomeSchema);
