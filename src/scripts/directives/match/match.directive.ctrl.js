(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('MatchDirectiveController',  
                ['$scope',
        function($scope){

            $scope.editting = false;
            
            $scope.editMatch = function(){
                 $scope.editting = !$scope.editting;
            }
            
            $scope.saveMatch = function(context, match){
                context.saveMatch(match, function(){
                    $scope.editting = !$scope.editting;    
                });
            }
            
}])})()