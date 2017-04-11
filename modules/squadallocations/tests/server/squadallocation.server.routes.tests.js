'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Squadallocation = mongoose.model('Squadallocation'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, squadallocation;

/**
 * Squadallocation routes tests
 */
describe('Squadallocation CRUD tests', function () {

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

    // Save a user to the test db and create new Squadallocation
    user.save(function () {
      squadallocation = {
        name: 'Squadallocation name'
      };

      done();
    });
  });

  it('should be able to save a Squadallocation if logged in', function (done) {
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

        // Save a new Squadallocation
        agent.post('/api/squadallocations')
          .send(squadallocation)
          .expect(200)
          .end(function (squadallocationSaveErr, squadallocationSaveRes) {
            // Handle Squadallocation save error
            if (squadallocationSaveErr) {
              return done(squadallocationSaveErr);
            }

            // Get a list of Squadallocations
            agent.get('/api/squadallocations')
              .end(function (squadallocationsGetErr, squadallocationsGetRes) {
                // Handle Squadallocation save error
                if (squadallocationsGetErr) {
                  return done(squadallocationsGetErr);
                }

                // Get Squadallocations list
                var squadallocations = squadallocationsGetRes.body;

                // Set assertions
                (squadallocations[0].user._id).should.equal(userId);
                (squadallocations[0].name).should.match('Squadallocation name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Squadallocation if not logged in', function (done) {
    agent.post('/api/squadallocations')
      .send(squadallocation)
      .expect(403)
      .end(function (squadallocationSaveErr, squadallocationSaveRes) {
        // Call the assertion callback
        done(squadallocationSaveErr);
      });
  });

  it('should not be able to save an Squadallocation if no name is provided', function (done) {
    // Invalidate name field
    squadallocation.name = '';

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

        // Save a new Squadallocation
        agent.post('/api/squadallocations')
          .send(squadallocation)
          .expect(400)
          .end(function (squadallocationSaveErr, squadallocationSaveRes) {
            // Set message assertion
            (squadallocationSaveRes.body.message).should.match('Please fill Squadallocation name');

            // Handle Squadallocation save error
            done(squadallocationSaveErr);
          });
      });
  });

  it('should be able to update an Squadallocation if signed in', function (done) {
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

        // Save a new Squadallocation
        agent.post('/api/squadallocations')
          .send(squadallocation)
          .expect(200)
          .end(function (squadallocationSaveErr, squadallocationSaveRes) {
            // Handle Squadallocation save error
            if (squadallocationSaveErr) {
              return done(squadallocationSaveErr);
            }

            // Update Squadallocation name
            squadallocation.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Squadallocation
            agent.put('/api/squadallocations/' + squadallocationSaveRes.body._id)
              .send(squadallocation)
              .expect(200)
              .end(function (squadallocationUpdateErr, squadallocationUpdateRes) {
                // Handle Squadallocation update error
                if (squadallocationUpdateErr) {
                  return done(squadallocationUpdateErr);
                }

                // Set assertions
                (squadallocationUpdateRes.body._id).should.equal(squadallocationSaveRes.body._id);
                (squadallocationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Squadallocations if not signed in', function (done) {
    // Create new Squadallocation model instance
    var squadallocationObj = new Squadallocation(squadallocation);

    // Save the squadallocation
    squadallocationObj.save(function () {
      // Request Squadallocations
      request(app).get('/api/squadallocations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Squadallocation if not signed in', function (done) {
    // Create new Squadallocation model instance
    var squadallocationObj = new Squadallocation(squadallocation);

    // Save the Squadallocation
    squadallocationObj.save(function () {
      request(app).get('/api/squadallocations/' + squadallocationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', squadallocation.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Squadallocation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/squadallocations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Squadallocation is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Squadallocation which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Squadallocation
    request(app).get('/api/squadallocations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Squadallocation with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Squadallocation if signed in', function (done) {
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

        // Save a new Squadallocation
        agent.post('/api/squadallocations')
          .send(squadallocation)
          .expect(200)
          .end(function (squadallocationSaveErr, squadallocationSaveRes) {
            // Handle Squadallocation save error
            if (squadallocationSaveErr) {
              return done(squadallocationSaveErr);
            }

            // Delete an existing Squadallocation
            agent.delete('/api/squadallocations/' + squadallocationSaveRes.body._id)
              .send(squadallocation)
              .expect(200)
              .end(function (squadallocationDeleteErr, squadallocationDeleteRes) {
                // Handle squadallocation error error
                if (squadallocationDeleteErr) {
                  return done(squadallocationDeleteErr);
                }

                // Set assertions
                (squadallocationDeleteRes.body._id).should.equal(squadallocationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Squadallocation if not signed in', function (done) {
    // Set Squadallocation user
    squadallocation.user = user;

    // Create new Squadallocation model instance
    var squadallocationObj = new Squadallocation(squadallocation);

    // Save the Squadallocation
    squadallocationObj.save(function () {
      // Try deleting Squadallocation
      request(app).delete('/api/squadallocations/' + squadallocationObj._id)
        .expect(403)
        .end(function (squadallocationDeleteErr, squadallocationDeleteRes) {
          // Set message assertion
          (squadallocationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Squadallocation error error
          done(squadallocationDeleteErr);
        });

    });
  });

  it('should be able to get a single Squadallocation that has an orphaned user reference', function (done) {
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

          // Save a new Squadallocation
          agent.post('/api/squadallocations')
            .send(squadallocation)
            .expect(200)
            .end(function (squadallocationSaveErr, squadallocationSaveRes) {
              // Handle Squadallocation save error
              if (squadallocationSaveErr) {
                return done(squadallocationSaveErr);
              }

              // Set assertions on new Squadallocation
              (squadallocationSaveRes.body.name).should.equal(squadallocation.name);
              should.exist(squadallocationSaveRes.body.user);
              should.equal(squadallocationSaveRes.body.user._id, orphanId);

              // force the Squadallocation to have an orphaned user reference
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

                    // Get the Squadallocation
                    agent.get('/api/squadallocations/' + squadallocationSaveRes.body._id)
                      .expect(200)
                      .end(function (squadallocationInfoErr, squadallocationInfoRes) {
                        // Handle Squadallocation error
                        if (squadallocationInfoErr) {
                          return done(squadallocationInfoErr);
                        }

                        // Set assertions
                        (squadallocationInfoRes.body._id).should.equal(squadallocationSaveRes.body._id);
                        (squadallocationInfoRes.body.name).should.equal(squadallocation.name);
                        should.equal(squadallocationInfoRes.body.user, undefined);

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
      Squadallocation.remove().exec(done);
    });
  });
});
