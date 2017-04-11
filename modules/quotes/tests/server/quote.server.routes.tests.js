'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Quote = mongoose.model('Quote'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, quote;

/**
 * Quote routes tests
 */
describe('Quote CRUD tests', function () {

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

    // Save a user to the test db and create new Quote
    user.save(function () {
      quote = {
        name: 'Quote name'
      };

      done();
    });
  });

  it('should be able to save a Quote if logged in', function (done) {
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

        // Save a new Quote
        agent.post('/api/quotes')
          .send(quote)
          .expect(200)
          .end(function (quoteSaveErr, quoteSaveRes) {
            // Handle Quote save error
            if (quoteSaveErr) {
              return done(quoteSaveErr);
            }

            // Get a list of Quotes
            agent.get('/api/quotes')
              .end(function (quotesGetErr, quotesGetRes) {
                // Handle Quote save error
                if (quotesGetErr) {
                  return done(quotesGetErr);
                }

                // Get Quotes list
                var quotes = quotesGetRes.body;

                // Set assertions
                (quotes[0].user._id).should.equal(userId);
                (quotes[0].name).should.match('Quote name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Quote if not logged in', function (done) {
    agent.post('/api/quotes')
      .send(quote)
      .expect(403)
      .end(function (quoteSaveErr, quoteSaveRes) {
        // Call the assertion callback
        done(quoteSaveErr);
      });
  });

  it('should not be able to save an Quote if no name is provided', function (done) {
    // Invalidate name field
    quote.name = '';

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

        // Save a new Quote
        agent.post('/api/quotes')
          .send(quote)
          .expect(400)
          .end(function (quoteSaveErr, quoteSaveRes) {
            // Set message assertion
            (quoteSaveRes.body.message).should.match('Please fill Quote name');

            // Handle Quote save error
            done(quoteSaveErr);
          });
      });
  });

  it('should be able to update an Quote if signed in', function (done) {
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

        // Save a new Quote
        agent.post('/api/quotes')
          .send(quote)
          .expect(200)
          .end(function (quoteSaveErr, quoteSaveRes) {
            // Handle Quote save error
            if (quoteSaveErr) {
              return done(quoteSaveErr);
            }

            // Update Quote name
            quote.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Quote
            agent.put('/api/quotes/' + quoteSaveRes.body._id)
              .send(quote)
              .expect(200)
              .end(function (quoteUpdateErr, quoteUpdateRes) {
                // Handle Quote update error
                if (quoteUpdateErr) {
                  return done(quoteUpdateErr);
                }

                // Set assertions
                (quoteUpdateRes.body._id).should.equal(quoteSaveRes.body._id);
                (quoteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Quotes if not signed in', function (done) {
    // Create new Quote model instance
    var quoteObj = new Quote(quote);

    // Save the quote
    quoteObj.save(function () {
      // Request Quotes
      request(app).get('/api/quotes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Quote if not signed in', function (done) {
    // Create new Quote model instance
    var quoteObj = new Quote(quote);

    // Save the Quote
    quoteObj.save(function () {
      request(app).get('/api/quotes/' + quoteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', quote.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Quote with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/quotes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Quote is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Quote which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Quote
    request(app).get('/api/quotes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Quote with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Quote if signed in', function (done) {
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

        // Save a new Quote
        agent.post('/api/quotes')
          .send(quote)
          .expect(200)
          .end(function (quoteSaveErr, quoteSaveRes) {
            // Handle Quote save error
            if (quoteSaveErr) {
              return done(quoteSaveErr);
            }

            // Delete an existing Quote
            agent.delete('/api/quotes/' + quoteSaveRes.body._id)
              .send(quote)
              .expect(200)
              .end(function (quoteDeleteErr, quoteDeleteRes) {
                // Handle quote error error
                if (quoteDeleteErr) {
                  return done(quoteDeleteErr);
                }

                // Set assertions
                (quoteDeleteRes.body._id).should.equal(quoteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Quote if not signed in', function (done) {
    // Set Quote user
    quote.user = user;

    // Create new Quote model instance
    var quoteObj = new Quote(quote);

    // Save the Quote
    quoteObj.save(function () {
      // Try deleting Quote
      request(app).delete('/api/quotes/' + quoteObj._id)
        .expect(403)
        .end(function (quoteDeleteErr, quoteDeleteRes) {
          // Set message assertion
          (quoteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Quote error error
          done(quoteDeleteErr);
        });

    });
  });

  it('should be able to get a single Quote that has an orphaned user reference', function (done) {
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

          // Save a new Quote
          agent.post('/api/quotes')
            .send(quote)
            .expect(200)
            .end(function (quoteSaveErr, quoteSaveRes) {
              // Handle Quote save error
              if (quoteSaveErr) {
                return done(quoteSaveErr);
              }

              // Set assertions on new Quote
              (quoteSaveRes.body.name).should.equal(quote.name);
              should.exist(quoteSaveRes.body.user);
              should.equal(quoteSaveRes.body.user._id, orphanId);

              // force the Quote to have an orphaned user reference
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

                    // Get the Quote
                    agent.get('/api/quotes/' + quoteSaveRes.body._id)
                      .expect(200)
                      .end(function (quoteInfoErr, quoteInfoRes) {
                        // Handle Quote error
                        if (quoteInfoErr) {
                          return done(quoteInfoErr);
                        }

                        // Set assertions
                        (quoteInfoRes.body._id).should.equal(quoteSaveRes.body._id);
                        (quoteInfoRes.body.name).should.equal(quote.name);
                        should.equal(quoteInfoRes.body.user, undefined);

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
      Quote.remove().exec(done);
    });
  });
});
