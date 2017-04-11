'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * quote item
 *
 */

var QuoteItemSchema = new Schema({
  productName: String,
  featureName: String,
  featurePrice: Number,
  included: Boolean
});

/**
 * Quote Schema
 */
var QuoteSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Quote name',
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
  region: {
    type: Schema.ObjectId,
    ref: 'Region'
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer'
  },
  notes: String,
  accountOwner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  maxNumberOfCustomers: Number,
  maxNumberOfApplications: Number,
  maxNumberOfInternalUsers: Number,
  currency: {
    type: Schema.ObjectId,
    ref: 'Currency'
  },
  supportPlan: {
    type: Schema.ObjectId,
    ref: 'Supportplan'
  },
  packageOffer: {
    type: Schema.ObjectId,
    ref: 'Packageoffering'
  },
  ceoDiscount: {
    type: Schema.ObjectId,
    ref: 'Ceodiscount'
  },
  quotedItems: [ QuoteItemSchema ],
  yearlyGrowthPercentage: Number,
  yearlyGrowthPercentageApplications: Number,
  yearlyGrowthPercentageInternalUsers: Number,
  contractPeriod: {
    type: Schema.ObjectId,
    ref: 'Contractterm'
  },
  includedProducts: [ {
    type: Schema.ObjectId,
    ref: 'Product'
  } ],
  costPerStoryPoint: Number,
  teamVelocity: Number,
  numberOfStoryPointsPurchased: Number,
  includedCalibrationSprints: Number,
  allocatedStoryPointsPerSprint: Number,
  sprintDuration: Number,

  status: String

}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});


QuoteSchema.virtual('totalPrice')
  .get(function () {
    var thisQuote = this;
    var total = 0;
    for (var i = 0; i < thisQuote.quotedItems.length; i++) {
      if (thisQuote.quotedItems[ i ].included)
        total = total + thisQuote.quotedItems[ i ].featurePrice;
    }
    return total;
  });


mongoose.model('Quote', QuoteSchema);
