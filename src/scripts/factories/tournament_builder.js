angular.module('tournamentModule').factory('build_tournament', 
                            ['groups_builder', 'brackets_builder', 'bracketFunctions', 
                    function( build_groups,     build_brackets,     bracketFunctions){

    
    /*
        Torneo:
            -nombre
            -fecha
            -Formato:
                -\jugadores.length => count_zonas
                -cantidad de clasificados a llave A por zona
                -llave B?
                -cantidad de sets por instancia (o inicio del aumento de la cantidad de sets)
            -jugadores
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
                        
    function create_matches_id(bracket){
        var id = 1;
        bracketFunctions.list_per_round(bracket).reverse().forEach(l => l.forEach(m => { m.id = id; id++;}))
    }
                        
    function build_tournament(name, date, category, type){
        return {
            name: name,
            date: date,
            category: category, 
            type: type,
            players: [],
            format: {},
            groups: [],
            brackets: [],
            seed: function(){
                this.create_format();
                this.sort_players();
                this.create_groups();
                this.create_brackets();
            },
            
            // Private  
            sort_players: function(){
                this.players.sort((j1,j2) => {return j2.rating - j1.rating});  
            },
            create_format: function(){                
                this.format = type.format.format_for_n_players(this.players.length);
            },
            create_groups: function(){
                this.groups = build_groups(this.format.count_groups(this.players.length),
                                                        this.format.sets_by_instance.groups,
                                                        this.players);
            },
            create_brackets: function(){
                this.brackets = build_brackets(this.groups,
                                                  this.format.bracket_a_clasified,
                                                  this.format.bracket_b,
                                                  this.format.sets_by_instance.brackets);
                this.brackets.forEach(create_matches_id);
            }
        };
    }
    
    return build_tournament;
    
}]);