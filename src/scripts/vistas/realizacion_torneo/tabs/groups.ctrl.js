(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('GroupsController',  
                ['$scope', '$state', '$stateParams', 'tournament_dao', 'groups_functions', 'other_functions',
        function($scope, $state, $stateParams, tournament_dao, groups_functions, other_functions){

        /******************************************/

        //Configuracion
        var context = {};
        
        $scope.other_functions = other_functions;
        $scope.format_group_id = other_functions.format_group_id;
        $scope.torneo = tournament_dao.get_by_id($stateParams.id);
        $scope.group = $scope.torneo.groups[$stateParams.group_id];
        console.log("Grupo: ", $scope.group);
            

        $scope.grupos_mostrados = $scope.torneo.groups;

        /////////////////////////////////////////////

        // Tab Grupos
            
   



        context.is_bye_match = groups_functions.isByeMatch;
            
        context.getPlayerName = groups_functions.getPlayerName;
        context.torneo = $scope.torneo;
           
        $scope.context = context;
        
        
      }])
})()