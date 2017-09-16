angular.module('tournamentModule').factory('print_group', 
                            ['printer_components', 'other_functions', 'groups_functions',
                    function(components, of, groups_functions){
    
    return print_group;
              
    function print_group(tournament, group){
        var pdf = group_to_pdf(tournament, group);
        pdf.autoPrint();        
        window.open(pdf.output('bloburl'), '_blank');
    }
                        
    ///////////////////////////////////////
    
    function group_to_pdf(tournament, group){
        switch (group.players.length){
            case 3: return group_to_pdf_3_players(tournament, group);
            case 4: return group_to_pdf_4_players(tournament, group);
            case 5: return group_to_pdf_5_players(tournament, group);
        }
    }
    
      function group_to_pdf_3_players(tournament, group){
        var mts = {
            sup_margin: 15,
            lat_margin: 6
        }
        
        mts.alt_titulo =  mts.sup_margin;
        
        mts.alt_info = mts.alt_titulo+25;
        mts.lat_info_1 = mts.lat_margin;
        mts.lat_info_2 = mts.lat_margin + 69;
        mts.lat_info_3 = mts.lat_info_2 + 69;
        
        mts.alt_jugadores = mts.alt_info + 40;
        
        mts.alt_titulos_partidos = mts.alt_jugadores + 50;
        mts.alt_partidos = mts.alt_titulos_partidos + 10;
        mts.match_height = 20;
        
        mts.alt_firmas = mts.alt_partidos_3 + 50;
        
        mts.width_player_name = 62;
        mts.width_set = 17;
        mts.bar_height = 10;
        mts.pos_arbitro = end_sets => end_sets + (192 - end_sets + mts.lat_margin)/2 - 6;        
        
        return [
            complete_tournament_info,
            load_players_info,
            load_matches
        ].reduce((r,f) => f(r, mts, tournament, group), group_pdf_base(mts));        
    }
                        
    function group_to_pdf_4_players(tournament, group){
        var mts = {
            sup_margin: 15,
            lat_margin: 6
        }
        
        mts.alt_titulo =  mts.sup_margin;
        
        mts.alt_info = mts.alt_titulo+25;
        mts.lat_info_1 = mts.lat_margin;
        mts.lat_info_2 = mts.lat_margin + 69;
        mts.lat_info_3 = mts.lat_info_2 + 69;
        
        mts.alt_jugadores = mts.alt_info + 35;
        
        mts.alt_titulos_partidos = mts.alt_info + 90;
        mts.alt_partidos = mts.alt_titulos_partidos + 10;
        mts.match_height = 20;
        
        mts.alt_firmas = mts.alt_partidos_3 + 50;
        
        mts.width_player_name = 62;
        mts.width_set = 17;
        mts.bar_height = 10;
        mts.pos_arbitro = end_sets => end_sets + (192 - end_sets + mts.lat_margin)/2 - 6;        
        
        return [
            complete_tournament_info,
            load_players_info,
            load_matches
        ].reduce((r,f) => f(r, mts, tournament, group), group_pdf_base(mts));
    }
                        
                        

    function group_to_pdf_5_players(group){
        
    }
                        
    ///// Functions for create a PDF for group
                        
    function group_pdf_base(mts){
        var doc = new jsPDF();
        
        doc.rect(mts.lat_margin, mts.alt_titulo, 192, 20);
        doc.addImage(components.logo_fetemba, 'JPEG', mts.lat_margin + 110, mts.alt_titulo+2, 74, 16);

        doc.rect(mts.lat_info_1, mts.alt_info, 54, 20);
        doc.rect(mts.lat_info_2, mts.alt_info, 54, 20);
        doc.rect(mts.lat_info_3, mts.alt_info, 54, 20);
                
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(15);
        doc.text(mts.lat_info_1 + 7, mts.alt_info + 6, 'Categoria:');

        doc.setFontSize(15);
        doc.text(mts.lat_info_2 + 7, mts.alt_info + 6, 'Zona:');

        doc.setFontSize(15);
        doc.text(mts.lat_info_3 + 7, mts.alt_info + 6, 'Clasifican:');
        
        return doc;
    }           
                        
    function complete_tournament_info(doc, mts, tournament, group){ 
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(20);
        doc.text(mts.lat_margin + 6, mts.alt_titulo + 9, tournament.name);
        
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(15);
//        console.log(tournament.date);
//        doc.text(mts.lat_margin + 10, mts.alt_titulo + 17, of.format_date(tournament.date));

        doc.setFontSize(25);
        doc.text(mts.lat_info_1 + 2, mts.alt_info + 17, tournament.category.str_s);

        doc.setFontSize(25);
        doc.text(mts.lat_info_2 + 23, mts.alt_info + 17, of.format_group_id(group.id));

        doc.setFontSize(25);
        doc.text(mts.lat_info_3 + 23, mts.alt_info + 17, group.clasified.toString());
        
        return doc;
    }    
                        
    function load_players_info(doc, mts, tournament, group){
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text(mts.lat_margin + 30, mts.alt_jugadores, "Jugadores:");
        
        doc.setFont('helvetica', 'italic');
        return group.players.reduce((r,p,i) => {
            r.text(mts.lat_margin + 20, mts.alt_jugadores+10*(i+1), 
                (i+1) + ". " + p.apellido + ", " + p.nombre + " - " + p.rating + " - " + p.club_corto); return r;}, doc);
    }
    
    function load_matches(doc, mts, tournament, group){
        return [
            create_matches_title_bar,
            create_matches,
            fill_matches_with_players
        ].reduce((r,f) => f(r, mts, tournament, group), doc);
    }
                        
    function create_matches_title_bar(doc, mts, tournament, group){
        var sets = group.matches[0].sets.length;        
        var end_sets = mts.lat_margin + mts.width_player_name + mts.width_set * (sets + 1);        
        
        doc.setLineWidth(0.4);
        doc.setFillColor(200,191,231);
        doc.rect(mts.lat_margin, mts.alt_titulos_partidos, 192, mts.bar_height, 'FD');
        
        doc.line(mts.lat_margin + mts.width_player_name, mts.alt_titulos_partidos, 
                 mts.lat_margin + mts.width_player_name, mts.alt_titulos_partidos + mts.bar_height);
        
        doc.line(mts.lat_margin + mts.width_player_name + mts.width_set*(sets), mts.alt_titulos_partidos, 
                 mts.lat_margin + mts.width_player_name + mts.width_set*(sets), mts.alt_titulos_partidos + mts.bar_height);
        
        doc.line(end_sets, mts.alt_titulos_partidos, 
                 end_sets, mts.alt_titulos_partidos + mts.bar_height);
        
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        var y_dis = (y)=>{return y+7};
        doc.text(mts.lat_margin + 22, y_dis(mts.alt_titulos_partidos), "Jugadores");
        doc.setLineWidth(0.1);
        for(var i = 1; i <= sets; i++){
            doc.line(mts.lat_margin + mts.width_player_name + mts.width_set*i, mts.alt_titulos_partidos, 
                     mts.lat_margin + mts.width_player_name + mts.width_set*i, mts.alt_titulos_partidos + mts.bar_height);   
            doc.text(mts.lat_margin + mts.width_player_name + mts.width_set*i - 13, y_dis(mts.alt_titulos_partidos), "Set " + i);
        }
        
        doc.text(end_sets - 12, y_dis(mts.alt_titulos_partidos), "Res.");
        doc.text(mts.pos_arbitro(end_sets), y_dis(mts.alt_titulos_partidos), "Arbitro");
        
        return doc;
    }
                        
    function create_matches(doc, mts, tournament, group){
        var sets = group.matches[0].sets.length;    
        var end_sets = mts.lat_margin + mts.width_player_name + mts.width_set * (sets + 1); 
        
        for(var i = 0; i < group.players.length * (group.players.length - 1) / 2; i++){
            // create_match
            var alt_init_match = mts.alt_partidos + mts.match_height * i;
            var alt_end_match = alt_init_match + mts.match_height;
            
            doc.setLineWidth(0.4);
            doc.setFillColor(200,191,231);
            doc.rect(mts.lat_margin, alt_init_match, 192, mts.match_height, '');
            doc.rect(end_sets - mts.width_set, alt_init_match, mts.width_set, mts.match_height, 'FD');
            
            doc.line(mts.lat_margin + mts.width_player_name, alt_init_match, 
                     mts.lat_margin + mts.width_player_name, alt_end_match);

            doc.line(end_sets - mts.width_set, alt_init_match, 
                     end_sets - mts.width_set, alt_end_match);

            doc.line(end_sets, alt_init_match,
                     end_sets, alt_end_match);
            
            doc.setLineWidth(0.1);
            for(var j = 1; j <= sets; j++){
                doc.line(mts.lat_margin + mts.width_player_name + mts.width_set*j, alt_init_match, 
                         mts.lat_margin + mts.width_player_name + mts.width_set*j, alt_end_match);   
            }
            doc.line(mts.lat_margin, alt_init_match + mts.match_height / 2, 
                     end_sets, alt_init_match + mts.match_height / 2);            
        }        
        return doc;
    }
                        
    function fill_matches_with_players(doc, mts, tournament, group){
        var sets = group.matches[0].sets.length;    
        var players = group.players;
        
        var end_sets = mts.lat_margin + mts.width_player_name + mts.width_set * (sets + 1); 
        
        var x_dis_player_a = mts.lat_margin + 5;
        var x_dis_player_b = mts.lat_margin + 5;
        var x_dis_player_c = end_sets + 5;
        
        var y_dis_player_a = (y)=>{return y+7};
        var y_dis_player_b = (y)=>{return y_dis_player_a(y) + 10};
        var y_dis_player_c = (y)=>{return y+11};
        
        
        return group.matches.reduce( (r, m, i) => {
            var alt_init_match = mts.alt_partidos + mts.match_height * i;
            
            var arbitro = 0;
            // arbitro:
            if((m.players[0] == 0 && m.players[1] == 1) || (m.players[1] == 0 && m.players[0] == 1)) arbitro = 2;
            if((m.players[0] == 0 && m.players[1] == 2) || (m.players[1] == 0 && m.players[0] == 2)) arbitro = 1;
            if((m.players[0] == 1 && m.players[1] == 2) || (m.players[1] == 1 && m.players[0] == 2)) arbitro = 0;
            
            
            
            r.text(x_dis_player_a, y_dis_player_a(alt_init_match), (m.players[0] + 1) + ". " + group.players[m.players[0]].apellido);
            r.text(x_dis_player_b, y_dis_player_b(alt_init_match), (m.players[1] + 1) + ". " + group.players[m.players[1]].apellido);
            r.text(x_dis_player_c, y_dis_player_c(alt_init_match), group.players[arbitro].apellido);
                
            return r;
        }, doc);
    }
                               
}]);



