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
 * Revenueallocation Schema
 */
var RevenueallocationSchema = new Schema({
  product: {
    type: Schema.ObjectId,
    ref: 'Product',
    required: 'Product must be selected'
  },
  squad: {
    type: Schema.ObjectId,
    ref: 'Squad',
    required: 'Squad must be selected'
  },
  allocation: {
    type: Number,
    default: 100,
    required: 'Please enter an allocation',
    validate: [ validateAllocation, 'Allocation must be a percentage between 0 and 100' ]
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

RevenueallocationSchema.index({
  squad: 1,
  product: 1
}, {
  unique: true
});

/**
 * Validate that the revenue allocations are unique and that all the allocations for the same product total less than 100
 */
RevenueallocationSchema.pre('save', function (next) {
  var thisRevenueAllocation = this;
  var RevenueAllocationModel = mongoose.model('Revenueallocation');

  var query2 = RevenueAllocationModel.find(
    {
      product: thisRevenueAllocation.product
    });
  query2.exec(function (err, revenueAllocations) {
    var totalAllocation = thisRevenueAllocation.allocation;
    for (var i = 0; i < revenueAllocations.length; i++) {
      if (!revenueAllocations[ i ]._id.equals(thisRevenueAllocation._id))
        totalAllocation = totalAllocation + revenueAllocations[ i ].allocation;
    }

    if (totalAllocation > 100) {
      next(new Error('Total allocation across all squads must be <= 100'));
    }
    next();
  });

});

mongoose.model('Revenueallocation', RevenueallocationSchema);
