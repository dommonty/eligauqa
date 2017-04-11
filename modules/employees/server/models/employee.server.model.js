'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Employee Schema
 */
var EmployeeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Employee name',
    unique: true,
    trim: true
  },
  nickName: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  role: {
    type: Schema.ObjectId,
    ref: 'Role',
    required: 'Please select a role'
  },
  otherRole: {
    type: Schema.ObjectId,
    ref: 'Role'
  },
  reportingManager: {
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  location: {
    type: Schema.ObjectId,
    ref: 'Location',
    required: 'Please enter employee location'
  },
  businessUnit: {
    type: Schema.ObjectId,
    ref: 'Businessunit',
    required: 'Please enter employee business unit'
  },
  salary: {
    type: Number,
    required: 'Please enter employee salary'
  },
  quoteEstimateAuthorityLevel: {
    type: Number,
    default: 0
  },
  user: { //who created the entry
    type: Schema.ObjectId,
    ref: 'User'
  },
  systemUser: {//an employee can also be a user of the system
    type: Schema.ObjectId,
    ref: 'User'
  },
  reviewer: Boolean
});

EmployeeSchema.methods.getSquadAllocations = function (mainCB) {
  var SquadAllocation = mongoose.model('Squadallocation');
  var query = SquadAllocation.find(
    {
      employee: this._id
    });
  query.populate('squad').exec(function (err, allocations) {
    mainCB(allocations);
  });
};
mongoose.model('Employee', EmployeeSchema);

