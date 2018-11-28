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


    function getCampsites(response, parkLocationStr) {

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
                
                var newOption = $("<option>");
                var newOption = $("<option>").attr("data-location", parkLocationStr);
                newOption.attr("data-locationValue", false);
                newOption.attr("class", "campsites");
                newOption.text(response.data[j].name);
                $(".info").append(newOption);
            }
        }
    }


    function dayOfWeek(timeStamp) {
    
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var dayNum = new Date(timeStamp * 1000).getDay();
        var result = days[dayNum];
        return result;
    }


    function parksAjax() {

        //ajax call to get park lat and long===================
        var urlPark = "https://developer.nps.gov/api/v1/parks?"
        var queryParamsPark = {
            "api_key": "KPU9fBN1jvn0aF6OMVUOJ3fFcxjhAPpNuBCQhcrO"
        };
        queryParamsPark.q = $("#name").val();;
        var queryURLPark = urlPark + $.param(queryParamsPark);

        $.ajax({
            url: queryURLPark,
            method: "GET"
        }).then(function (response) {
            console.log(response.data[0].latLong);
            parkLocationStr = response.data[0].latLong;

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
                getCampsites(response, parkLocationStr);
            });

        });
    }


    function forecastAjax(location) {

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
            var days = response.list[i];
            var weekDay = dayOfWeek(days.dt);

            var newRow = $("<tr>").append(
                $("<td>").text(weekDay),
                $("<td>").text(Math.round(days.main.temp) + "F"),
                $("<td>").text(days.weather[0].main),
                // $("<td>").text(days.weather[0].description),
                $("<td>").text(days.wind.speed + " mph winds")
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


    $("#submit-btn").on("click", function (event) {

        event.preventDefault();
        $(".forecast-view").empty();
        parksAjax()
    })


    $(document).on("click", ".campsites", function () {

        // this could be its own function
        var locationStr = $(this).attr("data-location");
        var locationValue = $(this).attr("data-locationValue")
        var cleanLatLong = locationStr.slice(1, -1).split(',');

        if (locationValue === "true") {

            var latitude = cleanLatLong[0].substr(4);
            var longitude = cleanLatLong[1].substr(5);
        } else if (locationValue === "false") {

            var latitude = cleanLatLong[0].substr(3);
            var longitude = cleanLatLong[1].substr(6);
        }

        var location = {
            lat: latitude,
            long: longitude
        }
        forecastAjax(location)
    })

});

console.log(moment().format("DD/MM/YY hh:mm A"));