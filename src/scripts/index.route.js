(function() {
  'use strict';

  angular
    .module('managerModule')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('principal', {
        url: '/',
        templateUrl: 'scripts/vistas/managing_torneos/managing_tournaments.tmp.html',
        controller: 'SeleccionTorneoController'
      }) 
      .state('torneo', {
        url: '/torneo',
        params: {
            tournament: ""
        },
        templateUrl: 'scripts/vistas/realizacion_torneo/tournament.tmp.html',
        controller: 'TournamentController'
      })

      ;

    $urlRouterProvider.otherwise('/');
  }

})();