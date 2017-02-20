angular.module('tournamentModule').controller('tournamentController',  
            ['$scope', 'tournament_builder', 'format_builders', 'groups_functions', 'bracketFunctions', 'xlsxParser',
    function($scope, build_tournament, format_builders, groups_functions, bracket_functions, xlsx_parser){
    
    /******************************************/
        
       
    //Configuracion
        
    var directory_prefix = "/home/juancho-r/Documentos/Proyectos/tdm_manager/";
    var inputFileColumns = ["Nombre", "Club", "Rating"];
    var frames = ['inscripcion', 'grupos', 'llave', 'configuracion'];
    var start_frame = 'inscripcion';
    $scope.isStart = false;
    $scope.isTournament = true;
        
    $scope.agregarTodos = function(){
        $scope.torneo.players = $scope.jugadores_previos;
    }
    
    
    /******************************************/
        
    // Inicio - Configuracion
        
    $scope.openNewTournament = function(){
        openInNewTab(directory_prefix + "index.html", "_blank");
    }
    
       
    $scope.seeded = false;
    
    $scope.torneo = build_tournament("Torneo Interescuelas 1", format_builders.interescuelas);
            
    $scope.setsForVictory = function(sets){
        return Math.floor($scope.sets / 2) + 1;
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
            
    $scope.torneo.players = [];
    
    $scope.inscribirJugador = function(jugador){
        if(!$scope.torneo.players.includes(jugador)){
            $scope.torneo.players.push(jugador);                    
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
        $scope.torneo.players.push($scope.nuevo_jugador);
        $scope.reset_nuevo_jugador();
    };    
    
    $scope.eliminarJugador = (jugador, jugadores) => {
        jugadores.splice(jugadores.indexOf(jugador), 1);
        document.getElementById(jugador.rating + jugador.nombre + jugador.club).classList.remove("success");
    };
        
    
    $scope.seed_tournament = function(){
        $scope.torneo.seed();
        
        reset_grupos_mostrados();   
        reset_showed_bracket();
        
        $scope.seeded = true;
    };
        
    
    function reset_showed_bracket(){
        $scope.selected_bracket = $scope.torneo.brackets[0];    
    }
    /////////////////////////////////////////////
    
    // Frame Grupos
    
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
        $scope.grupos_mostrados = $scope.torneo.groups.map(g => {return {mostrar:false, editar: false}});
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
        var partido = groups_functions.partidosJugadosEnGrupoPor(grupo, jugador).filter(p => {return groups_functions.jugadorParticipoDePartido(p, jOp)})[0];
        return groups_functions.setsGanadosEnPartidoPor(partido, jugador) + " - " + groups_functions.setsGanadosEnPartidoPor(partido, jOp);
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
    
          
            
      
    /////////////////////////////////////////////////////
      
    $scope.partidosGanadosEnGrupo = groups_functions.partidosGanadosEnGrupo;
    
    $scope.partidosPerdidosEnGrupo = groups_functions.partidosPerdidosEnGrupo;
    
    $scope.setsGanadosEnGrupo = groups_functions.setsGanadosEnGrupo;
    
    $scope.setsPerdidosEnGrupo = groups_functions.setsPerdidosEnGrupo;
    
    $scope.puntosGanadosEnGrupo = groups_functions.puntosGanadosEnGrupo;
    
    $scope.puntosPerdidosEnGrupo = groups_functions.puntosPerdidosEnGrupo;
    
    /////////////////////////////////////////////////////
    
    
    $scope.posicionEnGrupo = groups_functions.posicionEnGrupo;
      
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
    
    // Frame Resultados
 
    
  }]);