angular.module('tournamentModule').factory('groups_builder', 
                    ['groups_seeder', 'groups_matches_builder', 'groups_functions',
            function( seed_players,    build_groups_matches,     groups_functions){
    
    function adapt(groups, bracket_a_clasified){
        return groups.map(
                (g,i) => { 
                    g.id = i;
                    g.finished = false;
                    g.clasified = bracket_a_clasified;
                    return g;
                }
            );
    }
                
                
    function build_groups(count_groups, sets, players, bracket_a_clasified){
        return build_groups_matches(adapt(seed_players(count_groups, players), bracket_a_clasified), sets);
    }
    
    return build_groups;
    
}]);
