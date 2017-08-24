angular.module('tournamentModule').factory('db_connection', 
                            [
                    function(){
                           
                        
    function save(key, obj){
        localStorage.setItem(key, JSON.stringify(obj));
    }
                        
    
    function get(key){
        return JSON.parse(localStorage.getItem(key));
    }
                        
    function remove(id){
        localStorage.removeItem(id);
    }
    
                        
    function start_bd(){
        console.log(localStorage);
    }
    
                        
                                            
    function start_bd(){
        if(get("id") == null){
            save("id", "0");
            save("ids", []);
            save("list_players", []);
        }
        console.log(localStorage);
    }
     
               
    function restart_bd(){
        for(var x in localStorage){
            remove(x);
        }
        start_bd();
    }
                        
    start_bd();
     
                        
    return {
        save: save,
        get: get,
        remove: remove
    }
    
}]);