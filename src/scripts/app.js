angular
    .module('managerModule', ['tournamentModule', 'ngMaterial', 'ui.bootstrap'])
    .config(function($mdThemingProvider) {
          $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
    });;
angular.module('tournamentModule', []);