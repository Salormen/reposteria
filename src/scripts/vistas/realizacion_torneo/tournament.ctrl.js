(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('TournamentController',  
                ['$scope', '$rootScope', '$state', '$stateParams', 'tournament_dao',
        function($scope, $rootScope, $state, $stateParams, tournament_dao){

        /******************************************/
        
        function load_tournament(){
            $scope.torneo = tournament_dao.get_by_id($stateParams.id);
        }
                    
        load_tournament();
            
        $rootScope.$on('tournamentSaved', function(event, message) {
            console.log("actualizando controller");
            load_tournament();
        });
        
        
                
        $scope.countMatchesReadyToPlayAllBrackets = function(){
            if($scope.seeded){
                var mrtp = bracket_functions.matchesReadyToPlayAllBrackets($scope.torneo.brackets).length;
                (mrtp == 0)? "": "("+ mrtp +")";
            }else{
                return "";
            }
        }
        
/*
        $scope.matchesReadyToPlayRound = function(bracket, round){
            if($scope.seeded){
                var mrtp = $scope.bracket_funcs.round_n($scope.torneo.brackets[bracket], round).reduce((rc,m) => 
                            rc+m.readyToPlay,0);
                if (mrtp == 0){
                    return "";
                }else{
                    return "("+ mrtp +")";
                }
            }else{
                return "";
            }
        }
        */
        
            



        
      }])
})()