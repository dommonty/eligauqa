'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Customercontact = mongoose.model('Customercontact'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, customercontact;

/**
 * Customercontact routes tests
 */
describe('Customercontact CRUD tests', function () {

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

    // Save a user to the test db and create new Customercontact
    user.save(function () {
      customercontact = {
        name: 'Customercontact name'
      };

      done();
    });
  });

  it('should be able to save a Customercontact if logged in', function (done) {
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

        // Save a new Customercontact
        agent.post('/api/customercontacts')
          .send(customercontact)
          .expect(200)
          .end(function (customercontactSaveErr, customercontactSaveRes) {
            // Handle Customercontact save error
            if (customercontactSaveErr) {
              return done(customercontactSaveErr);
            }

            // Get a list of Customercontacts
            agent.get('/api/customercontacts')
              .end(function (customercontactsGetErr, customercontactsGetRes) {
                // Handle Customercontact save error
                if (customercontactsGetErr) {
                  return done(customercontactsGetErr);
                }

                // Get Customercontacts list
                var customercontacts = customercontactsGetRes.body;

                // Set assertions
                (customercontacts[0].user._id).should.equal(userId);
                (customercontacts[0].name).should.match('Customercontact name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Customercontact if not logged in', function (done) {
    agent.post('/api/customercontacts')
      .send(customercontact)
      .expect(403)
      .end(function (customercontactSaveErr, customercontactSaveRes) {
        // Call the assertion callback
        done(customercontactSaveErr);
      });
  });

  it('should not be able to save an Customercontact if no name is provided', function (done) {
    // Invalidate name field
    customercontact.name = '';

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

        // Save a new Customercontact
        agent.post('/api/customercontacts')
          .send(customercontact)
          .expect(400)
          .end(function (customercontactSaveErr, customercontactSaveRes) {
            // Set message assertion
            (customercontactSaveRes.body.message).should.match('Please fill Customercontact name');

            // Handle Customercontact save error
            done(customercontactSaveErr);
          });
      });
  });

  it('should be able to update an Customercontact if signed in', function (done) {
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

        // Save a new Customercontact
        agent.post('/api/customercontacts')
          .send(customercontact)
          .expect(200)
          .end(function (customercontactSaveErr, customercontactSaveRes) {
            // Handle Customercontact save error
            if (customercontactSaveErr) {
              return done(customercontactSaveErr);
            }

            // Update Customercontact name
            customercontact.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Customercontact
            agent.put('/api/customercontacts/' + customercontactSaveRes.body._id)
              .send(customercontact)
              .expect(200)
              .end(function (customercontactUpdateErr, customercontactUpdateRes) {
                // Handle Customercontact update error
                if (customercontactUpdateErr) {
                  return done(customercontactUpdateErr);
                }

                // Set assertions
                (customercontactUpdateRes.body._id).should.equal(customercontactSaveRes.body._id);
                (customercontactUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Customercontacts if not signed in', function (done) {
    // Create new Customercontact model instance
    var customercontactObj = new Customercontact(customercontact);

    // Save the customercontact
    customercontactObj.save(function () {
      // Request Customercontacts
      request(app).get('/api/customercontacts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Customercontact if not signed in', function (done) {
    // Create new Customercontact model instance
    var customercontactObj = new Customercontact(customercontact);

    // Save the Customercontact
    customercontactObj.save(function () {
      request(app).get('/api/customercontacts/' + customercontactObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', customercontact.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Customercontact with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/customercontacts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Customercontact is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Customercontact which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Customercontact
    request(app).get('/api/customercontacts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Customercontact with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Customercontact if signed in', function (done) {
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

        // Save a new Customercontact
        agent.post('/api/customercontacts')
          .send(customercontact)
          .expect(200)
          .end(function (customercontactSaveErr, customercontactSaveRes) {
            // Handle Customercontact save error
            if (customercontactSaveErr) {
              return done(customercontactSaveErr);
            }

            // Delete an existing Customercontact
            agent.delete('/api/customercontacts/' + customercontactSaveRes.body._id)
              .send(customercontact)
              .expect(200)
              .end(function (customercontactDeleteErr, customercontactDeleteRes) {
                // Handle customercontact error error
                if (customercontactDeleteErr) {
                  return done(customercontactDeleteErr);
                }

                // Set assertions
                (customercontactDeleteRes.body._id).should.equal(customercontactSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Customercontact if not signed in', function (done) {
    // Set Customercontact user
    customercontact.user = user;

    // Create new Customercontact model instance
    var customercontactObj = new Customercontact(customercontact);

    // Save the Customercontact
    customercontactObj.save(function () {
      // Try deleting Customercontact
      request(app).delete('/api/customercontacts/' + customercontactObj._id)
        .expect(403)
        .end(function (customercontactDeleteErr, customercontactDeleteRes) {
          // Set message assertion
          (customercontactDeleteRes.body.message).should.match('User is not authorized');

          // Handle Customercontact error error
          done(customercontactDeleteErr);
        });

    });
  });

  it('should be able to get a single Customercontact that has an orphaned user reference', function (done) {
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

          // Save a new Customercontact
          agent.post('/api/customercontacts')
            .send(customercontact)
            .expect(200)
            .end(function (customercontactSaveErr, customercontactSaveRes) {
              // Handle Customercontact save error
              if (customercontactSaveErr) {
                return done(customercontactSaveErr);
              }

              // Set assertions on new Customercontact
              (customercontactSaveRes.body.name).should.equal(customercontact.name);
              should.exist(customercontactSaveRes.body.user);
              should.equal(customercontactSaveRes.body.user._id, orphanId);

              // force the Customercontact to have an orphaned user reference
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

                    // Get the Customercontact
                    agent.get('/api/customercontacts/' + customercontactSaveRes.body._id)
                      .expect(200)
                      .end(function (customercontactInfoErr, customercontactInfoRes) {
                        // Handle Customercontact error
                        if (customercontactInfoErr) {
                          return done(customercontactInfoErr);
                        }

                        // Set assertions
                        (customercontactInfoRes.body._id).should.equal(customercontactSaveRes.body._id);
                        (customercontactInfoRes.body.name).should.equal(customercontact.name);
                        should.equal(customercontactInfoRes.body.user, undefined);

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
      Customercontact.remove().exec(done);
    });
  });
});
