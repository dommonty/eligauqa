'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ceodiscount = mongoose.model('Ceodiscount'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, ceodiscount;

/**
 * Ceodiscount routes tests
 */
describe('Ceodiscount CRUD tests', function () {

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

    // Save a user to the test db and create new Ceodiscount
    user.save(function () {
      ceodiscount = {
        name: 'Ceodiscount name'
      };

      done();
    });
  });

  it('should be able to save a Ceodiscount if logged in', function (done) {
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

        // Save a new Ceodiscount
        agent.post('/api/ceodiscounts')
          .send(ceodiscount)
          .expect(200)
          .end(function (ceodiscountSaveErr, ceodiscountSaveRes) {
            // Handle Ceodiscount save error
            if (ceodiscountSaveErr) {
              return done(ceodiscountSaveErr);
            }

            // Get a list of Ceodiscounts
            agent.get('/api/ceodiscounts')
              .end(function (ceodiscountsGetErr, ceodiscountsGetRes) {
                // Handle Ceodiscount save error
                if (ceodiscountsGetErr) {
                  return done(ceodiscountsGetErr);
                }

                // Get Ceodiscounts list
                var ceodiscounts = ceodiscountsGetRes.body;

                // Set assertions
                (ceodiscounts[0].user._id).should.equal(userId);
                (ceodiscounts[0].name).should.match('Ceodiscount name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Ceodiscount if not logged in', function (done) {
    agent.post('/api/ceodiscounts')
      .send(ceodiscount)
      .expect(403)
      .end(function (ceodiscountSaveErr, ceodiscountSaveRes) {
        // Call the assertion callback
        done(ceodiscountSaveErr);
      });
  });

  it('should not be able to save an Ceodiscount if no name is provided', function (done) {
    // Invalidate name field
    ceodiscount.name = '';

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

        // Save a new Ceodiscount
        agent.post('/api/ceodiscounts')
          .send(ceodiscount)
          .expect(400)
          .end(function (ceodiscountSaveErr, ceodiscountSaveRes) {
            // Set message assertion
            (ceodiscountSaveRes.body.message).should.match('Please fill Ceodiscount name');

            // Handle Ceodiscount save error
            done(ceodiscountSaveErr);
          });
      });
  });

  it('should be able to update an Ceodiscount if signed in', function (done) {
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

        // Save a new Ceodiscount
        agent.post('/api/ceodiscounts')
          .send(ceodiscount)
          .expect(200)
          .end(function (ceodiscountSaveErr, ceodiscountSaveRes) {
            // Handle Ceodiscount save error
            if (ceodiscountSaveErr) {
              return done(ceodiscountSaveErr);
            }

            // Update Ceodiscount name
            ceodiscount.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Ceodiscount
            agent.put('/api/ceodiscounts/' + ceodiscountSaveRes.body._id)
              .send(ceodiscount)
              .expect(200)
              .end(function (ceodiscountUpdateErr, ceodiscountUpdateRes) {
                // Handle Ceodiscount update error
                if (ceodiscountUpdateErr) {
                  return done(ceodiscountUpdateErr);
                }

                // Set assertions
                (ceodiscountUpdateRes.body._id).should.equal(ceodiscountSaveRes.body._id);
                (ceodiscountUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Ceodiscounts if not signed in', function (done) {
    // Create new Ceodiscount model instance
    var ceodiscountObj = new Ceodiscount(ceodiscount);

    // Save the ceodiscount
    ceodiscountObj.save(function () {
      // Request Ceodiscounts
      request(app).get('/api/ceodiscounts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Ceodiscount if not signed in', function (done) {
    // Create new Ceodiscount model instance
    var ceodiscountObj = new Ceodiscount(ceodiscount);

    // Save the Ceodiscount
    ceodiscountObj.save(function () {
      request(app).get('/api/ceodiscounts/' + ceodiscountObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', ceodiscount.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Ceodiscount with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ceodiscounts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Ceodiscount is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Ceodiscount which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Ceodiscount
    request(app).get('/api/ceodiscounts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Ceodiscount with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Ceodiscount if signed in', function (done) {
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

        // Save a new Ceodiscount
        agent.post('/api/ceodiscounts')
          .send(ceodiscount)
          .expect(200)
          .end(function (ceodiscountSaveErr, ceodiscountSaveRes) {
            // Handle Ceodiscount save error
            if (ceodiscountSaveErr) {
              return done(ceodiscountSaveErr);
            }

            // Delete an existing Ceodiscount
            agent.delete('/api/ceodiscounts/' + ceodiscountSaveRes.body._id)
              .send(ceodiscount)
              .expect(200)
              .end(function (ceodiscountDeleteErr, ceodiscountDeleteRes) {
                // Handle ceodiscount error error
                if (ceodiscountDeleteErr) {
                  return done(ceodiscountDeleteErr);
                }

                // Set assertions
                (ceodiscountDeleteRes.body._id).should.equal(ceodiscountSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Ceodiscount if not signed in', function (done) {
    // Set Ceodiscount user
    ceodiscount.user = user;

    // Create new Ceodiscount model instance
    var ceodiscountObj = new Ceodiscount(ceodiscount);

    // Save the Ceodiscount
    ceodiscountObj.save(function () {
      // Try deleting Ceodiscount
      request(app).delete('/api/ceodiscounts/' + ceodiscountObj._id)
        .expect(403)
        .end(function (ceodiscountDeleteErr, ceodiscountDeleteRes) {
          // Set message assertion
          (ceodiscountDeleteRes.body.message).should.match('User is not authorized');

          // Handle Ceodiscount error error
          done(ceodiscountDeleteErr);
        });

    });
  });

  it('should be able to get a single Ceodiscount that has an orphaned user reference', function (done) {
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

          // Save a new Ceodiscount
          agent.post('/api/ceodiscounts')
            .send(ceodiscount)
            .expect(200)
            .end(function (ceodiscountSaveErr, ceodiscountSaveRes) {
              // Handle Ceodiscount save error
              if (ceodiscountSaveErr) {
                return done(ceodiscountSaveErr);
              }

              // Set assertions on new Ceodiscount
              (ceodiscountSaveRes.body.name).should.equal(ceodiscount.name);
              should.exist(ceodiscountSaveRes.body.user);
              should.equal(ceodiscountSaveRes.body.user._id, orphanId);

              // force the Ceodiscount to have an orphaned user reference
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

                    // Get the Ceodiscount
                    agent.get('/api/ceodiscounts/' + ceodiscountSaveRes.body._id)
                      .expect(200)
                      .end(function (ceodiscountInfoErr, ceodiscountInfoRes) {
                        // Handle Ceodiscount error
                        if (ceodiscountInfoErr) {
                          return done(ceodiscountInfoErr);
                        }

                        // Set assertions
                        (ceodiscountInfoRes.body._id).should.equal(ceodiscountSaveRes.body._id);
                        (ceodiscountInfoRes.body.name).should.equal(ceodiscount.name);
                        should.equal(ceodiscountInfoRes.body.user, undefined);

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
      Ceodiscount.remove().exec(done);
    });
  });
});
