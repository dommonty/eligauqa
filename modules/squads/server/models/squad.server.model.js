'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  async = require('async'),
  Schema = mongoose.Schema;

/**
 * Squad Schema
 */
var SquadSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Squad name',
    unique: 'Squad name is already in use',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  squadOwner: {
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  actuals: [ {//store the actuals for monthly base cost
    dateCreated: {
      type: Date,
      default: Date.now,
      required: 'Please enter date actual entry was created'
    },
    amount: {
      type: Number,
      default: 0,
      required: 'Please enter actual amount'
    },
    description: String
  } ],
  outcomeTeam: {
    type: Schema.ObjectId,
    ref: 'Outcometeam',
    required: 'Please select an outcome team'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});


SquadSchema.methods.getSquadCosts = function (cb) {
  var thisSquad = this;
  async.waterfall([
    calculateBaseTotal,
    getPopulatedSquad,
    populateBusinessUnit,
    calculateCompanyOverheadCost,
    calculateBusinessUnitOverheadCost,
    calculateTotalSalariesCost

  ], calculateFinalResults);

  function calculateBaseTotal(callback) {
    var Allocation = mongoose.model('Squadallocation');
    var baseTotal = 0;

    var query = Allocation.find(
      {
        squad: thisSquad._id
      });
    query.exec(function (err, allocations) {
      async.each(allocations, function (eachAllocation, cb) {
        eachAllocation.getAllocatedCost(function (allocatedCost) {
          baseTotal = baseTotal + allocatedCost;
          cb();
        });
      }, function () {
        callback(null, baseTotal);
      });

    });
  }

  function getPopulatedSquad(baseTotal, callback) {
    var Squad = mongoose.model('Squad');
    Squad.findById(thisSquad._id).populate([ 'outcomeTeam' ]).exec(function (err, squad) {
      callback(null, baseTotal, squad);
    });
  }

  function populateBusinessUnit(baseTotal, squad, callback) {
    var businessUnitId = squad.outcomeTeam.businessUnit;
    var BusinessUnit = mongoose.model('Businessunit');

    BusinessUnit.findById(businessUnitId).populate([ 'companyOverheadCost', 'businessUnitOverheadCost' ]).exec(function (err, businessUnit) {
      callback(null, baseTotal, businessUnit);
    });
  }

  function calculateCompanyOverheadCost(baseTotal, businessUnit, callback) {
    businessUnit.yearlyBusinessUnitCost(function (buCost) {

      if (!businessUnit.companyOverheadCost | !businessUnit.businessUnitOverheadCost) {
        callback(new Error('No company or business unit overhead entries'));
        return;
      }

      businessUnit.companyOverheadCost.yearlyCost(function (companyOverheadCost) {
        callback(null, baseTotal, businessUnit, companyOverheadCost);
      });
    });
  }

  function calculateBusinessUnitOverheadCost(baseTotal, businessUnit, companyOverheadCost, callback) {
    businessUnit.businessUnitOverheadCost.yearlyCost(function (businessUnitOverheadCost) {
      callback(null, baseTotal, companyOverheadCost, businessUnitOverheadCost);
    });
  }

  function calculateTotalSalariesCost(baseTotal, companyOverheadCost, businessUnitOverheadCost, callback) {
    var Employee = mongoose.model('Employee');
    var totalSalaries = 0;

    Employee.find().exec(function (err, employees) {
      for (var i = 0; i < employees.length; i++)
        totalSalaries = totalSalaries + employees[ i ].salary;

      callback(null, baseTotal, companyOverheadCost, businessUnitOverheadCost, totalSalaries);
    });
  }

  function calculateFinalResults(err, baseTotal, companyOverheadCost, businessUnitOverheadCost, totalSalaries) {
    if (err) {
      cb(-1, -1);
      return;
    }
    var loadedTotal = 0;

    if (baseTotal > 0) {
      var totalLoadFactor = companyOverheadCost + businessUnitOverheadCost;
      loadedTotal = baseTotal + (baseTotal / totalSalaries * totalLoadFactor);
    }
    cb(baseTotal, loadedTotal);
  }
};

/*
 * Returns the sum of all opportunities associated to this squad
 */
SquadSchema.methods.getOpportunityValues1 = function (mainCB, probability) {
  var Product = mongoose.model('Product');
  var query = Product.find(
    {
      maintenanceSquad: this._id
    });
  query.exec(function (err, products) {
    var totalOppValue = 0;
    var totalNext12Months = 0;
    async.each(products, function (product, cb) {
        product.getOpportunityValues(function (valueForProduct, valueNext12Months) {
          totalOppValue = totalOppValue + valueForProduct;
          totalNext12Months = totalNext12Months + valueNext12Months;
          cb();
        }, probability);
      }, function () {
        mainCB(totalOppValue, totalNext12Months);
      }
    );
  });
};

/*
 * Returns the sum of all opportunities associated to this squad
 * A product is allocated to a squad by percentage
 */
SquadSchema.methods.getOpportunityValues = function (mainCB, probability) {
  var RevenueAllocation = mongoose.model('Revenueallocation');
  var query = RevenueAllocation.find(
    {
      squad: this._id
    });
  query.exec(function (err, allocations) {
    var totalOppValue = 0;
    var totalNext12Months = 0;
    async.each(allocations, function (anAllocation, cb) {
      var Product = mongoose.model('Product');
      Product.findById(anAllocation.product).exec(function (err, _product) {
        _product.getOpportunityValues(function (valueForProduct, valueNext12Months) {
          totalOppValue = totalOppValue + (valueForProduct * anAllocation.allocation / 100);
          totalNext12Months = totalNext12Months + (valueNext12Months * anAllocation.allocation / 100);
          cb();
        }, probability);
      });
    }, function () {
      mainCB(totalOppValue, totalNext12Months);
    });
  });
};

SquadSchema.virtual('listName').get(function () {
  return this.name + ' (' + this.squadOwner.name + ')';
});

SquadSchema.methods.getProjectedProfit = function (mainCB, probability) {
  var squadInstance = this;
  squadInstance.getOpportunityValues(function (totalValue, next12MonthsValue) {
    squadInstance.next12MonthsCost(function (directCost) {
      squadInstance.getSquadCosts(function (baseCost, loadedCost) {
        mainCB(next12MonthsValue - loadedCost - directCost);
      });
    });
  }, probability);
};

SquadSchema.methods.getProducts = function (mainCB) {
  var Product = mongoose.model('Product');
  var query = Product.find(
    {
      maintenanceSquad: this._id
    });
  query.exec(function (err, products) {
    mainCB(products);
  });
};

//Returns the direct cost allocated to the squad over the next 12 months
SquadSchema.methods.next12MonthsCost = function (mainCB) {
  var CostAllocation = mongoose.model('Costallocation');
  var thisSquad = this;
  var total = 0;

  var query = CostAllocation.find(
    {
      squad: thisSquad._id
    });
  query.exec(function (err, allocations) {
    async.each(allocations, function (eachAllocation, cb) {
      var Cost = mongoose.model('Cost');
      Cost.findById(eachAllocation.cost, function (_err, _cost) {
        //console.log(_cost);
        if (!_cost.overhead) {
          eachAllocation.next12MonthsCost(function (costAmount) {
            total = total + costAmount;
            cb();
          });
        } else
          cb();
      });
    }, function () {
      mainCB(total);
    });

  });

};

var deepPopulate = require('mongoose-deep-populate')(mongoose);
SquadSchema.plugin(deepPopulate, {
  whitelist: [ 'outcomeTeam', 'outcomeTeam.businessUnit' ]
});

mongoose.model('Squad', SquadSchema);
