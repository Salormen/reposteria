angular.module('tournamentModule').factory('seederEliminationBracket', ['partido_eliminacion', function(crearPartido){
    
    var emptyPart = {
            ganador: null
    };
    
    function esEmptyPart(partido){
        return partido == emptyPart;
    }
    
    function hojaPart(jugador){
        return {
            ganador: jugador,
            partidos: []
        };
    }
    
    function esHojaPart(partido){
        return partido.partidos.length == 0 && partido.ganador != null;
    }
    
    
    function pesoLlave(llave){
        if (esHojaPart(llave)){            
            return 1;
        }
        if (esEmptyPart(llave)){
            return 0;
        }
        else{
            return llave.partidos.reduce((r,p) => {return r + pesoLlave(p)}, 0);
        }     
    }
    
    function ubicarEnLlave(jugador, llave, sets){
        /*
        emptyPart emptyPart
        emptyPart part
        part emptyPart
        part part
        */
        
        if (esEmptyPart(llave)){
            return hojaPart(jugador, sets);
        }        
        if (esHojaPart(llave)){
            return crearPartido(hojaPart(llave.ganador, sets), hojaPart(jugador, sets), sets);
        }
        if (pesoLlave(llave.partidos[0]) < pesoLlave(llave.partidos[1])){
            llave.partidos[0] = ubicarEnLlave(jugador, llave.partidos[0], sets);
            return llave;
        }
        if (pesoLlave(llave.partidos[1]) < pesoLlave(llave.partidos[0])){
            llave.partidos[1] = ubicarEnLlave(jugador, llave.partidos[1], sets);
            return llave;
        }else{
            var some_doparti = Math.floor(Math.random() * 2);
            llave.partidos[some_doparti] = ubicarEnLlave(jugador, llave.partidos[some_doparti], sets);
            return llave;       
        }
    }
    
    function crearLlave(jugadores, sets) {
        // Prec: los jugadores estan en orden y jugadores.lenght = 2^k, keN
        return jugadores.reduce((r,j) => {return ubicarEnLlave(j,r, sets)}, emptyPart);    
    }
    
    return crearLlave;
    
}]);