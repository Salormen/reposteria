(function(){
    
  'use strict';
    
    angular
        .module('tournamentModule')
        .controller('DownloadsController',  
                ['$scope', '$stateParams', 'tournament_dao', 'file_creator_for_download',
        function( $scope,   $stateParams,   tournament_dao,   file_creator_for_download){

            /******************************************/

            $scope.torneo = tournament_dao.get_by_id($stateParams.id);
                    
            
            $scope.downloadTournament_formatTDMM = function(){
                download($scope.torneo.name + ".tdmm", file_creator_for_download.tdmm($scope.torneo));
            }
            
            $scope.downloadTournament_formatTMT = function(){
                download($scope.torneo.name + ".tmt", file_creator_for_download.tmt($scope.torneo));
            }
            
            
            function download(filename, text) {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            }
            
            
        }])
})()