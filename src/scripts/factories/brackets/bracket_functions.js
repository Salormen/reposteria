angular.module('tournamentModule').factory('bracketFunctions', [
                'other_functions',    
        function(other_functions){
    

    
    return {
                count_rounds: count_rounds,
                round_n: round_n,
                list_per_round: list_per_round,
        
                // funcionamiento anteriormente alojado en la llave
                is_bye_match: is_bye_match,
                getPlayerName: getPlayerName
            }
    
    
    /////////////////////////////////////////////////////////////////////////////////////
    
        
    /*
        Bracket := Player(player) | Match (winner_match_1, winner_match_2)
    */
    
    function count_rounds(bracket){
        if(bracket.is_player || bracket.is_bye){
            return 0;
        }else{
            return Math.max(count_rounds(bracket.prevs_matches[0]), 
                            count_rounds(bracket.prevs_matches[1]))
                    + 1;
        }
    }
    
    function round_n(bracket, n){
        if(bracket == undefined || bracket.is_player || bracket.is_bye){
            return [];
        }else{
            if(n == 0){            
                return [bracket];   
            }else{
                return round_n(bracket.prevs_matches[0], n-1).concat(
                       round_n(bracket.prevs_matches[1], n-1));
            }
        }
    }
    
    function list_per_round(bracket){
        var res = [];
        for (var i = 0; i <= count_rounds(bracket); i++){
            res.push(round_n(bracket, i));
        }
        return res;
    }
    
    function is_bye_match(match){
        return match.prevs_matches.reduce((r,p) => r || p.is_bye, false);
    }
    
    function getPlayerName(match, player_pos, tournament){
        if(!instanceFinished(match.prevs_matches[player_pos], tournament) || match.prevs_matches[player_pos].is_bye){
            return getWinnerDescription(match.prevs_matches[player_pos]);
        }else{
            return getWinner(match.prevs_matches[player_pos]).name;
        }
    }
    
    
    function instanceFinished(instance, tournament){
        return bracketDispatch(instance, 
                    () => true,
                    () => tournament.groups[instance.group_id].finished,
                    () => all(instance.prevs_matches, m => instanceFinished(m, tournament))
                    );
    }
    
    function getWinnerDescription(instance){
        return bracketDispatch(instance, 
                    () => " - Bye - ",
                    () => "Jugador en la posición " + instance.group_position + " del grupo " + other_functions.format_group_id(instance.group_id),
                    () => "Ganador partido " + instance.id           
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