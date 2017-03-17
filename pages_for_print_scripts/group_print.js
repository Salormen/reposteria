angular.module('groupPrinter').controller('groupPrinterController',  
            ['$scope', 'pageParametersParser', function($scope, parameters_parser){
                
 
    var params = parameters_parser();
    
    function getId(params){
        return params.filter(p => {return p.key == "id";})[0].value;
    }
    
    function getPlayers(params){
        var players_name = params.filter(p => {return p.key == "players";})[0].value.split(",");
        return params.filter(p => {return players_name.includes(p.key);}).map(p => {return {
                        name: p.key,
                        club:   p.value.split(",")[0],
                        rating: p.value.split(",")[1] 
        };});
    }
                
    function getMatches(params){
        return params.filter(p => {return p.key == "match";}).map(m => {
            var info = m.value.split(",");
            return {
                player1: info[0],
                player2: info[1],
                sets: info[2]
            };
        });
    }
                
    $scope.group = {
        id: getId(params),
        players: getPlayers(params),
        matches: getMatches(params)
    };
                
    $scope.numberList = function(init, end){
        var res = [];
        for (var i = init; i <= end; i++){
            res.push(i);
        }
        return res;
    }
            
    $scope.noMatchSymbol = function(oponent, player){
        if (oponent == player){return "-\\-"}
    }
    
    $scope.print_page = function(){
        document.getElementById("printButton").style.visibility = "hidden"; 
        window.print();
        document.getElementById("printButton").style.visibility = "visible";
    }
    
    $scope.print_page();
}]);