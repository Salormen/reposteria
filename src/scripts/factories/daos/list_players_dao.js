angular.module('tournamentModule').factory('list_players_dao', 
                            ['db_connection',
                    function(db_connection){
                        
    /* Public */
                        
    function save_new_list_players(list_players){
        db_connection.save("list_players", list_players);
    }
     
    function get_list_players(){
        return db_connection.get("list_players");
    }                    
                        
    function remove(){
        console.log("Eliminando lista de jugadores");
        db_connection.remove("list_players");
    }
                        
    /******************************************************/
                        
    return {
        save: save_new_list_players,
        get: get_list_players,
        remove: remove
    }
    
}]);