angular.module('tournamentModule').factory('bracket_seeder', [function(){
    
    /*
        Bracket := Bye | Player(player) | Match (Bracket,Bracket)
    */
        
        function bye_c(){
            return {is_bye: true};
        }
    
        function player_c(player){
            return {    reference: player,
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
        var players_by_round = slice_players_by_round(players);
        var fst_round_matches = players_by_round[1].map(match_with_bye).concat(seed_fst_round_players(players_by_round[0]));
        return replace_decoys(seed_decoys(decoys_for(fst_round_matches)));
    }
    
    
    function count_first_complete_round(count){
        var n = 0;
        while(Math.pow(2,n+1) <= count){
            n++;
        }
        return n;
    }
    
    
    function slice_players_by_round(players){
        var n = count_first_complete_round(players.length);   
        if (Math.pow(2,n) == players.length){
            return [players, []];
        }else{
            var fst_round_players = players.slice(Math.pow(2, n+1) - players.length);
            var snd_round_players = players.slice(0, players.length - fst_round_players.length);
            return [fst_round_players, snd_round_players];
        }
    }
    
    function random(min,max){
        return Math.floor(Math.random() * (max-min +1)) + min;
    }
    
    ///////////////////////////////// First round seeding
    
    
    /*  Pourpose:   Create decoys for n matches.
        Prec:       Matches must have 2n elements.
        Ret:        Array with n decoys.
    */
    function decoys_for(matches){
        return matches.map((m,i) => {return {is_decoy: true, match: m, id: i};});
    }
    
    
    /*  Pourpose:   Create matches for first round players.
        Prec:       Players must have 2n elements.
        Ret:        Array with n matches. 
    */
    function seed_fst_round_players(fst_round_players){
        var res = [];
        var fst_players = fst_round_players.slice(0, fst_round_players.length / 2);
        var lst_players = fst_round_players.slice(fst_players.length);
        for(var i = 0; i < fst_players.length; i++){
            var rdm = random(0, lst_players.length -1);
            res.push(match_c(player_c(fst_players[i]), player_c(lst_players[rdm])));
            lst_players.splice(rdm, 1);
        }
        return res;
    }
    
    
    function match_with_bye(player){
        return match_c(player_c(player), bye_c());
    }
    
    /////////////////////////////////       Bracket seeding 
    
    /*  Pourpose:   Seeds matches' decoys in bracket. 
        Prec:       decoys must be in order. decoys.length == 2^n
        Ret:        balanced bracket with all decoys seed
    */
    function seed_decoys(decoys){
        var fst = decoys.shift();
        return decoys.reduce(place_decoy_in_bracket, fst);
    }
        
    
    /*  Pourpose:   place the given decoy in bracket. 
        Prec:       bracket is balanced
        Ret:        balanced bracket with decoy seed
    */
    function place_decoy_in_bracket(bracket, decoy){
        if (bracket.is_decoy){
            return match_c(bracket, decoy);
        }else{
            return place_in_lighter_branch(bracket, decoy);                   
        }
    }
    
    
    /*  Pourpose:   makes recursion in the lighter bracket's branch. 
                    Uses <place_decoy_in_bracket(bracket, decoy)> for recursion.
        Prec:       bracket is balanced. Bracket isn't decoy.
        Ret:        balanced bracket with decoy seed
    */
    function place_in_lighter_branch(bracket, decoy){
        // If both branch have the same number of players, then choose one at random.
        if (is_lighter(bracket.branch_1, bracket.branch_2)){
            bracket.branch_1 = place_decoy_in_bracket(bracket.branch_1, decoy);
            return bracket;
        }
        if (is_lighter(bracket.branch_2, bracket.branch_1)){
            bracket.branch_2 = place_decoy_in_bracket(bracket.branch_2, decoy);
            return bracket;
        }
        if(random(0,1) == 0){
            bracket.branch_1 = place_decoy_in_bracket(bracket.branch_1, decoy);
            return bracket;
        }
        else{
            bracket.branch_2 = place_decoy_in_bracket(bracket.branch_2, decoy);
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
        if(bracket.is_decoy){
            return 1;
        }else{
            return weight(bracket.branch_1) + weight(bracket.branch_2);
        }
    }
    
    
    /*  Pourpose:   Replace decoys with their respectives matches.
        Prec:       Matches must be in order. matches.length == bracket.width. 
                    For each fst_round_match, must be a decoy with id equal to the index of that match and it has to be unique.
        Ret:        Same bracket with decoys replaced.
    */    
    function replace_decoys(bracket){
        if(bracket.is_decoy){
            return bracket.match;
        }else{
            bracket.branch_1 = replace_decoys(bracket.branch_1);
            bracket.branch_2 = replace_decoys(bracket.branch_2);
            return bracket;
        }
    }

    
    
    return seed;
    
}]);