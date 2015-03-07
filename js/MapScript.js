(function (window, Codepros) {
 var mark1;
 var mark2;
 var myMap = Codepros.CreateNew(document.getElementById("container"), {
        center: new google.maps.LatLng(33.51849923765608, 36.287841796875),
        zoom: 13,
        geocoder: true,
        styles: [{
            featureType: 'poi',
            elementtype: 'labels',
            stylers: [
            { visibility: 'off' }
            ]
        }]
    });
 	 
    //search
    var input = document.getElementById("text-field");
    //myMap.PushControl(input,'top');
    myMap.AutoComplete(input);
    myMap._AttachEvents(myMap.gMap, [{
        name: 'click',
        callback: function (e) {
           
        }
    }]);

    //get location btn and push to map
    var btnLocation = document.getElementById("btnLocation");
    myMap.PushControl(btnLocation, 'bottom_right');
    //events
        btnLocation.onclick = function () {
       myMap.MarkCurrentPosition();

    }
        var btnGetDirectionMethodTwoSearchBox = document.getElementById('btnGetDirectionMethodTwoSearchBox');
        btnGetDirectionMethodTwoSearchBox.onclick = function () {
            $.mobile.pageContainer.pagecontainer("change", "#PageGetDirection", {
                transition: "slide"
            });
        }
    document.getElementById('btn2point').onclick = function () {
       drowPoint1()
    }

    
    document.getElementById('btnOk').onclick = function () {

        $("#popupDialogDireictionError").popup("close")
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
    var getDirectionError = true;
    //call GetDirections in codepros
    function getDirection(travelModes) {
        myMap.GetDirections({
            start: new google.maps.LatLng(mark1.position.lat(), mark1.position.lng()),
            end: new google.maps.LatLng(mark2.position.lat(), mark2.position.lng()),
            travelMode: travelModes,
            panel: "directions",
            error: function () {
                $("#popupDialogDireictionError").popup("open")
                clear();

            }
        ,
            success: function () {
                myMap._OnOnce({
                    obj: myMap.gMap,
                    event: 'click',
                    callback: function (e) {
                    /*    $.mobile.pageContainer.pagecontainer("change", "#pagePanel", {
                            transition: "slideup"
                        });*/
                  $("#popupPanel").popup("open",{
    x: 0,
    y: 0
})

  myMap._OnOnce({
                    obj: myMap.gMap,
                    event: 'click',
                    callback: function (e) {
                        clear();
                   }})

                    }
                });

            }
        });
        myMap.clearMark(mark1);
        myMap.clearMark(mark2);


    }
    //to drow first point1 and call drowPoont2() 
    function drowPoint1() {
        //open popupDialogDireictionHint 
        //add event to map
        myMap._OnOnce({
            obj: myMap.gMap,
            event: 'click',

            callback: function (e) {
                //marksLatLong.point1Lat = e.latLng.lat();
                //marksLatLong.point1Lng = e.latLng.lng();
                mark1 = new google.maps.Marker({
                    position: {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                    },
                    map: this.gMap
                })
                //call drowPoint2()
                drowPoint2();

            }
        })
    }

    function drowPoint2() {
        myMap._OnOnce({
            obj: myMap.gMap,
            event: 'click',
            callback: function (e) {
                //marksLatLong.point2Lat = e.latLng.lat();
                // marksLatLong.point2Lng = e.latLng.lng();
                mark2 = new google.maps.Marker({
                    position: {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                    },
                    map: this.gMap
                })
                openpoPupDialogDireictionMethod2Point();

            }
        }

	);
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
