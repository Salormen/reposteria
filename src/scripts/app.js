angular
    .module('managerModule', ['tournamentModule', 'ui.router', 'ngMaterial', 'ui.bootstrap'])
    .config(function($mdThemingProvider) {
          $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
    });
angular.module('tournamentModule', []);