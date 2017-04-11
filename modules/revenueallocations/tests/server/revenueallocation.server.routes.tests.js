'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Revenueallocation = mongoose.model('Revenueallocation'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, revenueallocation;

/**
 * Revenueallocation routes tests
 */
describe('Revenueallocation CRUD tests', function () {

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

    // Save a user to the test db and create new Revenueallocation
    user.save(function () {
      revenueallocation = {
        name: 'Revenueallocation name'
      };

      done();
    });
  });

  it('should be able to save a Revenueallocation if logged in', function (done) {
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

        // Save a new Revenueallocation
        agent.post('/api/revenueallocations')
          .send(revenueallocation)
          .expect(200)
          .end(function (revenueallocationSaveErr, revenueallocationSaveRes) {
            // Handle Revenueallocation save error
            if (revenueallocationSaveErr) {
              return done(revenueallocationSaveErr);
            }

            // Get a list of Revenueallocations
            agent.get('/api/revenueallocations')
              .end(function (revenueallocationsGetErr, revenueallocationsGetRes) {
                // Handle Revenueallocation save error
                if (revenueallocationsGetErr) {
                  return done(revenueallocationsGetErr);
                }

                // Get Revenueallocations list
                var revenueallocations = revenueallocationsGetRes.body;

                // Set assertions
                (revenueallocations[0].user._id).should.equal(userId);
                (revenueallocations[0].name).should.match('Revenueallocation name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Revenueallocation if not logged in', function (done) {
    agent.post('/api/revenueallocations')
      .send(revenueallocation)
      .expect(403)
      .end(function (revenueallocationSaveErr, revenueallocationSaveRes) {
        // Call the assertion callback
        done(revenueallocationSaveErr);
      });
  });

  it('should not be able to save an Revenueallocation if no name is provided', function (done) {
    // Invalidate name field
    revenueallocation.name = '';

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

        // Save a new Revenueallocation
        agent.post('/api/revenueallocations')
          .send(revenueallocation)
          .expect(400)
          .end(function (revenueallocationSaveErr, revenueallocationSaveRes) {
            // Set message assertion
            (revenueallocationSaveRes.body.message).should.match('Please fill Revenueallocation name');

            // Handle Revenueallocation save error
            done(revenueallocationSaveErr);
          });
      });
  });

  it('should be able to update an Revenueallocation if signed in', function (done) {
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

        // Save a new Revenueallocation
        agent.post('/api/revenueallocations')
          .send(revenueallocation)
          .expect(200)
          .end(function (revenueallocationSaveErr, revenueallocationSaveRes) {
            // Handle Revenueallocation save error
            if (revenueallocationSaveErr) {
              return done(revenueallocationSaveErr);
            }

            // Update Revenueallocation name
            revenueallocation.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Revenueallocation
            agent.put('/api/revenueallocations/' + revenueallocationSaveRes.body._id)
              .send(revenueallocation)
              .expect(200)
              .end(function (revenueallocationUpdateErr, revenueallocationUpdateRes) {
                // Handle Revenueallocation update error
                if (revenueallocationUpdateErr) {
                  return done(revenueallocationUpdateErr);
                }

                // Set assertions
                (revenueallocationUpdateRes.body._id).should.equal(revenueallocationSaveRes.body._id);
                (revenueallocationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Revenueallocations if not signed in', function (done) {
    // Create new Revenueallocation model instance
    var revenueallocationObj = new Revenueallocation(revenueallocation);

    // Save the revenueallocation
    revenueallocationObj.save(function () {
      // Request Revenueallocations
      request(app).get('/api/revenueallocations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Revenueallocation if not signed in', function (done) {
    // Create new Revenueallocation model instance
    var revenueallocationObj = new Revenueallocation(revenueallocation);

    // Save the Revenueallocation
    revenueallocationObj.save(function () {
      request(app).get('/api/revenueallocations/' + revenueallocationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', revenueallocation.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Revenueallocation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/revenueallocations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Revenueallocation is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Revenueallocation which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Revenueallocation
    request(app).get('/api/revenueallocations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Revenueallocation with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Revenueallocation if signed in', function (done) {
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

        // Save a new Revenueallocation
        agent.post('/api/revenueallocations')
          .send(revenueallocation)
          .expect(200)
          .end(function (revenueallocationSaveErr, revenueallocationSaveRes) {
            // Handle Revenueallocation save error
            if (revenueallocationSaveErr) {
              return done(revenueallocationSaveErr);
            }

            // Delete an existing Revenueallocation
            agent.delete('/api/revenueallocations/' + revenueallocationSaveRes.body._id)
              .send(revenueallocation)
              .expect(200)
              .end(function (revenueallocationDeleteErr, revenueallocationDeleteRes) {
                // Handle revenueallocation error error
                if (revenueallocationDeleteErr) {
                  return done(revenueallocationDeleteErr);
                }

                // Set assertions
                (revenueallocationDeleteRes.body._id).should.equal(revenueallocationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Revenueallocation if not signed in', function (done) {
    // Set Revenueallocation user
    revenueallocation.user = user;

    // Create new Revenueallocation model instance
    var revenueallocationObj = new Revenueallocation(revenueallocation);

    // Save the Revenueallocation
    revenueallocationObj.save(function () {
      // Try deleting Revenueallocation
      request(app).delete('/api/revenueallocations/' + revenueallocationObj._id)
        .expect(403)
        .end(function (revenueallocationDeleteErr, revenueallocationDeleteRes) {
          // Set message assertion
          (revenueallocationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Revenueallocation error error
          done(revenueallocationDeleteErr);
        });

    });
  });

  it('should be able to get a single Revenueallocation that has an orphaned user reference', function (done) {
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

          // Save a new Revenueallocation
          agent.post('/api/revenueallocations')
            .send(revenueallocation)
            .expect(200)
            .end(function (revenueallocationSaveErr, revenueallocationSaveRes) {
              // Handle Revenueallocation save error
              if (revenueallocationSaveErr) {
                return done(revenueallocationSaveErr);
              }

              // Set assertions on new Revenueallocation
              (revenueallocationSaveRes.body.name).should.equal(revenueallocation.name);
              should.exist(revenueallocationSaveRes.body.user);
              should.equal(revenueallocationSaveRes.body.user._id, orphanId);

              // force the Revenueallocation to have an orphaned user reference
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

                    // Get the Revenueallocation
                    agent.get('/api/revenueallocations/' + revenueallocationSaveRes.body._id)
                      .expect(200)
                      .end(function (revenueallocationInfoErr, revenueallocationInfoRes) {
                        // Handle Revenueallocation error
                        if (revenueallocationInfoErr) {
                          return done(revenueallocationInfoErr);
                        }

                        // Set assertions
                        (revenueallocationInfoRes.body._id).should.equal(revenueallocationSaveRes.body._id);
                        (revenueallocationInfoRes.body.name).should.equal(revenueallocation.name);
                        should.equal(revenueallocationInfoRes.body.user, undefined);

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
      Revenueallocation.remove().exec(done);
    });
  });
});
