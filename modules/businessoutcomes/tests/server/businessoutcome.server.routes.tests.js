'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Businessoutcome = mongoose.model('Businessoutcome'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, businessoutcome;

/**
 * Businessoutcome routes tests
 */
describe('Businessoutcome CRUD tests', function () {

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

    // Save a user to the test db and create new Businessoutcome
    user.save(function () {
      businessoutcome = {
        name: 'Businessoutcome name'
      };

      done();
    });
  });

  it('should be able to save a Businessoutcome if logged in', function (done) {
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

        // Save a new Businessoutcome
        agent.post('/api/businessoutcomes')
          .send(businessoutcome)
          .expect(200)
          .end(function (businessoutcomeSaveErr, businessoutcomeSaveRes) {
            // Handle Businessoutcome save error
            if (businessoutcomeSaveErr) {
              return done(businessoutcomeSaveErr);
            }

            // Get a list of Businessoutcomes
            agent.get('/api/businessoutcomes')
              .end(function (businessoutcomesGetErr, businessoutcomesGetRes) {
                // Handle Businessoutcome save error
                if (businessoutcomesGetErr) {
                  return done(businessoutcomesGetErr);
                }

                // Get Businessoutcomes list
                var businessoutcomes = businessoutcomesGetRes.body;

                // Set assertions
                (businessoutcomes[0].user._id).should.equal(userId);
                (businessoutcomes[0].name).should.match('Businessoutcome name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Businessoutcome if not logged in', function (done) {
    agent.post('/api/businessoutcomes')
      .send(businessoutcome)
      .expect(403)
      .end(function (businessoutcomeSaveErr, businessoutcomeSaveRes) {
        // Call the assertion callback
        done(businessoutcomeSaveErr);
      });
  });

  it('should not be able to save an Businessoutcome if no name is provided', function (done) {
    // Invalidate name field
    businessoutcome.name = '';

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

        // Save a new Businessoutcome
        agent.post('/api/businessoutcomes')
          .send(businessoutcome)
          .expect(400)
          .end(function (businessoutcomeSaveErr, businessoutcomeSaveRes) {
            // Set message assertion
            (businessoutcomeSaveRes.body.message).should.match('Please fill Businessoutcome name');

            // Handle Businessoutcome save error
            done(businessoutcomeSaveErr);
          });
      });
  });

  it('should be able to update an Businessoutcome if signed in', function (done) {
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

        // Save a new Businessoutcome
        agent.post('/api/businessoutcomes')
          .send(businessoutcome)
          .expect(200)
          .end(function (businessoutcomeSaveErr, businessoutcomeSaveRes) {
            // Handle Businessoutcome save error
            if (businessoutcomeSaveErr) {
              return done(businessoutcomeSaveErr);
            }

            // Update Businessoutcome name
            businessoutcome.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Businessoutcome
            agent.put('/api/businessoutcomes/' + businessoutcomeSaveRes.body._id)
              .send(businessoutcome)
              .expect(200)
              .end(function (businessoutcomeUpdateErr, businessoutcomeUpdateRes) {
                // Handle Businessoutcome update error
                if (businessoutcomeUpdateErr) {
                  return done(businessoutcomeUpdateErr);
                }

                // Set assertions
                (businessoutcomeUpdateRes.body._id).should.equal(businessoutcomeSaveRes.body._id);
                (businessoutcomeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Businessoutcomes if not signed in', function (done) {
    // Create new Businessoutcome model instance
    var businessoutcomeObj = new Businessoutcome(businessoutcome);

    // Save the businessoutcome
    businessoutcomeObj.save(function () {
      // Request Businessoutcomes
      request(app).get('/api/businessoutcomes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Businessoutcome if not signed in', function (done) {
    // Create new Businessoutcome model instance
    var businessoutcomeObj = new Businessoutcome(businessoutcome);

    // Save the Businessoutcome
    businessoutcomeObj.save(function () {
      request(app).get('/api/businessoutcomes/' + businessoutcomeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', businessoutcome.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Businessoutcome with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/businessoutcomes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Businessoutcome is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Businessoutcome which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Businessoutcome
    request(app).get('/api/businessoutcomes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Businessoutcome with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Businessoutcome if signed in', function (done) {
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

        // Save a new Businessoutcome
        agent.post('/api/businessoutcomes')
          .send(businessoutcome)
          .expect(200)
          .end(function (businessoutcomeSaveErr, businessoutcomeSaveRes) {
            // Handle Businessoutcome save error
            if (businessoutcomeSaveErr) {
              return done(businessoutcomeSaveErr);
            }

            // Delete an existing Businessoutcome
            agent.delete('/api/businessoutcomes/' + businessoutcomeSaveRes.body._id)
              .send(businessoutcome)
              .expect(200)
              .end(function (businessoutcomeDeleteErr, businessoutcomeDeleteRes) {
                // Handle businessoutcome error error
                if (businessoutcomeDeleteErr) {
                  return done(businessoutcomeDeleteErr);
                }

                // Set assertions
                (businessoutcomeDeleteRes.body._id).should.equal(businessoutcomeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Businessoutcome if not signed in', function (done) {
    // Set Businessoutcome user
    businessoutcome.user = user;

    // Create new Businessoutcome model instance
    var businessoutcomeObj = new Businessoutcome(businessoutcome);

    // Save the Businessoutcome
    businessoutcomeObj.save(function () {
      // Try deleting Businessoutcome
      request(app).delete('/api/businessoutcomes/' + businessoutcomeObj._id)
        .expect(403)
        .end(function (businessoutcomeDeleteErr, businessoutcomeDeleteRes) {
          // Set message assertion
          (businessoutcomeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Businessoutcome error error
          done(businessoutcomeDeleteErr);
        });

    });
  });

  it('should be able to get a single Businessoutcome that has an orphaned user reference', function (done) {
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

          // Save a new Businessoutcome
          agent.post('/api/businessoutcomes')
            .send(businessoutcome)
            .expect(200)
            .end(function (businessoutcomeSaveErr, businessoutcomeSaveRes) {
              // Handle Businessoutcome save error
              if (businessoutcomeSaveErr) {
                return done(businessoutcomeSaveErr);
              }

              // Set assertions on new Businessoutcome
              (businessoutcomeSaveRes.body.name).should.equal(businessoutcome.name);
              should.exist(businessoutcomeSaveRes.body.user);
              should.equal(businessoutcomeSaveRes.body.user._id, orphanId);

              // force the Businessoutcome to have an orphaned user reference
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

                    // Get the Businessoutcome
                    agent.get('/api/businessoutcomes/' + businessoutcomeSaveRes.body._id)
                      .expect(200)
                      .end(function (businessoutcomeInfoErr, businessoutcomeInfoRes) {
                        // Handle Businessoutcome error
                        if (businessoutcomeInfoErr) {
                          return done(businessoutcomeInfoErr);
                        }

                        // Set assertions
                        (businessoutcomeInfoRes.body._id).should.equal(businessoutcomeSaveRes.body._id);
                        (businessoutcomeInfoRes.body.name).should.equal(businessoutcome.name);
                        should.equal(businessoutcomeInfoRes.body.user, undefined);

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
      Businessoutcome.remove().exec(done);
    });
  });
});
