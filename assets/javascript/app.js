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
                newOption.attr("class", "campsites");
                newOption.text("Name: " + response.data[j].name);
                $(".info").append(newOption);
            }
        }
    }

    function parksAjax() {
        //first i build query string

        var url = "https://developer.nps.gov/api/v1/campgrounds?"
        var queryParams = {"api_key": "KPU9fBN1jvn0aF6OMVUOJ3fFcxjhAPpNuBCQhcrO"};
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

        var url = "https://api.openweathermap.org/data/2.5/forecast?"
        var queryParams = {
            "appid": "25f1d41384ca0a12c21a0c9237a9d2cb"
        };
        // queryParams.q = $("#name").val();
        queryParams.lat = location.lat;
        queryParams.lon = location.long;
        console.log(queryParams.q);
        queryParams.units = "imperial"

        var queryURL = url + $.param(queryParams);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            forecastLoop(response);
        });
    }

    function forecastLoop(response) {
        $(".forecast").empty();

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
            $(".forecast").append(newRow);
        }
    }


    $("#heading").text("DOM manipulation")

    $("#submit-btn").on("click", function (event) {
        event.preventDefault();

        $(".forecast").empty();

        parksAjax()
    })


    $(document).on("click", ".campsites", function () {

        // this could be its own function
        var locationStr = $(this).attr("data-location");
        console.log(locationStr)

        var cleanLatLong = locationStr.slice(1, -1).split(',');
        console.log(cleanLatLong)
        let latitude = cleanLatLong[0].substr(4);
        let longitude = cleanLatLong[1].substr(5);

        let location = {
            lat: latitude,
            long: longitude
        }

        forecastAjax(location)
    })

});

console.log(moment().format("DD/MM/YY hh:mm A"));