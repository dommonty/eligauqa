'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Outcome = mongoose.model('Outcome'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, outcome;

/**
 * Outcome routes tests
 */
describe('Outcome CRUD tests', function () {

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

    // Save a user to the test db and create new Outcome
    user.save(function () {
      outcome = {
        name: 'Outcome name'
      };

      done();
    });
  });

  it('should be able to save a Outcome if logged in', function (done) {
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

        // Save a new Outcome
        agent.post('/api/outcomes')
          .send(outcome)
          .expect(200)
          .end(function (outcomeSaveErr, outcomeSaveRes) {
            // Handle Outcome save error
            if (outcomeSaveErr) {
              return done(outcomeSaveErr);
            }

            // Get a list of Outcomes
            agent.get('/api/outcomes')
              .end(function (outcomesGetErr, outcomesGetRes) {
                // Handle Outcome save error
                if (outcomesGetErr) {
                  return done(outcomesGetErr);
                }

                // Get Outcomes list
                var outcomes = outcomesGetRes.body;

                // Set assertions
                (outcomes[0].user._id).should.equal(userId);
                (outcomes[0].name).should.match('Outcome name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Outcome if not logged in', function (done) {
    agent.post('/api/outcomes')
      .send(outcome)
      .expect(403)
      .end(function (outcomeSaveErr, outcomeSaveRes) {
        // Call the assertion callback
        done(outcomeSaveErr);
      });
  });

  it('should not be able to save an Outcome if no name is provided', function (done) {
    // Invalidate name field
    outcome.name = '';

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

        // Save a new Outcome
        agent.post('/api/outcomes')
          .send(outcome)
          .expect(400)
          .end(function (outcomeSaveErr, outcomeSaveRes) {
            // Set message assertion
            (outcomeSaveRes.body.message).should.match('Please fill Outcome name');

            // Handle Outcome save error
            done(outcomeSaveErr);
          });
      });
  });

  it('should be able to update an Outcome if signed in', function (done) {
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

        // Save a new Outcome
        agent.post('/api/outcomes')
          .send(outcome)
          .expect(200)
          .end(function (outcomeSaveErr, outcomeSaveRes) {
            // Handle Outcome save error
            if (outcomeSaveErr) {
              return done(outcomeSaveErr);
            }

            // Update Outcome name
            outcome.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Outcome
            agent.put('/api/outcomes/' + outcomeSaveRes.body._id)
              .send(outcome)
              .expect(200)
              .end(function (outcomeUpdateErr, outcomeUpdateRes) {
                // Handle Outcome update error
                if (outcomeUpdateErr) {
                  return done(outcomeUpdateErr);
                }

                // Set assertions
                (outcomeUpdateRes.body._id).should.equal(outcomeSaveRes.body._id);
                (outcomeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Outcomes if not signed in', function (done) {
    // Create new Outcome model instance
    var outcomeObj = new Outcome(outcome);

    // Save the outcome
    outcomeObj.save(function () {
      // Request Outcomes
      request(app).get('/api/outcomes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Outcome if not signed in', function (done) {
    // Create new Outcome model instance
    var outcomeObj = new Outcome(outcome);

    // Save the Outcome
    outcomeObj.save(function () {
      request(app).get('/api/outcomes/' + outcomeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', outcome.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Outcome with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/outcomes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Outcome is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Outcome which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Outcome
    request(app).get('/api/outcomes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Outcome with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Outcome if signed in', function (done) {
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

        // Save a new Outcome
        agent.post('/api/outcomes')
          .send(outcome)
          .expect(200)
          .end(function (outcomeSaveErr, outcomeSaveRes) {
            // Handle Outcome save error
            if (outcomeSaveErr) {
              return done(outcomeSaveErr);
            }

            // Delete an existing Outcome
            agent.delete('/api/outcomes/' + outcomeSaveRes.body._id)
              .send(outcome)
              .expect(200)
              .end(function (outcomeDeleteErr, outcomeDeleteRes) {
                // Handle outcome error error
                if (outcomeDeleteErr) {
                  return done(outcomeDeleteErr);
                }

                // Set assertions
                (outcomeDeleteRes.body._id).should.equal(outcomeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Outcome if not signed in', function (done) {
    // Set Outcome user
    outcome.user = user;

    // Create new Outcome model instance
    var outcomeObj = new Outcome(outcome);

    // Save the Outcome
    outcomeObj.save(function () {
      // Try deleting Outcome
      request(app).delete('/api/outcomes/' + outcomeObj._id)
        .expect(403)
        .end(function (outcomeDeleteErr, outcomeDeleteRes) {
          // Set message assertion
          (outcomeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Outcome error error
          done(outcomeDeleteErr);
        });

    });
  });

  it('should be able to get a single Outcome that has an orphaned user reference', function (done) {
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

          // Save a new Outcome
          agent.post('/api/outcomes')
            .send(outcome)
            .expect(200)
            .end(function (outcomeSaveErr, outcomeSaveRes) {
              // Handle Outcome save error
              if (outcomeSaveErr) {
                return done(outcomeSaveErr);
              }

              // Set assertions on new Outcome
              (outcomeSaveRes.body.name).should.equal(outcome.name);
              should.exist(outcomeSaveRes.body.user);
              should.equal(outcomeSaveRes.body.user._id, orphanId);

              // force the Outcome to have an orphaned user reference
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

                    // Get the Outcome
                    agent.get('/api/outcomes/' + outcomeSaveRes.body._id)
                      .expect(200)
                      .end(function (outcomeInfoErr, outcomeInfoRes) {
                        // Handle Outcome error
                        if (outcomeInfoErr) {
                          return done(outcomeInfoErr);
                        }

                        // Set assertions
                        (outcomeInfoRes.body._id).should.equal(outcomeSaveRes.body._id);
                        (outcomeInfoRes.body.name).should.equal(outcome.name);
                        should.equal(outcomeInfoRes.body.user, undefined);

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
      Outcome.remove().exec(done);
    });
  });
});
