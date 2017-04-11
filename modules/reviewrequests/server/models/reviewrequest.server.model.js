'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Reviewrequest Schema
 */
var ReviewrequestSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill review request name',
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
  businessPeriod: {
    type: Schema.ObjectId,
    ref: 'Period',
    required: 'Please select the business period'
  },
  reviewee: {
    type: Schema.ObjectId,
    ref: 'Employee',
    required: 'Reviewee must be selected'
  },
  outcomeSquad: {
    type: Schema.ObjectId,
    ref: 'Squad',
    required: 'Outcome squad is required'
  },
  reviewer: {
    type: Schema.ObjectId,
    ref: 'Employee',
    required: 'Reviewee must be selected'
  },
  dueBy: {
    type: Date,
    required: 'due date is required'
  },
  status: {
    type: String,
    enum: [ 'open', 'submitted', 'reviewee-completed', 'reviewer-completed', 'both-reviews-completed' ],
    default: 'open',
    required: 'Please enter review status'
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

ReviewrequestSchema.virtual('statusDescription')
  .get(function () {
    switch (this.status) {
      case 'open':
        return 'Open';
      case'submitted':
        return 'Feedback forms have been sent to reviewee and reviewer';
      case 'reviewee-completed':
        return 'Review completed by reviewee';
      case 'reviewer-completed':
        return 'Review completed by Reviewer';
      case 'both-reviews-completed':
        return 'Both reviewer and reviewee feedback now complete';
    }
  });


mongoose.model('Reviewrequest', ReviewrequestSchema);
