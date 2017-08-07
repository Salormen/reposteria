angular.module('tournamentModule').factory('print_bracket_matches', 
                            ['print_group',
                    function(print_group){
                            
    return print_bracket_matches;
                        
                        
    // Max n matches -> find n :P
    function print_bracket_matches(tournament, matches){
        var pdf = matches_to_pdf(tournament, matches);
        //pdf.autoPrint();        
        window.open(pdf.output('bloburl'), '_blank');
    }
                        
    function matches_to_pdf(tournament, matches){
        var mts = {
            sup_margin: 0,
            lat_margin: 6
        }
        
        mts.width = 192;
        
        mts.rel_alt_info = 5;
        mts.rel_alt_match = 30;
        mts.rel_alt_umpire = 60;
        mts.bars_height = 10;
        mts.distance_init_match = 75
        
        mts.x_tounament_name = mts.lat_margin + 5;
        mts.x_bracket_name = mts.lat_margin + 5;
        mts.x_category_name = mts.lat_margin + 100;
        mts.x_instance_name = mts.lat_margin + 100;
        
        mts.x_player_name = mts.lat_margin + 5;
        mts.x_umpire = mts.lat_margin + 15;
        
        mts.x_players = (width) => mts.lat_margin + width/2 - 11;
        mts.x_set = (end) => end - 7;
        mts.x_res = (end) => end - 13;
        
        mts.width_set = 17;
        
        return [
                create_matches_structure,
                complete_matches_info
               ].reduce((r,f) => f(r, mts, tournament, matches), group_pdf_base());        
    }
                        
    function group_pdf_base(){
        var doc = new jsPDF();
        return doc;
    }
                        
    function create_matches_structure(doc, mts, tournament, matches){
        return matches.reduce((r,m,i) => {
            var y_init = mts.sup_margin + mts.distance_init_match * i;
            r.setLineWidth(0.4);
            r.setFillColor(200,191,231);
            
            r.rect(mts.lat_margin, y_init + mts.rel_alt_info, 
                     mts.width, mts.bars_height * 2, '');
            
            r.line(mts.lat_margin,             y_init + mts.rel_alt_info + mts.bars_height, 
                     mts.lat_margin + mts.width, y_init + mts.rel_alt_info + mts.bars_height);
                        
            r.line(mts.lat_margin + 95, y_init + mts.rel_alt_info, 
                     mts.lat_margin + 95, y_init + mts.rel_alt_info + mts.bars_height * 2);
            
            
            r.rect(mts.lat_margin, y_init + mts.rel_alt_match, 
                     mts.width, mts.bars_height * 3, '');
                        
            r.rect(mts.lat_margin + mts.width - mts.width_set, y_init + mts.rel_alt_match,
                   mts.width_set, mts.bars_height * 3, 'FD');
            
            r.line(mts.lat_margin,             y_init + mts.rel_alt_match + mts.bars_height, 
                   mts.lat_margin + mts.width, y_init + mts.rel_alt_match + mts.bars_height);
            
            r.line(mts.lat_margin + mts.width - mts.width_set * (m.sets.length + 1), y_init + mts.rel_alt_match, 
                   mts.lat_margin + mts.width - mts.width_set * (m.sets.length + 1), y_init + mts.rel_alt_match + mts.bars_height * 3);   
            
            r.setLineWidth(0.1);
            
            r.line(mts.lat_margin,             y_init + mts.rel_alt_match + mts.bars_height * 2, 
                   mts.lat_margin + mts.width, y_init + mts.rel_alt_match + mts.bars_height * 2);
            
            for (var j = 2; j <= m.sets.length; j++){
                r.line(mts.lat_margin + mts.width - mts.width_set * j, y_init + mts.rel_alt_match, 
                       mts.lat_margin + mts.width - mts.width_set * j, y_init + mts.rel_alt_match + mts.bars_height * 3);                
            }
            
            
            return r;
        }, doc);
    }
                        
    function complete_matches_info(doc, mts, tournament, matches){        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        var y_dis = (y)=>{return y+7};
        
        return matches.reduce((r,m,i) => {
            var sets = m.sets.length;
            var y_init = mts.sup_margin + mts.distance_init_match * i;   
            
            // Match info
            r.text(mts.x_tounament_name, y_dis(y_init + mts.rel_alt_info), tournament.name);
            r.text(mts.x_category_name, y_dis(y_init + mts.rel_alt_info), tournament.category.str_s);
            r.text(mts.x_bracket_name, y_dis(y_init + mts.rel_alt_info + mts.bars_height), m.bracket);
            r.text(mts.x_instance_name, y_dis(y_init + mts.rel_alt_info + mts.bars_height), m.round); 
            
            // Match result
            r.text(mts.x_players(mts.width - (sets + 1) * mts.width_set), y_dis(y_init + mts.rel_alt_match), "Jugadores"); 
            for(var j = sets; j > 0; j--){
                r.text(mts.x_set(mts.width - (sets - j + 1) * mts.width_set), y_dis(y_init + mts.rel_alt_match), "Set " + j);
            }
            r.text(mts.x_res(mts.lat_margin + mts.width), y_dis(y_init + mts.rel_alt_match), "Res.");
            
            r.text(mts.x_player_name, y_dis(y_init + mts.rel_alt_match + mts.bars_height),     m.players[0].nombre);
            r.text(mts.x_player_name, y_dis(y_init + mts.rel_alt_match + mts.bars_height * 2), m.players[1].nombre);
            
            
            // Umpire
            r.text(mts.x_umpire, y_dis(y_init + mts.rel_alt_umpire), "Arbitro:  "); // dinamizar
            
            
            return r;
        }, doc);
    }
                               
}]);

