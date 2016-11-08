angular.module('tournamentModule').factory('partido_eliminacion', [function(){

    function crearSets(setsPartido){
        var sets = []
        for (var i = 0; i<setsPartido; i++){
            sets.push([0,0]);
        }
    }
    
    function crearPartido(partido1, partido2, setsPartido){
        return  {
            partidos: [partido1, partido2],
            get jugadores () {
                return this.partidos.map(p => {return p.ganador});
            },
            sets: crearSets(setsPartido),
            final: [0,0],
            setsParaLaVictoria: Math.floor(setsPartido / 2) + 1,
            get ganador () {
                if (this.setsGanadosEnPartidoPor(this.jugadores[0]) === this.setsParaLaVictoria){
                    return this.jugadores[0];
                }
                if (this.setsGanadosEnPartidoPor(this.jugadores[1]) === this.setsParaLaVictoria){
                    return this.jugadores[1];
                }else{
                    return null;
                }
                
            },
            setsGanadosEnPartidoPor: function (jugador) {
                return this.final[this.jugadores.indexOf(jugador)];
            }
        };
    }
    
    return crearPartido;
    
}]);