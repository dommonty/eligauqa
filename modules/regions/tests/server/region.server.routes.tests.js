'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Region = mongoose.model('Region'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, region;

/**
 * Region routes tests
 */
describe('Region CRUD tests', function () {

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

    // Save a user to the test db and create new Region
    user.save(function () {
      region = {
        name: 'Region name'
      };

      done();
    });
  });

  it('should be able to save a Region if logged in', function (done) {
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

        // Save a new Region
        agent.post('/api/regions')
          .send(region)
          .expect(200)
          .end(function (regionSaveErr, regionSaveRes) {
            // Handle Region save error
            if (regionSaveErr) {
              return done(regionSaveErr);
            }

            // Get a list of Regions
            agent.get('/api/regions')
              .end(function (regionsGetErr, regionsGetRes) {
                // Handle Region save error
                if (regionsGetErr) {
                  return done(regionsGetErr);
                }

                // Get Regions list
                var regions = regionsGetRes.body;

                // Set assertions
                (regions[0].user._id).should.equal(userId);
                (regions[0].name).should.match('Region name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Region if not logged in', function (done) {
    agent.post('/api/regions')
      .send(region)
      .expect(403)
      .end(function (regionSaveErr, regionSaveRes) {
        // Call the assertion callback
        done(regionSaveErr);
      });
  });

  it('should not be able to save an Region if no name is provided', function (done) {
    // Invalidate name field
    region.name = '';

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

        // Save a new Region
        agent.post('/api/regions')
          .send(region)
          .expect(400)
          .end(function (regionSaveErr, regionSaveRes) {
            // Set message assertion
            (regionSaveRes.body.message).should.match('Please fill Region name');

            // Handle Region save error
            done(regionSaveErr);
          });
      });
  });

  it('should be able to update an Region if signed in', function (done) {
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

        // Save a new Region
        agent.post('/api/regions')
          .send(region)
          .expect(200)
          .end(function (regionSaveErr, regionSaveRes) {
            // Handle Region save error
            if (regionSaveErr) {
              return done(regionSaveErr);
            }

            // Update Region name
            region.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Region
            agent.put('/api/regions/' + regionSaveRes.body._id)
              .send(region)
              .expect(200)
              .end(function (regionUpdateErr, regionUpdateRes) {
                // Handle Region update error
                if (regionUpdateErr) {
                  return done(regionUpdateErr);
                }

                // Set assertions
                (regionUpdateRes.body._id).should.equal(regionSaveRes.body._id);
                (regionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Regions if not signed in', function (done) {
    // Create new Region model instance
    var regionObj = new Region(region);

    // Save the region
    regionObj.save(function () {
      // Request Regions
      request(app).get('/api/regions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Region if not signed in', function (done) {
    // Create new Region model instance
    var regionObj = new Region(region);

    // Save the Region
    regionObj.save(function () {
      request(app).get('/api/regions/' + regionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', region.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Region with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/regions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Region is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Region which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Region
    request(app).get('/api/regions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Region with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Region if signed in', function (done) {
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

        // Save a new Region
        agent.post('/api/regions')
          .send(region)
          .expect(200)
          .end(function (regionSaveErr, regionSaveRes) {
            // Handle Region save error
            if (regionSaveErr) {
              return done(regionSaveErr);
            }

            // Delete an existing Region
            agent.delete('/api/regions/' + regionSaveRes.body._id)
              .send(region)
              .expect(200)
              .end(function (regionDeleteErr, regionDeleteRes) {
                // Handle region error error
                if (regionDeleteErr) {
                  return done(regionDeleteErr);
                }

                // Set assertions
                (regionDeleteRes.body._id).should.equal(regionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Region if not signed in', function (done) {
    // Set Region user
    region.user = user;

    // Create new Region model instance
    var regionObj = new Region(region);

    // Save the Region
    regionObj.save(function () {
      // Try deleting Region
      request(app).delete('/api/regions/' + regionObj._id)
        .expect(403)
        .end(function (regionDeleteErr, regionDeleteRes) {
          // Set message assertion
          (regionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Region error error
          done(regionDeleteErr);
        });

    });
  });

  it('should be able to get a single Region that has an orphaned user reference', function (done) {
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

          // Save a new Region
          agent.post('/api/regions')
            .send(region)
            .expect(200)
            .end(function (regionSaveErr, regionSaveRes) {
              // Handle Region save error
              if (regionSaveErr) {
                return done(regionSaveErr);
              }

              // Set assertions on new Region
              (regionSaveRes.body.name).should.equal(region.name);
              should.exist(regionSaveRes.body.user);
              should.equal(regionSaveRes.body.user._id, orphanId);

              // force the Region to have an orphaned user reference
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

                    // Get the Region
                    agent.get('/api/regions/' + regionSaveRes.body._id)
                      .expect(200)
                      .end(function (regionInfoErr, regionInfoRes) {
                        // Handle Region error
                        if (regionInfoErr) {
                          return done(regionInfoErr);
                        }

                        // Set assertions
                        (regionInfoRes.body._id).should.equal(regionSaveRes.body._id);
                        (regionInfoRes.body.name).should.equal(region.name);
                        should.equal(regionInfoRes.body.user, undefined);

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
      Region.remove().exec(done);
    });
  });
});
