'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Costallocation = mongoose.model('Costallocation'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, costallocation;

/**
 * Costallocation routes tests
 */
describe('Costallocation CRUD tests', function () {

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

    // Save a user to the test db and create new Costallocation
    user.save(function () {
      costallocation = {
        name: 'Costallocation name'
      };

      done();
    });
  });

  it('should be able to save a Costallocation if logged in', function (done) {
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

        // Save a new Costallocation
        agent.post('/api/costallocations')
          .send(costallocation)
          .expect(200)
          .end(function (costallocationSaveErr, costallocationSaveRes) {
            // Handle Costallocation save error
            if (costallocationSaveErr) {
              return done(costallocationSaveErr);
            }

            // Get a list of Costallocations
            agent.get('/api/costallocations')
              .end(function (costallocationsGetErr, costallocationsGetRes) {
                // Handle Costallocation save error
                if (costallocationsGetErr) {
                  return done(costallocationsGetErr);
                }

                // Get Costallocations list
                var costallocations = costallocationsGetRes.body;

                // Set assertions
                (costallocations[0].user._id).should.equal(userId);
                (costallocations[0].name).should.match('Costallocation name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Costallocation if not logged in', function (done) {
    agent.post('/api/costallocations')
      .send(costallocation)
      .expect(403)
      .end(function (costallocationSaveErr, costallocationSaveRes) {
        // Call the assertion callback
        done(costallocationSaveErr);
      });
  });

  it('should not be able to save an Costallocation if no name is provided', function (done) {
    // Invalidate name field
    costallocation.name = '';

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

        // Save a new Costallocation
        agent.post('/api/costallocations')
          .send(costallocation)
          .expect(400)
          .end(function (costallocationSaveErr, costallocationSaveRes) {
            // Set message assertion
            (costallocationSaveRes.body.message).should.match('Please fill Costallocation name');

            // Handle Costallocation save error
            done(costallocationSaveErr);
          });
      });
  });

  it('should be able to update an Costallocation if signed in', function (done) {
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

        // Save a new Costallocation
        agent.post('/api/costallocations')
          .send(costallocation)
          .expect(200)
          .end(function (costallocationSaveErr, costallocationSaveRes) {
            // Handle Costallocation save error
            if (costallocationSaveErr) {
              return done(costallocationSaveErr);
            }

            // Update Costallocation name
            costallocation.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Costallocation
            agent.put('/api/costallocations/' + costallocationSaveRes.body._id)
              .send(costallocation)
              .expect(200)
              .end(function (costallocationUpdateErr, costallocationUpdateRes) {
                // Handle Costallocation update error
                if (costallocationUpdateErr) {
                  return done(costallocationUpdateErr);
                }

                // Set assertions
                (costallocationUpdateRes.body._id).should.equal(costallocationSaveRes.body._id);
                (costallocationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Costallocations if not signed in', function (done) {
    // Create new Costallocation model instance
    var costallocationObj = new Costallocation(costallocation);

    // Save the costallocation
    costallocationObj.save(function () {
      // Request Costallocations
      request(app).get('/api/costallocations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Costallocation if not signed in', function (done) {
    // Create new Costallocation model instance
    var costallocationObj = new Costallocation(costallocation);

    // Save the Costallocation
    costallocationObj.save(function () {
      request(app).get('/api/costallocations/' + costallocationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', costallocation.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Costallocation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/costallocations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Costallocation is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Costallocation which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Costallocation
    request(app).get('/api/costallocations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Costallocation with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Costallocation if signed in', function (done) {
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

        // Save a new Costallocation
        agent.post('/api/costallocations')
          .send(costallocation)
          .expect(200)
          .end(function (costallocationSaveErr, costallocationSaveRes) {
            // Handle Costallocation save error
            if (costallocationSaveErr) {
              return done(costallocationSaveErr);
            }

            // Delete an existing Costallocation
            agent.delete('/api/costallocations/' + costallocationSaveRes.body._id)
              .send(costallocation)
              .expect(200)
              .end(function (costallocationDeleteErr, costallocationDeleteRes) {
                // Handle costallocation error error
                if (costallocationDeleteErr) {
                  return done(costallocationDeleteErr);
                }

                // Set assertions
                (costallocationDeleteRes.body._id).should.equal(costallocationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Costallocation if not signed in', function (done) {
    // Set Costallocation user
    costallocation.user = user;

    // Create new Costallocation model instance
    var costallocationObj = new Costallocation(costallocation);

    // Save the Costallocation
    costallocationObj.save(function () {
      // Try deleting Costallocation
      request(app).delete('/api/costallocations/' + costallocationObj._id)
        .expect(403)
        .end(function (costallocationDeleteErr, costallocationDeleteRes) {
          // Set message assertion
          (costallocationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Costallocation error error
          done(costallocationDeleteErr);
        });

    });
  });

  it('should be able to get a single Costallocation that has an orphaned user reference', function (done) {
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

          // Save a new Costallocation
          agent.post('/api/costallocations')
            .send(costallocation)
            .expect(200)
            .end(function (costallocationSaveErr, costallocationSaveRes) {
              // Handle Costallocation save error
              if (costallocationSaveErr) {
                return done(costallocationSaveErr);
              }

              // Set assertions on new Costallocation
              (costallocationSaveRes.body.name).should.equal(costallocation.name);
              should.exist(costallocationSaveRes.body.user);
              should.equal(costallocationSaveRes.body.user._id, orphanId);

              // force the Costallocation to have an orphaned user reference
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

                    // Get the Costallocation
                    agent.get('/api/costallocations/' + costallocationSaveRes.body._id)
                      .expect(200)
                      .end(function (costallocationInfoErr, costallocationInfoRes) {
                        // Handle Costallocation error
                        if (costallocationInfoErr) {
                          return done(costallocationInfoErr);
                        }

                        // Set assertions
                        (costallocationInfoRes.body._id).should.equal(costallocationSaveRes.body._id);
                        (costallocationInfoRes.body.name).should.equal(costallocation.name);
                        should.equal(costallocationInfoRes.body.user, undefined);

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
      Costallocation.remove().exec(done);
    });
  });
});
