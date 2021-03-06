(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('BracketsController',  
                ['$scope', '$state', '$stateParams', 'tournament_dao', 'bracketFunctions', 'other_functions',
        function($scope, $state, $stateParams, tournament_dao, bracket_functions, other_functions){

        /******************************************/
        
        var context = {};

        //Configuracion
            
        $scope.torneo = tournament_dao.get_by_id($stateParams.id);
        context.torneo = $scope.torneo;
            
            
        console.log("Torneo recibido: ", $scope.torneo);
            
         
        //////////////////////////
        ///// frame llave ////////
        //////////////////////////

        // Print matches
        
        $scope.matches_for_print = [];

        $scope.print_match = function (match){
            if($scope.matches_for_print.length == 4){
                alert('Solo se permiten imprimir 4 partidos por vez.\nPor favor, imprima los partidos seleccionados \npara poder seguir agregando partidos a la impresión.');
            }else{
                match.round = $scope.round_name($scope.selected_round);
                match.bracket = $scope.bracket_name($scope.selected_bracket);
                $scope.matches_for_print.push(match);
            }
        }

        $scope.print_matches = function(){
            printer.print_bracket_matches($scope.torneo, $scope.matches_for_print);     
            $scope.matches_for_print = [];
        }


        $scope.context = context;
        
}])})()