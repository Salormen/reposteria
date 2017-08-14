angular.module('tournamentModule').factory('format_builders', 
                            ['groups_builder', 'brackets_builder', 
                    function( build_groups,     build_brackets){
    /*
        Format builder:
            -limites de formatos:
                -max jugadores (limite)
                -Formato:
                    -count_groups:                  \jugadores.length -> count_zonas
                    -bracket_a_clasified:           cantidad de clasificados a llave A por zona
                    -bracket_b:                     bool. llave B?
                    -sets_by_instance: cantidad de sets por instancia (o inicio del aumento de la cantidad de sets):
                        -groups
                        -7(bracket)             <= las rondas se cuentan dsd la final, empezando por 0:
                        -5(bracket)                     never: -1
                        -3(bracket)                     final:  0
                        -1(bracket)                     semis:  1 ... etc
                    
    */
    
    // Configuracion Interescuelas ////////////////
             
                        
    var interescuelas_format_5 = {
        count_groups:  function(p){return 1},
        matches_in_groups: matches_in_groups,
        bracket_a_clasified:  0,
        bracket_b: false,
        sets_by_instance: {
            groups: 3,
            brackets: {}
        }
    };
                        
                        
    var interescuelas_format_11 = {
        count_groups:  function(p){return min(3, p)},
        matches_in_groups: matches_in_groups,
        bracket_a_clasified:  3,
        bracket_b: false,
        sets_by_instance: {
            groups: 3,
            brackets: {
                /*
                    Round id:                Round
                    -1                      Never
                    0                       Final
                    1                       Semifinal
                    2                       4tos de final
                                ...
                    100                     First round
                */
                bracket_a: function(round){
                    var a = [{round:-1, sets: 1}, {round:100, sets: 3}, {round:0, sets: 5}, {round:100, sets: 7}];
                    return a.filter(c => {return round <= c.round})[0].sets;
                }
            }
        }
    };
                        
    var interescuelas_format_65 = {
        count_groups:  function(p){return min(3, p)},
        matches_in_groups: matches_in_groups,
        bracket_a_clasified:  2,
        bracket_b: true,
        sets_by_instance: {
            groups: 3,
            brackets: {
                /*
                    Round id:                Round
                    -1                      Never
                    0                       Final
                    1                       Semifinal
                    2                       4tos de final
                    ...
                    100                     First round
                */
                bracket_a: function(round){
                    var a = [{round:-1, sets: 1}, {round:100, sets: 3}, {round:0, sets: 5}, {round:100, sets: 7}];
                    return a.filter(c => {return round <= c.round})[0].sets;
                },
                bracket_b: function(round){
                    var b = [{round:-1, sets: 1}, {round:100, sets: 3}, {round:-1, sets: 5}, {round:-1, sets: 7}];
                    return b.filter(c => {return round <= c.round})[0].sets;
                }
            }
        }
    };
                        
    var interescuelas_format_131 = {};
    var interescuelas_format_1000 = {};
                        
               
              
    var interescuelas_limits = [    {max_players_alowed: 5,     format: interescuelas_format_5},
                                    {max_players_alowed: 11,    format: interescuelas_format_11},
                                    {max_players_alowed: 65,    format: interescuelas_format_65},
                                    {max_players_alowed: 131,   format: interescuelas_format_131},
                                    {max_players_alowed: 1000,  format: interescuelas_format_1000}
                                ];
                        
    /////////////////////////////////////////////////   
                
    function min(players_per_group, count_players){
        return Math.floor(count_players / players_per_group);
    }             
                        
    function max(players_per_group, count_players){
        return Math.ceil(count_players / players_per_group);
    }             
                        
    function format_for_n_players(limits, count_players){
        var coincident_formats = limits.filter((f) => {return count_players <= f.max_players_alowed;});
        return coincident_formats[0].format; // first format    
    }
            
    function matches_in_groups(p){
        switch(p){
            case 3: return [[1,3,2], [1,2,3], [2,3,1]];
            case 4: return [[1,3,2], [2,4,3], [1,2,4], [3,4,1], [1,4,3], [2,3,4]];
            case 5: return [[1,4,1], [3,5,2], [1,2,3], [2,3,4], [1,5,5], [2,4,1], [1,3,2], [2,5,3], [1,2,3], [3,4,5]];
        }
    }
                        
    return {
        getFormat: function(name){
            return {
                interescuelas: {format_for_n_players: format_for_n_players.bind(null, interescuelas_limits)}
            }[name];
        }
    }
    
}]);