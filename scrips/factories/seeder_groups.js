 angular.module('tournamentModule').factory('seederGroups', [function(){

    function seed(prefered_group_size, players) {
        var seeding_info = {sentido: true, next_group: 0};
        var groups = [];
        for (i=0; i< Math.floor(players.length / prefered_group_size); i++){
            groups.push({id: i, players: []});
        }
        return players.reduce((prev, p, i)=>{
            next_group_for_player(p, seeding_info, prev).players.push(p);
            seeding_info = next_group_asignation(seeding_info, prev);
            return prev;
        }, groups);
    }

    function next_group_for_player (player, seeding_info, groups){
        if (all_groups_have_this_club(player.club, groups)){ // aca se deberia comprobar si es el ultimo jugador a asignar
            return groups[seeding_info.next_group];
        }else {
            return first_fitting_group(player, seeding_info, groups);
        }
    }

    function all_groups_have_this_club(club, groups){
        return groups.reduce((r, g) => {return group_have_club(g, club) && r;}, true);
    }

    function group_have_club(group, club){
        return group.players.reduce((r, p) => {return (p.club == club) || r}, false);
    }

    function first_fitting_group(player, seeding_info, groups){
        var local_seeding_info = seeding_info;
        while (group_doesnt_fit_player(player, groups[local_seeding_info.next_group])){
            local_seeding_info = next_group(local_seeding_info, groups);
        }
        return groups[local_seeding_info.next_group];
    }

    function next_group(seeding_info, groups){
        var local_seeding_info = seeding_info;
        if (is_border(seeding_info.next_group, seeding_info.sentido, groups)){
            local_seeding_info.sentido = !local_seeding_info.sentido;
        }else{
            if (seeding_info.sentido){
                local_seeding_info.next_group ++;
            }else{
                local_seeding_info.next_group --;
            }
        }	
        return local_seeding_info;
    }

    function group_doesnt_fit_player(player, group){
        return group_have_club(group, player.club);
    }

    function is_border(next_group, sentido, groups){
        return ((next_group === 0) & (!sentido )) || (((next_group == (groups.length) - 1)) && sentido);
    }

    ///////////////////////////////

    function next_group_asignation(seeding_info, groups){
        var local_seeding_info = seeding_info;
        if (!group_have_less_players_than_others(groups[local_seeding_info.next_group], groups)){
            local_seeding_info = next_group(local_seeding_info, groups);
            while (!is_next_group(groups[local_seeding_info.next_group], groups)){
                local_seeding_info = next_group(local_seeding_info, groups);
            }
        }		
        return local_seeding_info;
    }

    function group_have_less_players_than_others(group, groups){
        return group.players.length < groups.map( g => {return g.players.length}).reduce((max, l) => {return (max > l ? max : l );});
    }

    function is_next_group(group, groups){
        return group_have_less_players_than_others(group, groups)                              ||
                groups.reduce((p,g)=>{return (g.players.length == group.players.length) && p},true);
    }
     
    return seed;
 }]);
