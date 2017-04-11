'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Approval = mongoose.model('Approval'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, approval;

/**
 * Approval routes tests
 */
describe('Approval CRUD tests', function () {

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

    // Save a user to the test db and create new Approval
    user.save(function () {
      approval = {
        name: 'Approval name'
      };

      done();
    });
  });

  it('should be able to save a Approval if logged in', function (done) {
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

        // Save a new Approval
        agent.post('/api/approvals')
          .send(approval)
          .expect(200)
          .end(function (approvalSaveErr, approvalSaveRes) {
            // Handle Approval save error
            if (approvalSaveErr) {
              return done(approvalSaveErr);
            }

            // Get a list of Approvals
            agent.get('/api/approvals')
              .end(function (approvalsGetErr, approvalsGetRes) {
                // Handle Approval save error
                if (approvalsGetErr) {
                  return done(approvalsGetErr);
                }

                // Get Approvals list
                var approvals = approvalsGetRes.body;

                // Set assertions
                (approvals[0].user._id).should.equal(userId);
                (approvals[0].name).should.match('Approval name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Approval if not logged in', function (done) {
    agent.post('/api/approvals')
      .send(approval)
      .expect(403)
      .end(function (approvalSaveErr, approvalSaveRes) {
        // Call the assertion callback
        done(approvalSaveErr);
      });
  });

  it('should not be able to save an Approval if no name is provided', function (done) {
    // Invalidate name field
    approval.name = '';

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

        // Save a new Approval
        agent.post('/api/approvals')
          .send(approval)
          .expect(400)
          .end(function (approvalSaveErr, approvalSaveRes) {
            // Set message assertion
            (approvalSaveRes.body.message).should.match('Please fill Approval name');

            // Handle Approval save error
            done(approvalSaveErr);
          });
      });
  });

  it('should be able to update an Approval if signed in', function (done) {
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

        // Save a new Approval
        agent.post('/api/approvals')
          .send(approval)
          .expect(200)
          .end(function (approvalSaveErr, approvalSaveRes) {
            // Handle Approval save error
            if (approvalSaveErr) {
              return done(approvalSaveErr);
            }

            // Update Approval name
            approval.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Approval
            agent.put('/api/approvals/' + approvalSaveRes.body._id)
              .send(approval)
              .expect(200)
              .end(function (approvalUpdateErr, approvalUpdateRes) {
                // Handle Approval update error
                if (approvalUpdateErr) {
                  return done(approvalUpdateErr);
                }

                // Set assertions
                (approvalUpdateRes.body._id).should.equal(approvalSaveRes.body._id);
                (approvalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Approvals if not signed in', function (done) {
    // Create new Approval model instance
    var approvalObj = new Approval(approval);

    // Save the approval
    approvalObj.save(function () {
      // Request Approvals
      request(app).get('/api/approvals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Approval if not signed in', function (done) {
    // Create new Approval model instance
    var approvalObj = new Approval(approval);

    // Save the Approval
    approvalObj.save(function () {
      request(app).get('/api/approvals/' + approvalObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', approval.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Approval with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/approvals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Approval is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Approval which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Approval
    request(app).get('/api/approvals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Approval with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Approval if signed in', function (done) {
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

        // Save a new Approval
        agent.post('/api/approvals')
          .send(approval)
          .expect(200)
          .end(function (approvalSaveErr, approvalSaveRes) {
            // Handle Approval save error
            if (approvalSaveErr) {
              return done(approvalSaveErr);
            }

            // Delete an existing Approval
            agent.delete('/api/approvals/' + approvalSaveRes.body._id)
              .send(approval)
              .expect(200)
              .end(function (approvalDeleteErr, approvalDeleteRes) {
                // Handle approval error error
                if (approvalDeleteErr) {
                  return done(approvalDeleteErr);
                }

                // Set assertions
                (approvalDeleteRes.body._id).should.equal(approvalSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Approval if not signed in', function (done) {
    // Set Approval user
    approval.user = user;

    // Create new Approval model instance
    var approvalObj = new Approval(approval);

    // Save the Approval
    approvalObj.save(function () {
      // Try deleting Approval
      request(app).delete('/api/approvals/' + approvalObj._id)
        .expect(403)
        .end(function (approvalDeleteErr, approvalDeleteRes) {
          // Set message assertion
          (approvalDeleteRes.body.message).should.match('User is not authorized');

          // Handle Approval error error
          done(approvalDeleteErr);
        });

    });
  });

  it('should be able to get a single Approval that has an orphaned user reference', function (done) {
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

          // Save a new Approval
          agent.post('/api/approvals')
            .send(approval)
            .expect(200)
            .end(function (approvalSaveErr, approvalSaveRes) {
              // Handle Approval save error
              if (approvalSaveErr) {
                return done(approvalSaveErr);
              }

              // Set assertions on new Approval
              (approvalSaveRes.body.name).should.equal(approval.name);
              should.exist(approvalSaveRes.body.user);
              should.equal(approvalSaveRes.body.user._id, orphanId);

              // force the Approval to have an orphaned user reference
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

                    // Get the Approval
                    agent.get('/api/approvals/' + approvalSaveRes.body._id)
                      .expect(200)
                      .end(function (approvalInfoErr, approvalInfoRes) {
                        // Handle Approval error
                        if (approvalInfoErr) {
                          return done(approvalInfoErr);
                        }

                        // Set assertions
                        (approvalInfoRes.body._id).should.equal(approvalSaveRes.body._id);
                        (approvalInfoRes.body.name).should.equal(approval.name);
                        should.equal(approvalInfoRes.body.user, undefined);

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
      Approval.remove().exec(done);
    });
  });
});
