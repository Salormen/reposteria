angular.module('tournamentModule').factory('tournament_factory', 
                'groupsSeeder', [function(
                seed_players_in_groups){

    
    /*
        Torneo:
            -nombre
            -Formato:
                -\jugadores.length => count_zonas
                -cantidad de clasificados a llave A por zona
                -llave B?
                -cantidad de sets por instancia (o inicio del aumento de la cantidad de sets)
            -jugadores
            -Instancias:
                -grupos
                -llaves
    */
    
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
    
    function create_tournament(name, format_builder){
        return {
            name: name,
            players: [],
            seed: function(){
                this.create_format();
                this.sort_players();
                this.create_groups();
                this.create_brackets();
            },
            sort_players: function(){
                this.players.sort((j1,j2) => {return j2.rating - j1.rating});  
            },
            create_format: function(){
                var coincident_formats = format_builder.limits.filter((f) => {return this.players.length <= f.max;});
                this["format"] = coincident_formats[coincident_formats.length - 1].format; // last format
            },
            create_groups: function(){
                this["groups"] = seed_players_in_groups(this.format.count_groups(this.players.length),
                                                        this.format.sets_by_instance.groups,
                                                        this.players);
            },
            create_brackets: function(){
                this["brackets"] = seed_brackets(this.players.length,
                                                 this.groups.length,
                                                 this.format.bracket_a_clasified,
                                                 this.format.bracket_b,
                                                 this.format.sets_by_instance.brackets)
            }
        };
    }
    
    return create_tournament;
    
}]);