angular.module('tournamentModule').factory('bracketFunctions', [function(){
        
    /*
        Bracket := Player(player) | Match (winner_match_1, winner_match_2)
    */
    
    function count_rounds(bracket){
        if(bracket.is_player){
            return 0;
        }else{
            return Math.max(count_rounds(bracket.prevs_matches[0]), 
                            count_rounds(bracket.prevs_matches[1]))
                    + 1;
        }
    }
    
    function round_n(bracket, n){
        if(bracket.is_player){
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
    
    var funcs = {
                    count_rounds: count_rounds,
                    round_n: round_n,
                    list_per_round: list_per_round 
                }
        
    return funcs;
    
}]);