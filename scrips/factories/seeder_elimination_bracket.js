angular.module('tournamentModule').factory('seederEliminationBracket', [function(){
    
    /*
        Bracket := Player(player) | Match (Bracket,Bracket)
    */
    
        function player_c(player){
            return {    player: player,
                        is_player: true
                    };
        }

        function match_c(bracket_1, bracket_2){
            return {    branch_1: bracket_1,
                        branch_2: bracket_2,
                        is_player: false
                    };
        }
    ////////////////////////////////////////////////////
        
    
    function seed(players) {
        var n = count_first_complete_round(players.length);
        var first_round_players = players.slice(Math.pow(2, n+1) - players.length);
        var first_complete_round_players = players.slice(0, players.length - first_round_players.length);
        first_complete_round_players = first_complete_round_players.concat(decoys_for(first_round_players));
        var bracket = seed_complete_round(first_complete_round_players);
        var first_round_matches = seed_first_round_players(first_round_players);
        return replace_decoys(bracket, first_round_matches);
    }
    
    
    function count_first_complete_round(count){
        var n = 0;
        while(Math.pow(2,n+1) <= count){
            n++;
        }
        return n;
    }
    
    
    
    ///////////////////////////////// First round seeding
    
    
    /*  Pourpose:   Create decoys for first round matches.
        Prec:       Players must have 2n elements.
        Ret:        Array with n decoys.
    */
    function decoys_for(players){
        return players.slice(players.length / 2).map((d,i) => {return {ref: 'decoy', id: i};});
    }
    
    
    /*  Pourpose:   Create matches for first round players.
        Prec:       Players must have 2n elements.
        Ret:        Array with n matches. 
    */
    function seed_first_round_players(first_round_players){
        var group_a = first_round_players.slice(0, first_round_players.length / 2);
        var group_b = first_round_players.slice(first_round_players.length / 2).reverse();
        return group_a.map((p,i) => {return match_c(player_c(p), player_c(group_b[i]))});
    }
    
    
    
    /////////////////////////////////       Bracket seeding 
    
    /*  Pourpose:   Seeds players in bracket. 
        Prec:       players must be in order.
        Ret:        balanced bracket with all players seed
    */
    function seed_complete_round(players){
        return seed_bracket(player_c(players[0]), players.slice(1));
    }
    
    
    /*  Pourpose:   Seeds players recursively in bracket. 
        Prec:       none.
        Ret:        balanced bracket with all players seed
    */
    function seed_bracket(bracket, players){
        if (players.length == 0){
            return bracket;
        }else{
            return seed_bracket(place_player_in_bracket(players[0], bracket), players.slice(1));
        }
    }
    
    
    /*  Pourpose:   place the given player in bracket. 
        Prec:       bracket is balanced
        Ret:        balanced bracket with player seed
    */
    function place_player_in_bracket(player, bracket){
        if (bracket.is_player){
            return match_c(bracket, player_c(player));
        }else{
            return place_in_lighter_branch(player, bracket);                   
        }
    }
    
    
    /*  Pourpose:   makes recursion in the lighter bracket's branch. 
                    Uses <place_player_in_bracket(player, bracket)> for recursion.
        Prec:       bracket is balanced. Bracket isn't player.
        Ret:        balanced bracket with player seed
    */
    function place_in_lighter_branch(player, bracket){
        if (is_lighter(bracket.branch_1, bracket.branch_2)){
            bracket.branch_1 = place_player_in_bracket(player, bracket.branch_1);
            return bracket;
        }
        if (is_lighter(bracket.branch_2, bracket.branch_1)){
            bracket.branch_2 = place_player_in_bracket(player, bracket.branch_2);
            return bracket;
        }
        // If both branch have the same number of players, then choose one at random.
        if (Math.floor(Math.random() * 2) == 0){
            bracket.branch_1 = place_player_in_bracket(player, bracket.branch_1);
            return bracket;
        }else{
            bracket.branch_2 = place_player_in_bracket(player, bracket.branch_2);
            return bracket;
        }
    } 
    
    
    /*  Pourpose:   determines if the first bracket is lighter than the second one.
        Prec:       none.
        Ret:        bool.
    */
    function is_lighter(bracket_1, bracket_2){
        return weight(bracket_1) < weight(bracket_2);
    }
    
    
    /*  Pourpose:   weight the given bracket.
        Prec:       none.
        Ret:        bracket's weight.
    */
    function weight(bracket){
        if(bracket.is_player){
            return 1;
        }else{
            return weight(bracket.branch_1) + weight(bracket.branch_2);
        }
    }
    
    
    /*  Pourpose:   Replace decoys with their respectives matches.
        Prec:       Matches must be in order. matches.length == bracket.decoys.length
        Ret:        Same bracket with decoys replaced.
    */    
    function replace_decoys(bracket, first_round_matches){
        return first_round_matches.reduce(replace_decoy_in_bracket, bracket);
    }    
    
    
    /*  Pourpose:   Replace decoy in bracket with match.
        Prec:       Must be a decoy with id == decoyId in bracket and it has to be unique.
        Ret:        Bracket with decoy replaced.
    */ 
    function replace_decoy_in_bracket(bracket, match, decoyId){
        if(bracket.is_player){
            if(bracket.player.ref == 'decoy' && bracket.player.id == decoyId){
                return match;
            }else{
                return bracket;
            }            
        }else{
            bracket.branch_1 = replace_decoy_in_bracket(bracket.branch_1, match, decoyId);
            bracket.branch_2 = replace_decoy_in_bracket(bracket.branch_2, match, decoyId);
            return bracket;
        }
    }
    
    return seed;
    
}]);