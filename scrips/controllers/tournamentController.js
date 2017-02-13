angular.module('tournamentModule').controller('tournamentController',  
            ['$scope', 'groupsSeeder', 'bracketSeeder', 'matchesForBracket', 'bracketFunctions', 'xlsxParser',
    function($scope, seed_groups, seed_bracket, matches_for_bracket, bracket_functions, xlsx_parser){
    
    /******************************************/
        
       
    //Configuracion
        
    var directory_prefix = "file:///C:/Users/user/Documents/Proyectos/TDM_Manager/";
    var inputFileColumns = ["Nombre", "Club", "Rating"];
    var frames = ['inscripcion', 'grupos', 'llave', 'configuracion'];
    var start_frame = 'inscripcion';
    $scope.isStart = false;
    $scope.isTournament = true;
        
    $scope.agregarTodos = function(){
        $scope.jugadores_inscriptos = $scope.jugadores_previos;
    }
    
    
    /******************************************/
        
    // Inicio
        
    $scope.openNewTournament = function(){
        openInNewTab(directory_prefix + "index.html", "_blank");
    }
    
    ///////////////////////////////////////////////
    // Seleccion del frame
    $scope.seleccionarFrame = frame => {
        $scope.seSeleccionoFrameList = frames.map( f => {return {type: f, value: f == frame}} );
    };
    
    $scope.seleccionarFrame(start_frame);
    
    
    
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
    
    $scope.jugadores_previos = [];
    xlsx_parser.createListener('excel_file');
                
    $scope.load_previous_players = function(){
        $scope.jugadores_previos = xlsx_parser.getValue().map(
            p => {return {
                        nombre: p[inputFileColumns[0]],
                        club:   p[inputFileColumns[1]], 
                        rating: p[inputFileColumns[2]] };}
        );
    }
            
    $scope.jugadores_inscriptos = [];
    
    $scope.inscribirJugador = function(jugador){
        if(!$scope.jugadores_inscriptos.includes(jugador)){
            $scope.jugadores_inscriptos.push(jugador);                    
        }
        document.getElementById(jugador.rating + jugador.nombre + jugador.club).className = "success";
    }
        
    $scope.searchedPlayer = {
        nombre: "",
        club: ""
    }
    
    $scope.searchedInscriptedPlayer = {
        nombre: "",
        club: ""
    }
    
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
    
    $scope.eliminarJugador = (jugador, jugadores) => {
        jugadores.splice(jugadores.indexOf(jugador), 1);
        document.getElementById(jugador.rating + jugador.nombre + jugador.club).classList.remove("success");
    };
        
    
    $scope.seed_tournament = function(){
                                                        // Se ordenan de mayor a menor rating
        seed_players_in_groups(sort_players());         // Se sortean los grupos
        create_groups_matches();                        // Se crean lo partidos para los grupos
        
        seed_brackets();                                // Se sortean las llaves a y, si hay, b
        
        reset_grupos_mostrados();   
        reset_showed_bracket();
        
        $scope.seeded = true;
    };
        
    function seed_brackets(){
        if($scope.torneo.type.exist_bracket_b){
            $scope.bracket_b = create_bracket_matches(seed_references_in_bracket(bracket_b_references())); 
                            // Se sortea la llave b
        }
        $scope.bracket_a = create_bracket_matches(seed_references_in_bracket(bracket_a_references()));   
                            // Se sortea la llave a
    }
    
    function reset_showed_bracket(){
        $scope.selected_bracket = $scope.bracket_a;    
    }
    /////////////////////////////////////////////
    
    // Frame Grupos
    
    $scope.grupos = [];
    $scope.seSelecciono_todosLosGrupos = true;
    $scope.grupos_mostrados = [];
          
    $scope.mostrar_todos_grupos = function(){
        reset_grupos_mostrados();
        $scope.seSelecciono_todosLosGrupos = true;
        collapse('groups_menu');
    };
    
    $scope.mostrar_grupo = function(id){
        $scope.seSelecciono_todosLosGrupos = false;
        reset_grupos_mostrados();
        $scope.grupos_mostrados[id].mostrar = true;
        collapse('groups_menu');
    };
    
    function collapse(id){
        document.getElementById(id).classList.remove("in");        
    }
        
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
        return (parseInt(partido.final[partido.jugador1.id]) + parseInt(partido.final[partido.jugador2.id])) >= $scope.setsForVictory($scope.torneo.type.sets_groups_match);
    }
     
    function ganoPartido(partido, jugador){
        return setsGanadosEnPartidoPor(partido, jugador) === $scope.setsForVictory($scope.torneo.type.sets_groups_match);
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
      
    $scope.openGroupPrintPage = function(group){
        var players_names = group.jugadores.map(j => {return j.nombre;}).reduce((r,n) => {return r+","+n});
        var params = "id="+group.id+"&players="+players_names   + 
                create_info_players_params(group.jugadores)     +
                create_info_matches_params(group.partidos) ;
        
        openInNewTab(directory_prefix + "group_printer.html?" + params, "_blank");
    }
        
    function openInNewTab(url) {
      var win = window.open(url, '_blank');
      win.focus();
    }
        
    function create_info_players_params(players){
        return players.reduce((r, j) => {return r+"&"+j.nombre+"="+j.club+","+j.rating}, "");
    }
        
    function create_info_matches_params(matches){
        return matches.reduce((r,m) => {return r+"&match="+m.jugador1.nombre+","+m.jugador2.nombre+","+m.sets.length}, "");
    }
        
    //////////////////////////
    ///// frame llave ////////
    //////////////////////////
    
    $scope.bracket_a;
    $scope.bracket_b;
    $scope.selected_bracket;    
    $scope.selected_round = 0;
    $scope.any_bracket_is_selected = false;
    
    $scope.collapse_bracket = bracket => {
        collapse('bracket_' + bracket + '_rounds');
        $scope.any_bracket_is_selected = false;
    }        
        
    $scope.round_name = round_number => {
        switch(round_number){
            case 0: return "Final";
            case 1: return "Semifinales";
            case 2: return "4tos de final";
            case 3: return "8vos de final";
            case 4: return "16vos de final ";
            case 5: return "32vos de final ";
            case 6: return "64vos de final ";
        }
    }
        
    $scope.bracket_funcs = {
        count_rounds: (bracket)=>{if($scope.seeded){return bracket_functions.count_rounds(bracket)}},
        round_n: (bracket, n)=>{if($scope.seeded){return bracket_functions.round_n(bracket, n)}},
        list_per_round: (bracket)=>{if($scope.seeded){return bracket_functions.list_per_round(bracket)}}
       
    };
        
    $scope.rounds_numbers = function(bracket){
        var res = [];
        for(var i = $scope.bracket_funcs.count_rounds(bracket) -1; i>=0; i--){
            res.push(i);
        }
        return res;        
    }
    
    
    $scope.show_round = function(bracket, n){
        $scope.selected_bracket = bracket;
        $scope.selected_round = n;
        $scope.any_bracket_is_selected = true;
    }
    
    $scope.is_playable = function(match){
        return match.is_playable;
    }
    
    ///////////////////////////////////
    
    // Frame configuracion
    
    $scope.seeded = false;
    
    $scope.torneo = {
        nombre: "",
        type: {
            cant_per_group: 3,
            max: false,
            clasified_per_group: 2,
            exist_bracket_b: true,
            sets_groups_match: 5,
        },
        categoria: ""
    }
            
    $scope.setsForVictory = function(sets){
        return Math.floor($scope.sets / 2) + 1;
    }

        
    function sort_players(){
        $scope.jugadores_inscriptos.sort((j1,j2) => {return j2.rating - j1.rating});  
        return $scope.jugadores_inscriptos;
    }

    function seed_players_in_groups(players){
        $scope.grupos = seed_groups($scope.torneo.type.cant_per_group, players).map(
                (g,i) => {
                    return {
                        id: i, 
                        jugadores: g.players, 
                        get_player_in_position: function(position){
                            return this.jugadores.sort((j1,j2) => 
                                {return coeficienteEnGrupoPara(this,j2) - coeficienteEnGrupoPara(this,j1)})
                                    [position-1];
                        }
                    }
                }
            );
    }

    function create_groups_matches(){
        $scope.grupos = $scope.grupos.map(crearPartidosDeGrupoPara);
    };

    function seed_references_in_bracket(players_references){
        return seed_bracket(players_references);
    }
    
    function bracket_a_references(){
        var res = [];
        var local_groups = copy($scope.grupos);
        for(var i = 1; i <= $scope.torneo.type.clasified_per_group; i++){
            res = res.concat(local_groups.map(g => {
                return {ref: 'player reference', group_id: g.id, player_pos: i};
            }));
            local_groups.reverse();   // para sorteo en serpiente
        }
        return res;
    }
    
    function bracket_b_references(){
        var res = [];
        var local_groups = copy($scope.grupos);
        for(var i = $scope.torneo.type.clasified_per_group +1; i <= $scope.torneo.type.cant_per_group + 1; i++){
            for(var j = 0; j < local_groups.length; j++){
                if(i <= local_groups[j].jugadores.length){
                    res.push({ref: 'player reference', group_id: j, player_pos: i});
                }
            }
            local_groups.reverse();         // para sorteo en serpiente
        }
        return res;
    }

    function create_bracket_matches(bracket){  
        return matches_for_bracket(bracket, 5, $scope.grupos);
    }
          
    function crearPartidosDeGrupoPara(grupo){
        grupo.partidos = grupo.jugadores.map((j,id) => {
            var local_jds = copy(grupo.jugadores);
            return local_jds.splice(id+1, grupo.jugadores.length-id+1).reduce((r, jo, idO)=>{
                r.push({jugador1: {id: id,       nombre: j.nombre},
                        jugador2: {id: idO+id+1, nombre:jo.nombre},
                        sets: crearSets(id, idO+id+1, grupo.jugadores.length),
                        final: listFor(id, idO+id+1, grupo.jugadores.length)
                       });                
                return r;
            }, []);
        }).reduce((r,e) => {return r.concat(e)}, []);
        return grupo;   
    }
    
    function crearSets(idj, ido, len){
        var sets = [];        
        for (var i = 0; i < $scope.torneo.type.sets_groups_match; i++) {
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
    
    
  }]);