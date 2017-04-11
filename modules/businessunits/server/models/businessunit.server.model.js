'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  async = require('async'),
  Schema = mongoose.Schema;

/**
 * Businessunit Schema
 */
var BusinessunitSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Business unit name',
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
  company: {
    type: Schema.ObjectId,
    ref: 'Company'
  },
  companyOverheadCost: {
    type: Schema.ObjectId,
    ref: 'Cost'
  },
  businessUnitOverheadCost: {
    type: Schema.ObjectId,
    ref: 'Cost'
  }
});

//yearly cost of all employees in this business unit
BusinessunitSchema.methods.yearlyBusinessUnitCost = function (mainCB) {
  var total = 0;
  var Employee = mongoose.model('Employee');
  var query = Employee.find(
    {
      businessUnit: this._id
    });
  query.exec(function (err, employees) {
    async.each(employees, function (employee, cb) {
      total = total + employee.salary;
      cb();
    }, function (err) {
      mainCB(total);
    });
  });
};

BusinessunitSchema.methods.allSquads = function (mainCB) {
  var Outcometeam = mongoose.model('Outcometeam');
  var thisBusinessUnit = this;
  var results = [];

  Outcometeam.find({
    businessUnit: thisBusinessUnit._id
  }).exec(function (err, teams) {
    async.each(teams, function (eachTeam, cb) {
      eachTeam.allSquads(function (squads) {
        for (var i = 0; i < squads.length; i++)
          results.push(squads[ i ]);
        cb();
      });
    }, function (err) {
      mainCB(results);
    });
  });
};

BusinessunitSchema.methods.getCustomers = function (cb) {
  var thisBusinessUnit = this,
    Customer = mongoose.model('Customer');

  var query = Customer.find();

  query.exec(function (err, customers) {
    cb(customers);
  });
};


BusinessunitSchema.methods.annualRevenue = function (mainCB) {

  var thisBusinessUnit = this;
  thisBusinessUnit.getCustomers(function (customers) {
    var totalRevenue = 0;
    async.each(customers, function (eachCustomer, cb) {
      eachCustomer.annualRevenue(thisBusinessUnit._id, function (amount) {
        totalRevenue = totalRevenue + amount;
        cb();
      });
    }, function () {
      // console.log(totalRevenue);
      mainCB(totalRevenue);
    });
  });
};

mongoose.model('Businessunit', BusinessunitSchema);
