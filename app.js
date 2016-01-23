function initMap() {
    var myLatLng = {lat: 10, lng: -2.617999};

    var map = new google.maps.Map(document.getElementById('map'), {
        // zoom: 14,
        // center: myLatLng

    });


}

$( document ).ready(function() {
    var myKey = 'YOUR_API_KEY';

    var staticUrl = "https://bristol.api.urbanthings.io/api/2.0/static/";

    var routeX38 = "trips?routeID=UK_TNDS_NOC_FBRI-X39&includePolylines=true" + myKey;
    var transitions = "transitstops?stopIDs=";
    $.ajax({
    url: staticUrl + routeX38,
    type: "GET",

    // first ajax
    success: function(data){

        console.log(data);
        var myLatLng = {lat: 51.443506, lng: -2.617999};

        var myMap = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: myLatLng
        });

        // find replace polyline
        var escapedLine = data.data[0].polyline.replace(/\\/g,"\\\\");

        // decode polyline to array
        var myPath = google.maps.geometry.encoding.decodePath(escapedLine);

        var myPathArray = [];
        for(var i = 0; i < myPath.length; i++) {
            //console.log(myPath[i].lat(), myPath[i].lng());
            myPathArray.push({ lat: myPath[i].lat(), lng: myPath[i].lng() });
        }

        var busPath = new google.maps.Polyline({
            path: myPathArray,
            strokeColor: '#00AAEE',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });


        // get all stop calls and store in array
        var stopsArray = [];
        for(var a = 0; a < data.data[0].stopCalls.length; a++) {
            stopsArray.push(data.data[0].stopCalls[a].transitStopPrimaryCode);
        }

        // ajax inception
        $.ajax({
            url: staticUrl + transitions + stopsArray.join() + myKey,
            type: "GET",

            success: function(stops) {

                var customStops = [];
                for(var b = 0; b < stops.data.length; b++) {
                    customStops.push({ lat: stops.data[b].lat, lng:stops.data[b].lng});
                }

                //Do the PolyLines
                // var customStopsPath = new google.maps.Polyline({
                //     path: customStops,
                //     geodesic: true,
                //     strokeColor: '#ff0000',
                //     strokeOpacity: 1.0,
                //     strokeWeight: 2
                // });
                // customStopsPath.setMap(myMap);

                // // Do the Markers
                for(var g=0; g < customStops.length; g++){
                   var marker = new google.maps.Marker({
                	   position: customStops[g],
                	   map: myMap
                	 });
                //
                }
            },
            error: function(a){
                console.log(a);
            }
        });




        //console.log(myPathArray);
        // Plot a dodgy map
        //busPath.setMap(myMap);



    },
    error: function(a){
        console.log(a);
    }
    })



});
