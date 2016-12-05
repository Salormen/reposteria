angular.module('tournamentModule').factory('matchesForBracket', [function(){

    /*
        Bracket := Player(player) | Match (winner_match_1, winner_match_2)
    */
    
        function player_c(group, position){
            return {    
                        is_player: true,
                        from_group: group,
                        get winner () {
                            return group.get_player_in_position(position);
                        }                
                    };
        }

        function match_c(prev_match_1, prev_match_2, sets_count){
            return {    
                        is_player: false,
                        prevs_matches: [prev_match_1, prev_match_2],
                        get players () {
                            return this.prevs_matches.map(p => {return p.winner});
                        },
                        sets: crearSets(sets_count),
                        final: [0,0],
                        get winner () {
                            if (this.final[0] == sets_for_victory(sets_count)){
                                return this.players[0];
                            }
                            if (this.final[1] == sets_for_victory(sets_count)){
                                return this.players[1];
                            }else{
                                return null;
                            }                            
                        }
                    };
        }


    function crearSets(setsPartido){
        var sets = []
        for (var i = 0; i<setsPartido; i++){
            sets.push([0,0]);
        }
        return sets;
    }
    
    function sets_for_victory(sets_count){
        return Math.floor(sets_count / 2) + 1;
    }

    ////////////////////////////////////////////////////

    function matches_for_bracket(bracket, sets_per_round, groups){
        if(bracket.is_player){
            return player_c(groups[bracket.reference.group_id], bracket.reference.player_pos);
        }else{
            var match_1 = matches_for_bracket(bracket.branch_1, sets_per_round, groups);
            var match_2 = matches_for_bracket(bracket.branch_2, sets_per_round, groups);
            return match_c(match_1, match_2, sets_per_round);
        }
    }

    
    return matches_for_bracket;
    
}]);