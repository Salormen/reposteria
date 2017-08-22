angular.module('tournamentModule').factory('tournament_dao', 
                            [
                    function(){
   
                        
    /* 
        Funciones de acceso y guardado a la bd, con el parseo correspondiente    
        
        TODO: en cuanto se guarden mas clases en la bd habria que extraerlo a otro modulo
    */
                        
                        
    function save(key, obj){
        localStorage.setItem(key, JSON.stringify(obj));
    }
                        
    
    function get(key){
        return JSON.parse(localStorage.getItem(key));
    }
                        
    function remove(id){
        localStorage.removeItem(id);
    }
    
    function remove_id(id){
        save("ids", get("ids").filter(id_i => {return id_i != id}));
    }
                        
    function next_id(){
        return get("id");
    }
                        
    function gen_next_id(){
        save("id", (parseInt(next_id()) + 1).toString() );
    }
           
    function ids(){
        return get("ids");
    }
                        
    function push_id(id){
        var ids = get("ids");
        ids.push(id);
        save("ids", ids);
        
        console.log("Ids: ", get("ids"));
        
    }
                        
    function start_bd(){
        if(get("id") == null){
            save("id", "0");
            save("ids", []);
        }
        console.log(localStorage);
    }
                        
    function restart_bd(){
        if(get("id") != null){
            localStorage.removeItem("id");
            localStorage.removeItem("ids");
            for(var i = 0; i<100; i++){
                localStorage.removeItem(i.toString());
            }
            start_bd();
        }
    }
                        
    start_bd();
                        
                        
    /* Public */
                        
    function save_newTournament(tournament){
        tournament.id = next_id();
        
        save(tournament.id, tournament);
        push_id(tournament.id)
        gen_next_id();
        
        console.log("guardado torneo ", tournament.name, " con id ", tournament.id);
        
        return tournament.id;
    }
                        
    function save_tournament(tournament){
        save(tournament.id, tournament);
    }
                        
    function get_tournament_by_id(id){
        return get(id);
    }
                    
    function get_all(){
        console.log("Torneos guardados: ", ids().map(id => get_tournament_by_id(id)));
        return ids().map(id => get_tournament_by_id(id));
    }
          
    function remove_tournament(tournament){
        console.log("Torneo a eliminar: ", tournament);
        remove(tournament.id);
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