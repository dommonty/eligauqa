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
 * Opportunityaction Schema
 */
var OpportunityactionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Opportunityaction name',
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  },
  dueBy: {
    type: Date,
    required: 'Please fill in the due by date'
  },
  assignee: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  opportunity: {
    type: Schema.ObjectId,
    ref: 'Opportunity',
    required: 'Opportunity is required'
  },
  status: {
    type: String,
    default: 'open',
    required: 'Status is required',
    enum: [ 'open', 'in-progress', 'closed' ]
  },
  progress: {
    type: Number,
    default: 0,
    validate: [validateProbability, 'Progress must be between 0 and 100']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var deepPopulate = require('mongoose-deep-populate')(mongoose);
OpportunityactionSchema.plugin(deepPopulate, {
  whitelist: [ 'opportunity.customer' ]
});
mongoose.model('Opportunityaction', OpportunityactionSchema);
