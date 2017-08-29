(function(){
  'use strict';

    angular
        .module('tournamentModule')
        .controller('SeleccionTorneoController',  ['$scope', '$modal', '$state', 'build_tournament', 'tournament_dao', 'tmt_parser', SeleccionTorneoController]);

    /** @ngInject */
    function SeleccionTorneoController($scope, $modal, $state, build_tournament, tournament_dao, tmt_parser){
        
        
        $scope.load = function(){
            var id = tournament_dao.save_new(build_tournament("Torneo de muestra ", new Date(2017, 9, 29, 0, 0, 0, 0), {
                    name: "dam_sub15",
                    str_l: "Damas sub 15",
                    str_s: "Dam. sub 15"
                }, {
                    format: "interescuelas",
                    label: "Interescuelas"
                })
            );
            
            var tournament = tournament_dao.get_by_id(id);
            tournament.name += id;
            
            tournament_dao.save(tournament);
            $scope.tournaments = tournament_dao.all();    
        }
        
        
        $scope.tournaments = tournament_dao.all();    
        
                
        tmt_parser.createListener('input_file');      

        $scope.load_previous_players = function(){
            list_players_dao.save(tmt_parser.getValue());
            init_previous_players();
        }

        
        
        $scope.newTournament = function(){


            var modalInstance = $modal.open({
                    templateUrl: 'scripts/vistas/managing_torneos/new_tournament.html',
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
        
        $scope.deleteTournament = function(tournament){
            tournament_dao.remove(tournament);
            $scope.tournaments = tournament_dao.all();
        }
        
    }
    
    var ModalInstanceCtrl = function ($scope, $modalInstance, userForm, build_tournament, format_builders) {
        console.log("ModalInstanceCtrl");
        $scope.form = {}
        
        $scope.tiposDeTorneos = [{
                value: format_builders.getFormat("interescuelas"),
                label: "Interescuelas"
            },{
                value: "TMT",
                label: "TMT"
            },{
                value: "SS",
                label: "Super Serie"
            }            
        ];
        
        $scope.form.category = "";
        $scope.categorias = [{
                value: "TodoCompetidor",
                label: "Todo competidor"
            },{
                value: "Damas",
                label: "Damas"
            },{
                value: "Caballeros",
                label: "Caballeros"
            }
        ];
        
        $scope.todoCompetidor = {
                name: "todo_competidor",
                str_l: "Todo Competidor",
                str_s: "Todo Competidor"
        }
        
        $scope.categorias_damas = [
            {
                name: "dam_sub11",
                str_l: "Damas sub 11",
                str_s: "Dam. sub 11"
            },{
                name: "dam_sub13",
                str_l: "Damas sub 13",
                str_s: "Dam. sub 13"
            },{
                name: "dam_sub15",
                str_l: "Damas sub 15",
                str_s: "Dam. sub 15"
            }
        ];

        $scope.categorias_caballeros = [
            {
                name: "cab_sub10",
                str_l: "Caballeros sub 10",
                str_s: "Cab. sub 10"
            },{
                name: "cab_sub12",
                str_l: "Caballeros sub 12",
                str_s: "Cab. sub 12"
            },{
                name: "cab_sub15",
                str_l: "Caballeros sub 15",
                str_s: "Cab. sub 15"
            }
        ];
        
        $scope.tournament = {
            name: "",
            type: "",
            category: {}
        }
        
        $scope.submitForm = function () {
            if ($scope.form.userForm.$valid) {
                if($scope.form.category == "TodoCompetidor") $scope.tournament.category = $scope.todoCompetidor;
                   
                console.log("Torneo: ", $scope.tournament);
                
                var newTournament = build_tournament($scope.tournament.name, new Date(), $scope.tournament.category, $scope.tournament.type);
                $scope.tournaments.push(newTournament);
                $modalInstance.close('');
            } else {
                console.log('userform is not in scope');
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

})()