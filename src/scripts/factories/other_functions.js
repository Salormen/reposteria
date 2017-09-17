angular.module('tournamentModule').factory('other_functions', 
                            [
                    function(){
                        
    return {
        format_group_id: format_group_id,
        format_date: format_date,
        nList: nList
    }
    
    function format_group_id(group_id){
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return alphabet[group_id];
    }
    
    function format_date(date){
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    }        
    
                        
    /*
     * Returns a list of integers from init to end, inclusive
     */
    function nList(init, end){
        var res = [];
        for (var i = init; i <= end; i++){
            res.push(i);
        }
        return res;
    }
    
}]);