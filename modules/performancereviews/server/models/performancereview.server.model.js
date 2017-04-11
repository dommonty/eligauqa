'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Performancereview Schema
 */
var PerformancereviewSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Performance review name',
    trim: true
  },
  request: {
    type: Schema.ObjectId,
    ref: 'Reviewrequest',
    required: 'Review request is required'

  },
  outcomes: [ {
    description: String,
    mandatory: Boolean,
    usedForScoring: Boolean,
    maximumScore: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    }
  } ],
  created: {
    type: Date,
    default: Date.now
  },
  assignee: {//the person asssigned to fill the review, can be reviewer or reviewee
    type: Schema.ObjectId,
    ref: 'User'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  whatHasWorked: String,
  whatHasNotWorked: String,
  whatCanBeDoneBetter: String,
  immutable: Boolean
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

//maximum of 5 points per outcome
PerformancereviewSchema.virtual('maximumPossibleScore')
  .get(function () {
    var thisReview = this,
      score = 0;
    for (var i = 0; i < thisReview.outcomes.length; i++) {
      if (thisReview.outcomes[ i ].usedForScoring)
        score = score + 5;
    }
    return score;
  });

//minimum of 3 points per mandatory outcome
PerformancereviewSchema.virtual('minimumExpectedScore')
  .get(function () {
    var total = 0,
      thisReview = this;

    for (var i = 0; i < thisReview.outcomes.length; i++) {
      if (thisReview.outcomes[ i ].usedForScoring)
        total = total + 3;
    }

    return total;
  });

PerformancereviewSchema.virtual('employeeScore')
  .get(function () {
    var total = 0,
      thisReview = this;
    for (var i = 0; i < thisReview.outcomes.length; i++)
      total = total + thisReview.outcomes[ i ].score;

    return total;
  });


var deepPopulate = require('mongoose-deep-populate')(mongoose);
PerformancereviewSchema.plugin(deepPopulate, {
  whitelist: [ 'request.reviewer', 'request.reviewee', 'request.businessPeriod' ]
});
mongoose.model('Performancereview', PerformancereviewSchema);
