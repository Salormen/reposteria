angular.module('tournamentModule').factory('bracketFunctions', [
                'other_functions', 'matchesFunctions',
        function(other_functions,   matches_functions){
    

    
    return {
                count_rounds: count_rounds,
                round_n: round_n,
                list_per_round: list_per_round,
                matchesReadyToPlayAllBrackets: matchesReadyToPlayAllBrackets,
                matchesReadyToPlayBracket: matchesReadyToPlayBracket,
                matchesReadyToPlayRound: matchesReadyToPlayRound
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
    
            
    function matchesReadyToPlayAllBrackets(brackets){
        return brackets.reduce((r,b) => r.concat(matchesReadyToPlayBracket(b)), 
                                        []);
    }
            
    function matchesReadyToPlayBracket(bracket){
        return list_per_round(bracket).reduce((r,round) => 
                        r.concat(round.reduce((rc, m) => (
                                    matchReadyToPlay(m))?rc.push(m):rc, 
                                    []), 
                        [])
                );
    }        
    
    function matchesReadyToPlayRound(bracket, round){
        round_n(bracket, round).reduce((rc,m) => 
                                            (matchReadyToPlay(m))?rc.push(m):rc, 
                                            []);
    }        
        
            
    // Funciones accesorias (las 2 que hay no pertenecen aa este módulo)
            
    function any(list, prop){
        return list.reduce((r, e) => {return r || prop(e)}, false);
    }
        
    function all(list, prop){
        return list.reduce((r, e) => {return r && prop(e)}, true);
    }
            
            
}]);