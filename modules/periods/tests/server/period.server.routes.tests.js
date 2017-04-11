'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Period = mongoose.model('Period'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, period;

/**
 * Period routes tests
 */
describe('Period CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Period
    user.save(function () {
      period = {
        name: 'Period name'
      };

      done();
    });
  });

  it('should be able to save a Period if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Period
        agent.post('/api/periods')
          .send(period)
          .expect(200)
          .end(function (periodSaveErr, periodSaveRes) {
            // Handle Period save error
            if (periodSaveErr) {
              return done(periodSaveErr);
            }

            // Get a list of Periods
            agent.get('/api/periods')
              .end(function (periodsGetErr, periodsGetRes) {
                // Handle Period save error
                if (periodsGetErr) {
                  return done(periodsGetErr);
                }

                // Get Periods list
                var periods = periodsGetRes.body;

                // Set assertions
                (periods[0].user._id).should.equal(userId);
                (periods[0].name).should.match('Period name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Period if not logged in', function (done) {
    agent.post('/api/periods')
      .send(period)
      .expect(403)
      .end(function (periodSaveErr, periodSaveRes) {
        // Call the assertion callback
        done(periodSaveErr);
      });
  });

  it('should not be able to save an Period if no name is provided', function (done) {
    // Invalidate name field
    period.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Period
        agent.post('/api/periods')
          .send(period)
          .expect(400)
          .end(function (periodSaveErr, periodSaveRes) {
            // Set message assertion
            (periodSaveRes.body.message).should.match('Please fill Period name');

            // Handle Period save error
            done(periodSaveErr);
          });
      });
  });

  it('should be able to update an Period if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Period
        agent.post('/api/periods')
          .send(period)
          .expect(200)
          .end(function (periodSaveErr, periodSaveRes) {
            // Handle Period save error
            if (periodSaveErr) {
              return done(periodSaveErr);
            }

            // Update Period name
            period.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Period
            agent.put('/api/periods/' + periodSaveRes.body._id)
              .send(period)
              .expect(200)
              .end(function (periodUpdateErr, periodUpdateRes) {
                // Handle Period update error
                if (periodUpdateErr) {
                  return done(periodUpdateErr);
                }

                // Set assertions
                (periodUpdateRes.body._id).should.equal(periodSaveRes.body._id);
                (periodUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Periods if not signed in', function (done) {
    // Create new Period model instance
    var periodObj = new Period(period);

    // Save the period
    periodObj.save(function () {
      // Request Periods
      request(app).get('/api/periods')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Period if not signed in', function (done) {
    // Create new Period model instance
    var periodObj = new Period(period);

    // Save the Period
    periodObj.save(function () {
      request(app).get('/api/periods/' + periodObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', period.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Period with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/periods/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Period is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Period which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Period
    request(app).get('/api/periods/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Period with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Period if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Period
        agent.post('/api/periods')
          .send(period)
          .expect(200)
          .end(function (periodSaveErr, periodSaveRes) {
            // Handle Period save error
            if (periodSaveErr) {
              return done(periodSaveErr);
            }

            // Delete an existing Period
            agent.delete('/api/periods/' + periodSaveRes.body._id)
              .send(period)
              .expect(200)
              .end(function (periodDeleteErr, periodDeleteRes) {
                // Handle period error error
                if (periodDeleteErr) {
                  return done(periodDeleteErr);
                }

                // Set assertions
                (periodDeleteRes.body._id).should.equal(periodSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Period if not signed in', function (done) {
    // Set Period user
    period.user = user;

    // Create new Period model instance
    var periodObj = new Period(period);

    // Save the Period
    periodObj.save(function () {
      // Try deleting Period
      request(app).delete('/api/periods/' + periodObj._id)
        .expect(403)
        .end(function (periodDeleteErr, periodDeleteRes) {
          // Set message assertion
          (periodDeleteRes.body.message).should.match('User is not authorized');

          // Handle Period error error
          done(periodDeleteErr);
        });

    });
  });

  it('should be able to get a single Period that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Period
          agent.post('/api/periods')
            .send(period)
            .expect(200)
            .end(function (periodSaveErr, periodSaveRes) {
              // Handle Period save error
              if (periodSaveErr) {
                return done(periodSaveErr);
              }

              // Set assertions on new Period
              (periodSaveRes.body.name).should.equal(period.name);
              should.exist(periodSaveRes.body.user);
              should.equal(periodSaveRes.body.user._id, orphanId);

              // force the Period to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Period
                    agent.get('/api/periods/' + periodSaveRes.body._id)
                      .expect(200)
                      .end(function (periodInfoErr, periodInfoRes) {
                        // Handle Period error
                        if (periodInfoErr) {
                          return done(periodInfoErr);
                        }

                        // Set assertions
                        (periodInfoRes.body._id).should.equal(periodSaveRes.body._id);
                        (periodInfoRes.body.name).should.equal(period.name);
                        should.equal(periodInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Period.remove().exec(done);
    });
  });
});
