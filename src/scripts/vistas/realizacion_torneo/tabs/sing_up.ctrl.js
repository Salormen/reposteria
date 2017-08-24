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

        function noEstaInscriptoATorneo(torneo, jugador){
            var inscripto = torneo.players.reduce((r,p) => r || (p.rating == jugador.rating 
                                                    && p.apellido == jugador.apellido
                                                    && p.nombre == jugador.nombre 
                                                    && p.club_largo == jugador.club_largo), false);
            console.log("inscripto ", inscripto);
            return !inscripto;
        }
            
        $scope.inscribirJugador = function(jugador){
            console.log("Inscribir jugador ", jugador, " al torneo ", $scope.torneo);
            if(noEstaInscriptoATorneo($scope.torneo, jugador)){
                $scope.torneo.players.push(jugador);     
                tournament_dao.save($scope.torneo);
            }
        }

        $scope.eliminarJugador = (jugador, jugadores) => {
            jugadores.splice(jugadores.indexOf(jugador), 1);    
            tournament_dao.save($scope.torneo);
        };

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


        $scope.seed_tournament = function(){
            $scope.torneo.seed();

            reset_grupos_mostrados();   
            reset_showed_bracket();

            $scope.seeded = true;
            alert("Sorteo concluido!");
        };


}])})()