'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cost = mongoose.model('Cost'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, cost;

/**
 * Cost routes tests
 */
describe('Cost CRUD tests', function () {

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

    // Save a user to the test db and create new Cost
    user.save(function () {
      cost = {
        name: 'Cost name'
      };

      done();
    });
  });

  it('should be able to save a Cost if logged in', function (done) {
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

        // Save a new Cost
        agent.post('/api/costs')
          .send(cost)
          .expect(200)
          .end(function (costSaveErr, costSaveRes) {
            // Handle Cost save error
            if (costSaveErr) {
              return done(costSaveErr);
            }

            // Get a list of Costs
            agent.get('/api/costs')
              .end(function (costsGetErr, costsGetRes) {
                // Handle Cost save error
                if (costsGetErr) {
                  return done(costsGetErr);
                }

                // Get Costs list
                var costs = costsGetRes.body;

                // Set assertions
                (costs[0].user._id).should.equal(userId);
                (costs[0].name).should.match('Cost name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Cost if not logged in', function (done) {
    agent.post('/api/costs')
      .send(cost)
      .expect(403)
      .end(function (costSaveErr, costSaveRes) {
        // Call the assertion callback
        done(costSaveErr);
      });
  });

  it('should not be able to save an Cost if no name is provided', function (done) {
    // Invalidate name field
    cost.name = '';

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

        // Save a new Cost
        agent.post('/api/costs')
          .send(cost)
          .expect(400)
          .end(function (costSaveErr, costSaveRes) {
            // Set message assertion
            (costSaveRes.body.message).should.match('Please fill Cost name');

            // Handle Cost save error
            done(costSaveErr);
          });
      });
  });

  it('should be able to update an Cost if signed in', function (done) {
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

        // Save a new Cost
        agent.post('/api/costs')
          .send(cost)
          .expect(200)
          .end(function (costSaveErr, costSaveRes) {
            // Handle Cost save error
            if (costSaveErr) {
              return done(costSaveErr);
            }

            // Update Cost name
            cost.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Cost
            agent.put('/api/costs/' + costSaveRes.body._id)
              .send(cost)
              .expect(200)
              .end(function (costUpdateErr, costUpdateRes) {
                // Handle Cost update error
                if (costUpdateErr) {
                  return done(costUpdateErr);
                }

                // Set assertions
                (costUpdateRes.body._id).should.equal(costSaveRes.body._id);
                (costUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Costs if not signed in', function (done) {
    // Create new Cost model instance
    var costObj = new Cost(cost);

    // Save the cost
    costObj.save(function () {
      // Request Costs
      request(app).get('/api/costs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Cost if not signed in', function (done) {
    // Create new Cost model instance
    var costObj = new Cost(cost);

    // Save the Cost
    costObj.save(function () {
      request(app).get('/api/costs/' + costObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', cost.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Cost with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/costs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Cost is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Cost which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Cost
    request(app).get('/api/costs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Cost with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Cost if signed in', function (done) {
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

        // Save a new Cost
        agent.post('/api/costs')
          .send(cost)
          .expect(200)
          .end(function (costSaveErr, costSaveRes) {
            // Handle Cost save error
            if (costSaveErr) {
              return done(costSaveErr);
            }

            // Delete an existing Cost
            agent.delete('/api/costs/' + costSaveRes.body._id)
              .send(cost)
              .expect(200)
              .end(function (costDeleteErr, costDeleteRes) {
                // Handle cost error error
                if (costDeleteErr) {
                  return done(costDeleteErr);
                }

                // Set assertions
                (costDeleteRes.body._id).should.equal(costSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Cost if not signed in', function (done) {
    // Set Cost user
    cost.user = user;

    // Create new Cost model instance
    var costObj = new Cost(cost);

    // Save the Cost
    costObj.save(function () {
      // Try deleting Cost
      request(app).delete('/api/costs/' + costObj._id)
        .expect(403)
        .end(function (costDeleteErr, costDeleteRes) {
          // Set message assertion
          (costDeleteRes.body.message).should.match('User is not authorized');

          // Handle Cost error error
          done(costDeleteErr);
        });

    });
  });

  it('should be able to get a single Cost that has an orphaned user reference', function (done) {
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

          // Save a new Cost
          agent.post('/api/costs')
            .send(cost)
            .expect(200)
            .end(function (costSaveErr, costSaveRes) {
              // Handle Cost save error
              if (costSaveErr) {
                return done(costSaveErr);
              }

              // Set assertions on new Cost
              (costSaveRes.body.name).should.equal(cost.name);
              should.exist(costSaveRes.body.user);
              should.equal(costSaveRes.body.user._id, orphanId);

              // force the Cost to have an orphaned user reference
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

                    // Get the Cost
                    agent.get('/api/costs/' + costSaveRes.body._id)
                      .expect(200)
                      .end(function (costInfoErr, costInfoRes) {
                        // Handle Cost error
                        if (costInfoErr) {
                          return done(costInfoErr);
                        }

                        // Set assertions
                        (costInfoRes.body._id).should.equal(costSaveRes.body._id);
                        (costInfoRes.body.name).should.equal(cost.name);
                        should.equal(costInfoRes.body.user, undefined);

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
      Cost.remove().exec(done);
    });
  });
});
