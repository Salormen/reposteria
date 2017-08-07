angular.module('tournamentModule').factory('printer', 
                            ['print_group', 'print_bracket_matches',
                    function(print_group, print_bracket_matches){
                            
    return {
        print_group: print_group,
        print_bracket_matches: print_bracket_matches
    };    
              
                               
}]);



