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
        
                        
    function build_tournament(name, date, category, type){
        return {
            name: name,
            date: date,
            category: category, 
            type: type,                 
            players: [],
            groups: [],
            brackets: []
        };
    }
    
    return build_tournament;
    
}]);