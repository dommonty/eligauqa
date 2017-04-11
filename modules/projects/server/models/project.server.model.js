'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  moment = require('moment'),
  momentBus = require('moment-business'),
  Schema = mongoose.Schema;

var validateProbability = function (probability) {
  return (probability >= 0 && probability <= 100);
};
/**
 * Project Schema
 */
var ProjectSchema = new Schema(
  {
    name: {
      type: String,
      default: '',
      required: 'Please fill Project name',
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    businessUnit: {
      type: Schema.ObjectId,
      ref: 'Businessunit',
      required: 'Please select a business unit',
    },
    outcomeTeam: {
      type: Schema.ObjectId,
      ref: 'Outcometeam',
      required: 'Please select an outcome team'
    },
    created: {
      type: Date,
      default: Date.now
    },
    startDate: {
      type: Date,
      required: 'Please fill project start date'
    },
    endDate: {
      type: Date,
      required: 'Please fill project end date'
    },
    budget: {
      type: Number,
      min: [ 0, 'Budget must be greater than 0' ],
      default: 0,
      required: 'Please fill project budget amount'
    },
    estimatedStoryPoints: {
      type: Number,
      default: 0,
      min: [ 0, 'Velocity must be greater than 0' ],
      required: 'Please fill planned velocity '
    },
    plannedVelocity: {
      type: Number,
      default: 0,
      min: [ 0, 'Story points must be greater than 0' ],
      required: 'Please fill project estimated story points '
    },
    status: {
      type: String,
      enum: [ 'open', 'approved', 'progress', 'closed' ],
      default: 'open',
      required: 'Please select project progress status'
    },
    projectType: {
      type: String,
      enum: [ 'customer', 'product', 'estimate', 'r&d', 'support' ],
      default: 'customer',
      required: 'Please select project type'
    },
    advisoryCommitteeApprovalDate: {
      type: Date
    },
    researchAndDevelopmentProjectOutcomes: {
      type: String,
      default: 'N/A'
    },
    customer: {
      type: Schema.ObjectId,
      ref: 'Customer',
      required: 'Please select customer',
    },
    sprintDuration: {
      type: Number,
      default: 10,
      required: 'Please enter the duration of a sprint in days'
    },
    keyMilestonesDescription: String,
    sprints: [ {
      startDate: {
        type: Date,
        required: 'Please fill sprint start date'
      },
      actualStoryPoints: {
        type: Number,
        default: 0,
        required: 'Please enter sprint story points'
      },
      squadName: {
        type: String,
        default: '',
        required: 'Please fill squad name',
        trim: true
      },

      allocatedSquadPercentage: {
        type: Number,
        default: 50,
        required: 'Please enter percentage of squad allocated to this project',
        validate: [ validateProbability, 'Squad allocation must be between 0 and 100' ]
      },

      loadedSquadCost: {//allocated squad cost captured from the client vm.squad.loadedSquadCost * percentageFactor / vm.company.businessDaysInYear * vm.sprint.sprintDuration
        type: Number,
        default: 0,
        required: 'Please enter allocated loaded squad cost'
      },
      sprintDuration: {
        type: Number,
        default: 10,
        required: 'Please enter the duration of a sprint in days'
      },
      riskStatus: {
        type: String,
        enum: [ 'green', 'orange', 'red' ],
        default: 'green',
        required: 'Please select updated project risk status'
      },
      riskStatusNotes: String,
      statusUpdatedDate: {
        type: Date,
        default: Date.now
      }
    } ],
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    projectManager: {
      type: Schema.ObjectId,
      ref: 'Employee',
      required: 'Please select the project manager from the squad owners'
    },
    linkedRevenueOpportunities: [ {
      type: Schema.ObjectId,
      ref: 'Opportunity'
    } ],
    confluence: String,
    jira: String
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  });
ProjectSchema.pre('save', function (next) {
  if (this.endDate < this.startDate)
    next(new Error('End date must be after start date'));
  next();
});

ProjectSchema.virtual('statusDescription').get(function () {
  switch (this.status) {
    case 'open':
      return 'Open';
    case 'approved':
      return 'Approved';
    case 'progress':
      return 'In progress';
    case 'closed':
      return 'Closed';
  }
});

ProjectSchema.virtual('projectTypeDescription').get(function () {
  switch (this.projectType) {
    case 'customer':
      return 'Customer Project';
    case 'product':
      return 'Product Development Project';
    case 'support':
      return 'Support Management Project';
    case 'r&d':
      return 'Research and Development Project';
    case 'estimate':
      return 'Project for estimation purposes';
  }
});

ProjectSchema.virtual('totalAnticipatedRevenue').get(function () {
  var total = 0,
    thisProject = this;
  for (var i = 0; i < thisProject.linkedRevenueOpportunities.length; i++) {
    total = total + thisProject.linkedRevenueOpportunities[ i ].totalOpportunityValue;
  }
  return total;
});

ProjectSchema.virtual('actualLoadedCost').get(function () {
  if (this.sprints && this.sprints.length > 0)
    return calculateProjectActualCost(this.sprints);
  else
    return 0;
});

ProjectSchema.virtual('projectProfit').get(function () {
  if (this.sprints && this.sprints.length > 0)
    return this.budget - calculateProjectActualCost(this.sprints);
  else
    return 0;
});

ProjectSchema.virtual('averageVelocity').get(function () {
  if (this.sprints && this.sprints.length > 0)
    return Math.round(calculateAverageVelocity(this.sprints));
  else
    return 0;
});

ProjectSchema.virtual('storyPointsCompleted').get(function () {
  if (this.sprints && this.sprints.length > 0)
    return calculateStoryPointsCompleted(this.sprints);
  else
    return 0;
});

ProjectSchema.virtual('costPerStoryPoint').get(function () {
  if (this.sprints && this.sprints.length > 0)
    return calculateCostPerStoryPoint(this.sprints);
  else
    return 0;
});

ProjectSchema.virtual('remainingStoryPoints').get(function () {
  if (this.sprints && this.sprints.length > 0)
    return calculateRemainingStoryPoints(this, this.sprints);
  else
    return 0;
});

ProjectSchema.virtual('projectForecastCost').get(function () {
  if (this.sprints && this.sprints.length > 0)
    return calculateProjectForecastCost(this, this.sprints);
  else
    return 0;
});

ProjectSchema.virtual('projectForecastProfitability').get(function () {
  if (this.sprints && this.sprints.length > 0)
    return this.budget - calculateProjectForecastCost(this, this.sprints);
  else
    return 0;
});

ProjectSchema.virtual('projectForecastEndDate').get(function () {
  if (this.sprints && this.sprints.length > 0)
    return calculateEstimatedEndDate(this, this.sprints);
  else
    return null;
});

ProjectSchema.virtual('estimatedSprintsLeft').get(function () {
  var velocity = calculateAverageVelocity(this.sprints);
  var completedStoryPoints = calculateStoryPointsCompleted(this.sprints);
  if (velocity > 0)
    return Math.round((this.estimatedStoryPoints - completedStoryPoints) / velocity);
  else
    return 0;
});

ProjectSchema.virtual('plannedSprints').get(function () {
  if (this.plannedVelocity > 0)
    return Math.round(this.estimatedStoryPoints / this.plannedVelocity);
  else
    return 0;
});

ProjectSchema.virtual('nextSprintStartDate').get(function () {
  var thisProject = this;
  var latest = latestSprint(thisProject.sprints);
  if (latest) {
    var lastSprintStartDate = moment(latest.startDate);
    return momentBus.addWeekDays(lastSprintStartDate, Math.round(thisProject.sprintDuration));
  }
  else
    return thisProject.startDate;
});

ProjectSchema.virtual('latestRiskStatus').get(function () {
  var latest = latestSprint(this.sprints);
  if (latest)
    return latest.riskStatus;
  else
    return null;
});

ProjectSchema.virtual('latestStatusUpdatedDate').get(function () {
  var latest = latestSprint(this.sprints);
  if (latest)
    return latest.statusUpdatedDate;
  else
    return null;
});
ProjectSchema.virtual('latestStatusUpdatedNotes').get(function () {
  var latest = latestSprint(this.sprints);
  if (latest)
    return latest.riskStatusNotes;
  else
    return null;
});

ProjectSchema.virtual('latestSprint').get(function () {
  return latestSprint(this.sprints);
});


function latestSprint(sprints) {
  if (sprints.length === 0)
    return null;
  var latest = sprints[ 0 ];
  for (var i = 0; i < sprints.length; i++) {
    if (sprints[ i ].startDate > latest.startDate)
      latest = sprints[ i ];
  }
  return latest;
}

function calculateProjectActualCost(sprints) {
  var total = 0;
  for (var i = 0; i < sprints.length; i++) {
    total = total + sprints[ i ].loadedSquadCost;
  }
  return total;
}

function calculateStoryPointsCompleted(sprints) {
  var total = 0;
  for (var i = 0; i < sprints.length; i++) {
    total = total + sprints[ i ].actualStoryPoints;
  }
  return total;
}

function calculateRemainingStoryPoints(project, sprints) {
  return project.estimatedStoryPoints - calculateStoryPointsCompleted(sprints);
}

function calculateProjectForecastCost(project, sprints) {
  return calculateRemainingStoryPoints(project, sprints) * calculateCostPerStoryPoint(sprints) + calculateProjectActualCost(sprints);
}

function calculateCostPerStoryPoint(sprints) {
  var completedPoints = calculateStoryPointsCompleted(sprints);

  if (completedPoints > 0)
    return calculateProjectActualCost(sprints) / completedPoints;
  else
    return 0;
}

function calculateEstimatedEndDate(project, sprints) {
  var storyPointsLeft = calculateRemainingStoryPoints(project, sprints);
  if (storyPointsLeft <= 0)
    return project.endDate;
  var velocity = calculateAverageVelocity(sprints);
  var sprintsLeft = storyPointsLeft / velocity;
  var daysLeft = sprintsLeft * project.sprintDuration;
  var today = moment(Date.now());
  return momentBus.addWeekDays(today, Math.round(daysLeft));
}

function calculateAverageVelocity(sprints) {
  var total = 0;
  for (var i = 0; i < sprints.length; i++) {
    total = total + sprints[ i ].actualStoryPoints;
  }
  if (sprints.length > 0) {
    return total / sprints.length;
  }
  else return 0;
}

function projectVelocityStatistics() {

}

var deepPopulate = require('mongoose-deep-populate')(mongoose);
ProjectSchema.plugin(deepPopulate, {
  whitelist: [ 'outcomeTeam.businessUnit', 'outcomeTeam.businessUnit.company', 'linkedRevenueOpportunities.customer', 'linkedRevenueOpportunities.contractPeriod' ]
});
mongoose.model('Project', ProjectSchema);
