'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Businessunit = mongoose.model('Businessunit'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, businessunit;

/**
 * Businessunit routes tests
 */
describe('Businessunit CRUD tests', function () {

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

    // Save a user to the test db and create new Businessunit
    user.save(function () {
      businessunit = {
        name: 'Businessunit name'
      };

      done();
    });
  });

  it('should be able to save a Businessunit if logged in', function (done) {
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

        // Save a new Businessunit
        agent.post('/api/businessunits')
          .send(businessunit)
          .expect(200)
          .end(function (businessunitSaveErr, businessunitSaveRes) {
            // Handle Businessunit save error
            if (businessunitSaveErr) {
              return done(businessunitSaveErr);
            }

            // Get a list of Businessunits
            agent.get('/api/businessunits')
              .end(function (businessunitsGetErr, businessunitsGetRes) {
                // Handle Businessunit save error
                if (businessunitsGetErr) {
                  return done(businessunitsGetErr);
                }

                // Get Businessunits list
                var businessunits = businessunitsGetRes.body;

                // Set assertions
                (businessunits[0].user._id).should.equal(userId);
                (businessunits[0].name).should.match('Businessunit name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Businessunit if not logged in', function (done) {
    agent.post('/api/businessunits')
      .send(businessunit)
      .expect(403)
      .end(function (businessunitSaveErr, businessunitSaveRes) {
        // Call the assertion callback
        done(businessunitSaveErr);
      });
  });

  it('should not be able to save an Businessunit if no name is provided', function (done) {
    // Invalidate name field
    businessunit.name = '';

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

        // Save a new Businessunit
        agent.post('/api/businessunits')
          .send(businessunit)
          .expect(400)
          .end(function (businessunitSaveErr, businessunitSaveRes) {
            // Set message assertion
            (businessunitSaveRes.body.message).should.match('Please fill Businessunit name');

            // Handle Businessunit save error
            done(businessunitSaveErr);
          });
      });
  });

  it('should be able to update an Businessunit if signed in', function (done) {
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

        // Save a new Businessunit
        agent.post('/api/businessunits')
          .send(businessunit)
          .expect(200)
          .end(function (businessunitSaveErr, businessunitSaveRes) {
            // Handle Businessunit save error
            if (businessunitSaveErr) {
              return done(businessunitSaveErr);
            }

            // Update Businessunit name
            businessunit.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Businessunit
            agent.put('/api/businessunits/' + businessunitSaveRes.body._id)
              .send(businessunit)
              .expect(200)
              .end(function (businessunitUpdateErr, businessunitUpdateRes) {
                // Handle Businessunit update error
                if (businessunitUpdateErr) {
                  return done(businessunitUpdateErr);
                }

                // Set assertions
                (businessunitUpdateRes.body._id).should.equal(businessunitSaveRes.body._id);
                (businessunitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Businessunits if not signed in', function (done) {
    // Create new Businessunit model instance
    var businessunitObj = new Businessunit(businessunit);

    // Save the businessunit
    businessunitObj.save(function () {
      // Request Businessunits
      request(app).get('/api/businessunits')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Businessunit if not signed in', function (done) {
    // Create new Businessunit model instance
    var businessunitObj = new Businessunit(businessunit);

    // Save the Businessunit
    businessunitObj.save(function () {
      request(app).get('/api/businessunits/' + businessunitObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', businessunit.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Businessunit with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/businessunits/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Businessunit is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Businessunit which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Businessunit
    request(app).get('/api/businessunits/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Businessunit with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Businessunit if signed in', function (done) {
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

        // Save a new Businessunit
        agent.post('/api/businessunits')
          .send(businessunit)
          .expect(200)
          .end(function (businessunitSaveErr, businessunitSaveRes) {
            // Handle Businessunit save error
            if (businessunitSaveErr) {
              return done(businessunitSaveErr);
            }

            // Delete an existing Businessunit
            agent.delete('/api/businessunits/' + businessunitSaveRes.body._id)
              .send(businessunit)
              .expect(200)
              .end(function (businessunitDeleteErr, businessunitDeleteRes) {
                // Handle businessunit error error
                if (businessunitDeleteErr) {
                  return done(businessunitDeleteErr);
                }

                // Set assertions
                (businessunitDeleteRes.body._id).should.equal(businessunitSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Businessunit if not signed in', function (done) {
    // Set Businessunit user
    businessunit.user = user;

    // Create new Businessunit model instance
    var businessunitObj = new Businessunit(businessunit);

    // Save the Businessunit
    businessunitObj.save(function () {
      // Try deleting Businessunit
      request(app).delete('/api/businessunits/' + businessunitObj._id)
        .expect(403)
        .end(function (businessunitDeleteErr, businessunitDeleteRes) {
          // Set message assertion
          (businessunitDeleteRes.body.message).should.match('User is not authorized');

          // Handle Businessunit error error
          done(businessunitDeleteErr);
        });

    });
  });

  it('should be able to get a single Businessunit that has an orphaned user reference', function (done) {
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

          // Save a new Businessunit
          agent.post('/api/businessunits')
            .send(businessunit)
            .expect(200)
            .end(function (businessunitSaveErr, businessunitSaveRes) {
              // Handle Businessunit save error
              if (businessunitSaveErr) {
                return done(businessunitSaveErr);
              }

              // Set assertions on new Businessunit
              (businessunitSaveRes.body.name).should.equal(businessunit.name);
              should.exist(businessunitSaveRes.body.user);
              should.equal(businessunitSaveRes.body.user._id, orphanId);

              // force the Businessunit to have an orphaned user reference
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

                    // Get the Businessunit
                    agent.get('/api/businessunits/' + businessunitSaveRes.body._id)
                      .expect(200)
                      .end(function (businessunitInfoErr, businessunitInfoRes) {
                        // Handle Businessunit error
                        if (businessunitInfoErr) {
                          return done(businessunitInfoErr);
                        }

                        // Set assertions
                        (businessunitInfoRes.body._id).should.equal(businessunitSaveRes.body._id);
                        (businessunitInfoRes.body.name).should.equal(businessunit.name);
                        should.equal(businessunitInfoRes.body.user, undefined);

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
      Businessunit.remove().exec(done);
    });
  });
});
