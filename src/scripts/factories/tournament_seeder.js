angular.module('tournamentModule').factory('tournament_seeder', 
                            ['format_builders', 'groups_builder', 'brackets_builder', 'bracketFunctions', 
                    function( format_builders,   build_groups,     build_brackets,     bracketFunctions){

        
    /*
         
        Format builder:
            -limites de formatos:
                -max jugadores (limite)
                -Formato:
                    -\jugadores.length => count_zonas
                    -cantidad de clasificados a llave A por zona
                    -llave B?
                    -cantidad de sets por instancia (o inicio del aumento de la cantidad de sets):
                        -groups
                        -7(bracket)             <= las rondas se cuentan dsd la final, empezando por 0:
                        -5(bracket)                     never: -1
                        -3(bracket)                     final:  0
                        -1(bracket)                     semis:  1 ... etc
                    
    */
      
                        
                        
    function sort_players(tournament){
        tournament.players.sort((j1,j2) => {return j2.rating - j1.rating});                 // Ordena los jugadores de mayor a menor rating
    }
   
    function create_groups(tournament, format){
        tournament.groups = build_groups(format.count_groups(tournament.players.length),    // Cantidad de grupos
                                         format.sets_by_instance.groups,                    // Cantidad de sets para cada partido de grupo
                                         tournament.players);                               // Jugadores que disputaran los grupos en cuestion
    }
                        
    function create_brackets(tournament, format){
        tournament.brackets = build_brackets(tournament.groups,                            // Grupos desde los que van a clasificar a la llave
                                             format.bracket_a_clasified,                    // cuantos de cada grupo clasifican a llave a
                                             format.bracket_b,                              // si existe llave b
                                             format.sets_by_instance.brackets);             // Sets por instancia
        tournament.bracket_b = format.bracket_b;
        tournament.brackets.forEach(create_matches_id);
    }
               
                    
    function create_matches_id(bracket){
        var id = 1;
        bracketFunctions.list_per_round(bracket).reverse().forEach(l => l.forEach(m => { m.id = id; id++;}))
    }
                        
    function seed(tournament){
        console.log("Format: ", tournament.type.format);
        var format = format_builders.getFormat(tournament.type.format).format_for_n_players(tournament.players.length);
        sort_players(tournament);
        create_groups(tournament, format);
        create_brackets(tournament, format);        
        console.log(tournament);
        return tournament;
    }
    
    return {
        seed: seed
    };
    
}]);