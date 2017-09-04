angular.module('tournamentModule').directive('match', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'MatchDirectiveController',
        scope: {
            currentMatch: '=currentMatch',
            context: '=currentContext'
        },
        templateUrl: 'scripts/directives/match.directive.tmpl.html'
      };
        
}]);