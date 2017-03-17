angular.module('tournamentModule').factory('other_functions', 
                            [
                    function(){
                        
    return {
        format_group_id: format_group_id,
        format_date: format_date
    }
    
    function format_group_id(group_id){
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return alphabet[group_id];
    }
    
    function format_date(date){
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    }                    
    
}]);