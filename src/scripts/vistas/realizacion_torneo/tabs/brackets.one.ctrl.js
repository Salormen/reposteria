(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('BracketController',  
                ['$scope', '$state', '$stateParams', 'tournament_dao', 'bracketFunctions', 'matchesFunctions', 'other_functions', 'print_bracket_matches',
        function($scope, $state, $stateParams, tournament_dao, bracket_functions, matches_functions, other_functions, printer){

        /******************************************/
        
        var context = {};

        //Configuracion
            
        $scope.torneo = tournament_dao.get_by_id($stateParams.id);
        context.torneo = $scope.torneo;
            
        $scope.llave = parseInt($stateParams.llave_id);
            
        $scope.round_matches = function(round){
            return bracket_functions.round_n($scope.torneo.brackets[$stateParams.llave_id], round);
        }
            
        console.log("Torneo recibido: ", $scope.torneo);
            
         
        //////////////////////////
        ///// frame llave ////////
        //////////////////////////

            
        context.is_bye_match = matches_functions.is_bye_match;
            
        context.getPlayerName = matches_functions.getPlayerName;
        
        context.canEdit = function(){
            return true;
        }
        
        context.saveMatch = function(match, callback){
            if(isValidMatch(match)){
                tournament_dao.save($scope.torneo);
                callback();
            }else{
                alert('El partido ');   
            }
            console.log($scope.torneo.brackets[0]);
        }
        
        function isValidMatch(match){
            return true; // TODO
        }
        
        // Print matches
        
        $scope.matches_for_print = [];
            
        context.imprimible = true;    

        context.print_match = function (match, round){
            if($scope.matches_for_print.length == 4){
                alert('Solo se permiten imprimir 4 partidos por vez.\nPor favor, imprima los partidos seleccionados \npara poder seguir agregando partidos a la impresión.');
            }else{
                match.round = $scope.round_name(round);
                match.bracket = $scope.bracket_name($scope.llave);
                $scope.matches_for_print.push(match);
            }
        }

        $scope.print_matches = function(){
            console.log($scope.matches_for_print);
            printer.print_bracket_matches($scope.torneo, $scope.matches_for_print);     
            $scope.matches_for_print = [];
        }


        $scope.context = context;
            
            
        // Submenu
            
        $scope.tournament_rounds = function(bracket_id){
            return bracket_functions.count_rounds($scope.torneo.brackets[bracket_id]);
        }
        
        $scope.rounds_numbers = function(rounds){
            return other_functions.nList(0, rounds - 1).reverse();
        }
        
        $scope.round_name = round_number => {
            switch(round_number){
                case 0: return "Final";
                case 1: return "Semifinales";
                case 2: return "4tos de final";
                case 3: return "8vos de final";
                case 4: return "16vos de final ";
                case 5: return "32vos de final ";
                case 6: return "64vos de final ";
            }
        }

        $scope.bracket_name = bracket_n => {
            switch(bracket_n){
                case 0: return "Llave A";
                case 1: return "Llave B";
            }   
        }
}])})()