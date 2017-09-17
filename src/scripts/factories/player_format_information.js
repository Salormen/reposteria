angular.module('tournamentModule').factory('playerFormat', [function(){
   
    return {
        justName: justName,
        justLastName: justLastName,
        lastNameWithNamesInitial: lastNameWithNamesInitial,
        lastNameWithName: lastNameWithName
    }
    
    // Private - Implementations
    
    
    function justName(player){
        return player.nombre;
    }
    
    function justLastName(player){
        return player.apellido;
    }
    
    function lastNameWithNamesInitial(player){
        return player.apellido + ", " + player.nombre.slice(0,1);
    }
    
    function lastNameWithName(player){
        return player.apellido + ", " + player.nombre;
    }
}])