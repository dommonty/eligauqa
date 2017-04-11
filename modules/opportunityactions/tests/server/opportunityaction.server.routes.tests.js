'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Opportunityaction = mongoose.model('Opportunityaction'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, opportunityaction;

/**
 * Opportunityaction routes tests
 */
describe('Opportunityaction CRUD tests', function () {

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

    // Save a user to the test db and create new Opportunityaction
    user.save(function () {
      opportunityaction = {
        name: 'Opportunityaction name'
      };

      done();
    });
  });

  it('should be able to save a Opportunityaction if logged in', function (done) {
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

        // Save a new Opportunityaction
        agent.post('/api/opportunityactions')
          .send(opportunityaction)
          .expect(200)
          .end(function (opportunityactionSaveErr, opportunityactionSaveRes) {
            // Handle Opportunityaction save error
            if (opportunityactionSaveErr) {
              return done(opportunityactionSaveErr);
            }

            // Get a list of Opportunityactions
            agent.get('/api/opportunityactions')
              .end(function (opportunityactionsGetErr, opportunityactionsGetRes) {
                // Handle Opportunityaction save error
                if (opportunityactionsGetErr) {
                  return done(opportunityactionsGetErr);
                }

                // Get Opportunityactions list
                var opportunityactions = opportunityactionsGetRes.body;

                // Set assertions
                (opportunityactions[0].user._id).should.equal(userId);
                (opportunityactions[0].name).should.match('Opportunityaction name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Opportunityaction if not logged in', function (done) {
    agent.post('/api/opportunityactions')
      .send(opportunityaction)
      .expect(403)
      .end(function (opportunityactionSaveErr, opportunityactionSaveRes) {
        // Call the assertion callback
        done(opportunityactionSaveErr);
      });
  });

  it('should not be able to save an Opportunityaction if no name is provided', function (done) {
    // Invalidate name field
    opportunityaction.name = '';

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

        // Save a new Opportunityaction
        agent.post('/api/opportunityactions')
          .send(opportunityaction)
          .expect(400)
          .end(function (opportunityactionSaveErr, opportunityactionSaveRes) {
            // Set message assertion
            (opportunityactionSaveRes.body.message).should.match('Please fill Opportunityaction name');

            // Handle Opportunityaction save error
            done(opportunityactionSaveErr);
          });
      });
  });

  it('should be able to update an Opportunityaction if signed in', function (done) {
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

        // Save a new Opportunityaction
        agent.post('/api/opportunityactions')
          .send(opportunityaction)
          .expect(200)
          .end(function (opportunityactionSaveErr, opportunityactionSaveRes) {
            // Handle Opportunityaction save error
            if (opportunityactionSaveErr) {
              return done(opportunityactionSaveErr);
            }

            // Update Opportunityaction name
            opportunityaction.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Opportunityaction
            agent.put('/api/opportunityactions/' + opportunityactionSaveRes.body._id)
              .send(opportunityaction)
              .expect(200)
              .end(function (opportunityactionUpdateErr, opportunityactionUpdateRes) {
                // Handle Opportunityaction update error
                if (opportunityactionUpdateErr) {
                  return done(opportunityactionUpdateErr);
                }

                // Set assertions
                (opportunityactionUpdateRes.body._id).should.equal(opportunityactionSaveRes.body._id);
                (opportunityactionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Opportunityactions if not signed in', function (done) {
    // Create new Opportunityaction model instance
    var opportunityactionObj = new Opportunityaction(opportunityaction);

    // Save the opportunityaction
    opportunityactionObj.save(function () {
      // Request Opportunityactions
      request(app).get('/api/opportunityactions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Opportunityaction if not signed in', function (done) {
    // Create new Opportunityaction model instance
    var opportunityactionObj = new Opportunityaction(opportunityaction);

    // Save the Opportunityaction
    opportunityactionObj.save(function () {
      request(app).get('/api/opportunityactions/' + opportunityactionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', opportunityaction.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Opportunityaction with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/opportunityactions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Opportunityaction is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Opportunityaction which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Opportunityaction
    request(app).get('/api/opportunityactions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Opportunityaction with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Opportunityaction if signed in', function (done) {
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

        // Save a new Opportunityaction
        agent.post('/api/opportunityactions')
          .send(opportunityaction)
          .expect(200)
          .end(function (opportunityactionSaveErr, opportunityactionSaveRes) {
            // Handle Opportunityaction save error
            if (opportunityactionSaveErr) {
              return done(opportunityactionSaveErr);
            }

            // Delete an existing Opportunityaction
            agent.delete('/api/opportunityactions/' + opportunityactionSaveRes.body._id)
              .send(opportunityaction)
              .expect(200)
              .end(function (opportunityactionDeleteErr, opportunityactionDeleteRes) {
                // Handle opportunityaction error error
                if (opportunityactionDeleteErr) {
                  return done(opportunityactionDeleteErr);
                }

                // Set assertions
                (opportunityactionDeleteRes.body._id).should.equal(opportunityactionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Opportunityaction if not signed in', function (done) {
    // Set Opportunityaction user
    opportunityaction.user = user;

    // Create new Opportunityaction model instance
    var opportunityactionObj = new Opportunityaction(opportunityaction);

    // Save the Opportunityaction
    opportunityactionObj.save(function () {
      // Try deleting Opportunityaction
      request(app).delete('/api/opportunityactions/' + opportunityactionObj._id)
        .expect(403)
        .end(function (opportunityactionDeleteErr, opportunityactionDeleteRes) {
          // Set message assertion
          (opportunityactionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Opportunityaction error error
          done(opportunityactionDeleteErr);
        });

    });
  });

  it('should be able to get a single Opportunityaction that has an orphaned user reference', function (done) {
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

          // Save a new Opportunityaction
          agent.post('/api/opportunityactions')
            .send(opportunityaction)
            .expect(200)
            .end(function (opportunityactionSaveErr, opportunityactionSaveRes) {
              // Handle Opportunityaction save error
              if (opportunityactionSaveErr) {
                return done(opportunityactionSaveErr);
              }

              // Set assertions on new Opportunityaction
              (opportunityactionSaveRes.body.name).should.equal(opportunityaction.name);
              should.exist(opportunityactionSaveRes.body.user);
              should.equal(opportunityactionSaveRes.body.user._id, orphanId);

              // force the Opportunityaction to have an orphaned user reference
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

                    // Get the Opportunityaction
                    agent.get('/api/opportunityactions/' + opportunityactionSaveRes.body._id)
                      .expect(200)
                      .end(function (opportunityactionInfoErr, opportunityactionInfoRes) {
                        // Handle Opportunityaction error
                        if (opportunityactionInfoErr) {
                          return done(opportunityactionInfoErr);
                        }

                        // Set assertions
                        (opportunityactionInfoRes.body._id).should.equal(opportunityactionSaveRes.body._id);
                        (opportunityactionInfoRes.body.name).should.equal(opportunityaction.name);
                        should.equal(opportunityactionInfoRes.body.user, undefined);

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
      Opportunityaction.remove().exec(done);
    });
  });
});
