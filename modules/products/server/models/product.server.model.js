'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  async = require('async'),
  Schema = mongoose.Schema;

var FeatureDefinitionSchema = new Schema({
  featureName: String,
  featureDescription: String,
  recommendedCostPercentage: Number
});


var ProductFeatureSchema = new Schema({
  productName: String,
  featureName: String,
  featurePricePercentage: Number,
  featurePrice: Number
});

var ProductTierSchema = new Schema(
  {
    tierName: String,
    exampleCustomers: String,
    fromNumberOfCustomers: Number,
    toNumberOfCustomers: Number,
    costPerCustomer: Number,
    features: [ ProductFeatureSchema ]
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  });

ProductTierSchema.virtual('totalPrice').get(function () {
  return this.costPerCustomer * this.toNumberOfCustomers;
});

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
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
  businessUnit: {
    type: Schema.ObjectId,
    ref: 'Businessunit',
    required: 'Please select a business unit'
  },
  maintenanceSquad: {
    type: Schema.ObjectId,
    ref: 'Squad'
  },
  productTiers: [ ProductTierSchema ],
  featureDefinitions: [ FeatureDefinitionSchema ],
  priceDeterminant: String, //e.g. numberOfCustomers, numberOfApplications, numberOfInternalUsers
});

//returns totalValue and next12MonthsValue
ProductSchema.methods.getOpportunityValues = function (cb, probability) {
  var thisProduct = this;
  var Opportunity = mongoose.model('Opportunity');
  async.waterfall([
    findMatchingIds,
    populateObjects,
    calculateValues
  ], finalCall);

  function findMatchingIds(callback) {
    var query = Opportunity.find(
      {
        includedProduct: thisProduct._id
      });
    query.where('probability').gte(probability ? probability : 0);
    query.select('_id');
    query.exec(function (err, results) {
      callback(null, results);
    });
  }

  function populateObjects(idObjs, callback) {
    var results = [];
    async.each(idObjs, function (idObj, cb) {
      Opportunity.findById(idObj._id).populate('contractPeriod').exec(function (err, opportunity) {
        results.push(opportunity);
        cb();
      });
    }, function (err) {
      callback(null, results);

    });
  }

  function calculateValues(opportunities, callback) {
    var total = 0;
    var totalNext12Months = 0;

    async.each(opportunities, function (opportunity, cb) {
      opportunity.getOpportunityValues(function (value, next12MonthsValue) {
        total = total + value;
        totalNext12Months = totalNext12Months + next12MonthsValue;
        cb();
      });
    }, function (err) {
      callback(null, total, totalNext12Months);
    });
  }

  function finalCall(err, total, totalNext12Months) {
    cb(total, totalNext12Months);
  }
};

mongoose.model('Product', ProductSchema);

