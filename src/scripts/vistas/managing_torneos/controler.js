(function(){
  'use strict';

    angular
        .module('tournamentModule')
        .controller('SeleccionTorneoController',  ['$scope', '$modal', SeleccionTorneoController]);

    /** @ngInject */
    function SeleccionTorneoController($scope, $modal){

        $scope.tournaments = [{
            name: "Torneo 1",
            date: new Date(2017, 9, 29, 0, 0, 0, 0),
            type: "Interescuela", 
            category: {str_l: "Caballeros sub 10"}
        },{
            name: "Torneo 2",
            date: new Date(2017, 8, 29, 0, 0, 0, 0),
            type: "TMT", 
            category: {str_l: "Caballeros sub 10"}
            
        },{
            name: "Torneo 3",
            date: new Date(2017, 7, 29, 0, 0, 0, 0),
            type: "TMT", 
            category: {str_l: "Caballeros sub 10"}
            
        },{
            name: "Torneo 4",
            date: new Date(2017, 6, 29, 0, 0, 0, 0),
            type: "TMT", 
            category: {str_l: "Caballeros sub 10"}
            
        }
                             ];
        
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
            $scope.tournaments.splice($scope.tournaments.indexOf(tournament), 1);
        }
        
    }
    
    var ModalInstanceCtrl = function ($scope, $modalInstance, userForm, format_builders) {
        console.log("ModalInstanceCtrl");
        $scope.form = {}
        
        $scope.tiposDeTorneos = [{
                value: format_builders.interescuelas,
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
                $scope.tournament.date = new Date();
                if($scope.form.category == "TodoCompetidor") $scope.tournament.category = $scope.todoCompetidor;
                   
                console.log("Torneo: ", $scope.tournament);
                
                $scope.tournaments.push($scope.tournament);
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