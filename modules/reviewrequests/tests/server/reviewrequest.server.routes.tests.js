'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Reviewrequest = mongoose.model('Reviewrequest'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, reviewrequest;

/**
 * Reviewrequest routes tests
 */
describe('Reviewrequest CRUD tests', function () {

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

    // Save a user to the test db and create new Reviewrequest
    user.save(function () {
      reviewrequest = {
        name: 'Reviewrequest name'
      };

      done();
    });
  });

  it('should be able to save a Reviewrequest if logged in', function (done) {
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

        // Save a new Reviewrequest
        agent.post('/api/reviewrequests')
          .send(reviewrequest)
          .expect(200)
          .end(function (reviewrequestSaveErr, reviewrequestSaveRes) {
            // Handle Reviewrequest save error
            if (reviewrequestSaveErr) {
              return done(reviewrequestSaveErr);
            }

            // Get a list of Reviewrequests
            agent.get('/api/reviewrequests')
              .end(function (reviewrequestsGetErr, reviewrequestsGetRes) {
                // Handle Reviewrequest save error
                if (reviewrequestsGetErr) {
                  return done(reviewrequestsGetErr);
                }

                // Get Reviewrequests list
                var reviewrequests = reviewrequestsGetRes.body;

                // Set assertions
                (reviewrequests[0].user._id).should.equal(userId);
                (reviewrequests[0].name).should.match('Reviewrequest name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Reviewrequest if not logged in', function (done) {
    agent.post('/api/reviewrequests')
      .send(reviewrequest)
      .expect(403)
      .end(function (reviewrequestSaveErr, reviewrequestSaveRes) {
        // Call the assertion callback
        done(reviewrequestSaveErr);
      });
  });

  it('should not be able to save an Reviewrequest if no name is provided', function (done) {
    // Invalidate name field
    reviewrequest.name = '';

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

        // Save a new Reviewrequest
        agent.post('/api/reviewrequests')
          .send(reviewrequest)
          .expect(400)
          .end(function (reviewrequestSaveErr, reviewrequestSaveRes) {
            // Set message assertion
            (reviewrequestSaveRes.body.message).should.match('Please fill Reviewrequest name');

            // Handle Reviewrequest save error
            done(reviewrequestSaveErr);
          });
      });
  });

  it('should be able to update an Reviewrequest if signed in', function (done) {
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

        // Save a new Reviewrequest
        agent.post('/api/reviewrequests')
          .send(reviewrequest)
          .expect(200)
          .end(function (reviewrequestSaveErr, reviewrequestSaveRes) {
            // Handle Reviewrequest save error
            if (reviewrequestSaveErr) {
              return done(reviewrequestSaveErr);
            }

            // Update Reviewrequest name
            reviewrequest.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Reviewrequest
            agent.put('/api/reviewrequests/' + reviewrequestSaveRes.body._id)
              .send(reviewrequest)
              .expect(200)
              .end(function (reviewrequestUpdateErr, reviewrequestUpdateRes) {
                // Handle Reviewrequest update error
                if (reviewrequestUpdateErr) {
                  return done(reviewrequestUpdateErr);
                }

                // Set assertions
                (reviewrequestUpdateRes.body._id).should.equal(reviewrequestSaveRes.body._id);
                (reviewrequestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Reviewrequests if not signed in', function (done) {
    // Create new Reviewrequest model instance
    var reviewrequestObj = new Reviewrequest(reviewrequest);

    // Save the reviewrequest
    reviewrequestObj.save(function () {
      // Request Reviewrequests
      request(app).get('/api/reviewrequests')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Reviewrequest if not signed in', function (done) {
    // Create new Reviewrequest model instance
    var reviewrequestObj = new Reviewrequest(reviewrequest);

    // Save the Reviewrequest
    reviewrequestObj.save(function () {
      request(app).get('/api/reviewrequests/' + reviewrequestObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', reviewrequest.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Reviewrequest with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/reviewrequests/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Reviewrequest is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Reviewrequest which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Reviewrequest
    request(app).get('/api/reviewrequests/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Reviewrequest with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Reviewrequest if signed in', function (done) {
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

        // Save a new Reviewrequest
        agent.post('/api/reviewrequests')
          .send(reviewrequest)
          .expect(200)
          .end(function (reviewrequestSaveErr, reviewrequestSaveRes) {
            // Handle Reviewrequest save error
            if (reviewrequestSaveErr) {
              return done(reviewrequestSaveErr);
            }

            // Delete an existing Reviewrequest
            agent.delete('/api/reviewrequests/' + reviewrequestSaveRes.body._id)
              .send(reviewrequest)
              .expect(200)
              .end(function (reviewrequestDeleteErr, reviewrequestDeleteRes) {
                // Handle reviewrequest error error
                if (reviewrequestDeleteErr) {
                  return done(reviewrequestDeleteErr);
                }

                // Set assertions
                (reviewrequestDeleteRes.body._id).should.equal(reviewrequestSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Reviewrequest if not signed in', function (done) {
    // Set Reviewrequest user
    reviewrequest.user = user;

    // Create new Reviewrequest model instance
    var reviewrequestObj = new Reviewrequest(reviewrequest);

    // Save the Reviewrequest
    reviewrequestObj.save(function () {
      // Try deleting Reviewrequest
      request(app).delete('/api/reviewrequests/' + reviewrequestObj._id)
        .expect(403)
        .end(function (reviewrequestDeleteErr, reviewrequestDeleteRes) {
          // Set message assertion
          (reviewrequestDeleteRes.body.message).should.match('User is not authorized');

          // Handle Reviewrequest error error
          done(reviewrequestDeleteErr);
        });

    });
  });

  it('should be able to get a single Reviewrequest that has an orphaned user reference', function (done) {
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

          // Save a new Reviewrequest
          agent.post('/api/reviewrequests')
            .send(reviewrequest)
            .expect(200)
            .end(function (reviewrequestSaveErr, reviewrequestSaveRes) {
              // Handle Reviewrequest save error
              if (reviewrequestSaveErr) {
                return done(reviewrequestSaveErr);
              }

              // Set assertions on new Reviewrequest
              (reviewrequestSaveRes.body.name).should.equal(reviewrequest.name);
              should.exist(reviewrequestSaveRes.body.user);
              should.equal(reviewrequestSaveRes.body.user._id, orphanId);

              // force the Reviewrequest to have an orphaned user reference
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

                    // Get the Reviewrequest
                    agent.get('/api/reviewrequests/' + reviewrequestSaveRes.body._id)
                      .expect(200)
                      .end(function (reviewrequestInfoErr, reviewrequestInfoRes) {
                        // Handle Reviewrequest error
                        if (reviewrequestInfoErr) {
                          return done(reviewrequestInfoErr);
                        }

                        // Set assertions
                        (reviewrequestInfoRes.body._id).should.equal(reviewrequestSaveRes.body._id);
                        (reviewrequestInfoRes.body.name).should.equal(reviewrequest.name);
                        should.equal(reviewrequestInfoRes.body.user, undefined);

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
      Reviewrequest.remove().exec(done);
    });
  });
});
