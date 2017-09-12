angular.module('tournamentModule').factory('file_creator_for_download', 
                            [
                    function(){
    
                        
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
        return tournament.groups.reduce((r,g) => r + createMatchesData_TMT(g, tournament), "");
    }                    
                        
    function createMatchesData_TMT(group, tournament){
        var category = categoryData_TMT(tournament);
        var group_id = groupID_tmt(group);
        
        var init = "\""   
        var end = "\"\t"  

        function elem(e_i){
            return init + e_i + end;
        }
                
        return group.matches.reduce((r,m) => 
            r +  
            elem("0000") + elem(category) + elem(group_id) + 
                                    m.players[0].rating+"\t" + elem(m.players[0].apellido+", "+m.players[0].nombre) +
                                    m.players[1].rating+"\t" + elem(m.players[1].apellido+", "+m.players[1].nombre) +
            "\n", "");
    }
                        
    function categoryData_TMT(tournament){
        return "AAA";
    }
                        
    function groupID_tmt(group){
        return "1" + (group.id + 1).toString();
    }
    
}]);