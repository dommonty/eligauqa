'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Opportunitynote = mongoose.model('Opportunitynote'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, opportunitynote;

/**
 * Opportunitynote routes tests
 */
describe('Opportunitynote CRUD tests', function () {

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

    // Save a user to the test db and create new Opportunitynote
    user.save(function () {
      opportunitynote = {
        name: 'Opportunitynote name'
      };

      done();
    });
  });

  it('should be able to save a Opportunitynote if logged in', function (done) {
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

        // Save a new Opportunitynote
        agent.post('/api/opportunitynotes')
          .send(opportunitynote)
          .expect(200)
          .end(function (opportunitynoteSaveErr, opportunitynoteSaveRes) {
            // Handle Opportunitynote save error
            if (opportunitynoteSaveErr) {
              return done(opportunitynoteSaveErr);
            }

            // Get a list of Opportunitynotes
            agent.get('/api/opportunitynotes')
              .end(function (opportunitynotesGetErr, opportunitynotesGetRes) {
                // Handle Opportunitynote save error
                if (opportunitynotesGetErr) {
                  return done(opportunitynotesGetErr);
                }

                // Get Opportunitynotes list
                var opportunitynotes = opportunitynotesGetRes.body;

                // Set assertions
                (opportunitynotes[0].user._id).should.equal(userId);
                (opportunitynotes[0].name).should.match('Opportunitynote name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Opportunitynote if not logged in', function (done) {
    agent.post('/api/opportunitynotes')
      .send(opportunitynote)
      .expect(403)
      .end(function (opportunitynoteSaveErr, opportunitynoteSaveRes) {
        // Call the assertion callback
        done(opportunitynoteSaveErr);
      });
  });

  it('should not be able to save an Opportunitynote if no name is provided', function (done) {
    // Invalidate name field
    opportunitynote.name = '';

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

        // Save a new Opportunitynote
        agent.post('/api/opportunitynotes')
          .send(opportunitynote)
          .expect(400)
          .end(function (opportunitynoteSaveErr, opportunitynoteSaveRes) {
            // Set message assertion
            (opportunitynoteSaveRes.body.message).should.match('Please fill Opportunitynote name');

            // Handle Opportunitynote save error
            done(opportunitynoteSaveErr);
          });
      });
  });

  it('should be able to update an Opportunitynote if signed in', function (done) {
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

        // Save a new Opportunitynote
        agent.post('/api/opportunitynotes')
          .send(opportunitynote)
          .expect(200)
          .end(function (opportunitynoteSaveErr, opportunitynoteSaveRes) {
            // Handle Opportunitynote save error
            if (opportunitynoteSaveErr) {
              return done(opportunitynoteSaveErr);
            }

            // Update Opportunitynote name
            opportunitynote.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Opportunitynote
            agent.put('/api/opportunitynotes/' + opportunitynoteSaveRes.body._id)
              .send(opportunitynote)
              .expect(200)
              .end(function (opportunitynoteUpdateErr, opportunitynoteUpdateRes) {
                // Handle Opportunitynote update error
                if (opportunitynoteUpdateErr) {
                  return done(opportunitynoteUpdateErr);
                }

                // Set assertions
                (opportunitynoteUpdateRes.body._id).should.equal(opportunitynoteSaveRes.body._id);
                (opportunitynoteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Opportunitynotes if not signed in', function (done) {
    // Create new Opportunitynote model instance
    var opportunitynoteObj = new Opportunitynote(opportunitynote);

    // Save the opportunitynote
    opportunitynoteObj.save(function () {
      // Request Opportunitynotes
      request(app).get('/api/opportunitynotes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Opportunitynote if not signed in', function (done) {
    // Create new Opportunitynote model instance
    var opportunitynoteObj = new Opportunitynote(opportunitynote);

    // Save the Opportunitynote
    opportunitynoteObj.save(function () {
      request(app).get('/api/opportunitynotes/' + opportunitynoteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', opportunitynote.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Opportunitynote with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/opportunitynotes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Opportunitynote is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Opportunitynote which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Opportunitynote
    request(app).get('/api/opportunitynotes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Opportunitynote with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Opportunitynote if signed in', function (done) {
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

        // Save a new Opportunitynote
        agent.post('/api/opportunitynotes')
          .send(opportunitynote)
          .expect(200)
          .end(function (opportunitynoteSaveErr, opportunitynoteSaveRes) {
            // Handle Opportunitynote save error
            if (opportunitynoteSaveErr) {
              return done(opportunitynoteSaveErr);
            }

            // Delete an existing Opportunitynote
            agent.delete('/api/opportunitynotes/' + opportunitynoteSaveRes.body._id)
              .send(opportunitynote)
              .expect(200)
              .end(function (opportunitynoteDeleteErr, opportunitynoteDeleteRes) {
                // Handle opportunitynote error error
                if (opportunitynoteDeleteErr) {
                  return done(opportunitynoteDeleteErr);
                }

                // Set assertions
                (opportunitynoteDeleteRes.body._id).should.equal(opportunitynoteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Opportunitynote if not signed in', function (done) {
    // Set Opportunitynote user
    opportunitynote.user = user;

    // Create new Opportunitynote model instance
    var opportunitynoteObj = new Opportunitynote(opportunitynote);

    // Save the Opportunitynote
    opportunitynoteObj.save(function () {
      // Try deleting Opportunitynote
      request(app).delete('/api/opportunitynotes/' + opportunitynoteObj._id)
        .expect(403)
        .end(function (opportunitynoteDeleteErr, opportunitynoteDeleteRes) {
          // Set message assertion
          (opportunitynoteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Opportunitynote error error
          done(opportunitynoteDeleteErr);
        });

    });
  });

  it('should be able to get a single Opportunitynote that has an orphaned user reference', function (done) {
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

          // Save a new Opportunitynote
          agent.post('/api/opportunitynotes')
            .send(opportunitynote)
            .expect(200)
            .end(function (opportunitynoteSaveErr, opportunitynoteSaveRes) {
              // Handle Opportunitynote save error
              if (opportunitynoteSaveErr) {
                return done(opportunitynoteSaveErr);
              }

              // Set assertions on new Opportunitynote
              (opportunitynoteSaveRes.body.name).should.equal(opportunitynote.name);
              should.exist(opportunitynoteSaveRes.body.user);
              should.equal(opportunitynoteSaveRes.body.user._id, orphanId);

              // force the Opportunitynote to have an orphaned user reference
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

                    // Get the Opportunitynote
                    agent.get('/api/opportunitynotes/' + opportunitynoteSaveRes.body._id)
                      .expect(200)
                      .end(function (opportunitynoteInfoErr, opportunitynoteInfoRes) {
                        // Handle Opportunitynote error
                        if (opportunitynoteInfoErr) {
                          return done(opportunitynoteInfoErr);
                        }

                        // Set assertions
                        (opportunitynoteInfoRes.body._id).should.equal(opportunitynoteSaveRes.body._id);
                        (opportunitynoteInfoRes.body.name).should.equal(opportunitynote.name);
                        should.equal(opportunitynoteInfoRes.body.user, undefined);

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
      Opportunitynote.remove().exec(done);
    });
  });
});
