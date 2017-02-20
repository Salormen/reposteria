angular.module('tournamentModule').factory('bracket_matches_builder', [
            'groups_functions',
    function(groups_functions){

    /*
        Bracket := Player(player) | Bye | Match (winner_match_1, winner_match_2)
    */
        
        function bye_c(){
            return {
                        is_bye: true,
                        get winner () {
                            return this;
                        }  
            };
        }
        
        function player_c(group, position){
            return {    
                        is_player: true,
                        from_group: group,
                        group_position: position,
                        get winner () {
                            return groups_functions.get_player_in_position(group, position);
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
                            if(any(this.players, p => {return p == null})){
                                return null;
                            }
                            if (this.final[0] == sets_for_victory(sets_count) || this.players[1].is_bye){
                                return this.players[0];
                            }
                            if (this.final[1] == sets_for_victory(sets_count) || this.players[0].is_bye){
                                return this.players[1];
                            }                          
                        },
                        get is_playable(){
                            return all(this.players, p => {return p!=null && !p.is_bye});
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

    function any(list, prop){
        return list.reduce((r, e) => {return r || prop(e)}, false);
    }
        
    function all(list, prop){
        return list.reduce((r, e) => {return r && prop(e)}, true);
    }
    
    ////////////////////////////////////////////////////

    function build_bracket_matches(bracket, sets_per_round, round, groups){
        if(bracket.is_bye){
            return bye_c();
        }
        if(bracket.is_player){
            return player_c(groups[bracket.reference.group_id], bracket.reference.player_pos);
        }else{
            var match_1 = build_bracket_matches(bracket.branch_1, sets_per_round, round+1, groups);
            var match_2 = build_bracket_matches(bracket.branch_2, sets_per_round, round+1, groups);
            return match_c(match_1, match_2, sets_per_round(round));
        }
    }

    
    return build_bracket_matches;
    
}]);