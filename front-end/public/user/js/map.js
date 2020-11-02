
    jQuery(function($) {
        // Asynchronously Load the map API 
        var script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBZib4Lvp0g1L8eskVBFJ0SEbnENB6cJ-g&callback=initialize";
        document.body.appendChild(script);
    });

    function initialize() {
        var map;
        var bounds = new google.maps.LatLngBounds();
        var mapOptions = {
            mapTypeId: 'roadmap'
        };

        // Display a map on the page
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        map.setTilt(45);

        // Multiple Markers
        var markers = [
            ['Ahmedabad, Gujarat', 23.0201818, 72.4396589]
        ];

        // Loop through our array of markers & place each one on the map  
        for (i = 0; i < markers.length; i++) {
            var position = new google.maps.LatLng(markers[i][1],
                markers[i][2], markers[i][3], markers[i][4]);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: markers[i][0],
                gestureHandling: 'greedy'
            });

            

            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
        }

        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        var  tilesloadedListener = google.maps.event.addListener((map),  'tilesloaded', function(event) {
            this.setZoom(5);
            google.maps.event.removeListener(tilesloadedListener);
        });

    }
