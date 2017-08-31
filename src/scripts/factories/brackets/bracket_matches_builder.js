angular.module('tournamentModule').factory('bracket_matches_builder', [
            'groups_functions', 'other_functions',
    function(groups_functions,   other_functions){

    /*
        Bracket := Player(player) | Bye | Match (winner_match_1, winner_match_2)
    */
        
        function bye_c(){
            return {
                        is_bye: true,
                        is_player: false/*,
                        get winner () {
                            return this;
                        },
                        getWinnerDescription: function(){
                            return " - Bye - ";
                        },
                        get finished(){
                            return false
                        }*/
            };
        }
        
        function player_c(group_id, position){
            return {    
                        is_bye: false,
                        is_player: true,
                        group_id: group_id,
                        group_position: position/*,
                        get winner () {
                            return groups_functions.get_player_in_position(group, position);                                
                        },
                        getWinnerDescription: function(){
                            return "Jugador en la posición " + this.group_position + " del grupo " + other_functions.format_group_id(this.from_group.id);
                        },
                        get finished(){
                            return this.from_group.finished
                        }*/
                    };
        }

        function match_c(prev_match_1, prev_match_2, sets_count){
            return {    
                        is_bye: false,
                        is_player: false,
                        prevs_matches: [prev_match_1, prev_match_2],
                        sets: crearSets(sets_count),
                        final: [0,0]/*,
                        get players () {
                            return this.prevs_matches.map(p => {return p.winner});
                        },
                        player: function(id){
                            if (this.prevs_matches[id].finished){
                                return this.players[id]
                            }else{
                                return {nombre: this.prevs_matches[id].getWinnerDescription()}
                            }
                        },
                        get is_bye_match () {
                            return this.prevs_matches.reduce((r,p) => r || p.is_bye, false);
                        },
                        get readyToPlay () {
                            return this.prevs_matches.reduce((r,m) => r && m.finished, true);
                        }*//*,
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
                        getWinnerDescription: function(){
                            return "Ganador partido " + this.id;
                        },
                        get finished(){
                            return  (this.is_bye_match && any(this.prevs_matches, m => m.finished)) ||
                                    (!this.is_bye_match && this.winner != null);
                        }*/
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

    function build_bracket_matches(bracket, sets_per_round, round){
        if(bracket.is_bye){
            return bye_c();
        }
        if(bracket.is_player){
            return player_c(bracket.reference.group_id, bracket.reference.player_pos);
        }else{
            var match_1 = build_bracket_matches(bracket.branch_1, sets_per_round, round+1);
            var match_2 = build_bracket_matches(bracket.branch_2, sets_per_round, round+1);
            return match_c(match_1, match_2, sets_per_round(round));
        }
    }

    
    return build_bracket_matches;
    
}]);