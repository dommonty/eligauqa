'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  moment = require('moment'),
  Schema = mongoose.Schema;


/**
 * A Validation function for local strategy email
 */
var validateProbability = function (probability) {
  return (probability >= 0 && probability <= 100);
};

module.exports = validateProbability;

/**
 * Opportunity Schema
 */
var OpportunitySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Opportunity name',
    trim: true
  },
  description: String,

  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  businessUnit: {
    type: Schema.ObjectId,
    ref: 'Businessunit',
    required: 'Please enter a business unit'
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer',
    required: 'Please select a customer'
  },
  probability: {
    type: Number,
    default: 60,
    required: 'Please enter a probability',
    validate: [ validateProbability, 'Please enter a number between 0 and 100' ]
  },
  includedProduct: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  contractPeriod: {
    type: Schema.ObjectId,
    ref: 'Contractterm',
    required: 'Contract Period is required'
  },
  atRisk: Boolean,
  atRiskDescription: String,
  forecastSeries: [ {
    date: Date, //startDate
    amount: Number,
    description: String,
    repeat: {
      type: String, enum: [ 'once', 'monthly', 'quarterly', 'half yearly', 'yearly' ]
    }
  } ],

  actualSeries: [ {
    dateCreated: {
      type: Date,
      default: Date.now,
      validate: [ function (dateCreated) {
        return dateCreated <= new Date();
      }, 'Creation date cannot be in the future' ],
      required: 'Date is required for actual entry'
    },
    amount: {
      type: Number,
      default: 0,
      required: 'Amount is required for actual entry'
    },
    description: String
  } ]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

OpportunitySchema.virtual('totalOpportunityValue')
  .get(function () {
    return calculateTotalOpportunityValue(this);
  });

OpportunitySchema.virtual('opportunityDisplay')
  .get(function () {
    return this.name + ' (' + this.customer.name + ')';
  });

//cannot call virtual functions using find and queries
//returns totalValue and next12MonthsValue
OpportunitySchema.methods.getOpportunityValues = function (cb) {
  var opp = this;
  this.getOpportunityValueNext12Months(function (valueNext12Months) {
    cb(calculateTotalOpportunityValue(opp), valueNext12Months);
  });

};

function calculateTotalOpportunityValue(opportunity) {
  var total = 0;
  for (var i = 0; i < opportunity.forecastSeries.length; i++) {
    var amountObj = opportunity.forecastSeries[ i ];
    switch (amountObj.repeat) {
      case 'once':
        total = total + amountObj.amount;
        break;
      case 'monthly':
        total = total + amountObj.amount * 12 * opportunity.contractPeriod.contractTerm;
        break;
      case 'quarterly':
        total = total + amountObj.amount * 4 * opportunity.contractPeriod.contractTerm;
        break;
      case 'half yearly':
        total = total + amountObj.amount * 2 * opportunity.contractPeriod.contractTerm;
        break;
      case 'yearly':
        total = total + amountObj.amount * opportunity.contractPeriod.contractTerm;
        break;
      default:
        total = total;
    }
  }
  return total;
}


OpportunitySchema.methods.getOpportunityValueNext12Months = function (cb) {
  cb(getAmounts(new Date(), 12, this.forecastSeries, 1));
};

var deepPopulate = require('mongoose-deep-populate')(mongoose);
OpportunitySchema.plugin(deepPopulate, {
  whitelist: [ 'customer.region' ]
});

mongoose.model('Opportunity', OpportunitySchema);

//assume amountSeries is [{date, amount, description, repeat}]  -  seeopportunity.server.model.js
//returns an amount
function getAmounts(startDate, monthsForward, amountSeries, term) {
  var amountResults = 0;
  var rollingDate = moment(startDate);

  for (var j = 0; j < monthsForward; j++) {
    for (var i = 0; i < amountSeries.length; i++) {
      var amountObj = amountSeries[ i ];
      var amountObjDate = new Date(amountObj.date);
      var maxDate = moment(startDate).add(term, 'Y');

      switch (amountObj.repeat) {
        case 'once':
          if (rollingDate.get('month') === amountObjDate.getMonth() && rollingDate.get('year') === amountObjDate.getFullYear()) {
            amountResults = amountResults + amountObj.amount;
          }
          break;
        case 'monthly':
          if (rollingDate.isSameOrAfter(amountObjDate, 'month') && rollingDate.isSameOrBefore(maxDate, 'month')) {
            amountResults = amountResults + amountObj.amount;
          }
          break;
        case 'quarterly':
          if (rollingDate.isSameOrAfter(amountObjDate, 'month') && rollingDate.isSameOrBefore(maxDate, 'month')) {
            if (rollingDate.diff(amountObjDate, 'months') % 3 === 0)
              amountResults = amountResults + amountObj.amount;
          }
          break;
        case 'half yearly':
          if (rollingDate.isSameOrAfter(amountObjDate, 'month') && rollingDate.isSameOrBefore(maxDate, 'month')) {
            if (rollingDate.diff(amountObjDate, 'months') % 6 === 0)
              amountResults = amountResults + amountObj.amount;
          }
          break;
        case 'yearly':
          if (rollingDate.isSameOrAfter(amountObjDate, 'month') && rollingDate.isSameOrBefore(maxDate, 'month')) {
            if (rollingDate.diff(amountObjDate, 'months') % 12 === 0)
              amountResults = amountResults + amountObj.amount;
          }
          break;

      }

    }
    rollingDate.add(1, 'M');
  }
  return amountResults;
}
