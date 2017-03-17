angular.module('tournamentModule').factory('printer', 
                            ['printer_components', 'other_functions', 'groups_functions',
                    function(components, of, groups_functions){
    
    var groups = [];
                        
    return {
        print_group: print_group
    };    
              
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
    
    function group_pdf_base(){
        var doc = new jsPDF();
                
        var sup_margin = 15;
        var lat_margin = 6;
        
        var alt_titulo = sup_margin;
        
        var alt_info = alt_titulo+25;
        var lat_info_1 = lat_margin;
        var lat_info_2 = lat_margin + 69;
        var lat_info_3 = lat_info_2 + 69;
        
        doc.rect(lat_margin, alt_titulo, 192, 20);
        doc.addImage(components.logo_fetemba, 'JPEG', lat_margin + 110, alt_titulo+2, 74, 16);

        doc.rect(lat_info_1, alt_info, 54, 20);
        doc.rect(lat_info_2, alt_info, 54, 20);
        doc.rect(lat_info_3, alt_info, 54, 20);
                
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(15);
        doc.text(lat_info_1 + 7, alt_info + 6, 'Categoria:');

        doc.setFontSize(15);
        doc.text(lat_info_2 + 7, alt_info + 6, 'Zona:');

        doc.setFontSize(15);
        doc.text(lat_info_3 + 7, alt_info + 6, 'Clasifican:');
        
        return doc;
    }                    
    
    function group_to_pdf_3_players(tournament, group){
        var doc = group_pdf_base();
        
        var sup_margin = 15;
        var lat_margin = 6;
                
        var alt_titulo = sup_margin;
        
        var alt_info = alt_titulo+25;
        var lat_info_1 = lat_margin;
        var lat_info_2 = lat_margin + 69;
        var lat_info_3 = lat_info_2 + 69;
        
        var alt_jugadores = alt_info + 40;
        
        var alt_titulos_partidos = alt_jugadores + 50;
        var alt_partidos_1 = alt_titulos_partidos + 10;
        var alt_partidos_2 = alt_partidos_1 + 20;
        var alt_partidos_3 = alt_partidos_2 + 20;
        
        var alt_firmas = alt_partidos_3 + 50;

        
        create_matches(lat_margin, alt_titulos_partidos, doc, group, tournament);
        
        //doc.addImage(components.barra_firmas, 'JPEG', lat_margin, alt_firmas, 192, 10);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(20);
        doc.text(lat_margin + 6, alt_titulo + 9, tournament.name);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text(lat_margin + 60, alt_jugadores, "Jugadores:");


        doc.setFont('helvetica', 'italic');
        doc.setFontSize(15);
        doc.text(lat_margin + 10, alt_titulo + 17, of.format_date(tournament.date));

        doc.setFontSize(25);
        doc.text(lat_info_1 + 9, alt_info + 17, tournament.category.str);

        doc.setFontSize(25);
        doc.text(lat_info_2 + 23, alt_info + 17, of.format_group_id(group.id));

        doc.setFontSize(25);
        doc.text(lat_info_3 + 23, alt_info + 17, tournament.format.bracket_a_clasified.toString());

        doc.setFontSize(20);
        group.players.reduce((r,p,i) => {
            r.text(lat_margin + 50, alt_jugadores+10*(i+1), 
                (i+1) + ". " + p.nombre + " - " + p.rating + " - " + p.club); return r;}, doc);
                
        return doc;
    }
                        
    function group_to_pdf_4_players(group){
        
    }
    function group_to_pdf_5_players(group){
        
    }
         
    function create_matches(lat_margin, alt_titulos_partidos, doc, group, tournament){
        if(tournament.format.sets_by_instance.groups == 3){
            create_matches_group_3_players_3_sets(lat_margin, alt_titulos_partidos, doc, group);
        }
        if(tournament.format.sets_by_instance.groups == 5){
            create_matches_group_3_players_5_sets(lat_margin, alt_titulos_partidos, doc, group);
        }
    }
                        
    function create_matches_group_3_players_3_sets(lat_margin, alt_titulos_partidos, doc, group){
        create_matches_group_3_players(lat_margin, alt_titulos_partidos, doc, 3, group);
        
        var alt_partidos_1 = alt_titulos_partidos + 10;
        var alt_partidos_2 = alt_partidos_1 + 20;
        var alt_partidos_3 = alt_partidos_2 + 20;
        
        var y_dis_player_c = (y)=>{return y+11};
        var x_dis_player_c = (x)=>{return x+135};
        
        var player_1 = groups_functions.get_player_in_position(group, 1);
        var player_2 = groups_functions.get_player_in_position(group, 2);
        var player_3 = groups_functions.get_player_in_position(group, 3);
        
        doc.text(x_dis_player_c(lat_margin), y_dis_player_c(alt_partidos_1), player_2.nombre);
        doc.text(x_dis_player_c(lat_margin), y_dis_player_c(alt_partidos_2), player_3.nombre);
        doc.text(x_dis_player_c(lat_margin), y_dis_player_c(alt_partidos_3), player_1.nombre);
    }
                        
    function create_matches_group_3_players_5_sets(lat_margin, alt_titulos_partidos, doc, group){
        create_matches_group_3_players(lat_margin, alt_titulos_partidos, doc, 5, group);
        
        var alt_partidos_1 = alt_titulos_partidos + 10;
        var alt_partidos_2 = alt_partidos_1 + 20;
        var alt_partidos_3 = alt_partidos_2 + 20;
        
        var y_dis_player_c = (y)=>{return y+11};
        var x_dis_player_c = (x)=>{return x+177};
        
        var player_1 = groups_functions.get_player_in_position(group, 1);
        var player_2 = groups_functions.get_player_in_position(group, 2);
        var player_3 = groups_functions.get_player_in_position(group, 3);
        
        doc.text(x_dis_player_c(lat_margin), y_dis_player_c(alt_partidos_1), "2");
        doc.text(x_dis_player_c(lat_margin), y_dis_player_c(alt_partidos_2), "3");
        doc.text(x_dis_player_c(lat_margin), y_dis_player_c(alt_partidos_3), "1");
    }
                        
    function create_matches_group_3_players(lat_margin, alt_titulos_partidos, doc, sets, group){
        var alt_partidos_1 = alt_titulos_partidos + 10;
        var alt_partidos_2 = alt_partidos_1 + 20;
        var alt_partidos_3 = alt_partidos_2 + 20;
        
        var ancho_nombre_jugador = 62;
        var ancho_set = 17;
        var fin_sets = lat_margin + ancho_nombre_jugador + ancho_set * (sets + 1);
        
        doc.setFillColor(200,191,231);
        doc.rect(lat_margin, alt_titulos_partidos, 192,10, 'F');
        doc.rect(lat_margin + ancho_nombre_jugador + ancho_set*sets, alt_titulos_partidos, ancho_set, 70, 'F');
        
        doc.line(lat_margin, alt_partidos_1 + 10, fin_sets, alt_partidos_1 + 10);
        doc.line(lat_margin, alt_partidos_2 + 10, fin_sets, alt_partidos_2 + 10);
        doc.line(lat_margin, alt_partidos_3 + 10, fin_sets, alt_partidos_3 + 10);
                
        for(var i = 1; i <= sets; i++){
            doc.line(lat_margin + ancho_nombre_jugador + ancho_set*i, alt_titulos_partidos, 
                     lat_margin + ancho_nombre_jugador + ancho_set*i, alt_partidos_3 + 20);
        }
        
        doc.setLineWidth(0.3);
        doc.rect(lat_margin, alt_titulos_partidos, ancho_nombre_jugador, 70);
        doc.rect(fin_sets, alt_titulos_partidos, 192 - fin_sets + lat_margin, 70);
        
        doc.line(lat_margin + ancho_nombre_jugador, alt_titulos_partidos, 
                 lat_margin + ancho_nombre_jugador + ancho_set*(sets+1), alt_titulos_partidos);
        
        doc.line(lat_margin + ancho_nombre_jugador, alt_partidos_3 + 20, 
                 lat_margin + ancho_nombre_jugador + ancho_set*(sets+1), alt_partidos_3 + 20);
        
        for(var i=0; i < 3; i++){
            doc.line(lat_margin, alt_partidos_1 + 20*i, lat_margin + 192, alt_partidos_1 + 20*i);    
        }
        
        doc.setFontSize(12);
        
        
        var x_dis_player_a = (x)=>{return x+5};
        var x_dis_player_b = (x)=>{return x+5};
        
        var y_dis = (y)=>{return y+7};
        var y_dis_player_a = y_dis;
        var y_dis_player_b = (y)=>{return y_dis(y) + 10};
        var pos_arbitro = fin_sets + (192 - fin_sets + lat_margin)/2 - 6;
        
        
        doc.text(lat_margin + 22, y_dis(alt_titulos_partidos), "Jugadores");
        for(var i=1; i <= sets; i++){
            doc.text(lat_margin + ancho_nombre_jugador + ancho_set*i - 13, y_dis(alt_titulos_partidos), "Set " + i);
        }
        
        doc.text(fin_sets - 12, y_dis(alt_titulos_partidos), "Res.");
        doc.text(pos_arbitro, y_dis(alt_titulos_partidos), "Arbitro");
        
        var player_1 = groups_functions.get_player_in_position(group, 1);
        var player_2 = groups_functions.get_player_in_position(group, 2);
        var player_3 = groups_functions.get_player_in_position(group, 3);
        
        doc.text(x_dis_player_a(lat_margin), y_dis_player_a(alt_partidos_1), "1. " + player_1.nombre);
        doc.text(x_dis_player_b(lat_margin), y_dis_player_b(alt_partidos_1), "3. " + player_3.nombre);

        doc.text(x_dis_player_a(lat_margin), y_dis_player_a(alt_partidos_2), "1. " + player_1.nombre);
        doc.text(x_dis_player_b(lat_margin), y_dis_player_b(alt_partidos_2), "2. " + player_2.nombre);

        doc.text(x_dis_player_a(lat_margin), y_dis_player_a(alt_partidos_3), "2. " + player_2.nombre);
        doc.text(x_dis_player_b(lat_margin), y_dis_player_b(alt_partidos_3), "3. " + player_3.nombre);
        
    }
}]);



