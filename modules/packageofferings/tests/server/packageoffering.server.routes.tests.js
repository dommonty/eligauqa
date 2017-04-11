'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Packageoffering = mongoose.model('Packageoffering'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, packageoffering;

/**
 * Packageoffering routes tests
 */
describe('Packageoffering CRUD tests', function () {

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

    // Save a user to the test db and create new Packageoffering
    user.save(function () {
      packageoffering = {
        name: 'Packageoffering name'
      };

      done();
    });
  });

  it('should be able to save a Packageoffering if logged in', function (done) {
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

        // Save a new Packageoffering
        agent.post('/api/packageofferings')
          .send(packageoffering)
          .expect(200)
          .end(function (packageofferingSaveErr, packageofferingSaveRes) {
            // Handle Packageoffering save error
            if (packageofferingSaveErr) {
              return done(packageofferingSaveErr);
            }

            // Get a list of Packageofferings
            agent.get('/api/packageofferings')
              .end(function (packageofferingsGetErr, packageofferingsGetRes) {
                // Handle Packageoffering save error
                if (packageofferingsGetErr) {
                  return done(packageofferingsGetErr);
                }

                // Get Packageofferings list
                var packageofferings = packageofferingsGetRes.body;

                // Set assertions
                (packageofferings[0].user._id).should.equal(userId);
                (packageofferings[0].name).should.match('Packageoffering name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Packageoffering if not logged in', function (done) {
    agent.post('/api/packageofferings')
      .send(packageoffering)
      .expect(403)
      .end(function (packageofferingSaveErr, packageofferingSaveRes) {
        // Call the assertion callback
        done(packageofferingSaveErr);
      });
  });

  it('should not be able to save an Packageoffering if no name is provided', function (done) {
    // Invalidate name field
    packageoffering.name = '';

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

        // Save a new Packageoffering
        agent.post('/api/packageofferings')
          .send(packageoffering)
          .expect(400)
          .end(function (packageofferingSaveErr, packageofferingSaveRes) {
            // Set message assertion
            (packageofferingSaveRes.body.message).should.match('Please fill Packageoffering name');

            // Handle Packageoffering save error
            done(packageofferingSaveErr);
          });
      });
  });

  it('should be able to update an Packageoffering if signed in', function (done) {
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

        // Save a new Packageoffering
        agent.post('/api/packageofferings')
          .send(packageoffering)
          .expect(200)
          .end(function (packageofferingSaveErr, packageofferingSaveRes) {
            // Handle Packageoffering save error
            if (packageofferingSaveErr) {
              return done(packageofferingSaveErr);
            }

            // Update Packageoffering name
            packageoffering.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Packageoffering
            agent.put('/api/packageofferings/' + packageofferingSaveRes.body._id)
              .send(packageoffering)
              .expect(200)
              .end(function (packageofferingUpdateErr, packageofferingUpdateRes) {
                // Handle Packageoffering update error
                if (packageofferingUpdateErr) {
                  return done(packageofferingUpdateErr);
                }

                // Set assertions
                (packageofferingUpdateRes.body._id).should.equal(packageofferingSaveRes.body._id);
                (packageofferingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Packageofferings if not signed in', function (done) {
    // Create new Packageoffering model instance
    var packageofferingObj = new Packageoffering(packageoffering);

    // Save the packageoffering
    packageofferingObj.save(function () {
      // Request Packageofferings
      request(app).get('/api/packageofferings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Packageoffering if not signed in', function (done) {
    // Create new Packageoffering model instance
    var packageofferingObj = new Packageoffering(packageoffering);

    // Save the Packageoffering
    packageofferingObj.save(function () {
      request(app).get('/api/packageofferings/' + packageofferingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', packageoffering.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Packageoffering with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/packageofferings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Packageoffering is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Packageoffering which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Packageoffering
    request(app).get('/api/packageofferings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Packageoffering with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Packageoffering if signed in', function (done) {
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

        // Save a new Packageoffering
        agent.post('/api/packageofferings')
          .send(packageoffering)
          .expect(200)
          .end(function (packageofferingSaveErr, packageofferingSaveRes) {
            // Handle Packageoffering save error
            if (packageofferingSaveErr) {
              return done(packageofferingSaveErr);
            }

            // Delete an existing Packageoffering
            agent.delete('/api/packageofferings/' + packageofferingSaveRes.body._id)
              .send(packageoffering)
              .expect(200)
              .end(function (packageofferingDeleteErr, packageofferingDeleteRes) {
                // Handle packageoffering error error
                if (packageofferingDeleteErr) {
                  return done(packageofferingDeleteErr);
                }

                // Set assertions
                (packageofferingDeleteRes.body._id).should.equal(packageofferingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Packageoffering if not signed in', function (done) {
    // Set Packageoffering user
    packageoffering.user = user;

    // Create new Packageoffering model instance
    var packageofferingObj = new Packageoffering(packageoffering);

    // Save the Packageoffering
    packageofferingObj.save(function () {
      // Try deleting Packageoffering
      request(app).delete('/api/packageofferings/' + packageofferingObj._id)
        .expect(403)
        .end(function (packageofferingDeleteErr, packageofferingDeleteRes) {
          // Set message assertion
          (packageofferingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Packageoffering error error
          done(packageofferingDeleteErr);
        });

    });
  });

  it('should be able to get a single Packageoffering that has an orphaned user reference', function (done) {
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

          // Save a new Packageoffering
          agent.post('/api/packageofferings')
            .send(packageoffering)
            .expect(200)
            .end(function (packageofferingSaveErr, packageofferingSaveRes) {
              // Handle Packageoffering save error
              if (packageofferingSaveErr) {
                return done(packageofferingSaveErr);
              }

              // Set assertions on new Packageoffering
              (packageofferingSaveRes.body.name).should.equal(packageoffering.name);
              should.exist(packageofferingSaveRes.body.user);
              should.equal(packageofferingSaveRes.body.user._id, orphanId);

              // force the Packageoffering to have an orphaned user reference
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

                    // Get the Packageoffering
                    agent.get('/api/packageofferings/' + packageofferingSaveRes.body._id)
                      .expect(200)
                      .end(function (packageofferingInfoErr, packageofferingInfoRes) {
                        // Handle Packageoffering error
                        if (packageofferingInfoErr) {
                          return done(packageofferingInfoErr);
                        }

                        // Set assertions
                        (packageofferingInfoRes.body._id).should.equal(packageofferingSaveRes.body._id);
                        (packageofferingInfoRes.body.name).should.equal(packageoffering.name);
                        should.equal(packageofferingInfoRes.body.user, undefined);

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
      Packageoffering.remove().exec(done);
    });
  });
});
