angular.module('tournamentModule').factory('xlsxParser', [function(){
         
    var players = [];
    
    function createListener(id, book){
        /*document.getElementById(id).addEventListener('change', (e) => {
            var file = e.target.files[0];
            var reader = new FileReader();
            var name = file.name;
            reader.onload = (elem) => {
                var data = elem.target.result;
                var workbook = XLSX.read(data, {type: 'binary'});        
                //players = XLSX.utils.sheet_to_json(workbook.Sheets[book]);
                players = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            };
            reader.readAsBinaryString(file);
        }, true);*/
    };
        
    function getValue(){
        return players;
    }
    
    
    return {createListener: createListener, getValue: getValue};
    
}]);


