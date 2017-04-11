(function () {
  'use strict';

  angular
    .module('opportunitynotes')
    .controller('OpportunityNotesTimeLineController', OpportunityNotesTimeLineController);

  OpportunityNotesTimeLineController.$inject = [ '$scope', '$filter', '$stateParams', '$moment', 'OpportunitiesService', 'OpportunitynotesService', 'OpportunityactionsService', 'customerResolve' ];

  function OpportunityNotesTimeLineController($scope, $filter, $stateParams, $moment, OpportunitiesService, OpportunitynotesService, OpportunityactionsService, customer) {
    var vm = this;

    vm.customer = customer;
    vm.showFullContentForEvent = showFullContentForEvent;

    init();

    function init() {
      OpportunitiesService.query({customerId: customer._id}, function (opportunities) {
        vm.events = [];
        angular.forEach(opportunities, function (eachOpportunity) {
          OpportunitynotesService.query({opportunityId: eachOpportunity._id}, function (notes) {
            angular.forEach(notes, function (eachNote) {
              vm.events.push({
                time: eachNote.created,
                badgeClass: 'info',
                badgeIconClass: 'glyphicon-usd  ',
                title: eachOpportunity.name,
                timeFromNow: $moment(new Date(eachNote.created)).fromNow(),
                content: eachNote.note.substring(0, 200),
                fullContent: eachNote.note,
                user: eachNote.user,
                type: 'Note'
              });
            });
          });
          OpportunityactionsService.query({ opportunityId: eachOpportunity._id }, function (actions) {
            angular.forEach(actions, function (eachAction) {
              vm.events.push({
                time: eachAction.created,
                badgeClass: 'info',
                badgeIconClass: 'glyphicon-tasks',
                title: eachAction.name,
                timeFromNow: $moment(new Date(eachAction.created)).fromNow(),
                content: eachAction.description.substring(0, 200),
                fullContent: eachAction.description,
                user: eachAction.user,
                type: 'Action'
              });
            });
          });
        });
      });
    }

    function showFullContentForEvent(event, moreOrLess) {
      event.showFull = moreOrLess;
    }
  }
})();
