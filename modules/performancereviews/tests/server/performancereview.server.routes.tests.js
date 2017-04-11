'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Performancereview = mongoose.model('Performancereview'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, performancereview;

/**
 * Performancereview routes tests
 */
describe('Performancereview CRUD tests', function () {

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

    // Save a user to the test db and create new Performancereview
    user.save(function () {
      performancereview = {
        name: 'Performancereview name'
      };

      done();
    });
  });

  it('should be able to save a Performancereview if logged in', function (done) {
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

        // Save a new Performancereview
        agent.post('/api/performancereviews')
          .send(performancereview)
          .expect(200)
          .end(function (performancereviewSaveErr, performancereviewSaveRes) {
            // Handle Performancereview save error
            if (performancereviewSaveErr) {
              return done(performancereviewSaveErr);
            }

            // Get a list of Performancereviews
            agent.get('/api/performancereviews')
              .end(function (performancereviewsGetErr, performancereviewsGetRes) {
                // Handle Performancereview save error
                if (performancereviewsGetErr) {
                  return done(performancereviewsGetErr);
                }

                // Get Performancereviews list
                var performancereviews = performancereviewsGetRes.body;

                // Set assertions
                (performancereviews[0].user._id).should.equal(userId);
                (performancereviews[0].name).should.match('Performancereview name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Performancereview if not logged in', function (done) {
    agent.post('/api/performancereviews')
      .send(performancereview)
      .expect(403)
      .end(function (performancereviewSaveErr, performancereviewSaveRes) {
        // Call the assertion callback
        done(performancereviewSaveErr);
      });
  });

  it('should not be able to save an Performancereview if no name is provided', function (done) {
    // Invalidate name field
    performancereview.name = '';

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

        // Save a new Performancereview
        agent.post('/api/performancereviews')
          .send(performancereview)
          .expect(400)
          .end(function (performancereviewSaveErr, performancereviewSaveRes) {
            // Set message assertion
            (performancereviewSaveRes.body.message).should.match('Please fill Performancereview name');

            // Handle Performancereview save error
            done(performancereviewSaveErr);
          });
      });
  });

  it('should be able to update an Performancereview if signed in', function (done) {
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

        // Save a new Performancereview
        agent.post('/api/performancereviews')
          .send(performancereview)
          .expect(200)
          .end(function (performancereviewSaveErr, performancereviewSaveRes) {
            // Handle Performancereview save error
            if (performancereviewSaveErr) {
              return done(performancereviewSaveErr);
            }

            // Update Performancereview name
            performancereview.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Performancereview
            agent.put('/api/performancereviews/' + performancereviewSaveRes.body._id)
              .send(performancereview)
              .expect(200)
              .end(function (performancereviewUpdateErr, performancereviewUpdateRes) {
                // Handle Performancereview update error
                if (performancereviewUpdateErr) {
                  return done(performancereviewUpdateErr);
                }

                // Set assertions
                (performancereviewUpdateRes.body._id).should.equal(performancereviewSaveRes.body._id);
                (performancereviewUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Performancereviews if not signed in', function (done) {
    // Create new Performancereview model instance
    var performancereviewObj = new Performancereview(performancereview);

    // Save the performancereview
    performancereviewObj.save(function () {
      // Request Performancereviews
      request(app).get('/api/performancereviews')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Performancereview if not signed in', function (done) {
    // Create new Performancereview model instance
    var performancereviewObj = new Performancereview(performancereview);

    // Save the Performancereview
    performancereviewObj.save(function () {
      request(app).get('/api/performancereviews/' + performancereviewObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', performancereview.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Performancereview with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/performancereviews/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Performancereview is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Performancereview which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Performancereview
    request(app).get('/api/performancereviews/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Performancereview with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Performancereview if signed in', function (done) {
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

        // Save a new Performancereview
        agent.post('/api/performancereviews')
          .send(performancereview)
          .expect(200)
          .end(function (performancereviewSaveErr, performancereviewSaveRes) {
            // Handle Performancereview save error
            if (performancereviewSaveErr) {
              return done(performancereviewSaveErr);
            }

            // Delete an existing Performancereview
            agent.delete('/api/performancereviews/' + performancereviewSaveRes.body._id)
              .send(performancereview)
              .expect(200)
              .end(function (performancereviewDeleteErr, performancereviewDeleteRes) {
                // Handle performancereview error error
                if (performancereviewDeleteErr) {
                  return done(performancereviewDeleteErr);
                }

                // Set assertions
                (performancereviewDeleteRes.body._id).should.equal(performancereviewSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Performancereview if not signed in', function (done) {
    // Set Performancereview user
    performancereview.user = user;

    // Create new Performancereview model instance
    var performancereviewObj = new Performancereview(performancereview);

    // Save the Performancereview
    performancereviewObj.save(function () {
      // Try deleting Performancereview
      request(app).delete('/api/performancereviews/' + performancereviewObj._id)
        .expect(403)
        .end(function (performancereviewDeleteErr, performancereviewDeleteRes) {
          // Set message assertion
          (performancereviewDeleteRes.body.message).should.match('User is not authorized');

          // Handle Performancereview error error
          done(performancereviewDeleteErr);
        });

    });
  });

  it('should be able to get a single Performancereview that has an orphaned user reference', function (done) {
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

          // Save a new Performancereview
          agent.post('/api/performancereviews')
            .send(performancereview)
            .expect(200)
            .end(function (performancereviewSaveErr, performancereviewSaveRes) {
              // Handle Performancereview save error
              if (performancereviewSaveErr) {
                return done(performancereviewSaveErr);
              }

              // Set assertions on new Performancereview
              (performancereviewSaveRes.body.name).should.equal(performancereview.name);
              should.exist(performancereviewSaveRes.body.user);
              should.equal(performancereviewSaveRes.body.user._id, orphanId);

              // force the Performancereview to have an orphaned user reference
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

                    // Get the Performancereview
                    agent.get('/api/performancereviews/' + performancereviewSaveRes.body._id)
                      .expect(200)
                      .end(function (performancereviewInfoErr, performancereviewInfoRes) {
                        // Handle Performancereview error
                        if (performancereviewInfoErr) {
                          return done(performancereviewInfoErr);
                        }

                        // Set assertions
                        (performancereviewInfoRes.body._id).should.equal(performancereviewSaveRes.body._id);
                        (performancereviewInfoRes.body.name).should.equal(performancereview.name);
                        should.equal(performancereviewInfoRes.body.user, undefined);

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
      Performancereview.remove().exec(done);
    });
  });
});
