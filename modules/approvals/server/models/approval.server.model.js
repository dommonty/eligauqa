'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Approval Schema
 */
var ApprovalSchema = new Schema({
  description: {
    type: String,
    default: '',
    required: 'Please fill Approval description'
  },
  responseDescription: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: [ 'approved', 'rejected', 'moreInfoRequired', 'sentToCustomer', 'approved-referred', 'requested' ]
  },
  dueBy: {
    type: Date,
    required: 'Please fill in the due by date'
  },
  approver: {
    type: Schema.ObjectId,
    ref: 'Employee',
    required: 'Please provide an approver'
  },
  quote: {
    type: Schema.ObjectId,
    ref: 'Quote',
    required: 'Please provide the quote reference'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var deepPopulate = require('mongoose-deep-populate')(mongoose);
ApprovalSchema.plugin(deepPopulate, {
  whitelist: [ 'approver', 'approver.systemUser' ]
});
mongoose.model('Approval', ApprovalSchema);
