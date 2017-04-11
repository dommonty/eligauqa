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
 * Squadallocation Schema
 */
var SquadallocationSchema = new Schema({
  squad: {
    type: Schema.ObjectId,
    ref: 'Squad',
    required: 'Please select the allocated squad'
  },
  employee: {
    type: Schema.ObjectId,
    ref: 'Employee',
    required: 'Please select the allocated employee'
  },
  allocation: {
    type: Number,
    default: 100,
    required: 'Please enter squad allocation',
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

SquadallocationSchema.index({
  squad: 1,
  employee: 1
}, {
  unique: true
});
/**
 * Validate that the squad allocations are unique and that all the allocations for the same employee total less than 100
 */
SquadallocationSchema.pre('save', function (next) {
  var thisSquadAllocation = this;
  var SquadAllocationModel = mongoose.model('Squadallocation');

  var query2 = SquadAllocationModel.find(
    {
      employee: thisSquadAllocation.employee
    });
  query2.exec(function (err, existingSquads) {
    var totalAllocation = thisSquadAllocation.allocation;
    for (var i = 0; i < existingSquads.length; i++) {
      if (!existingSquads[ i ]._id.equals(thisSquadAllocation._id))
        totalAllocation = totalAllocation + existingSquads[ i ].allocation;
    }

    if (totalAllocation > 100) {
      next(new Error('Total allocation across all squads must be <= 100'));
    }
    next();
  });

});


SquadallocationSchema.methods.getAllocatedCost = function (cb) {
  var thisAllocation = this;
  var Employee = mongoose.model('Employee');
  Employee.findById(thisAllocation.employee).exec(function (err, employee) {
    var allocatedSalaryAmount = employee.salary * thisAllocation.allocation / 100;
    cb(allocatedSalaryAmount);
  });
};


mongoose.model('Squadallocation', SquadallocationSchema);
