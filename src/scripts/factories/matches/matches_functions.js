angular.module('tournamentModule').factory('matchesFunctions', [
                'groups_functions' , 'other_functions',
        function(groups_functions, other_functions){
    

    
    return {
                is_bye_match: is_bye_match,
                getPlayerName: getPlayerName
            }
    
    
    /////////////////////////////////////////////////////////////////////////////////////
    
    
    function is_bye_match(match){
        return match.prevs_matches.reduce((r,p) => r || p.is_bye, false);
    }
    
    function getPlayerName(match, player_pos, tournament){
        if(!instanceFinished(match.prevs_matches[player_pos], tournament) || match.prevs_matches[player_pos].is_bye){
            return getWinnerDescription(match.prevs_matches[player_pos]);
        }else{
            return getWinner(match.prevs_matches[player_pos], tournament).apellido;
        }
    }
    
    
    function instanceFinished(instance, tournament){
        return bracketDispatch(instance, 
                    () => true,
                    () => tournament.groups[instance.group_id].finished,
                    () => all(instance.prevs_matches, m => instanceFinished(m, tournament)) && (instance.final[0] + instance.final[1] > 2)
                    );
    }
    
    function getWinnerDescription(instance){
        return bracketDispatch(instance, 
                    () => " - Bye - ",
                    () => "Jugador en la posición " + instance.group_position + " del grupo " + other_functions.format_group_id(instance.group_id),
                    () => "Ganador partido " + instance.id           
                    );
    }
            
    
    function getWinner(instance, tournament){
        return bracketDispatch(instance, 
                    () => "",
                    () => groups_functions.get_player_in_position(tournament.groups[instance.group_id], instance.group_position),
                    () => getWinner(instance.prevs_matches[0], tournament)
                    );
    }
            
            
            
    // Funciones accesorias
            
    function bracketDispatch(bracket, case_bye, case_player, case_match){
        if(bracket.is_bye){
            return case_bye();
        }
        if(bracket.is_player){
            return case_player();
        }else{
            // es un match
            return case_match();
        }
    }
            
    function any(list, prop){
        return list.reduce((r, e) => {return r || prop(e)}, false);
    }
        
    function all(list, prop){
        return list.reduce((r, e) => {return r && prop(e)}, true);
    }
    
}]);