(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('SingUpController',  
                ['$scope', '$state', '$stateParams', 'tournament_dao', 'tmt_parser', 'list_players_dao', 'tournament_seeder', '$modal',
        function($scope, $state, $stateParams, tournament_dao, tmt_parser, list_players_dao, tournament_seeder, $modal){

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
        
        $scope.init_previous_players = function(){
            $scope.jugadores_previos = list_players_dao.get();   
        }
        
        $scope.init_previous_players();

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
            $scope.init_previous_players();
            console.log(searchedPlayer);
            $scope.jugadores_previos = $scope.jugadores_previos.filter(p => 
                        (p.id.includes(searchedPlayer.id.toString()) && searchedPlayer.id != "") ||
                        (p.club_largo.toLowerCase().includes(searchedPlayer.club.toLowerCase()) && searchedPlayer.club != "") ||
                        (p.apellido.toLowerCase().includes(searchedPlayer.apellido.toLowerCase()) && searchedPlayer.apellido != "") ||
                        (searchedPlayer.id == "" && searchedPlayer.club == "" && searchedPlayer.apellido == "")  
                                                                      );
        }
        
        
        $scope.searchedPlayer = {
            apellido: "",
            club: "",
            id: ""
        }
            
            
        // Sortear jugador

        $scope.seed_tournament = function(){
            $scope.torneo = tournament_seeder.seed($scope.torneo);
            tournament_dao.save($scope.torneo);
            alert("Sorteo realizado!");
        };

        
        // Nuevo jugador
            
        $scope.newPlayer = function(){
            var modalInstance = $modal.open({
                    templateUrl: 'scripts/vistas/realizacion_torneo/tabs/new_player.tmpl.html',
                    controller: ModalInstanceCtrl,
                    scope: $scope,
                    resolve: {
                        userForm: function () {
                            return $scope.userForm;
                        }
                    }
            });

            modalInstance.result.then(function (selectedItem) {
                console.log(selectedItem);
                $scope.selected = selectedItem;
            }, function () {
                console.log('Modal dismissed at: ', new Date());
            });

        }
            
            
        var ModalInstanceCtrl = function ($scope, $modalInstance, userForm, build_tournament, tournament_dao) {
            
            console.log("Modal", $scope.torneo);
            $scope.form = {};
            
            $scope.new_player = {
                apellido: "",
                nombre: "",
                id: "999999",
                rating: 0,
                club_corto: "",
                club_largo: ""
            }
            
            $scope.submitForm = function () {
                if ($scope.form.userForm.$valid) {
                    
                    $scope.torneo.players.push($scope.new_player);     
                    tournament_dao.save($scope.torneo);
                    console.log("Modal", $scope.torneo);
                    
                    $scope.init_previous_players();

                    $modalInstance.close('');
                } else {
                    console.log('userform is not in scope');
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }
            
    }])
   
})()