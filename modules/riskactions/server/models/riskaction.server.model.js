'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var validateProbability = function (probability) {
  return (probability >= 0 && probability <= 100);
};
/**
 * Riskaction Schema
 */
var RiskactionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please enter risk name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please enter risk description'
  },
  mitigation: {
    type: String,
    default: '',
    required: 'Please enter risk mitigation'
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer',
    required: 'Please provide the customer'
  },
  created: {
    type: Date,
    default: Date.now
  },
  dueBy: {
    type: Date,
    required: 'Please fill in the due by date'
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: [ 'open', 'closed', 'in-progress' ]
  },
  progress: {
    type: Number,
    default: 0,
    validate: [ validateProbability, 'Please enter a number between 0 and 100' ]
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Riskaction', RiskactionSchema);
