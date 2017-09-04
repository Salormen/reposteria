angular.module('tournamentModule').factory('groups_functions', 
                    [ 
            function(){
        
    // Funciones sobre resultados en el grupo por cierto jugador
                
    function partidosGanadosEnGrupo(grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {if (ganoPartido(p, jugador)){return r + 1}else{return r}}, 0);
    }
    
    function partidosPerdidosEnGrupo(grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {if (perdioPartido(p, jugador)){return r + 1}else{return r}}, 0);
    }
    
    function setsGanadosEnGrupo(grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {return r + setsGanadosEnPartidoPor(p, jugador);}, 0);
    }
    
    function setsPerdidosEnGrupo(grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {return r + setsPerdidosEnPartidoPor(p, jugador);}, 0);
    }
    
    function puntosGanadosEnGrupo(grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {return r + puntosGanadosEnPartidoPor(p, jugador);}, 0);
    }
    
    function puntosPerdidosEnGrupo(grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {return r + puntosPerdidosEnPartidoPor(p, jugador);}, 0);
    }      
                
    ///////////////////
                
    
    function partidosJugadosEnGrupoPor(grupo, jugador){
        return grupo.matches.filter(p => {return jugadorParticipoDePartido(p, jugador)});
    }
                
    // Funciones sobre partido
                
    function jugadorParticipoDePartido(partido, jugador){
        return (partido.players[0] == jugador) || 
               (partido.players[1] == jugador)
    }
    
    function seDisputoPartido(partido, sets_for_victory){
        return (parseInt(partido.final.reduce((r,e) => r+e, 0) >= sets_for_victory));
    }
     
    function ganoPartido(partido, jugador, sets_for_victory){
        return setsGanadosEnPartidoPor(partido, jugador) === sets_for_victory;
    }
      
    function perdioPartido(partido, jugador){
        return seDisputoPartido(partido) && !ganoPartido(partido, jugador);
    }
    
    function setsGanadosEnPartidoPor(partido, jugador){
        if (partido.players[0] == jugador){
            return parseInt(partido.final[0]);
        }else{
            return parseInt(partido.final[1]);
        }
    }
      
    function setsPerdidosEnPartidoPor(partido, jugador){
        if (partido.players[0] == jugador){
            return parseInt(partido.final[1]);
        }else{
            return parseInt(partido.final[0]);
        }
    }
      
    function puntosGanadosEnPartidoPor(partido, jugador){
        if (partido.players[0] == jugador){
            return partido.sets.reduce((r,s) => {return parseInt(s[0]) + r}, 0);
        }else{
            return partido.sets.reduce((r,s) => {return parseInt(s[1]) + r}, 0);
        }
    }
    
    function puntosPerdidosEnPartidoPor(partido, jugador){
        if (partido.players[0] == jugador){
            return partido.sets.reduce((r,s) => {return parseInt(s[1]) + r}, 0);
        }else{
            return partido.sets.reduce((r,s) => {return parseInt(s[0]) + r}, 0);
        }
    }
                
    // posicionEnGrupo
                
    function posicionEnGrupo(grupo, jugador){
        return grupo.players.sort((j1,j2) => {return coeficienteEnGrupoPara(grupo,j2) - coeficienteEnGrupoPara(grupo,j1)})
                    .indexOf(jugador) + 1;
    }
      
    function coeficienteEnGrupoPara(grupo, jugador){
        if (otrosJugadoresGanaronLaMismaCantidadDePartidosEnGrupo(grupo, jugador)){
            var jugadores = jugadoresConMismaCantidadDePartidosGanadosEnGrupo(grupo, jugador);
            var subgrupo = {matches: partidosDeJugadores(grupo, jugadores),
                            players: jugadores};
            return partidosGanadosEnGrupo(grupo, jugador) + 1 - posicionEnSubgrupo(subgrupo, jugador)/10;
        }else{
            return partidosGanadosEnGrupo(grupo, jugador);
        }
    }
      
    function otrosJugadoresGanaronLaMismaCantidadDePartidosEnGrupo(grupo, jugador){
        return jugadoresConMismaCantidadDePartidosGanadosEnGrupo(grupo, jugador).length > 1;
    }
      
    function jugadoresConMismaCantidadDePartidosGanadosEnGrupo(grupo, jugador){
        return grupo.players.filter(j => {return partidosGanadosEnGrupo(grupo, jugador) == 
                                                   partidosGanadosEnGrupo(grupo, j)});
    }
    
    function posicionEnSubgrupo(subgrupo, jugador){
        return subgrupo.players.sort
                         ((j1,j2) => {return coeficienteEnSubgrupoPara(subgrupo, j2) - 
                                             coeficienteEnSubgrupoPara(subgrupo, j1)})
                        .indexOf(jugador) + 1;
    }
      
    function coeficienteEnSubgrupoPara(subgrupo, jugador){
        if (otrosJugadoresGanaronLaMismaCantidadDePartidosEnGrupo(subgrupo, jugador)){
            return partidosGanadosEnGrupo(subgrupo, jugador) + 
                  (setsGanadosEnGrupo(subgrupo, jugador) - setsPerdidosEnGrupo(subgrupo, jugador))     / 10 +
                  (puntosGanadosEnGrupo(subgrupo, jugador) - puntosPerdidosEnGrupo(subgrupo, jugador)) / 10000;
        }else{
            return partidosGanadosEnGrupo(subgrupo, jugador);
        }
    }
      
    function partidosDeJugadores(grupo, jugadores){
        return grupo.matches.filter(
            p => {return jugadores.reduce(
                            (r,j) => {return r || jugadorParticipoDePartido(p,j)}, false)
                 }
        );
    }
              
    function get_player_in_position(group, position){
        return group.players.sort((j1,j2) => 
                        {return coeficienteEnGrupoPara(group,j2) - coeficienteEnGrupoPara(group,j1)})
                            [position-1];
    }
     
                
    // Interfaz match directive
    
    function is_bye_match(match){
        return false;
    }
                
    function getPlayerName(match, player_pos, tournament){
        return tournament.groups[match.group_id].players[match.players[player_pos]].apellido;
    }
                
                
    //////////////////////////////////////
                
    return {
        partidosGanadosEnGrupo: partidosGanadosEnGrupo,
        partidosPerdidosEnGrupo: partidosPerdidosEnGrupo, 
        setsGanadosEnGrupo: setsGanadosEnGrupo,
        setsPerdidosEnGrupo: setsPerdidosEnGrupo,
        puntosGanadosEnGrupo: puntosGanadosEnGrupo,
        puntosPerdidosEnGrupo: puntosPerdidosEnGrupo,
        
        partidosJugadosEnGrupoPor: partidosJugadosEnGrupoPor,
        
        jugadorParticipoDePartido: jugadorParticipoDePartido,
        seDisputoPartido: seDisputoPartido, /**/
        ganoPartido: ganoPartido, /**/
        perdioPartido: perdioPartido, /**/
        setsGanadosEnPartidoPor: setsGanadosEnPartidoPor,
        setsPerdidosEnPartidoPor: setsPerdidosEnPartidoPor, /**/
        puntosGanadosEnPartidoPor: puntosGanadosEnPartidoPor, /**/
        puntosPerdidosEnPartidoPor: puntosPerdidosEnPartidoPor, /**/
        
        posicionEnGrupo: posicionEnGrupo,
        coeficienteEnGrupoPara: coeficienteEnGrupoPara,
        get_player_in_position: get_player_in_position,
        
        // Interfaz match directive
        is_bye_match: is_bye_match,
        getPlayerName: getPlayerName
    }
                
}]);    