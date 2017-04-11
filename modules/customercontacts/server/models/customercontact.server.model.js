'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Customercontact Schema
 */
var CustomercontactSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Customer contact name',
    trim: true
  },
  role: {
    type: String,
    default: '',
    required: 'Please fill Customer contact role',
    trim: true
  },
  email: {
    type: String,
    default: '',
    trim: true
  },
  mobile: {
    type: String,
    default: '',
    trim: true
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer',
    required: 'Please select the customer this contact works for?'
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

mongoose.model('Customercontact', CustomercontactSchema);
