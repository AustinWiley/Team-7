$(document).ready(function () {
    console.log("js connected")

    function currentWeatherAjax() {

        var url = "https://api.openweathermap.org/data/2.5/weather?"
        var queryParams = {
            "appid": "25f1d41384ca0a12c21a0c9237a9d2cb"
        };
        queryParams.q = $("#name").val();
        console.log(queryParams.q);

        var queryURL = url + $.param(queryParams);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
        });
    }


    function getCampsites(response) {

        var parkSelection = $("#name").val();
        $("#park-selected").text("Campsites in " + parkSelection + " National Park");
        $(".info").empty();
        for (var j = 0; response.data.length - 1; j++) {

            console.log(response.data[j].latLong)
            var locationStr = response.data[j].latLong;

            if (!!locationStr) {

                var newOption = $("<option>");
                var newOption = $("<option>").attr("data-location", locationStr);
                newOption.attr("data-locationValue", true);
                newOption.attr("class", "campsites");
                newOption.text(response.data[j].name);
                $(".info").append(newOption);
            } else {
                var parkCode = response.data[j].parkCode;
                console.log(parkCode)
                var parkLocationStr = getParkLocation(parkCode)////////////////////////////////////////////////////////////not returning
                console.log(parkLocationStr)
                var newOption = $("<option>");
                var newOption = $("<option>").attr("data-location", parkLocationStr);
                newOption.attr("data-locationValue", false);
                newOption.attr("class", "campsites");
                newOption.text(response.data[j].name);
                $(".info").append(newOption);
            }
        }
    }


    function getParkLocation(parkCode) {

        //ajax call to get park lat and long===================
        var urlPark = "https://developer.nps.gov/api/v1/parks?"
        var queryParamsPark = {
            "api_key": "KPU9fBN1jvn0aF6OMVUOJ3fFcxjhAPpNuBCQhcrO"
        };
        queryParamsPark.parkCode = parkCode;
        var queryURLPark = urlPark + $.param(queryParamsPark);

        $.ajax({
            url: queryURLPark,
            method: "GET"
        }).then(function (response) {
            console.log(response.data[0].latLong);
            parkLocation = response.data[0].latLong;
        
        });

        

    }


    function parksAjax() {

        //ajax call for campsites===============================
        var url = "https://developer.nps.gov/api/v1/campgrounds?"
        var queryParams = {
            "api_key": "KPU9fBN1jvn0aF6OMVUOJ3fFcxjhAPpNuBCQhcrO"
        };
        queryParams.q = $("#name").val();
        var queryURL = url + $.param(queryParams);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            console.log(response)
            getCampsites(response);
        });
    }


    function forecastAjax(location) {
        //first i build query string

        console.log(location)

        var url = "https://api.openweathermap.org/data/2.5/forecast?"
        var queryParams = {
            "appid": "25f1d41384ca0a12c21a0c9237a9d2cb"
        };

        queryParams.lat = location.lat;
        queryParams.lon = location.long;
        queryParams.units = "imperial"

        var queryURL = url + $.param(queryParams);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            forecastLoop(response);
            recommendations(response);
        });
    }

    function forecastLoop(response) {
        $(".forecast-view").empty();

        for (i = 0; i < response.list.length; i = i + 8) {
            console.log(response.list[i]);
            var days = response.list[i]

            // tempF = ((days.main.temp - 273.15)*1.8)+32

            var newRow = $("<tr>").append(

                // $("<td>").text(moment(days.dt_txt).day()),
                $("<td>").text(days.dt_txt),
                $("<td>").text(Math.round(days.main.temp) + "F"),
                $("<td>").text(days.weather[0].main),
                $("<td>").text(days.weather[0].description),
                $("<td>").text(days.wind.speed + " mph")
            )
            $(".forecast-view").append(newRow);
        }
    }

    function recommendations(response) {

        $(".clothingRecommendations").empty();

        var temp = [];
        var weather = [];
        var wind = [];
        for (i = 0; i < response.list.length; i = i + 8) {
            var days = response.list[i];

            temp.push(Math.round(days.main.temp));
            weather.push(days.weather[0].main);
            wind.push(days.wind.speed);

        }
        console.log(temp);
        console.log(weather);
        console.log(wind);

        for (i = 0; i < temp.length; i++) {
            if (temp[i] < 30) {
                $(".clothingRecommendations").html(
                    "It's going to be chilly. Pack a jacket and a heavy sleeping bag!")
            }
        }

    }





$("#heading").text("DOM manipulation")

$("#submit-btn").on("click", function (event) {
    event.preventDefault();

    $(".forecast-view").empty();

    parksAjax()
})


$(document).on("click", ".campsites", function () {

    // this could be its own function
    var locationStr = $(this).attr("data-location");
    var locationValue = $(this).attr("data-locationValue")
    console.log(locationStr)
    console.log(locationValue)

    var cleanLatLong = locationStr.slice(1, -1).split(',');
    console.log(cleanLatLong)
    

    if (locationValue === "true") {
        var latitude = cleanLatLong[0].substr(4);
        var longitude = cleanLatLong[1].substr(5);
        console.log("truthiness")
    } else if (locationValue === "false") {
        var latitude = cleanLatLong[0].substr(3);
        var longitude = cleanLatLong[1].substr(6);
        console.log("falsyness")
    }
       
    var location = {
        lat: latitude,
        long: longitude
    }
console.log(location)
    forecastAjax(location)
})

});

console.log(moment().format("DD/MM/YY hh:mm A"));