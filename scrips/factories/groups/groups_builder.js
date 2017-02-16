angular.module('tournamentModule').factory('groups_builder', 
                    ['groups_seeder', 'groups_matches_builder', 
            function( seed_players,    build_groups_matches){
    
    function adapt(groups){
        return groups.map(
                (g,i) => { 
                    g["id"] = i;
                    g["get_player_in_position"] = function(position){
                            return this.jugadores.sort((j1,j2) => 
                                {return coeficienteEnGrupoPara(this,j2) - coeficienteEnGrupoPara(this,j1)})
                                    [position-1];
                        };
                    return g;
                }
            );
    }
                
                
    function build_groups(count_groups, sets, players){
        return build_groups_matches(adapt(seed_players(count_groups, players), sets));
    }
    
    return build_groups;
    
}]);
