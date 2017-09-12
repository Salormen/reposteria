angular.module('tournamentModule').directive('group', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'GroupDirectiveController',
        scope: {
            currentContext: '=currentContext',
            currentGroup: '=currentGroup'
        },
        templateUrl: 'scripts/directives/group/group.directive.tmpl.html'
      };
        
}]);