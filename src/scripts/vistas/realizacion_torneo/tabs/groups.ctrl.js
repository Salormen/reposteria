(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('GroupsController',  
                ['$scope', '$state', '$stateParams', 'tournament_dao', 'groups_functions', 'printer', 'other_functions',
        function($scope, $state, $stateParams, tournament_dao, groups_functions, printer, other_functions){

        /******************************************/

        //Configuracion
        var context = {};
        
        $scope.other_functions = other_functions;
        $scope.torneo = tournament_dao.get_by_id($stateParams.id);
        $scope.group = $scope.torneo.groups[$stateParams.group_id];
        console.log("Grupo: ", $scope.group);
            

        $scope.grupos_mostrados = $scope.torneo.groups;

        /////////////////////////////////////////////

        // Tab Grupos
            
   

        $scope.editar_grupo = function(id){
            if (!$scope.grupos_mostrados[id].editar){
                $scope.mostrar_grupo(id);
                $scope.grupos_mostrados[id].editar = true;
            }else{
                $scope.grupos_mostrados[id].editar = false;
            }
        };

        $scope.editando_grupo = function(id){
            return $scope.grupos_mostrados[id].editar;
        }

        
        $scope.print_group = function(group){
            printer.print_group($scope.torneo, group);
        }



        context.is_bye_match = groups_functions.isByeMatch;
            
        context.getPlayerName = groups_functions.getPlayerName;
        context.torneo = $scope.torneo;
           
        $scope.context = context;
        
        
      }])
})()