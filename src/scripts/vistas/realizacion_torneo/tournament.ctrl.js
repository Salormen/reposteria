(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('TournamentController',  
                ['$scope', '$state', '$stateParams', 'tournament_dao', 'groups_functions', 'bracketFunctions', 'other_functions',
        function($scope, $state, $stateParams, tournament_dao, groups_functions, bracketFunctions, other_functions){

        /******************************************/
            
        $scope.torneo = tournament_dao.get_by_id($stateParams.id);
                    
        
        // Menu //
            
        $scope.submenus = {
            groups: {
                show: false
            },
            brackets: {
                show: false,
                submenus: {
                    bracket_a: {
                        show: false
                    },
                    bracket_b: {
                        show: false
                    }
                }
            }
        }
            
        $scope.showSubmenu = function(submenus, name){
            var prev = submenus[name].show;
            $scope.hideSubmenus(submenus);
            submenus[name].show = !prev;
        }
            
        $scope.hideSubmenus = function(submenus){
            for(var menu in submenus){
                submenus[menu].show = false;
                $scope.hideSubmenus(submenus[menu].submenus);
            }
            
        }
        
        
        $scope.format_group_id = other_functions.format_group_id;
        
            
        // Brackets submenu
            
        $scope.tournament_rounds = function(bracket_id){
            return bracketFunctions.count_rounds($scope.torneo.brackets[bracket_id]);
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
                
        $scope.matchesReadyToPlayAllBrackets = function(){
            if($scope.seeded){
                var mrtp = $scope.torneo.brackets.reduce((r,b) =>
                    r+$scope.bracket_funcs.list_per_round(b).reduce((r,l) => 
                        r+l.reduce((rc,m) => 
                            rc+m.readyToPlay,0)
                        ,0)
                    ,0);
                if (mrtp == 0){
                    return "";
                }else{
                    return "("+ mrtp +")";
                }
            }else{
                return "";
            }
        }

        $scope.matchesReadyToPlayBracketA = function(){
            if($scope.seeded){
                var mrtp = $scope.bracket_funcs.list_per_round($scope.torneo.brackets[0]).reduce((r,l) => 
                        r+l.reduce((rc,m) => 
                            rc+m.readyToPlay,0)
                        ,0);
                if (mrtp == 0){
                    return "";
                }else{
                    return "("+ mrtp +")";
                }
            }else{
                return "";
            }
        }

        $scope.matchesReadyToPlayBracketB = function(){
            if($scope.seeded){
                var mrtp = $scope.bracket_funcs.list_per_round($scope.torneo.brackets[1]).reduce((r,l) => 
                        r+l.reduce((rc,m) => 
                            rc+m.readyToPlay,0)
                        ,0);
                if (mrtp == 0){
                    return "";
                }else{
                    return "("+ mrtp +")";
                }
            }else{
                return "";
            }
        }

        $scope.matchesReadyToPlayRound = function(bracket, round){
            if($scope.seeded){
                var mrtp = $scope.bracket_funcs.round_n($scope.torneo.brackets[bracket], round).reduce((rc,m) => 
                            rc+m.readyToPlay,0);
                if (mrtp == 0){
                    return "";
                }else{
                    return "("+ mrtp +")";
                }
            }else{
                return "";
            }
        }
        
        
            
            
            
            
            
            
            
            
            
        //Configuracion

        
        $scope.setsForVictory = function(sets){
            return Math.floor($scope.sets / 2) + 1;
        }



        /////////////////////////////////////////////

        // Frame Grupos

        $scope.seSelecciono_todosLosGrupos = true;
        $scope.grupos_mostrados = [];

        $scope.mostrar_todos_grupos = function(){
            reset_grupos_mostrados();
            $scope.seSelecciono_todosLosGrupos = true;
        };

        $scope.mostrar_grupo = function(id){
            $scope.seSelecciono_todosLosGrupos = false;
            reset_grupos_mostrados();
            $scope.grupos_mostrados[id].mostrar = true;
        };

        function reset_grupos_mostrados(){
            $scope.grupos_mostrados = $scope.torneo.groups.map(g => {return {mostrar:false, editar: false}});
        };

        $scope.seSelecciono_grupo = function(id){
            return $scope.grupos_mostrados[id].mostrar;
        };

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