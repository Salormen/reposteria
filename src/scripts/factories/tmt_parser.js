angular.module('tournamentModule').factory('tmt_parser', [function(){
         
    
    /**** Configuracion de columnas del archivo TMT ****/
    
    var tmt_id =            0;
    var apellido =          1;
    var nombre =            2;
    var dni =               3;
    var fecNac =            4;
    var sexo =              5;
    var localidad =         6;
    var provincia =         7;
    var pais =              8;
    var ultimoTorneo =      9;
    var rating =            10;
    var club_corto =        11;
    var club_largo =        12;
    
    
    
    var players = [];
    
    
    function createListener(id){
        document.getElementById(id).addEventListener('change', (e) => {
            
            var file = e.target.files[0];

            var reader = new FileReader();
            
            function createPlayer(line){
                return {
                    apellido: line[apellido],
                    nombre: line[nombre],
                    id: line[tmt_id],
                    rating: parseInt(line[rating]),
                    club_corto: line[club_corto],
                    club_largo: line[club_largo],
                    fecha_nacimiento: line[fecNac]
                };
            }
            
            reader.onload = function(elem){
                var data = elem.target.result;                
                players = data.split('\n').map(l => createPlayer(l.split('\t')));                
            };
            reader.readAsText(file);

        }, true);
    };
        
    
    
    function getValue(){
        return players;
    }
    
    
    return {
        createListener: createListener, 
        getValue: getValue
    };
    
}]);


