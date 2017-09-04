(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('GroupDirectiveController',  
                ['groups_functions', '$scope', 'other_functions',
        function(groups_functions,    $scope,   other_functions){
            
            
        
        
        $scope.format_group_id = other_functions.format_group_id;

            
        $scope.resultadoEnGrupoDeContra = function(grupo, jugador, jOp){
            if (jugador == jOp){return "- X -";}
            var partido = groups_functions.partidosJugadosEnGrupoPor(grupo, jugador)
                                .filter(p => {return groups_functions.jugadorParticipoDePartido(p, jOp)})[0];
            
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
    

}])})()