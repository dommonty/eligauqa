'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Opportunitynote Schema
 */
var OpportunitynoteSchema = new Schema({
  note: {
    type: String,
    default: '',
    required: 'Please fill Opportunity note name'
  },
  title: {
    type: String,
    default: 'Title',
    required: 'Please fill Opportunity title'
  },
  opportunity: {
    type: Schema.ObjectId,
    ref: 'Opportunity',
    required: 'Opportunity is required'
  },
  created: {
    type: Date,
    default: Date.now
  },
  significant: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Opportunitynote', OpportunitynoteSchema);
