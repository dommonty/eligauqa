'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Supportplan = mongoose.model('Supportplan'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, supportplan;

/**
 * Supportplan routes tests
 */
describe('Supportplan CRUD tests', function () {

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

    // Save a user to the test db and create new Supportplan
    user.save(function () {
      supportplan = {
        name: 'Supportplan name'
      };

      done();
    });
  });

  it('should be able to save a Supportplan if logged in', function (done) {
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

        // Save a new Supportplan
        agent.post('/api/supportplans')
          .send(supportplan)
          .expect(200)
          .end(function (supportplanSaveErr, supportplanSaveRes) {
            // Handle Supportplan save error
            if (supportplanSaveErr) {
              return done(supportplanSaveErr);
            }

            // Get a list of Supportplans
            agent.get('/api/supportplans')
              .end(function (supportplansGetErr, supportplansGetRes) {
                // Handle Supportplan save error
                if (supportplansGetErr) {
                  return done(supportplansGetErr);
                }

                // Get Supportplans list
                var supportplans = supportplansGetRes.body;

                // Set assertions
                (supportplans[0].user._id).should.equal(userId);
                (supportplans[0].name).should.match('Supportplan name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Supportplan if not logged in', function (done) {
    agent.post('/api/supportplans')
      .send(supportplan)
      .expect(403)
      .end(function (supportplanSaveErr, supportplanSaveRes) {
        // Call the assertion callback
        done(supportplanSaveErr);
      });
  });

  it('should not be able to save an Supportplan if no name is provided', function (done) {
    // Invalidate name field
    supportplan.name = '';

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

        // Save a new Supportplan
        agent.post('/api/supportplans')
          .send(supportplan)
          .expect(400)
          .end(function (supportplanSaveErr, supportplanSaveRes) {
            // Set message assertion
            (supportplanSaveRes.body.message).should.match('Please fill Supportplan name');

            // Handle Supportplan save error
            done(supportplanSaveErr);
          });
      });
  });

  it('should be able to update an Supportplan if signed in', function (done) {
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

        // Save a new Supportplan
        agent.post('/api/supportplans')
          .send(supportplan)
          .expect(200)
          .end(function (supportplanSaveErr, supportplanSaveRes) {
            // Handle Supportplan save error
            if (supportplanSaveErr) {
              return done(supportplanSaveErr);
            }

            // Update Supportplan name
            supportplan.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Supportplan
            agent.put('/api/supportplans/' + supportplanSaveRes.body._id)
              .send(supportplan)
              .expect(200)
              .end(function (supportplanUpdateErr, supportplanUpdateRes) {
                // Handle Supportplan update error
                if (supportplanUpdateErr) {
                  return done(supportplanUpdateErr);
                }

                // Set assertions
                (supportplanUpdateRes.body._id).should.equal(supportplanSaveRes.body._id);
                (supportplanUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Supportplans if not signed in', function (done) {
    // Create new Supportplan model instance
    var supportplanObj = new Supportplan(supportplan);

    // Save the supportplan
    supportplanObj.save(function () {
      // Request Supportplans
      request(app).get('/api/supportplans')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Supportplan if not signed in', function (done) {
    // Create new Supportplan model instance
    var supportplanObj = new Supportplan(supportplan);

    // Save the Supportplan
    supportplanObj.save(function () {
      request(app).get('/api/supportplans/' + supportplanObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', supportplan.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Supportplan with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/supportplans/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Supportplan is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Supportplan which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Supportplan
    request(app).get('/api/supportplans/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Supportplan with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Supportplan if signed in', function (done) {
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

        // Save a new Supportplan
        agent.post('/api/supportplans')
          .send(supportplan)
          .expect(200)
          .end(function (supportplanSaveErr, supportplanSaveRes) {
            // Handle Supportplan save error
            if (supportplanSaveErr) {
              return done(supportplanSaveErr);
            }

            // Delete an existing Supportplan
            agent.delete('/api/supportplans/' + supportplanSaveRes.body._id)
              .send(supportplan)
              .expect(200)
              .end(function (supportplanDeleteErr, supportplanDeleteRes) {
                // Handle supportplan error error
                if (supportplanDeleteErr) {
                  return done(supportplanDeleteErr);
                }

                // Set assertions
                (supportplanDeleteRes.body._id).should.equal(supportplanSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Supportplan if not signed in', function (done) {
    // Set Supportplan user
    supportplan.user = user;

    // Create new Supportplan model instance
    var supportplanObj = new Supportplan(supportplan);

    // Save the Supportplan
    supportplanObj.save(function () {
      // Try deleting Supportplan
      request(app).delete('/api/supportplans/' + supportplanObj._id)
        .expect(403)
        .end(function (supportplanDeleteErr, supportplanDeleteRes) {
          // Set message assertion
          (supportplanDeleteRes.body.message).should.match('User is not authorized');

          // Handle Supportplan error error
          done(supportplanDeleteErr);
        });

    });
  });

  it('should be able to get a single Supportplan that has an orphaned user reference', function (done) {
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

          // Save a new Supportplan
          agent.post('/api/supportplans')
            .send(supportplan)
            .expect(200)
            .end(function (supportplanSaveErr, supportplanSaveRes) {
              // Handle Supportplan save error
              if (supportplanSaveErr) {
                return done(supportplanSaveErr);
              }

              // Set assertions on new Supportplan
              (supportplanSaveRes.body.name).should.equal(supportplan.name);
              should.exist(supportplanSaveRes.body.user);
              should.equal(supportplanSaveRes.body.user._id, orphanId);

              // force the Supportplan to have an orphaned user reference
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

                    // Get the Supportplan
                    agent.get('/api/supportplans/' + supportplanSaveRes.body._id)
                      .expect(200)
                      .end(function (supportplanInfoErr, supportplanInfoRes) {
                        // Handle Supportplan error
                        if (supportplanInfoErr) {
                          return done(supportplanInfoErr);
                        }

                        // Set assertions
                        (supportplanInfoRes.body._id).should.equal(supportplanSaveRes.body._id);
                        (supportplanInfoRes.body.name).should.equal(supportplan.name);
                        should.equal(supportplanInfoRes.body.user, undefined);

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
      Supportplan.remove().exec(done);
    });
  });
});
