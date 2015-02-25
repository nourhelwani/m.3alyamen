(function (window, Codepros) {

    var myMap = Codepros.CreateNew(document.getElementById("container"), {
        center: new google.maps.LatLng(33, 36),
        zoom: 10,
        geocoder: true
    });
    var marks = { point1Lat: "", point1Lng: "", point2Lat: "", point2Lng: "" }
    //get location btn and push to map
    var btnLocation = document.getElementById("btnLocation");
    myMap.PushControl(btnLocation, 'bottom_right');
    //event
    btnLocation.onclick = function () {
        myMap.MarkCurrentPosition();
    }

    //add event 

    document.getElementById('btnGetDirection').onclick = function () {
      popupDialogGetDirectionMethod();
    
    }

    function popupDialogGetDirectionMethod() {
     
    $("#popupDialogGetDirectionMethod").popup("open")
    var btnGetDirectionMethodTwoPoint = document.getElementById('btnGetDirectionMethodTwoPoint');
    btnGetDirectionMethodTwoPoint.onclick = function () {
        $("#popupDialogGetDirectionMethod").popup("close")

        drowPoint1();
    }
    var btnGetDirectionMethodTwoSearchBox = document.getElementById('btnGetDirectionMethodTwoSearchBox');
    btnGetDirectionMethodTwoSearchBox.onclick = function () {
        $("#popupDialogGetDirectionMethod").popup("close")

    }
}
    function openpoPupDialogDireictionMethod2Point() {
        //open the popupDialogDireictionMethod
        $("#popupDialogDireictionMethod2Point").popup("open")
        //add event
        document.getElementById('btnCar').onclick = function () {
            $("#popupDialogDireictionMethod2Point").popup("close")
            getDirection('driving');
        }
        document.getElementById('btnWalk').onclick = function () {

            $("#popupDialogDireictionMethod2Point").popup("close")
            getDirection('walking')
        }
    }

    //call GetDirections in codepros
    function getDirection(travelModes) {
        var matches1 = myMap.RemoveBy(function (marker) {
            return marker.id === 0;
        });
        var matches2 = myMap.RemoveBy(function (marker) {
            return marker.id === -1;
        });
        myMap.GetDirections({
            //start: new google.maps.LatLng(matches1[0].position.lat(), matches1[0].position.lng()),
            //end: new google.maps.LatLng(matches2[0].position.lat(), matches2[0].position.lng()),
            start: new google.maps.LatLng(marks.point1Lat, marks.point1Lng),
            end: new google.maps.LatLng(marks.point2Lat, marks.point2Lng),
            travelMode: travelModes,
            panel: "test"
        });
    }
    //to drow first point1 and call drowPoont2() 
    function drowPoint1() {
$("#popupDialogDireictionHint").popup("open")
        document.getElementById('btnHintOk').onclick = function () {
            //event to close popupDialogDireictionHint when press ok 
            $("#popupDialogDireictionHint").popup("close")
        }
        //open popupDialogDireictionHint 
        
        //add event to map
        myMap._attachEvents(myMap.gMap, [{
            name: 'click',
            //create mark
            callback: function (e) {
                marks.point1Lat = e.latLng.lat();
                marks.point1Lng = e.latLng.lng();
                var marker1 = myMap.CreateMarker({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                    id: 0,
                    content: "first place",
                    draggable: true,
                    events: [{
                        name: 'dragend',
                        callback: function (e) {

                        }
                    }]
                });
                // clear event after click
                google.maps.event.clearListeners(myMap.gMap, 'click');
                //call drowPoint2()
                drowPoint2();
            }
        }]);
    }
    function drowPoint2() {
        myMap._attachEvents(myMap.gMap, [{
            name: 'click',
            callback: function (e) {
                marks.point2Lat = e.latLng.lat();
                marks.point2Lng = e.latLng.lng();
                var marker2 = myMap.CreateMarker({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                    id: -1,
                    content: "second place",
                    draggable: true,
                    events: [{
                        name: 'dragend',
                        callback: function (e) {
                            //remove marks when drag it 
                        }
                    }]
                });
                google.maps.event.clearListeners(myMap.gMap, 'click');
                openpoPupDialogDireictionMethod2Point();
                myMap._attachEvents(myMap.gMap, [{
                    name: 'click',
                    callback: function (e) {
                        clear();
                        google.maps.event.clearListeners(myMap.gMap, 'click');
                    }
                }]);
            }
        }]);
    }

    function clear() {
        myMap.ClearRoutes();
    }
    //move to damscus
    myMap.Geocode({
        location: "damascus",
        success: function (results) {
            console.log(results);
        },
        error: function () {
            console.log("okay");
        }
    });

})(window, window.Codepros)
