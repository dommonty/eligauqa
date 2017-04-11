'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Riskaction = mongoose.model('Riskaction'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, riskaction;

/**
 * Riskaction routes tests
 */
describe('Riskaction CRUD tests', function () {

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

    // Save a user to the test db and create new Riskaction
    user.save(function () {
      riskaction = {
        name: 'Riskaction name'
      };

      done();
    });
  });

  it('should be able to save a Riskaction if logged in', function (done) {
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

        // Save a new Riskaction
        agent.post('/api/riskactions')
          .send(riskaction)
          .expect(200)
          .end(function (riskactionSaveErr, riskactionSaveRes) {
            // Handle Riskaction save error
            if (riskactionSaveErr) {
              return done(riskactionSaveErr);
            }

            // Get a list of Riskactions
            agent.get('/api/riskactions')
              .end(function (riskactionsGetErr, riskactionsGetRes) {
                // Handle Riskaction save error
                if (riskactionsGetErr) {
                  return done(riskactionsGetErr);
                }

                // Get Riskactions list
                var riskactions = riskactionsGetRes.body;

                // Set assertions
                (riskactions[0].user._id).should.equal(userId);
                (riskactions[0].name).should.match('Riskaction name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Riskaction if not logged in', function (done) {
    agent.post('/api/riskactions')
      .send(riskaction)
      .expect(403)
      .end(function (riskactionSaveErr, riskactionSaveRes) {
        // Call the assertion callback
        done(riskactionSaveErr);
      });
  });

  it('should not be able to save an Riskaction if no name is provided', function (done) {
    // Invalidate name field
    riskaction.name = '';

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

        // Save a new Riskaction
        agent.post('/api/riskactions')
          .send(riskaction)
          .expect(400)
          .end(function (riskactionSaveErr, riskactionSaveRes) {
            // Set message assertion
            (riskactionSaveRes.body.message).should.match('Please fill Riskaction name');

            // Handle Riskaction save error
            done(riskactionSaveErr);
          });
      });
  });

  it('should be able to update an Riskaction if signed in', function (done) {
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

        // Save a new Riskaction
        agent.post('/api/riskactions')
          .send(riskaction)
          .expect(200)
          .end(function (riskactionSaveErr, riskactionSaveRes) {
            // Handle Riskaction save error
            if (riskactionSaveErr) {
              return done(riskactionSaveErr);
            }

            // Update Riskaction name
            riskaction.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Riskaction
            agent.put('/api/riskactions/' + riskactionSaveRes.body._id)
              .send(riskaction)
              .expect(200)
              .end(function (riskactionUpdateErr, riskactionUpdateRes) {
                // Handle Riskaction update error
                if (riskactionUpdateErr) {
                  return done(riskactionUpdateErr);
                }

                // Set assertions
                (riskactionUpdateRes.body._id).should.equal(riskactionSaveRes.body._id);
                (riskactionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Riskactions if not signed in', function (done) {
    // Create new Riskaction model instance
    var riskactionObj = new Riskaction(riskaction);

    // Save the riskaction
    riskactionObj.save(function () {
      // Request Riskactions
      request(app).get('/api/riskactions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Riskaction if not signed in', function (done) {
    // Create new Riskaction model instance
    var riskactionObj = new Riskaction(riskaction);

    // Save the Riskaction
    riskactionObj.save(function () {
      request(app).get('/api/riskactions/' + riskactionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', riskaction.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Riskaction with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/riskactions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Riskaction is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Riskaction which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Riskaction
    request(app).get('/api/riskactions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Riskaction with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Riskaction if signed in', function (done) {
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

        // Save a new Riskaction
        agent.post('/api/riskactions')
          .send(riskaction)
          .expect(200)
          .end(function (riskactionSaveErr, riskactionSaveRes) {
            // Handle Riskaction save error
            if (riskactionSaveErr) {
              return done(riskactionSaveErr);
            }

            // Delete an existing Riskaction
            agent.delete('/api/riskactions/' + riskactionSaveRes.body._id)
              .send(riskaction)
              .expect(200)
              .end(function (riskactionDeleteErr, riskactionDeleteRes) {
                // Handle riskaction error error
                if (riskactionDeleteErr) {
                  return done(riskactionDeleteErr);
                }

                // Set assertions
                (riskactionDeleteRes.body._id).should.equal(riskactionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Riskaction if not signed in', function (done) {
    // Set Riskaction user
    riskaction.user = user;

    // Create new Riskaction model instance
    var riskactionObj = new Riskaction(riskaction);

    // Save the Riskaction
    riskactionObj.save(function () {
      // Try deleting Riskaction
      request(app).delete('/api/riskactions/' + riskactionObj._id)
        .expect(403)
        .end(function (riskactionDeleteErr, riskactionDeleteRes) {
          // Set message assertion
          (riskactionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Riskaction error error
          done(riskactionDeleteErr);
        });

    });
  });

  it('should be able to get a single Riskaction that has an orphaned user reference', function (done) {
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

          // Save a new Riskaction
          agent.post('/api/riskactions')
            .send(riskaction)
            .expect(200)
            .end(function (riskactionSaveErr, riskactionSaveRes) {
              // Handle Riskaction save error
              if (riskactionSaveErr) {
                return done(riskactionSaveErr);
              }

              // Set assertions on new Riskaction
              (riskactionSaveRes.body.name).should.equal(riskaction.name);
              should.exist(riskactionSaveRes.body.user);
              should.equal(riskactionSaveRes.body.user._id, orphanId);

              // force the Riskaction to have an orphaned user reference
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

                    // Get the Riskaction
                    agent.get('/api/riskactions/' + riskactionSaveRes.body._id)
                      .expect(200)
                      .end(function (riskactionInfoErr, riskactionInfoRes) {
                        // Handle Riskaction error
                        if (riskactionInfoErr) {
                          return done(riskactionInfoErr);
                        }

                        // Set assertions
                        (riskactionInfoRes.body._id).should.equal(riskactionSaveRes.body._id);
                        (riskactionInfoRes.body.name).should.equal(riskaction.name);
                        should.equal(riskactionInfoRes.body.user, undefined);

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
      Riskaction.remove().exec(done);
    });
  });
});
