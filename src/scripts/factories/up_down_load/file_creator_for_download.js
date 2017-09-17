angular.module('tournamentModule').factory('file_creator_for_download', 
                            ['playerFormat', 'other_functions', 
                    function(player_format ,  other_functions){
    
                        
    return {
        tdmm: tdmmFileCreator,
        tmt: tmtFileCreator
    }
          
    /*******************************************************/
                        
                        
                        
    function tdmmFileCreator(tournament){
        return  JSON.stringify(tournament);
    }
                  
                        
    function tmtFileCreator(tournament){
        var res = "";
        res += createGroupsData_TMT(tournament);
        //res += createBracketData_TMT(tournament);
        return  res;
    }
                        
    function createGroupsData_TMT(tournament){
        return tournament.groups.reduce((r,g) => r + createMatchesData_gruop_TMT(g, tournament), "");
    }                    
                        
    function createMatchesData_gruop_TMT(group, tournament){
        var category = categoryData_TMT(tournament);
        var group_id = groupID_tmt(group);
        
        return group.matches.reduce((r,m) => 
            r +  
                createMatchData_TMT(category, group_id, group.players[m.players[0]], playerSets(0, m), 
                                                        group.players[m.players[1]], playerSets(1, m) ) +
            "\n", "");
    }
                                      
    function createMatchData_TMT(category, round, player_1, p1_sets, player_2, p2_sets){
        return elem("0000") + elem(category) + elem(round) + 
                                    playerId(player_1) + p1_sets +
                                    playerId(player_2) + p2_sets ;
    }
              
                        
    function categoryData_TMT(tournament){
        return "AAA";
    }
                        
    function groupID_tmt(group){
        return "1" + (group.id + 1).toString();
    }
                        
    function playerId(player){
        return player.rating+ "\t" + elem(player_format.lastNameWithName(player));
    }
    
    function playerSets(player, match){
        return match.sets.reduce((r, s) => r + s[player].toString() + "\t" , "") + 
            other_functions.nList(0, 4 - match.sets.length).reduce((r, s) => r + 0 + "\t" , "");
    }
                        
    function elem(e_i){
        var init = "\""   
        var end = "\"\t"  
        return init + e_i + end;
    }

        
}]);