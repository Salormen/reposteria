(function(angular) {
  'use strict';
angular.module('managerModule', [])
  .controller('Controller', function($scope) {
    
    // Seleccion del frame
    var frames = ['inscripcion', 'sorteo', 'zonas', 'llave'];
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
    
  });
})(window.angular);