(function (window, Codepros) {
    var markerPoint1;
    var markerPoint2;
    var markerBox1;
    var markerBox2;
    var h = window.innerHeight;
    document.getElementById('container').style.height = h;
    var myMap = Codepros.CreateNew(document.getElementById("container"), {
        center: new google.maps.LatLng(33.51849923765608, 36.287841796875),
        zoom: 13,
        panControl: false,
        zoomControl: false,
        mapTypeControl: true,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
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
    myMap.AutoComplete({
        element: input,
        position: function (pos) {

        },
        error: function (error) {
            document.getElementById('content').innerHTML = "sorry place not found";
            $("#popupText").popup("open");


        }
    });

    var btnLocation = document.getElementById("btnLocation");
    btnLocation.onclick = function () {
        myMap.MarkCurrentPosition();
    }
    myMap.PushControl(btnLocation, 'bottom_right');
    myMap.PushControl(pan, 'top_center');

    document.getElementById('btnClosePanel').onclick = function () {
        google.maps.event.clearListeners(myMap.gMap, 'click');
        markerBox1 = null;
        markerBox2 = null;
        $.mobile.pageContainer.pagecontainer("change", "#pageMain", {
            transition: "slide"
        });
    }
    document.getElementById('btnMinimizePanel').onclick = function () {
        markerBox1 = null;
        markerBox2 = null;
        $.mobile.pageContainer.pagecontainer("change", "#pageMain", {
            transition: "slide"
        });
    }
    var searchBox1 = document.getElementById("searchBox1");
    myMap.AutoComplete({
        element: searchBox1,
        position: function (pos) {
            markerBox1 = new google.maps.Marker({
                position: {
                    lat: pos.lat(),
                    lng: pos.lng()
                }
                ,
                map: null
            })
        }
    });

    var searchBox2 = document.getElementById("searchBox2");
    myMap.AutoComplete({
        element: searchBox2,
        position: function (pos) {

            markerBox2 = new google.maps.Marker({

                position: {
                    lat: pos.lat(),
                    lng: pos.lng()
                }

                    ,
                map: null
            })
        }
    });

    document.getElementById('btnGetDirectionMethodTwoSearchBox1').onclick = function () {
        //getDirection(travelModes)
        var errorGetDirections = false;
        var direictionsWay = $('input:radio[name=rad1]:checked').val()
        try {
            if (direictionsWay == 'car') {

                getDirection('driving', markerBox1, markerBox2);

            }
            else if (direictionsWay == 'walk') {

                getDirection('walking', markerBox1, markerBox2);

            }

        }
        catch (error) {
            errorGetDirections = true;
        }


        if (errorGetDirections == false) {
            $.mobile.pageContainer.pagecontainer("change", "#pageMain", {
                transition: "slide"
            });
        }
        else {
            document.getElementById('content1').innerHTML = "direction not avaliable";
            $("#popupText1").popup("open");
        }

    }

    document.getElementById('btn2point').onclick = function () {
        clear();
        $("#navpanel").panel("close");
        drowPoint1()
    }
    var btnGetDirectionMethodTwoSearchBox = document.getElementById('btnGetDirectionMethodTwoSearchBox');
    btnGetDirectionMethodTwoSearchBox.onclick = function () {
        google.maps.event.clearListeners(myMap.gMap, 'click');
        clear();
        $.mobile.pageContainer.pagecontainer("change", "#PageGetDirection", {

        });
    }

    document.getElementById('btnCar').onclick = function () {
        $("#popupDialogDireictionMethod2Point").popup("close")
        getDirection('driving', markerPoint1, markerPoint2);
    }
    document.getElementById('btnWalk').onclick = function () {

        $("#popupDialogDireictionMethod2Point").popup("close")

        getDirection('walking', markerPoint1, markerPoint2);
    }
    document.getElementById('btnOk').onclick = function () {

        $("#popupText").popup("close");
    }

    document.getElementById('btnOkSearchBox').onclick = function () {

        $("#popupText1").popup("close");
    }


    //call GetDirections in codepros
    function getDirection(travelModes, positionStart, positionEnd) {

        myMap.GetDirections({
            start: new google.maps.LatLng(positionStart.getPosition().lat(), positionStart.getPosition().lng()),
            end: new google.maps.LatLng(positionEnd.getPosition().lat(), positionEnd.getPosition().lng()),
            travelMode: travelModes,
            panel: "directions",
            error: function () {
                document.getElementById('content').innerHTML = "direction not avaliable";
                $("#popupText").popup("open");
                clear();

            }
        ,
            success: function () {


                myMap._On({
                    obj: myMap.gMap,
                    event: 'click',
                    callback: function (e) {
                        $.mobile.pageContainer.pagecontainer("change", "#pagePanel", {
                            transition: "slideup"
                        });
                    }
                })

            }
        });

    }

    //to drow first point1 and call drowPoont2() 
    function drowPoint1() {
        //intilize
        google.maps.event.clearListeners(myMap.gMap, 'click')
        //add event to map
        myMap._OnOnce({
            obj: myMap.gMap,
            event: 'click',

            callback: function (e) {
                //marksLatLong.point1Lat = e.latLng.lat();
                //marksLatLong.point1Lng = e.latLng.lng();
                markerPoint1 = new google.maps.Marker({
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
                markerPoint2 = new google.maps.Marker({
                    position: {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                    },
                    map: this.gMap
                })
                $("#popupDialogDireictionMethod2Point").popup("open")
                myMap.clearMark(markerPoint1);
                myMap.clearMark(markerPoint2);


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
