(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('GroupsController',  
                ['$scope', '$state', '$stateParams', 'tournament_dao', 'groups_functions', 'printer', 'other_functions',
        function($scope, $state, $stateParams, tournament_dao, groups_functions, printer, other_functions){

        /******************************************/

        //Configuracion

        
        $scope.other_functions = other_functions;
        $scope.torneo = tournament_dao.get_by_id($stateParams.id);
        $scope.group = $scope.torneo.groups[$stateParams.group_id];
        $scope.grupos_mostrados = $scope.torneo.groups;

        /////////////////////////////////////////////

        // Tab Grupos
            
        $scope.show_group_selection_b = false;
         
        $scope.show_group_selection = function(){
            $scope.show_group_selection_b = true;
        }        
    
        $scope.hide_group_selection = function(){
            $scope.show_group_selection_b = false;
        }


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

        $scope.resultadoEnGrupoDeContra = function(grupo, jugador, jOp){
            if (jugador.nombre === jOp.nombre){return "- X -";}
            var partido = groups_functions.partidosJugadosEnGrupoPor(grupo, jugador).filter(p => {return groups_functions.jugadorParticipoDePartido(p, jOp)})[0];
            return groups_functions.setsGanadosEnPartidoPor(partido, jugador) + " - " + groups_functions.setsGanadosEnPartidoPor(partido, jOp);
        }

        $scope.difPartidosGanadosPerdidosEnGrupo = function (grupo, jugador){
            return $scope.partidosGanadosEnGrupo(grupo, jugador) + "/" + $scope.partidosPerdidosEnGrupo(grupo, jugador)
        }

        $scope.difSetsGanadosPerdidosEnGrupo = function (grupo, jugador){
            return $scope.setsGanadosEnGrupo(grupo, jugador) + "/" + $scope.setsPerdidosEnGrupo(grupo, jugador)
        }

        $scope.difPuntosGanadosPerdidosEnGrupo = function (grupo, jugador){
            return $scope.puntosGanadosEnGrupo(grupo, jugador) + "/" + $scope.puntosPerdidosEnGrupo(grupo, jugador)
        }




        /////////////////////////////////////////////////////

        $scope.partidosGanadosEnGrupo = groups_functions.partidosGanadosEnGrupo;

        $scope.partidosPerdidosEnGrupo = groups_functions.partidosPerdidosEnGrupo;

        $scope.setsGanadosEnGrupo = groups_functions.setsGanadosEnGrupo;

        $scope.setsPerdidosEnGrupo = groups_functions.setsPerdidosEnGrupo;

        $scope.puntosGanadosEnGrupo = groups_functions.puntosGanadosEnGrupo;

        $scope.puntosPerdidosEnGrupo = groups_functions.puntosPerdidosEnGrupo;

        /////////////////////////////////////////////////////


        $scope.posicionEnGrupo = groups_functions.posicionEnGrupo;

        $scope.print_group = function(group){
            printer.print_group($scope.torneo, group);
        }



      }])
})()