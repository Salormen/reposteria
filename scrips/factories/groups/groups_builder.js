angular.module('tournamentModule').factory('groups_builder', 
                    ['groups_seeder', 'groups_matches_builder', 'groups_functions',
            function( seed_players,    build_groups_matches,     groups_functions){
    
    function adapt(groups){
        return groups.map(
                (g,i) => { 
                    g["id"] = i;
                    return g;
                }
            );
    }
                
                
    function build_groups(count_groups, sets, players){
        return build_groups_matches(adapt(seed_players(count_groups, players), sets));
    }
    
    return build_groups;
    
}]);
