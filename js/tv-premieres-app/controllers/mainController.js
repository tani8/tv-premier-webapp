app.controller("mainController", function($scope, $http){

    $scope.apiKey = "0559911c3a72023d3bd199b202738276";
//        "0024fd28bbd82e002ed4bda8c4587030";
    $scope.results = [];
    $scope.filterText = null;
    $scope.availableGenres = [];
    $scope.genreFilter = null;
    $scope.orderFields = ["Air Date", "Rating"];
    $scope.orderDirections = ["Ascending", "Descending"];
    $scope.orderField = "Air Date"; //Default field
    $scope.orderReverse = false;

    $scope.init = function() {
        var today = new Date(); //API requires a start date
        var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
        //slice extracts last 2 numbers, + 1 because month starts at 0
        $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK').success(function(data) {
        //server call to get data, passes data into callback to be saved by program
            angular.forEach(data, function(value, index){ //getting all the episodes for the day
                var date = value.date;
                angular.forEach(value.episodes, function(tvshow, index){ //add episodes to results array
                    //saving date based on input, for filtering later
                    tvshow.date = date; //puts date on every epi
                    $scope.results.push(tvshow);
                    //loop through every episode genre
                    angular.forEach(tvshow.show.genres, function(genre, index){
                        var exists = false;
                        angular.forEach($scope.availableGenres, function(avGenre, index){
                            if(avGenre == genre){
                                exists = true;
                            }
                        });
                        if(exists === false){
                            $scope.availableGenres.push(genre);
                        }
                    });
                });
            });
            console.log(data);
        }).error(function(error) {

        });

    };
    $scope.setGenreFilter = function(genre) {
        $scope.genreFilter = genre;
    };
    $scope.customOrder = function(tvshow){
        switch($scope.orderField){
            case "Air Date":
                return tvshow.episode.first_aired;
                break;
            case "Rating":
                return tvshow.episode.ratings.percentage;
                break;
        }
    };
});

app.filter('isGenre', function(){ //custom filter isGenre
    return function (input, genre) { //input is default text
        if(typeof genre == 'undefined' || genre == null){
            return input;
        } else {
            var out = [];
            for(var a = 0; a < input.length; a++){
                for(var b = 0; b < input[a].show.genres.length; b++){
                    if(input[a].show.genres[b] == genre){
                        out.push(input[a]);
                    }
                }
            }
            return out;
        }
    };
});

