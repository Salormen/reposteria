(function(angular) {
  'use strict';
angular.module('managerModule', [])
  .controller('Controller',  ['$scope',function($scope){
    
    // Seleccion del frame
    var frames = ['inscripcion', 'sorteo', 'grupos', 'llave'];
    $scope.seleccionarFrame = frame => {
        $scope.seSeleccionoFrameList = frames.map( (f, i, a) => {return {type: f, value: f == frame};} );
    };
    
    $scope.seleccionarFrame('inscripcion');
    
    
    
    $scope.getSeSeleccionoFrame = function(type){
        for(var i = 0; i < $scope.seSeleccionoFrameList.length; i++) {
            if($scope.seSeleccionoFrameList[i].type == type)
                return $scope.seSeleccionoFrameList[i];
        }
    };
    
    $scope.seSeleccionoFrame = function(type){
        return $scope.getSeSeleccionoFrame(type).value;
    };
    
    /////////////////////////////////////////////
    
    // Frame Inscripcion
    
    $scope.jugadores_inscriptos = [];
    
    $scope.nuevo_jugador = {
        nombre: "",
        club: "",
        rating: 0
    };
    
    $scope.reset_nuevo_jugador = function(){
        $scope.nuevo_jugador = {
            nombre: "",
            club: "",
            rating: 0
        }      
    };
    
    $scope.agregarNuevoJugador = function(){
        $scope.jugadores_inscriptos.push($scope.nuevo_jugador);
        $scope.reset_nuevo_jugador();
    };    
    
    $scope.eliminarJugador = jugador => {
        $scope.jugadores_inscriptos.splice($scope.jugadores_inscriptos.indexOf(jugador), 1);
    };
    
    /////////////////////////////////////////////
    
    // Frame Sorteo
    
    // sorteador
    //vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    
    $scope.seed = (prefered_group_size, players) => {
        var seeding_info = {sentido: true, next_group: 0};
        var groups = [];
        for (var i=0; i< Math.floor(players.length / prefered_group_size); i++){
            groups.push({id: i, jugadores: [], partidos: []});
        }
        return players.reduce((prev, p, i)=>{
            next_group_for_player(p, seeding_info, prev).jugadores.push(p);
            seeding_info = next_group_asignation(seeding_info, prev);
            return prev;
        }, groups);
    }

    function next_group_for_player (player, seeding_info, groups){
        if (all_groups_have_this_club(player.club, groups)){ // aca se deberia comprobar si es el ultimo jugador a asignar
            return groups[seeding_info.next_group];
        }else {
            return first_fitting_group(player, seeding_info, groups);
        }
    }

    function all_groups_have_this_club(club, groups){
        return groups.reduce((r, g) => {return group_have_club(g, club) && r;}, true);
    }

    function group_have_club(group, club){
        return group.jugadores.reduce((r, p) => {return (p.club == club) || r}, false);
    }

    function first_fitting_group(player, seeding_info, groups){
        var local_seeding_info = seeding_info;
        while (group_doesnt_fit_player(player, groups[local_seeding_info.next_group])){
            local_seeding_info = next_group(local_seeding_info, groups);
        }
        return groups[local_seeding_info.next_group];
    }

    function next_group(seeding_info, groups){
        var local_seeding_info = seeding_info;
        if (is_border(seeding_info.next_group, seeding_info.sentido, groups)){
            local_seeding_info.sentido = !local_seeding_info.sentido;
        }else{
            if (seeding_info.sentido){
                local_seeding_info.next_group ++;
            }else{
                local_seeding_info.next_group --;
            }
        }	
        return local_seeding_info;
    }

    function group_doesnt_fit_player(player, group){
        return group_have_club(group, player.club);
    }

    function is_border(next_group, sentido, groups){
        return ((next_group === 0) & (!sentido )) || (((next_group == (groups.length) - 1)) && sentido);
    }

    //------------------------------------------------

    function next_group_asignation(seeding_info, groups){
        var local_seeding_info = seeding_info;
        if (!group_have_less_players_than_others(groups[local_seeding_info.next_group], groups)){
            local_seeding_info = next_group(local_seeding_info, groups);
            while (!is_next_group(groups[local_seeding_info.next_group], groups)){
                local_seeding_info = next_group(local_seeding_info, groups);
            }
        }		
        return local_seeding_info;
    }

    function group_have_less_players_than_others(group, groups){
        return group.jugadores.length < groups.map( g => {return g.jugadores.length}).reduce((max, l) => {return (max > l ? max : l );});
    }

    function is_next_group(group, groups){
        return group_have_less_players_than_others(group, groups)                              ||
                groups.reduce((p,g)=>{return (g.jugadores.length == group.jugadores.length) && p},true);
    };
    
    //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  //
    
    $scope.cant_por_grupo = 0;
    $scope.sets_grupo = 0;
      
    $scope.asignar_grupos = function(){
        $scope.jugadores_inscriptos.sort((j1,j2) => {return j2.rating - j1.rating});
        $scope.grupos = $scope.seed($scope.cant_por_grupo, $scope.jugadores_inscriptos);
        crearPartidosGrupos();
        reset_grupos_mostrados();
    };
        
    function crearPartidosGrupos(){
        $scope.grupos = $scope.grupos.map(grupo => {
            grupo.partidos = crearPartidosPara(grupo.jugadores);
            return grupo;
        });
    };
          
    function crearPartidosPara(jugadores){
        return jugadores.map((j,id) => {
            var local_jds = copy(jugadores);
            return local_jds.splice(id+1, jugadores.length-id+1).reduce((r, jo, idO)=>{
                r.push({jugador1: {id: id,       nombre: j.nombre},
                        jugador2: {id: idO+id+1, nombre:jo.nombre},
                        sets: crearSets(id, idO+id+1, jugadores.length),
                        final: listFor(id, idO+id+1, jugadores.length)
                       });
                
                return r;
            }, []);
        }).reduce((r,e) => {return r.concat(e)}, []);   
    }
    
      var cant_sets = 5;
    function crearSets(idj, ido, len){
        return Array(cant_sets).fill(0).map(e => {return listFor(idj,ido, len)});
    }
    
    function listFor(id,idO, len){
        var r = Array(len);
        r[id] = 0;
        r[idO] = 0;
        return r;
    }
        
        
    function copy(arr){
        return arr.reduce((r,e) => {r.push(e); return r}, []); 
    }
      
      
    /////////////////////////////////////////////
    
    // Frame Grupos
    
    $scope.grupos = [];
    $scope.seSelecciono_todosLosGrupos = true;
    $scope.grupos_mostrados = [];
      
    $scope.mostrar_todos_grupos = function(){
        reset_grupos_mostrados();
        $scope.seSelecciono_todosLosGrupos = true;
    };
    
    $scope.mostrar_grupo = function(id){
        $scope.seSelecciono_todosLosGrupos = false;
        reset_grupos_mostrados();
        $scope.grupos_mostrados[id].mostrar = true;
    };
    
    function reset_grupos_mostrados(){
        $scope.grupos_mostrados = $scope.grupos.map(g => {return {mostrar:false, editar: false}});
    };
      
    $scope.seSelecciono_grupo = function(id){
        return $scope.grupos_mostrados[id].mostrar;
    };
      
    $scope.editar_grupo = function(id){
        if (!$scope.grupos_mostrados[id].editar){
            $scope.mostrar_grupo(id);
            $scope.grupos_mostrados[id].editar = true;
        }else{
            $scope.grupos_mostrados[id].editar = false;
        }
    };
      
    $scope.editando_grupo = function(id){
        return $scope.grupos_mostrados[id].editar;
    }
    
    $scope.resultadoEnGrupoDeContra = function(grupo, jugador, jOp){
        if (jugador.nombre === jOp.nombre){return "- X -";}
        var partido = partidosJugadosEnGrupoPor(grupo, jugador).filter(p => {return jugadorParticipoDePartido(p, jOp)})[0];
        return setsGanadosEnPartidoPor(partido, jugador) + " - " + setsGanadosEnPartidoPor(partido, jOp);
    }
    
    function jugadorParticipoDePartido(partido, jugador){
        return (partido.jugador1.nombre === jugador.nombre) || 
               (partido.jugador2.nombre === jugador.nombre)
    }
    
    function partidosJugadosEnGrupoPor(grupo, jugador){
        return grupo.partidos.filter(p => {return jugadorParticipoDePartido(p, jugador)});
    }
      
      
    function setsGanadosEnPartidoPor(partido, jugador){
        if (partido.jugador1.nombre === jugador.nombre){
            return parseInt(partido.final[partido.jugador1.id]);
        }else{
            return parseInt(partido.final[partido.jugador2.id]);
        }
    }
      
    function setsPerdidosEnPartidoPor(partido, jugador){
        if (partido.jugador1.nombre === jugador.nombre){
            return parseInt(partido.final[partido.jugador2.id]);
        }else{
            return parseInt(partido.final[partido.jugador1.id]);
        }
    }
      
    function puntosGanadosEnPartidoPor(partido, jugador){
        if (partido.jugador1.nombre === jugador.nombre){
            return partido.sets.reduce((r,s) => {return parseInt(s[partido.jugador1.id]) + r}, 0);
        }else{
            return partido.sets.reduce((r,s) => {return parseInt(s[partido.jugador2.id]) + r}, 0);
        }
    }
    
    function puntosPerdidosEnPartidoPor(partido, jugador){
        if (partido.jugador1.nombre === jugador.nombre){
            return partido.sets.reduce((r,s) => {return parseInt(s[partido.jugador2.id]) + r}, 0);
        }else{
            return partido.sets.reduce((r,s) => {return parseInt(s[partido.jugador1.id]) + r}, 0);
        }
    }
          
      
    function ganoPartido(partido, jugador){
        return setsGanadosEnPartidoPor(partido, jugador) === Math.floor(cant_sets / 2) + 1;
    }
      
    $scope.partidosGanadosEnGrupo = function (grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {if (ganoPartido(p, jugador)){return r + 1}else{return r}}, 0);
    }
    
    
    $scope.setsGanadosEnGrupo = function (grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {return r + setsGanadosEnPartidoPor(p, jugador);}, 0);
    }
    
    $scope.setsPerdidosEnGrupo = function(grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {return r + setsPerdidosEnPartidoPor(p, jugador);}, 0);
    }
    
    $scope.puntosGanadosEnGrupo = function (grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {return r + puntosGanadosEnPartidoPor(p, jugador);}, 0);
    }
    
    $scope.puntosPerdidosEnGrupo = function(grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {return r + puntosPerdidosEnPartidoPor(p, jugador);}, 0);
    }
    
    
    $scope.posicionEnGrupo = function(grupo, jugador){
        return grupo.jugadores.sort((j1,j2) => {return coeficienteEnGrupoPara(grupo,j2) - coeficienteEnGrupoPara(grupo,j1)})
                    .indexOf(jugador) + 1;
    }
      
    function coeficienteEnGrupoPara(grupo, jugador){
        if (otrosJugadoresGanaronLaMismaCantidadDePartidosEnGrupo(grupo, jugador)){
            var jugadores = jugadoresConMismaCantidadDePartidosGanadosEnGrupo(grupo, jugador);
            var subgrupo = {partidos: partidosDeJugadores(grupo, jugadores),
                            jugadores: jugadores};
            return $scope.partidosGanadosEnGrupo(grupo, jugador) + 1 - posicionEnSubgrupo(subgrupo, jugador)/10;
        }else{
            return $scope.partidosGanadosEnGrupo(grupo, jugador);
        }
    }
      
    function otrosJugadoresGanaronLaMismaCantidadDePartidosEnGrupo(grupo, jugador){
        return jugadoresConMismaCantidadDePartidosGanadosEnGrupo(grupo, jugador).length > 1;
    }
      
    function jugadoresConMismaCantidadDePartidosGanadosEnGrupo(grupo, jugador){
        return grupo.jugadores.filter(j => {return $scope.partidosGanadosEnGrupo(grupo, jugador) === 
                                                   $scope.partidosGanadosEnGrupo(grupo, j)});
    }
    
    function posicionEnSubgrupo(subgrupo, jugador){
        return subgrupo.jugadores.sort
                         ((j1,j2) => {return coeficienteEnSubgrupoPara(subgrupo, j2) - 
                                             coeficienteEnSubgrupoPara(subgrupo, j1)})
                        .indexOf(jugador) + 1;
    }
      
    function coeficienteEnSubgrupoPara(subgrupo, jugador){
        if (otrosJugadoresGanaronLaMismaCantidadDePartidosEnGrupo(subgrupo, jugador)){
            return $scope.partidosGanadosEnGrupo(subgrupo, jugador) + 
                  ($scope.setsGanadosEnGrupo(subgrupo, jugador) - $scope.setsPerdidosEnGrupo(subgrupo, jugador))     / 10 +
                  ($scope.puntosGanadosEnGrupo(subgrupo, jugador) - $scope.puntosPerdidosEnGrupo(subgrupo, jugador)) / 10000;
        }else{
            return $scope.partidosGanadosEnGrupo(subgrupo, jugador);
        }
    }
      
    function partidosDeJugadores(grupo, jugadores){
        return grupo.partidos.filter(
            p => {return jugadores.reduce(
                            (r,j) => {return r || jugadorParticipoDePartido(p,j)}, false)
                 }
        );
    }
      
    ///////////////////////// Test
    
    $scope.jugadores_inscriptos = [
        {nombre: "Amalia", club: "A", rating: 1000},
        {nombre: "Bermuda", club: "B", rating: 2000},
        {nombre: "Cecil", club: "C", rating: 3000},
        {nombre: "Drone", club: "D", rating: 4000},
        {nombre: "Epsilon", club: "E", rating: 5000},
        {nombre: "Felicia", club: "F", rating: 6000}
    ];
    
    
  }]);
})(window.angular);