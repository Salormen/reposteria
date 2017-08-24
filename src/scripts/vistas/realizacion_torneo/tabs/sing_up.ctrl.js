(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('SingUpController',  
                ['$scope', '$state', '$stateParams', 'tournament_dao', 'tmt_parser', 'list_players_dao',
        function($scope, $state, $stateParams, tournament_dao, tmt_parser, list_players_dao){

        /******************************************/

        //Configuracion
            
        $scope.torneo = tournament_dao.get_by_id($stateParams.id);
            
        console.log("Torneo recibido: ", $scope.torneo.name);
            
            
        $scope.go_main_menu = function(){
            $state.go("principal", {});
        }
            
        $scope.agregarTodos = function(){
            $scope.torneo.players = $scope.jugadores_previos.slice(0,16);
            $scope.seed_tournament();
        }


        /////////////////////////////////////////////

        // Frame Inscripcion
        
        function init_previous_players(){
            $scope.jugadores_previos = list_players_dao.get();   
        }
        
        init_previous_players();
        
        tmt_parser.createListener('input_file');      

        $scope.load_previous_players = function(){
            list_players_dao.save(tmt_parser.getValue());
            init_previous_players();
        }

        $scope.inscribirJugador = function(jugador){
            if(!$scope.torneo.players.includes(jugador)){
                $scope.torneo.players.push(jugador);                    
            }
            document.getElementById(jugador.rating + jugador.nombre + jugador.club).className = "success";
        }

        $scope.searchedPlayer = {
            nombre: "",
            club: ""
        }

        $scope.searchedInscriptedPlayer = {
            nombre: "",
            club: ""
        }

        $scope.nuevo_jugador = {
            nombre: "",
            club: "",
            rating: 0
        };


        $scope.reset_nuevo_jugador = function(){
            $scope.nuevo_jugador = {
                nombre: "",
                club: "",
                rating: 0
            }      
        };

        $scope.agregarNuevoJugador = function(){
            $scope.torneo.players.push($scope.nuevo_jugador);
            $scope.reset_nuevo_jugador();
        };    

        $scope.eliminarJugador = (jugador, jugadores) => {
            jugadores.splice(jugadores.indexOf(jugador), 1);
            document.getElementById(jugador.rating + jugador.nombre + jugador.club).classList.remove("success");
        };


        $scope.seed_tournament = function(){
            $scope.torneo.seed();

            reset_grupos_mostrados();   
            reset_showed_bracket();

            $scope.seeded = true;
            alert("Sorteo concluido!");
        };


}])})()