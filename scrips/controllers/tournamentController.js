angular.module('tournamentModule').controller('tournamentController',  ['$scope', 'seederGroups', 'seederEliminationBracket', function($scope, seederGroups, crearLlave){
    
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
    
    $scope.seed = function(prefered_group_size, players){
        return seederGroups(prefered_group_size, players).map(g => {return {id: g.id, jugadores: g.players}});
    }
    //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  //
    
    $scope.cant_por_grupo = 3;
    $scope.sets_grupo = 5;
    $scope.setsParaLaVictoria = Math.floor($scope.sets_grupo / 2) + 1;
      
    $scope.asignar_grupos = function(){
        $scope.jugadores_inscriptos.sort((j1,j2) => {return j2.rating - j1.rating});
        $scope.grupos = $scope.seed($scope.cant_por_grupo, $scope.jugadores_inscriptos);
        crearPartidosGrupos();
        reset_grupos_mostrados();
        crearPartidosLlave();
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
    
    function crearSets(idj, ido, len){
        var sets = [];        
        for (var i = 0; i < $scope.sets_grupo; i++) {
            sets.push(listFor(idj,ido, len));
        }
        return sets;
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
      
    function crearPartidosLlave(){
        $scope.llave = crearLlave($scope.jugadores_inscriptos.map(j => {return j.nombre}), 5);
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
    
    $scope.difPartidosGanadosPerdidosEnGrupo = function (grupo, jugador){
        return $scope.partidosGanadosEnGrupo(grupo, jugador) + "/" + $scope.partidosPerdidosEnGrupo(grupo, jugador)
    }
    
    $scope.difSetsGanadosPerdidosEnGrupo = function (grupo, jugador){
        return $scope.setsGanadosEnGrupo(grupo, jugador) + "/" + $scope.setsPerdidosEnGrupo(grupo, jugador)
    }
    
    $scope.difPuntosGanadosPerdidosEnGrupo = function (grupo, jugador){
        return $scope.puntosGanadosEnGrupo(grupo, jugador) + "/" + $scope.puntosPerdidosEnGrupo(grupo, jugador)
    }
    
    function jugadorParticipoDePartido(partido, jugador){
        return (partido.jugador1.nombre === jugador.nombre) || 
               (partido.jugador2.nombre === jugador.nombre)
    }
    
    function partidosJugadosEnGrupoPor(grupo, jugador){
        return grupo.partidos.filter(p => {return jugadorParticipoDePartido(p, jugador)});
    }
    
    function seDisputoPartido(partido){
        return (parseInt(partido.final[partido.jugador1.id]) + parseInt(partido.final[partido.jugador2.id])) >= $scope.setsParaLaVictoria;
    }
     
    function ganoPartido(partido, jugador){
        return setsGanadosEnPartidoPor(partido, jugador) === $scope.setsParaLaVictoria;
    }
      
    function perdioPartido(partido, jugador){
        return seDisputoPartido(partido) && !ganoPartido(partido, jugador);
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
          
      
    
      
      
    /////////////////////////////////////////////////////
      
    $scope.partidosGanadosEnGrupo = function (grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {if (ganoPartido(p, jugador)){return r + 1}else{return r}}, 0);
    }
    
    $scope.partidosPerdidosEnGrupo = function (grupo, jugador){
        return partidosJugadosEnGrupoPor(grupo, jugador).reduce((r,p) => {if (perdioPartido(p, jugador)){return r + 1}else{return r}}, 0);
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
    
    /////////////////////////////////////////////////////
    
    
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
      
    //////////////////////////
    ///// frame llave ////////
    //////////////////////////
    
    
    
    ///////////////////////// Test
    
    $scope.jugadores_inscriptos = [
        {nombre: "Amalia", club: "A", rating: 1000},
        {nombre: "Bermuda", club: "B", rating: 2000},
        {nombre: "Cecil", club: "C", rating: 3000},
        {nombre: "Drone", club: "D", rating: 4000},
        {nombre: "Epsilon", club: "E", rating: 5000},
        {nombre: "Felicia", club: "F", rating: 6000},
        {nombre: "Gillermo", club: "G", rating: 7000},
        {nombre: "Horacio", club: "H", rating: 8000}
    ];
    
    
  }]);