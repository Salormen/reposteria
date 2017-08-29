angular.module('tournamentModule').factory('build_tournament', 
                            ['groups_builder', 'brackets_builder', 'bracketFunctions', 
                    function( build_groups,     build_brackets,     bracketFunctions){

    
    /*
        Torneo:
            -nombre
            -fecha
            -categoria
            -tipo de torneo
            -jugadores
            -grupos
            -llaves
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