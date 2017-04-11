'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Outcometeam = mongoose.model('Outcometeam'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, outcometeam;

/**
 * Outcometeam routes tests
 */
describe('Outcometeam CRUD tests', function () {

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

    // Save a user to the test db and create new Outcometeam
    user.save(function () {
      outcometeam = {
        name: 'Outcometeam name'
      };

      done();
    });
  });

  it('should be able to save a Outcometeam if logged in', function (done) {
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

        // Save a new Outcometeam
        agent.post('/api/outcometeams')
          .send(outcometeam)
          .expect(200)
          .end(function (outcometeamSaveErr, outcometeamSaveRes) {
            // Handle Outcometeam save error
            if (outcometeamSaveErr) {
              return done(outcometeamSaveErr);
            }

            // Get a list of Outcometeams
            agent.get('/api/outcometeams')
              .end(function (outcometeamsGetErr, outcometeamsGetRes) {
                // Handle Outcometeam save error
                if (outcometeamsGetErr) {
                  return done(outcometeamsGetErr);
                }

                // Get Outcometeams list
                var outcometeams = outcometeamsGetRes.body;

                // Set assertions
                (outcometeams[0].user._id).should.equal(userId);
                (outcometeams[0].name).should.match('Outcometeam name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Outcometeam if not logged in', function (done) {
    agent.post('/api/outcometeams')
      .send(outcometeam)
      .expect(403)
      .end(function (outcometeamSaveErr, outcometeamSaveRes) {
        // Call the assertion callback
        done(outcometeamSaveErr);
      });
  });

  it('should not be able to save an Outcometeam if no name is provided', function (done) {
    // Invalidate name field
    outcometeam.name = '';

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

        // Save a new Outcometeam
        agent.post('/api/outcometeams')
          .send(outcometeam)
          .expect(400)
          .end(function (outcometeamSaveErr, outcometeamSaveRes) {
            // Set message assertion
            (outcometeamSaveRes.body.message).should.match('Please fill Outcometeam name');

            // Handle Outcometeam save error
            done(outcometeamSaveErr);
          });
      });
  });

  it('should be able to update an Outcometeam if signed in', function (done) {
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

        // Save a new Outcometeam
        agent.post('/api/outcometeams')
          .send(outcometeam)
          .expect(200)
          .end(function (outcometeamSaveErr, outcometeamSaveRes) {
            // Handle Outcometeam save error
            if (outcometeamSaveErr) {
              return done(outcometeamSaveErr);
            }

            // Update Outcometeam name
            outcometeam.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Outcometeam
            agent.put('/api/outcometeams/' + outcometeamSaveRes.body._id)
              .send(outcometeam)
              .expect(200)
              .end(function (outcometeamUpdateErr, outcometeamUpdateRes) {
                // Handle Outcometeam update error
                if (outcometeamUpdateErr) {
                  return done(outcometeamUpdateErr);
                }

                // Set assertions
                (outcometeamUpdateRes.body._id).should.equal(outcometeamSaveRes.body._id);
                (outcometeamUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Outcometeams if not signed in', function (done) {
    // Create new Outcometeam model instance
    var outcometeamObj = new Outcometeam(outcometeam);

    // Save the outcometeam
    outcometeamObj.save(function () {
      // Request Outcometeams
      request(app).get('/api/outcometeams')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Outcometeam if not signed in', function (done) {
    // Create new Outcometeam model instance
    var outcometeamObj = new Outcometeam(outcometeam);

    // Save the Outcometeam
    outcometeamObj.save(function () {
      request(app).get('/api/outcometeams/' + outcometeamObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', outcometeam.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Outcometeam with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/outcometeams/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Outcometeam is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Outcometeam which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Outcometeam
    request(app).get('/api/outcometeams/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Outcometeam with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Outcometeam if signed in', function (done) {
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

        // Save a new Outcometeam
        agent.post('/api/outcometeams')
          .send(outcometeam)
          .expect(200)
          .end(function (outcometeamSaveErr, outcometeamSaveRes) {
            // Handle Outcometeam save error
            if (outcometeamSaveErr) {
              return done(outcometeamSaveErr);
            }

            // Delete an existing Outcometeam
            agent.delete('/api/outcometeams/' + outcometeamSaveRes.body._id)
              .send(outcometeam)
              .expect(200)
              .end(function (outcometeamDeleteErr, outcometeamDeleteRes) {
                // Handle outcometeam error error
                if (outcometeamDeleteErr) {
                  return done(outcometeamDeleteErr);
                }

                // Set assertions
                (outcometeamDeleteRes.body._id).should.equal(outcometeamSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Outcometeam if not signed in', function (done) {
    // Set Outcometeam user
    outcometeam.user = user;

    // Create new Outcometeam model instance
    var outcometeamObj = new Outcometeam(outcometeam);

    // Save the Outcometeam
    outcometeamObj.save(function () {
      // Try deleting Outcometeam
      request(app).delete('/api/outcometeams/' + outcometeamObj._id)
        .expect(403)
        .end(function (outcometeamDeleteErr, outcometeamDeleteRes) {
          // Set message assertion
          (outcometeamDeleteRes.body.message).should.match('User is not authorized');

          // Handle Outcometeam error error
          done(outcometeamDeleteErr);
        });

    });
  });

  it('should be able to get a single Outcometeam that has an orphaned user reference', function (done) {
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

          // Save a new Outcometeam
          agent.post('/api/outcometeams')
            .send(outcometeam)
            .expect(200)
            .end(function (outcometeamSaveErr, outcometeamSaveRes) {
              // Handle Outcometeam save error
              if (outcometeamSaveErr) {
                return done(outcometeamSaveErr);
              }

              // Set assertions on new Outcometeam
              (outcometeamSaveRes.body.name).should.equal(outcometeam.name);
              should.exist(outcometeamSaveRes.body.user);
              should.equal(outcometeamSaveRes.body.user._id, orphanId);

              // force the Outcometeam to have an orphaned user reference
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

                    // Get the Outcometeam
                    agent.get('/api/outcometeams/' + outcometeamSaveRes.body._id)
                      .expect(200)
                      .end(function (outcometeamInfoErr, outcometeamInfoRes) {
                        // Handle Outcometeam error
                        if (outcometeamInfoErr) {
                          return done(outcometeamInfoErr);
                        }

                        // Set assertions
                        (outcometeamInfoRes.body._id).should.equal(outcometeamSaveRes.body._id);
                        (outcometeamInfoRes.body.name).should.equal(outcometeam.name);
                        should.equal(outcometeamInfoRes.body.user, undefined);

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
      Outcometeam.remove().exec(done);
    });
  });
});
