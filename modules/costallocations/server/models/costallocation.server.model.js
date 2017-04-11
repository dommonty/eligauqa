'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var validateAllocation = function (allocation) {
  return (allocation >= 0 && allocation <= 100);
};
/**
 * Costallocation Schema
 */
var CostallocationSchema = new Schema({
  cost: {
    type: Schema.ObjectId,
    ref: 'Cost',
    required: 'Please choose a cost item'
  },
  squad: {
    type: Schema.ObjectId,
    ref: 'Squad',
    required: 'Please choose a squad'
  },
  allocation: {
    type: Number,
    default: 100,
    required: 'Please enter an allocation',
    validate: [ validateAllocation, 'Allocation must be a percentage between 0 and 100' ]
  },
  actuals: [ {
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
    description: String,
    misPurchaseRequestNumber: String
  } ],
  created: {
    type: Date,
    default: Date.now
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

CostallocationSchema.index({
  squad: 1,
  cost: 1
}, {
  unique: true
});

CostallocationSchema.methods.allocatedCost = function (cb) {
  this.deepPopulate([ 'cost.contractPeriod', 'cost.businessUnit' ], function (err, _allocation) {
    _allocation.cost.totalCostMethod(function (amount) {
      cb(amount * _allocation.allocation / 100);
    });
  });
};


CostallocationSchema.methods.next12MonthsCost = function (cb) {
  this.deepPopulate('cost.contractPeriod', function (err, _allocation) {
    _allocation.cost.yearlyCost(function (yearlyCost) {
      cb(yearlyCost * _allocation.allocation / 100);
    });
  });
};

/**
 * Validate that the squad allocations are unique and that all the allocations for the same employee total less than 100
 */
CostallocationSchema.pre('save', function (next) {
  var thisCostAllocation = this;
  var CostAllocationModel = mongoose.model('Costallocation');

  var query2 = CostAllocationModel.find(
    {
      cost: thisCostAllocation.cost
    });
  query2.exec(function (err, existingAllocations) {
    var totalAllocation = thisCostAllocation.allocation;
    for (var i = 0; i < existingAllocations.length; i++) {
      if (!existingAllocations[ i ]._id.equals(thisCostAllocation._id))
        totalAllocation = totalAllocation + existingAllocations[ i ].allocation;
    }

    if (totalAllocation > 100) {
      next(new Error('Total allocation across all squads must be <= 100'));
    }
    next();
  });

});

var deepPopulate = require('mongoose-deep-populate')(mongoose);
CostallocationSchema.plugin(deepPopulate, {
  whitelist: [ 'cost.contractPeriod', 'cost.businessUnit' ]
});
mongoose.model('Costallocation', CostallocationSchema);
