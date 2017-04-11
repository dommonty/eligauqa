'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Squadoutcome = mongoose.model('Squadoutcome');

/**
 * Globals
 */
var user, squadoutcome;

/**
 * Unit tests
 */
describe('Squadoutcome Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      squadoutcome = new Squadoutcome({
        name: 'Squadoutcome Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return squadoutcome.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      squadoutcome.name = '';

      return squadoutcome.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Squadoutcome.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
