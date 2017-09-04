angular.module('tournamentModule').factory('groups_matches_builder', 
                    [
            function(){
            
                
    function build_group_matches(sets){
        return (group) => {
            group.matches = group.players.map((j,id) => {
                var local_jds = copy(group.players);
                return local_jds.splice(id+1, group.players.length-id+1).reduce((r, jo, idO)=>{
                    r.push({players: [id, idO+id+1],
                            sets: crearSets(sets),
                            final: [0,0],
                            group_id: group.id
                           });                
                    return r;
                }, []);
            }).reduce((r,e) => {return r.concat(e)}, []);
            return group;   
        };
    }    
        
  function crearSets(setsPartido){
        var sets = []
        for (var i = 0; i<setsPartido; i++){
            sets.push([0,0]);
        }
        return sets;
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