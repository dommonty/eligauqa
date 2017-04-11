'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Contractterm = mongoose.model('Contractterm'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, contractterm;

/**
 * Contractterm routes tests
 */
describe('Contractterm CRUD tests', function () {

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

    // Save a user to the test db and create new Contractterm
    user.save(function () {
      contractterm = {
        name: 'Contractterm name'
      };

      done();
    });
  });

  it('should be able to save a Contractterm if logged in', function (done) {
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

        // Save a new Contractterm
        agent.post('/api/contractterms')
          .send(contractterm)
          .expect(200)
          .end(function (contracttermSaveErr, contracttermSaveRes) {
            // Handle Contractterm save error
            if (contracttermSaveErr) {
              return done(contracttermSaveErr);
            }

            // Get a list of Contractterms
            agent.get('/api/contractterms')
              .end(function (contracttermsGetErr, contracttermsGetRes) {
                // Handle Contractterm save error
                if (contracttermsGetErr) {
                  return done(contracttermsGetErr);
                }

                // Get Contractterms list
                var contractterms = contracttermsGetRes.body;

                // Set assertions
                (contractterms[0].user._id).should.equal(userId);
                (contractterms[0].name).should.match('Contractterm name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Contractterm if not logged in', function (done) {
    agent.post('/api/contractterms')
      .send(contractterm)
      .expect(403)
      .end(function (contracttermSaveErr, contracttermSaveRes) {
        // Call the assertion callback
        done(contracttermSaveErr);
      });
  });

  it('should not be able to save an Contractterm if no name is provided', function (done) {
    // Invalidate name field
    contractterm.name = '';

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

        // Save a new Contractterm
        agent.post('/api/contractterms')
          .send(contractterm)
          .expect(400)
          .end(function (contracttermSaveErr, contracttermSaveRes) {
            // Set message assertion
            (contracttermSaveRes.body.message).should.match('Please fill Contractterm name');

            // Handle Contractterm save error
            done(contracttermSaveErr);
          });
      });
  });

  it('should be able to update an Contractterm if signed in', function (done) {
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

        // Save a new Contractterm
        agent.post('/api/contractterms')
          .send(contractterm)
          .expect(200)
          .end(function (contracttermSaveErr, contracttermSaveRes) {
            // Handle Contractterm save error
            if (contracttermSaveErr) {
              return done(contracttermSaveErr);
            }

            // Update Contractterm name
            contractterm.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Contractterm
            agent.put('/api/contractterms/' + contracttermSaveRes.body._id)
              .send(contractterm)
              .expect(200)
              .end(function (contracttermUpdateErr, contracttermUpdateRes) {
                // Handle Contractterm update error
                if (contracttermUpdateErr) {
                  return done(contracttermUpdateErr);
                }

                // Set assertions
                (contracttermUpdateRes.body._id).should.equal(contracttermSaveRes.body._id);
                (contracttermUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Contractterms if not signed in', function (done) {
    // Create new Contractterm model instance
    var contracttermObj = new Contractterm(contractterm);

    // Save the contractterm
    contracttermObj.save(function () {
      // Request Contractterms
      request(app).get('/api/contractterms')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Contractterm if not signed in', function (done) {
    // Create new Contractterm model instance
    var contracttermObj = new Contractterm(contractterm);

    // Save the Contractterm
    contracttermObj.save(function () {
      request(app).get('/api/contractterms/' + contracttermObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', contractterm.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Contractterm with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/contractterms/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Contractterm is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Contractterm which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Contractterm
    request(app).get('/api/contractterms/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Contractterm with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Contractterm if signed in', function (done) {
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

        // Save a new Contractterm
        agent.post('/api/contractterms')
          .send(contractterm)
          .expect(200)
          .end(function (contracttermSaveErr, contracttermSaveRes) {
            // Handle Contractterm save error
            if (contracttermSaveErr) {
              return done(contracttermSaveErr);
            }

            // Delete an existing Contractterm
            agent.delete('/api/contractterms/' + contracttermSaveRes.body._id)
              .send(contractterm)
              .expect(200)
              .end(function (contracttermDeleteErr, contracttermDeleteRes) {
                // Handle contractterm error error
                if (contracttermDeleteErr) {
                  return done(contracttermDeleteErr);
                }

                // Set assertions
                (contracttermDeleteRes.body._id).should.equal(contracttermSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Contractterm if not signed in', function (done) {
    // Set Contractterm user
    contractterm.user = user;

    // Create new Contractterm model instance
    var contracttermObj = new Contractterm(contractterm);

    // Save the Contractterm
    contracttermObj.save(function () {
      // Try deleting Contractterm
      request(app).delete('/api/contractterms/' + contracttermObj._id)
        .expect(403)
        .end(function (contracttermDeleteErr, contracttermDeleteRes) {
          // Set message assertion
          (contracttermDeleteRes.body.message).should.match('User is not authorized');

          // Handle Contractterm error error
          done(contracttermDeleteErr);
        });

    });
  });

  it('should be able to get a single Contractterm that has an orphaned user reference', function (done) {
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

          // Save a new Contractterm
          agent.post('/api/contractterms')
            .send(contractterm)
            .expect(200)
            .end(function (contracttermSaveErr, contracttermSaveRes) {
              // Handle Contractterm save error
              if (contracttermSaveErr) {
                return done(contracttermSaveErr);
              }

              // Set assertions on new Contractterm
              (contracttermSaveRes.body.name).should.equal(contractterm.name);
              should.exist(contracttermSaveRes.body.user);
              should.equal(contracttermSaveRes.body.user._id, orphanId);

              // force the Contractterm to have an orphaned user reference
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

                    // Get the Contractterm
                    agent.get('/api/contractterms/' + contracttermSaveRes.body._id)
                      .expect(200)
                      .end(function (contracttermInfoErr, contracttermInfoRes) {
                        // Handle Contractterm error
                        if (contracttermInfoErr) {
                          return done(contracttermInfoErr);
                        }

                        // Set assertions
                        (contracttermInfoRes.body._id).should.equal(contracttermSaveRes.body._id);
                        (contracttermInfoRes.body.name).should.equal(contractterm.name);
                        should.equal(contracttermInfoRes.body.user, undefined);

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
      Contractterm.remove().exec(done);
    });
  });
});
