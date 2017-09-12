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
        url: '/torneo/:id',
        templateUrl: 'scripts/vistas/realizacion_torneo/tournament.tmpl.html',
        controller: 'TournamentController'
      })
      
          .state('torneo.inscripcion', {
            url: '/inscripcion',
            templateUrl: 'scripts/vistas/realizacion_torneo/tabs/sing_up.tmpl.html',
            controller: 'SingUpController'
          })
          .state('torneo.grupos', {
            url: '/grupos',
            templateUrl: 'scripts/vistas/realizacion_torneo/tabs/groups.tmpl.html',
            controller: 'GroupsController'
          })
              .state('torneo.grupos.all', {
                url: '/todos',
                templateUrl: 'scripts/vistas/realizacion_torneo/tabs/groups.all.tmpl.html',
                controller: 'GroupsController'
              })
              .state('torneo.grupos.grupo', {
                url: '/grupo/:group_id',
                templateUrl: 'scripts/vistas/realizacion_torneo/tabs/groups.one.tmpl.html',
                controller: 'GroupsController'
              })

      
          .state('torneo.llaves', {
            url: '/llave',
            templateUrl: 'scripts/vistas/realizacion_torneo/tabs/brackets.tmpl.html',
            controller: 'BracketsController'
          })
              .state('torneo.llaves.llave', {
                url: '/:llave_id',
                templateUrl: 'scripts/vistas/realizacion_torneo/tabs/brackets.one.tmpl.html',
                controller: 'BracketController'
              })
      
      
          .state('torneo.modo_rapido', {
            url: '/rapido',
            templateUrl: 'scripts/vistas/realizacion_torneo/tabs/fast_mode.tmpl.html',
            controller: 'TournamentController'
          })
          .state('torneo.impresiones', {
            url: '/impresiones',
            templateUrl: 'scripts/vistas/realizacion_torneo/tabs/printer.tmpl.html',
            controller: 'TournamentController'
          })
          .state('torneo.descargas', {
            url: '/descargas',
            templateUrl: 'scripts/vistas/realizacion_torneo/tabs/downloads.tmpl.html',
            controller: 'DownloadsController'
          })
      ;

    $urlRouterProvider.otherwise('/');
  }

})();