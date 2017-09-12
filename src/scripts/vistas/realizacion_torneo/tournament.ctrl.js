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
        
            
        // Brackets submenu
            
        
                
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
        
        
            



        
      }])
})()