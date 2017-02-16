angular.module('tournamentModule').factory('groups_matches_builder', 
                    [
            function(){
            
                
    function build_group_matches(sets){
        return (group) => {
            group.matches = group.players.map((j,id) => {
                var local_jds = copy(group.players);
                return local_jds.splice(id+1, group.players.length-id+1).reduce((r, jo, idO)=>{
                    r.push({jugador1: {id: id,       nombre: j.nombre},
                            jugador2: {id: idO+id+1, nombre:jo.nombre},
                            sets: crearSets(id, idO+id+1, group.players.length, sets),
                            final: listFor(id, idO+id+1, group.players.length)
                           });                
                    return r;
                }, []);
            }).reduce((r,e) => {return r.concat(e)}, []);
            return group;   
        };
    }            
        
    function crearSets(idj, ido, len, count_sets){
        var sets = [];        
        for (var i = 0; i < count_sets; i++) {
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
                               
                
    /////////////////////////////////////////////////////////////////            
                
                
    function build_groups_matches(groups, sets){
        return groups.map(build_group_matches(sets));        
    }
    
    return build_groups_matches;        
            
}]);