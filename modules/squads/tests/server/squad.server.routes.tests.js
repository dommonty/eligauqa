'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Squad = mongoose.model('Squad'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, squad;

/**
 * Squad routes tests
 */
describe('Squad CRUD tests', function () {

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

    // Save a user to the test db and create new Squad
    user.save(function () {
      squad = {
        name: 'Squad name'
      };

      done();
    });
  });

  it('should be able to save a Squad if logged in', function (done) {
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

        // Save a new Squad
        agent.post('/api/squads')
          .send(squad)
          .expect(200)
          .end(function (squadSaveErr, squadSaveRes) {
            // Handle Squad save error
            if (squadSaveErr) {
              return done(squadSaveErr);
            }

            // Get a list of Squads
            agent.get('/api/squads')
              .end(function (squadsGetErr, squadsGetRes) {
                // Handle Squad save error
                if (squadsGetErr) {
                  return done(squadsGetErr);
                }

                // Get Squads list
                var squads = squadsGetRes.body;

                // Set assertions
                (squads[0].user._id).should.equal(userId);
                (squads[0].name).should.match('Squad name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Squad if not logged in', function (done) {
    agent.post('/api/squads')
      .send(squad)
      .expect(403)
      .end(function (squadSaveErr, squadSaveRes) {
        // Call the assertion callback
        done(squadSaveErr);
      });
  });

  it('should not be able to save an Squad if no name is provided', function (done) {
    // Invalidate name field
    squad.name = '';

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

        // Save a new Squad
        agent.post('/api/squads')
          .send(squad)
          .expect(400)
          .end(function (squadSaveErr, squadSaveRes) {
            // Set message assertion
            (squadSaveRes.body.message).should.match('Please fill Squad name');

            // Handle Squad save error
            done(squadSaveErr);
          });
      });
  });

  it('should be able to update an Squad if signed in', function (done) {
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

        // Save a new Squad
        agent.post('/api/squads')
          .send(squad)
          .expect(200)
          .end(function (squadSaveErr, squadSaveRes) {
            // Handle Squad save error
            if (squadSaveErr) {
              return done(squadSaveErr);
            }

            // Update Squad name
            squad.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Squad
            agent.put('/api/squads/' + squadSaveRes.body._id)
              .send(squad)
              .expect(200)
              .end(function (squadUpdateErr, squadUpdateRes) {
                // Handle Squad update error
                if (squadUpdateErr) {
                  return done(squadUpdateErr);
                }

                // Set assertions
                (squadUpdateRes.body._id).should.equal(squadSaveRes.body._id);
                (squadUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Squads if not signed in', function (done) {
    // Create new Squad model instance
    var squadObj = new Squad(squad);

    // Save the squad
    squadObj.save(function () {
      // Request Squads
      request(app).get('/api/squads')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Squad if not signed in', function (done) {
    // Create new Squad model instance
    var squadObj = new Squad(squad);

    // Save the Squad
    squadObj.save(function () {
      request(app).get('/api/squads/' + squadObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', squad.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Squad with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/squads/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Squad is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Squad which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Squad
    request(app).get('/api/squads/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Squad with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Squad if signed in', function (done) {
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

        // Save a new Squad
        agent.post('/api/squads')
          .send(squad)
          .expect(200)
          .end(function (squadSaveErr, squadSaveRes) {
            // Handle Squad save error
            if (squadSaveErr) {
              return done(squadSaveErr);
            }

            // Delete an existing Squad
            agent.delete('/api/squads/' + squadSaveRes.body._id)
              .send(squad)
              .expect(200)
              .end(function (squadDeleteErr, squadDeleteRes) {
                // Handle squad error error
                if (squadDeleteErr) {
                  return done(squadDeleteErr);
                }

                // Set assertions
                (squadDeleteRes.body._id).should.equal(squadSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Squad if not signed in', function (done) {
    // Set Squad user
    squad.user = user;

    // Create new Squad model instance
    var squadObj = new Squad(squad);

    // Save the Squad
    squadObj.save(function () {
      // Try deleting Squad
      request(app).delete('/api/squads/' + squadObj._id)
        .expect(403)
        .end(function (squadDeleteErr, squadDeleteRes) {
          // Set message assertion
          (squadDeleteRes.body.message).should.match('User is not authorized');

          // Handle Squad error error
          done(squadDeleteErr);
        });

    });
  });

  it('should be able to get a single Squad that has an orphaned user reference', function (done) {
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

          // Save a new Squad
          agent.post('/api/squads')
            .send(squad)
            .expect(200)
            .end(function (squadSaveErr, squadSaveRes) {
              // Handle Squad save error
              if (squadSaveErr) {
                return done(squadSaveErr);
              }

              // Set assertions on new Squad
              (squadSaveRes.body.name).should.equal(squad.name);
              should.exist(squadSaveRes.body.user);
              should.equal(squadSaveRes.body.user._id, orphanId);

              // force the Squad to have an orphaned user reference
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

                    // Get the Squad
                    agent.get('/api/squads/' + squadSaveRes.body._id)
                      .expect(200)
                      .end(function (squadInfoErr, squadInfoRes) {
                        // Handle Squad error
                        if (squadInfoErr) {
                          return done(squadInfoErr);
                        }

                        // Set assertions
                        (squadInfoRes.body._id).should.equal(squadSaveRes.body._id);
                        (squadInfoRes.body.name).should.equal(squad.name);
                        should.equal(squadInfoRes.body.user, undefined);

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
      Squad.remove().exec(done);
    });
  });
});
