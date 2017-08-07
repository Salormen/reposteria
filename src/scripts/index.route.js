(function() {
  'use strict';

  angular
    .module('chasqui')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('principal', {
        url: '/',
        templateUrl: 'scripts/vistas/managing_torneos/template.html',
        controller: 'SeleccionTorneoController',
        controllerAs: 'seleccionTorneoController'
      }) 
      .state('torneo', {
        url: '/torneo',
        templateUrl: 'scripts/vistas/realizacion_torneo/template.html',
        controller: 'TournamentController',
        controllerAs: 'tournamentController'
      })

      ;

    $urlRouterProvider.otherwise('/');
  }

})();