(function () {
  'use strict';

  /**
   * Module dependencies.
   */
  var mongoose = require('mongoose'),
    async = require('async'),
    Schema = mongoose.Schema;

  /**
   * Outcometeam Schema
   */
  var OutcometeamSchema = new Schema({
    name: {
      type: String,
      default: '',
      required: 'Please fill Outcometeam name',
      trim: true
    },
    created: {
      type: Date,
      default: Date.now
    },
    businessUnit: {
      type: Schema.ObjectId,
      ref: 'Businessunit',
      required: 'Please select a business unit'
    },
    outcomeOwner: {
      type: Schema.ObjectId,
      ref: 'Employee',
      required: 'Please select an outcome owner'
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  });

//cost of all squads belonging to the outcome team
//returns both base and loaded costs
  OutcometeamSchema.methods.totalSquadsCost = function (mainCB) {
    var Squad = mongoose.model('Squad');
    var query = Squad.find(
      {
        outcomeTeam: this._id
      });
    query.exec(function (err, squads) {
      var baseTotal = 0;
      var loadedTotal = 0;
      async.each(squads, function (squad, cb) {
        squad.getSquadCosts(function (baseCost, loadedCost) {
          baseTotal = baseTotal + baseCost;
          loadedTotal = loadedTotal + loadedCost;
          cb();
        });
      }, function (err) {
        mainCB(baseTotal, loadedTotal);
      });
    });
  };

  /*
   * Returns the direct cost allocated to the outcome team over the next 12 months
   */
  OutcometeamSchema.methods.next12MonthsCost = function (mainCB) {
    var Squad = mongoose.model('Squad');
    var query = Squad.find(
      {
        outcomeTeam: this._id
      });
    query.exec(function (err, squads) {
      var total = 0;
      async.each(squads, function (squad, cb) {
        squad.next12MonthsCost(function (directCost) {
          total = total + directCost;
          cb();
        });
      }, function (err) {
        mainCB(total);
      });
    });
  };

  /*
   * Returns the sum of all opportunities associated to this outcome team
   */
  OutcometeamSchema.methods.getOpportunityValues = function (mainCB, probability) {
    var Squad = mongoose.model('Squad');
    var query = Squad.find(
      {
        outcomeTeam: this._id
      });
    query.exec(function (err, squads) {
      var totalOppValue = 0;
      var totalNext12Months = 0;
      async.each(squads, function (squad, cb) {
          squad.getOpportunityValues(function (totalValue, squadValueNex12Months) {
            totalOppValue = totalOppValue + totalValue;
            totalNext12Months = totalNext12Months + squadValueNex12Months;
            cb();
          }, probability);
        }, function () {
          mainCB(totalOppValue, totalNext12Months);
        }
      );
    });
  };

  OutcometeamSchema.methods.getProjectedProfit = function (mainCB, probability) {
    var outcomeTeamInstance = this;
    outcomeTeamInstance.getOpportunityValues(function (totalValue, next12MonthsValue) {
      outcomeTeamInstance.totalSquadsCost(function (baseCost, loadedCost) {
        outcomeTeamInstance.next12MonthsCost(function (directCost) {
          mainCB(next12MonthsValue - loadedCost - directCost);
        });

      });
    }, probability);
  };

  OutcometeamSchema.methods.getProjects = function (mainCB) {
    var Project = mongoose.model('Project'),
      thisTeam = this;
    Project.find({
      outcomeTeam: thisTeam._id
    }).exec(function (err, projects) {
      mainCB(projects);
    });
  };


  OutcometeamSchema.methods.getProducts = function (mainCB) {
    var Squad = mongoose.model('Squad');
    var results = [];
    var query = Squad.find(
      {
        outcomeTeam: this._id
      });
    query.exec(function (err, squads) {
      async.each(squads, function (squad, cb) {
          squad.getProducts(function (products) {
            for (var i = 0; i < products.length; i++)
              results.push(products[ i ]);
            cb();
          });
        }, function () {
          mainCB(results);
        }
      );
    });
  };

  OutcometeamSchema.methods.allSquads = function (mainCB) {
    var Squad = mongoose.model('Squad');
    var thisTeam = this;

    Squad.find({outcomeTeam: thisTeam._id}).exec(function (err, squads) {
      mainCB(squads);
    });
  };
  mongoose.model('Outcometeam', OutcometeamSchema);
})();
