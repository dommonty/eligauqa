// 'use strict';
//
// var should = require('should'),
//   request = require('supertest'),
//   path = require('path'),
//   mongoose = require('mongoose'),
//   User = mongoose.model('User'),
//   Location = mongoose.model('Location'),
//   express = require(path.resolve('./config/lib/express'));
//
// /**
//  * Globals
//  */
// var app, agent, credentials, user, location;
//
// /**
//  * Location routes tests
//  */
// describe('Location CRUD tests', function () {
//
//   before(function (done) {
//     // Get application
//     app = express.init(mongoose);
//     agent = request.agent(app);
//
//     done();
//   });
//
//   beforeEach(function (done) {
//     // Create user credentials
//     credentials = {
//       username: 'username',
//       password: 'M3@n.jsI$Aw3$0m3'
//     };
//
//     // Create a new user
//     user = new User({
//       firstName: 'Full',
//       lastName: 'Name',
//       displayName: 'Full Name',
//       email: 'test@test.com',
//       username: credentials.username,
//       password: credentials.password,
//       provider: 'local'
//     });
//
//     // Save a user to the test db and create new Location
//     user.save(function () {
//       location = {
//         name: 'Location name'
//       };
//
//       done();
//     });
//   });
//
//   it('should be able to save a Location if logged in', function (done) {
//     agent.post('/api/auth/signin')
//       .send(credentials)
//       .expect(200)
//       .end(function (signinErr, signinRes) {
//         // Handle signin error
//         if (signinErr) {
//           return done(signinErr);
//         }
//
//         // Get the userId
//         var userId = user.id;
//
//         // Save a new Location
//         agent.post('/api/locations')
//           .send(location)
//           .expect(200)
//           .end(function (locationSaveErr, locationSaveRes) {
//             // Handle Location save error
//             if (locationSaveErr) {
//               return done(locationSaveErr);
//             }
//
//             // Get a list of Locations
//             agent.get('/api/locations')
//               .end(function (locationsGetErr, locationsGetRes) {
//                 // Handle Location save error
//                 if (locationsGetErr) {
//                   return done(locationsGetErr);
//                 }
//
//                 // Get Locations list
//                 var locations = locationsGetRes.body;
//
//                 // Set assertions
//                 (locations[0].user._id).should.equal(userId);
//                 (locations[0].name).should.match('Location name');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to save an Location if not logged in', function (done) {
//     agent.post('/api/locations')
//       .send(location)
//       .expect(403)
//       .end(function (locationSaveErr, locationSaveRes) {
//         // Call the assertion callback
//         done(locationSaveErr);
//       });
//   });
//
//   it('should not be able to save an Location if no name is provided', function (done) {
//     // Invalidate name field
//     location.name = '';
//
//     agent.post('/api/auth/signin')
//       .send(credentials)
//       .expect(200)
//       .end(function (signinErr, signinRes) {
//         // Handle signin error
//         if (signinErr) {
//           return done(signinErr);
//         }
//
//         // Get the userId
//         var userId = user.id;
//
//         // Save a new Location
//         agent.post('/api/locations')
//           .send(location)
//           .expect(400)
//           .end(function (locationSaveErr, locationSaveRes) {
//             // Set message assertion
//             (locationSaveRes.body.message).should.match('Please fill Location name');
//
//             // Handle Location save error
//             done(locationSaveErr);
//           });
//       });
//   });
//
//   it('should be able to update an Location if signed in', function (done) {
//     agent.post('/api/auth/signin')
//       .send(credentials)
//       .expect(200)
//       .end(function (signinErr, signinRes) {
//         // Handle signin error
//         if (signinErr) {
//           return done(signinErr);
//         }
//
//         // Get the userId
//         var userId = user.id;
//
//         // Save a new Location
//         agent.post('/api/locations')
//           .send(location)
//           .expect(200)
//           .end(function (locationSaveErr, locationSaveRes) {
//             // Handle Location save error
//             if (locationSaveErr) {
//               return done(locationSaveErr);
//             }
//
//             // Update Location name
//             location.name = 'WHY YOU GOTTA BE SO MEAN?';
//
//             // Update an existing Location
//             agent.put('/api/locations/' + locationSaveRes.body._id)
//               .send(location)
//               .expect(200)
//               .end(function (locationUpdateErr, locationUpdateRes) {
//                 // Handle Location update error
//                 if (locationUpdateErr) {
//                   return done(locationUpdateErr);
//                 }
//
//                 // Set assertions
//                 (locationUpdateRes.body._id).should.equal(locationSaveRes.body._id);
//                 (locationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should be able to get a list of Locations if not signed in', function (done) {
//     // Create new Location model instance
//     var locationObj = new Location(location);
//
//     // Save the location
//     locationObj.save(function () {
//       // Request Locations
//       request(app).get('/api/locations')
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Array).and.have.lengthOf(1);
//
//           // Call the assertion callback
//           done();
//         });
//
//     });
//   });
//
//   it('should be able to get a single Location if not signed in', function (done) {
//     // Create new Location model instance
//     var locationObj = new Location(location);
//
//     // Save the Location
//     locationObj.save(function () {
//       request(app).get('/api/locations/' + locationObj._id)
//         .end(function (req, res) {
//           // Set assertion
//           res.body.should.be.instanceof(Object).and.have.property('name', location.name);
//
//           // Call the assertion callback
//           done();
//         });
//     });
//   });
//
//   it('should return proper error for single Location with an invalid Id, if not signed in', function (done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/locations/test')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Location is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Location which doesnt exist, if not signed in', function (done) {
//     // This is a valid mongoose Id but a non-existent Location
//     request(app).get('/api/locations/559e9cd815f80b4c256a8f41')
//       .end(function (req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Location with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should be able to delete an Location if signed in', function (done) {
//     agent.post('/api/auth/signin')
//       .send(credentials)
//       .expect(200)
//       .end(function (signinErr, signinRes) {
//         // Handle signin error
//         if (signinErr) {
//           return done(signinErr);
//         }
//
//         // Get the userId
//         var userId = user.id;
//
//         // Save a new Location
//         agent.post('/api/locations')
//           .send(location)
//           .expect(200)
//           .end(function (locationSaveErr, locationSaveRes) {
//             // Handle Location save error
//             if (locationSaveErr) {
//               return done(locationSaveErr);
//             }
//
//             // Delete an existing Location
//             agent.delete('/api/locations/' + locationSaveRes.body._id)
//               .send(location)
//               .expect(200)
//               .end(function (locationDeleteErr, locationDeleteRes) {
//                 // Handle location error error
//                 if (locationDeleteErr) {
//                   return done(locationDeleteErr);
//                 }
//
//                 // Set assertions
//                 (locationDeleteRes.body._id).should.equal(locationSaveRes.body._id);
//
//                 // Call the assertion callback
//                 done();
//               });
//           });
//       });
//   });
//
//   it('should not be able to delete an Location if not signed in', function (done) {
//     // Set Location user
//     location.user = user;
//
//     // Create new Location model instance
//     var locationObj = new Location(location);
//
//     // Save the Location
//     locationObj.save(function () {
//       // Try deleting Location
//       request(app).delete('/api/locations/' + locationObj._id)
//         .expect(403)
//         .end(function (locationDeleteErr, locationDeleteRes) {
//           // Set message assertion
//           (locationDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Location error error
//           done(locationDeleteErr);
//         });
//
//     });
//   });
//
//   it('should be able to get a single Location that has an orphaned user reference', function (done) {
//     // Create orphan user creds
//     var _creds = {
//       username: 'orphan',
//       password: 'M3@n.jsI$Aw3$0m3'
//     };
//
//     // Create orphan user
//     var _orphan = new User({
//       firstName: 'Full',
//       lastName: 'Name',
//       displayName: 'Full Name',
//       email: 'orphan@test.com',
//       username: _creds.username,
//       password: _creds.password,
//       provider: 'local'
//     });
//
//     _orphan.save(function (err, orphan) {
//       // Handle save error
//       if (err) {
//         return done(err);
//       }
//
//       agent.post('/api/auth/signin')
//         .send(_creds)
//         .expect(200)
//         .end(function (signinErr, signinRes) {
//           // Handle signin error
//           if (signinErr) {
//             return done(signinErr);
//           }
//
//           // Get the userId
//           var orphanId = orphan._id;
//
//           // Save a new Location
//           agent.post('/api/locations')
//             .send(location)
//             .expect(200)
//             .end(function (locationSaveErr, locationSaveRes) {
//               // Handle Location save error
//               if (locationSaveErr) {
//                 return done(locationSaveErr);
//               }
//
//               // Set assertions on new Location
//               (locationSaveRes.body.name).should.equal(location.name);
//               should.exist(locationSaveRes.body.user);
//               should.equal(locationSaveRes.body.user._id, orphanId);
//
//               // force the Location to have an orphaned user reference
//               orphan.remove(function () {
//                 // now signin with valid user
//                 agent.post('/api/auth/signin')
//                   .send(credentials)
//                   .expect(200)
//                   .end(function (err, res) {
//                     // Handle signin error
//                     if (err) {
//                       return done(err);
//                     }
//
//                     // Get the Location
//                     agent.get('/api/locations/' + locationSaveRes.body._id)
//                       .expect(200)
//                       .end(function (locationInfoErr, locationInfoRes) {
//                         // Handle Location error
//                         if (locationInfoErr) {
//                           return done(locationInfoErr);
//                         }
//
//                         // Set assertions
//                         (locationInfoRes.body._id).should.equal(locationSaveRes.body._id);
//                         (locationInfoRes.body.name).should.equal(location.name);
//                         should.equal(locationInfoRes.body.user, undefined);
//
//                         // Call the assertion callback
//                         done();
//                       });
//                   });
//               });
//             });
//         });
//     });
//   });
//
//   afterEach(function (done) {
//     User.remove().exec(function () {
//       Location.remove().exec(done);
//     });
//   });
// });
