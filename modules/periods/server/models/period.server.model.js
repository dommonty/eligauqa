'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Period Schema
 */
var PeriodSchema = new Schema({
  periodDescription: {
    type: String,
    default: '',
    required: 'Please fill Period description',
    trim: true
  },
  periodFrom: {
    type: Date,
    required: 'PeriodFrom for the outcome is required'
  },
  periodTo: {
    type: Date,
    required: 'PeriodTo for the outcome is required'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});



mongoose.model('Period', PeriodSchema);
