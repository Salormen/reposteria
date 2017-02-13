angular.module('groupPrinter').factory('pageParametersParser', [function(){
    
    function getData(){
        var parameters = location.search.substring(1).split("&");
        return parameters.map(unescape).map(p => {return {key: p.split("=")[0], value: p.split("=")[1]};});       
    }
         
    return getData;

}]);