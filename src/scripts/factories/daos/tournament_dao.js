angular.module('tournamentModule').factory('tournament_dao', 
                            ['db_connection',
                    function(db_connection){
   
                        
    function remove_id(id){
        db_connection.save("ids", db_connection.get("ids").filter(id_i => {return id_i != id}));
    }
                        
    function next_id(){
        return db_connection.get("id");
    }
                        
    function gen_next_id(){
        db_connection.save("id", (parseInt(next_id()) + 1).toString() );
    }
           
    function ids(){
        return db_connection.get("ids");
    }
                        
    function push_id(id){
        var ids = db_connection.get("ids");
        ids.push(id);
        db_connection.save("ids", ids);
        
        console.log("Ids: ", db_connection.get("ids"));
        
    }
    
                        
                        
    /* Public */
                        
    function save_newTournament(tournament){
        tournament.id = next_id();
        
        db_connection.save(tournament.id, tournament);
        push_id(tournament.id)
        gen_next_id();
        
        console.log("guardado torneo ", tournament.name, " con id ", tournament.id);
        
        return tournament.id;
    }
                        
    function save_tournament(tournament){
        db_connection.save(tournament.id, tournament);
    }
                        
    function get_tournament_by_id(id){
        return db_connection.get(id);
    }
                    
    function get_all(){
        console.log("Torneos guardados: ", ids().map(id => get_tournament_by_id(id)));
        return ids().map(id => get_tournament_by_id(id));
    }
          
    function remove_tournament(tournament){
        console.log("Torneo a eliminar: ", tournament);
        db_connection.remove(tournament.id);
        remove_id(tournament.id);
    }
                        
    /******************************************************/
                        
    return {
        save_new: save_newTournament,
        save: save_tournament,
        get_by_id: get_tournament_by_id,
        all: get_all,
        remove: remove_tournament
    }
    
}]);