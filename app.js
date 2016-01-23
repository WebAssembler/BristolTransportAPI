$( document ).ready(function() {
    var apiKey = "&apikey=MY-API-KEY";
        baseUrl = "https://bristol.api.urbanthings.io/api/2.0/static/",
        routeX38 = "trips?routeID=UK_TNDS_NOC_FBRI-X39&includePolylines=true" + apiKey,
        transitions = "transitstops?stopIDs=";

    // Make Initial API Request
    $.ajax({
        url: baseUrl + routeX38,
        type: "GET",

        success: function(data) {
            console.log(data);

            // Set up map and options
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: {lat: 51.417861, lng: -2.501804}
            });

            // Grab polyline from json and escape backslashes
            var escapedPolyline = data.data[0].polyline.replace(/\\/g,"\\\\");

            // Encode back into array of objects
            var polylineCoords = google.maps.geometry.encoding.decodePath(escapedPolyline);

            // Loop through coords to create array of just lat long
            var routePolyline = [];
            for(var i = 0; i < polylineCoords.length; i++) {
                routePolyline.push({ lat: polylineCoords[i].lat(), lng: polylineCoords[i].lng() });
            }

            // Plot this polyline onto map
            var plottedRoute = new google.maps.Polyline({
                path: routePolyline,
                strokeColor: '#00AAEE',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            // get all stop calls and store in array
            var stopsArray = [];
            for(var i = 0; i < data.data[0].stopCalls.length; i++) {
                stopsArray.push(data.data[0].stopCalls[i].transitStopPrimaryCode);
            }

            // ajax inception
            $.ajax({
                url: baseUrl + transitions + stopsArray.join() + apiKey,
                type: "GET",

                success: function(stops) {

                    // Plot the custom stops
                    var customStops = [];
                    for(var b = 0; b < stops.data.length; b++) {
                        customStops.push({ lat: stops.data[b].lat, lng: stops.data[b].lng});
                    }

                    // Animate the Markers on the map
                    for(var i = 0; i < customStops.length; i++) {
                        addMarkerWithTimeout(customStops[i], i * 100);
                    }

                    // Draw the markers
                    var markers = [];
                    function addMarkerWithTimeout(position, timeout) {
                      window.setTimeout(function() {
                        markers.push(new google.maps.Marker({
                          position: position,
                          map: map,
                          animation: google.maps.Animation.DROP
                        }));
                      }, timeout);
                    }

                },
                error: function(a) {
                    console.log(a);
                }
            });
        },
        error: function(a){
            console.log(a);
        }
    })
});
