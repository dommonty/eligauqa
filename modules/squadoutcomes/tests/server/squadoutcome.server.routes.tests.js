'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Squadoutcome = mongoose.model('Squadoutcome'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, squadoutcome;

/**
 * Squadoutcome routes tests
 */
describe('Squadoutcome CRUD tests', function () {

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

    // Save a user to the test db and create new Squadoutcome
    user.save(function () {
      squadoutcome = {
        name: 'Squadoutcome name'
      };

      done();
    });
  });

  it('should be able to save a Squadoutcome if logged in', function (done) {
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

        // Save a new Squadoutcome
        agent.post('/api/squadoutcomes')
          .send(squadoutcome)
          .expect(200)
          .end(function (squadoutcomeSaveErr, squadoutcomeSaveRes) {
            // Handle Squadoutcome save error
            if (squadoutcomeSaveErr) {
              return done(squadoutcomeSaveErr);
            }

            // Get a list of Squadoutcomes
            agent.get('/api/squadoutcomes')
              .end(function (squadoutcomesGetErr, squadoutcomesGetRes) {
                // Handle Squadoutcome save error
                if (squadoutcomesGetErr) {
                  return done(squadoutcomesGetErr);
                }

                // Get Squadoutcomes list
                var squadoutcomes = squadoutcomesGetRes.body;

                // Set assertions
                (squadoutcomes[0].user._id).should.equal(userId);
                (squadoutcomes[0].name).should.match('Squadoutcome name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Squadoutcome if not logged in', function (done) {
    agent.post('/api/squadoutcomes')
      .send(squadoutcome)
      .expect(403)
      .end(function (squadoutcomeSaveErr, squadoutcomeSaveRes) {
        // Call the assertion callback
        done(squadoutcomeSaveErr);
      });
  });

  it('should not be able to save an Squadoutcome if no name is provided', function (done) {
    // Invalidate name field
    squadoutcome.name = '';

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

        // Save a new Squadoutcome
        agent.post('/api/squadoutcomes')
          .send(squadoutcome)
          .expect(400)
          .end(function (squadoutcomeSaveErr, squadoutcomeSaveRes) {
            // Set message assertion
            (squadoutcomeSaveRes.body.message).should.match('Please fill Squadoutcome name');

            // Handle Squadoutcome save error
            done(squadoutcomeSaveErr);
          });
      });
  });

  it('should be able to update an Squadoutcome if signed in', function (done) {
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

        // Save a new Squadoutcome
        agent.post('/api/squadoutcomes')
          .send(squadoutcome)
          .expect(200)
          .end(function (squadoutcomeSaveErr, squadoutcomeSaveRes) {
            // Handle Squadoutcome save error
            if (squadoutcomeSaveErr) {
              return done(squadoutcomeSaveErr);
            }

            // Update Squadoutcome name
            squadoutcome.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Squadoutcome
            agent.put('/api/squadoutcomes/' + squadoutcomeSaveRes.body._id)
              .send(squadoutcome)
              .expect(200)
              .end(function (squadoutcomeUpdateErr, squadoutcomeUpdateRes) {
                // Handle Squadoutcome update error
                if (squadoutcomeUpdateErr) {
                  return done(squadoutcomeUpdateErr);
                }

                // Set assertions
                (squadoutcomeUpdateRes.body._id).should.equal(squadoutcomeSaveRes.body._id);
                (squadoutcomeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Squadoutcomes if not signed in', function (done) {
    // Create new Squadoutcome model instance
    var squadoutcomeObj = new Squadoutcome(squadoutcome);

    // Save the squadoutcome
    squadoutcomeObj.save(function () {
      // Request Squadoutcomes
      request(app).get('/api/squadoutcomes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Squadoutcome if not signed in', function (done) {
    // Create new Squadoutcome model instance
    var squadoutcomeObj = new Squadoutcome(squadoutcome);

    // Save the Squadoutcome
    squadoutcomeObj.save(function () {
      request(app).get('/api/squadoutcomes/' + squadoutcomeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', squadoutcome.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Squadoutcome with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/squadoutcomes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Squadoutcome is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Squadoutcome which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Squadoutcome
    request(app).get('/api/squadoutcomes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Squadoutcome with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Squadoutcome if signed in', function (done) {
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

        // Save a new Squadoutcome
        agent.post('/api/squadoutcomes')
          .send(squadoutcome)
          .expect(200)
          .end(function (squadoutcomeSaveErr, squadoutcomeSaveRes) {
            // Handle Squadoutcome save error
            if (squadoutcomeSaveErr) {
              return done(squadoutcomeSaveErr);
            }

            // Delete an existing Squadoutcome
            agent.delete('/api/squadoutcomes/' + squadoutcomeSaveRes.body._id)
              .send(squadoutcome)
              .expect(200)
              .end(function (squadoutcomeDeleteErr, squadoutcomeDeleteRes) {
                // Handle squadoutcome error error
                if (squadoutcomeDeleteErr) {
                  return done(squadoutcomeDeleteErr);
                }

                // Set assertions
                (squadoutcomeDeleteRes.body._id).should.equal(squadoutcomeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Squadoutcome if not signed in', function (done) {
    // Set Squadoutcome user
    squadoutcome.user = user;

    // Create new Squadoutcome model instance
    var squadoutcomeObj = new Squadoutcome(squadoutcome);

    // Save the Squadoutcome
    squadoutcomeObj.save(function () {
      // Try deleting Squadoutcome
      request(app).delete('/api/squadoutcomes/' + squadoutcomeObj._id)
        .expect(403)
        .end(function (squadoutcomeDeleteErr, squadoutcomeDeleteRes) {
          // Set message assertion
          (squadoutcomeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Squadoutcome error error
          done(squadoutcomeDeleteErr);
        });

    });
  });

  it('should be able to get a single Squadoutcome that has an orphaned user reference', function (done) {
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

          // Save a new Squadoutcome
          agent.post('/api/squadoutcomes')
            .send(squadoutcome)
            .expect(200)
            .end(function (squadoutcomeSaveErr, squadoutcomeSaveRes) {
              // Handle Squadoutcome save error
              if (squadoutcomeSaveErr) {
                return done(squadoutcomeSaveErr);
              }

              // Set assertions on new Squadoutcome
              (squadoutcomeSaveRes.body.name).should.equal(squadoutcome.name);
              should.exist(squadoutcomeSaveRes.body.user);
              should.equal(squadoutcomeSaveRes.body.user._id, orphanId);

              // force the Squadoutcome to have an orphaned user reference
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

                    // Get the Squadoutcome
                    agent.get('/api/squadoutcomes/' + squadoutcomeSaveRes.body._id)
                      .expect(200)
                      .end(function (squadoutcomeInfoErr, squadoutcomeInfoRes) {
                        // Handle Squadoutcome error
                        if (squadoutcomeInfoErr) {
                          return done(squadoutcomeInfoErr);
                        }

                        // Set assertions
                        (squadoutcomeInfoRes.body._id).should.equal(squadoutcomeSaveRes.body._id);
                        (squadoutcomeInfoRes.body.name).should.equal(squadoutcome.name);
                        should.equal(squadoutcomeInfoRes.body.user, undefined);

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
      Squadoutcome.remove().exec(done);
    });
  });
});
