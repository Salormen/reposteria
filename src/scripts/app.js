angular
    .module('managerModule', ['tournamentModule', 'ui.router', 'ngMaterial', 'ui.bootstrap'])
    .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('dark-blue')
                .backgroundPalette('blue').dark();
            $mdThemingProvider.theme('default')
                .primaryPalette('indigo')
                .accentPalette('red')
                .warnPalette('red');
    });
angular.module('tournamentModule', []);