'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  async = require('async'),
  validateProbability = require(path.resolve('./modules/opportunities/server/models/opportunity.server.model'));

/**
 * Cost Schema
 */
var CostSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill cost name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  overhead: {
    type: Boolean,
    default: false,
    required: 'Overhead cost is required'
  },
  comment: String,
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  businessUnit: {
    type: Schema.ObjectId,
    ref: 'Businessunit',
    required: 'Please enter a business unit'
  },
  contractPeriod: {
    type: Schema.ObjectId,
    ref: 'Contractterm',
    required: 'Contract Period is required'
  },
  probability: {
    type: Number,
    default: 100,
    required: 'Please enter a probability',
    validate: [ validateProbability, 'Please enter a number between 0 and 100' ]
  },
  forecastSeries: {
    type: Object,
    required: 'Please enter forecast cost amount',
    date: {
      type: Date,
      default: Date.now,
      required: 'Please enter the forecast cost start date'
    },
    amount: {
      type: Number,
      default: 0,
      required: 'Please enter the amount'
    },
    description: String,
    repeat: {
      type: String, enum: [ 'once', 'monthly', 'quarterly', 'half yearly', 'yearly' ]
    }
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});


//Total cost over full contract period
CostSchema.virtual('totalCost')
  .get(function () {
    return calculateTotalCost(this.forecastSeries, this.contractPeriod.contractTerm);
  });

CostSchema.virtual('next12MonthsCost')
  .get(function () {
    return calculateTotalCost(this.forecastSeries, 1);
  });
//cost per year
CostSchema.methods.yearlyCost = function (cb) {
  cb(calculateTotalCost(this.forecastSeries, 1));
};

CostSchema.methods.totalCostMethod = function (cb) {
  cb(calculateTotalCost(this.forecastSeries, this.contractPeriod.contractTerm));
};


CostSchema.methods.allocatedCost = function (mainCB) {
  var CostAllocation = mongoose.model('Costallocation');
  var thisCost = this;

  CostAllocation.find({ cost: thisCost._id }).exec(function (err, allocations) {
    var total = 0;

    async.each(allocations, function (eachAllocation, cb) {
      eachAllocation.allocatedCost(function (eachAllocatedCost) {
        total = total + eachAllocatedCost;
        cb();
      });
    }, function (err) {
      mainCB(total);
    });
  });
};

//contractPeriod is an integer
function calculateTotalCost(series, contractPeriod) {
  var total = 0;

  switch (series.repeat) {
    case 'once':
      total = total + series.amount;
      break;
    case 'monthly':
      total = total + series.amount * 12 * contractPeriod;
      break;
    case 'quarterly':
      total = total + series.amount * 4 * contractPeriod;
      break;
    case 'half yearly':
      total = total + series.amount * 2 * contractPeriod;
      break;
    case 'yearly':
      total = total + series.amount * contractPeriod;
      break;
    default:
      total = total;
  }
  return total;
}

mongoose.model('Cost', CostSchema);

