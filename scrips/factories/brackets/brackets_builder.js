angular.module('tournamentModule').factory('brackets_builder', 
                            ['bracket_seeder', "bracket_matches_builder",
                    function( seed_bracket,     build_bracket_matches){

                        
                        
    function build_brackets(groups, bracket_a_clasified, bracket_b, sets_per_round){
        var res = [build_bracket_matches(seed_bracket(bracket_a_references(groups, bracket_a_clasified)),
                                          sets_per_round.bracket_a,
                                          0,
                                          groups)];
        
        if(bracket_b){
            res.push(build_bracket_matches(seed_bracket(bracket_b_references(groups, bracket_a_clasified)),
                                            sets_per_round.bracket_b,
                                            0,
                                            groups));
        }
        
        return res;
    }
                        
                        
    return build_brackets;
                        
                        
    ///////////////////////// Brackets seeding ////////////////////////
     
                        
    function bracket_a_references(groups, clasified){
        var res = [];
        var local_groups = copy(groups);
        for(var i = 1; i <= clasified; i++){
            res = res.concat(local_groups.map(g => {
                return ref(g.id, i);
            }));
            local_groups.reverse();   // para sorteo en serpiente
        }
        return res;
    }
    
    function bracket_b_references(groups, clasified){
        var res = [];
        var local_groups = copy(groups);
        for(var i = clasified +1; i <= Math.max(...groups.map((g) => {return g.players.length;})); i++){
            for(var j = 0; j < local_groups.length; j++){
                if(i <= local_groups[j].players.length){
                    res.push(ref(local_groups[j].id, i));
                }
            }
            local_groups.reverse();         // para sorteo en serpiente
        }
        return res;
    }
                        
    function ref(g,pos){
        return {group_id: g, player_pos: pos}
    }
               
                        
    function copy(arr){
        return arr.reduce((r,e) => {r.push(e); return r}, []); 
    }
  
              
                        
}]);