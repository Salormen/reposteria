angular.module('tournamentModule').factory('partido_grupo', [function(){

    function crearSets(setsPartido){
        var sets = []
        for (int i = 0; i<setsPartido; i++){
            sets.push([0,0]);
        }
    }
    
    function crearPartido(jugador1, jugador2, setsPartido){
        return  {
            jugadores: [jugador1, jugador2];
            sets: crearSets(setsPartido);
            final: [0,0];
        };
    }
    
    return crearPartido;
    
}]);