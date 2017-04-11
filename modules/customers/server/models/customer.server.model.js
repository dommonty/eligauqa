'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  async = require('async'),
  Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
  name: {
    type: String,
    default: '',
    unique: true,
    required: 'Please fill Customer name',
    trim: true
  },
  tier: {
    type: Number,
    enum: [ 1, 2, 3, 4, 5, 6, 7, 8 ]
  },
  region: {
    type: Schema.ObjectId,
    ref: 'Region'
  },
  confluenceAMSPage: String,
  confluenceAccountManagementPage: String,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

CustomerSchema.methods.getOpportunities = function (cb) {
  var thisCustomer = this,
    Opportunity = mongoose.model('Opportunity');

  var query = Opportunity.find(
    {
      customer: thisCustomer._id
    });

  query.populate([ 'contractPeriod' ]).exec(function (err, opportunities) {
    cb(opportunities);
  });
};

/*
 * returns true if customer has opportunity with contract period <= 1
 */
CustomerSchema.methods.isCustomerAtRisk = function (cb) {
  this.getOpportunities(function (opportunities) {
    var results = false;
    for (var i = 0; i < opportunities.length; i++) {
      if ((opportunities[ i ].contractPeriod.contractTerm <= 1 || opportunities[ i ].atRisk) && opportunities[ i ].probability === 100 && opportunityHasAnnuity(opportunities[ i ]))
        results = true;
    }
    cb(results);
  });

};

function opportunityHasAnnuity(opportunity) {
  var oppHasAnnuity = false;
  for (var i = 0; i < opportunity.forecastSeries.length; i++) {
    if (opportunity.forecastSeries[ i ].repeat !== 'once')
      oppHasAnnuity = true;
  }

  return oppHasAnnuity;
}
/*
 * Only consider annuities with guaranteed probabilities
 */
CustomerSchema.methods.annualRevenue = function (businessUnitId, mainCB) {
  this.getOpportunities(function (opportunities) {
    var totalRevenue = 0;
    async.each(opportunities, function (eachOpportunity, cb) {
      // console.log(eachOpportunity);
      // console.log(businessUnitId);
      if (eachOpportunity.businessUnit.equals(businessUnitId) && eachOpportunity.probability === 100) {
        if (opportunityHasAnnuity(eachOpportunity)) {
          eachOpportunity.getOpportunityValueNext12Months(function (amount) {
            totalRevenue = totalRevenue + amount;
            cb();
          });
        } else
          cb();
      }
      else
        cb();
    }, function () {
      // console.log(businessUnitId);
      // console.log(mainCB);
      // console.log(totalRevenue);
      mainCB(totalRevenue);
    });

  });
};

/*
 * returns the percentage annual revenue of this customer relative to the annual revenue of the entire business unit
 */
CustomerSchema.methods.contributionShare = function (businessUnitId, mainCB) {
  var thisCustomer = this;
  var BusinessUnit = mongoose.model('Businessunit');
  BusinessUnit.findById(businessUnitId).exec(function (err, businessUnit) {
    thisCustomer.annualRevenue(businessUnitId, function (customerAnnualRevenue) {
      businessUnit.annualRevenue(function (businessUnitAnnualRevenue) {
        if (businessUnitAnnualRevenue > 0)
          mainCB(Math.round(customerAnnualRevenue / businessUnitAnnualRevenue * 100));
        else
          mainCB(Number.NaN);
      });

    });
  });
};

mongoose.model('Customer', CustomerSchema);
