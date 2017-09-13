(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('SingUpController',  
                ['$scope', '$state', '$stateParams', 'tournament_dao', 'tmt_parser', 'list_players_dao', 'tournament_seeder',
        function($scope, $state, $stateParams, tournament_dao, tmt_parser, list_players_dao, tournament_seeder){

        /******************************************/

        //Configuracion
            
        $scope.torneo = tournament_dao.get_by_id($stateParams.id);
            
        console.log("Torneo recibido: ", $scope.torneo);
            
            
            
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
            
            
        $scope.searchPlayer = function(searchedPlayer){
            init_previous_players();
            console.log(searchedPlayer);
            $scope.jugadores_previos = $scope.jugadores_previos.filter(p => 
                        (p.tmt_id.includes(searchedPlayer.id.toString()) && searchedPlayer.id != "") ||
                        (p.club_largo.toLowerCase().includes(searchedPlayer.club.toLowerCase()) && searchedPlayer.club != "") ||
                        (p.apellido.toLowerCase().includes(searchedPlayer.apellido.toLowerCase()) && searchedPlayer.apellido != "")
                                                                       );
        }
        
        
        $scope.searchedPlayer = {
            apellido: "",
            club: "",
            id: ""
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

            
        // Sortear jugador

        $scope.seed_tournament = function(){
            $scope.torneo = tournament_seeder.seed($scope.torneo);
            tournament_dao.save($scope.torneo);
            alert("Sorteo realizado!");
        };


}])})()