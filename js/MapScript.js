(function (window, Codepros) {
 var markerPoint1;
 var markerPoint2;
 var markerBox1;
 var markerBox2;
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
    myMap.AutoComplete({
element:input
    });
    myMap._AttachEvents(myMap.gMap, [{
        name: 'click',
        callback: function (e) {
           
        }
    }]);

    var searchBox1 = document.getElementById("searchBox1");
    myMap.AutoComplete({
    	element:searchBox1,
    	position:function(pos){
    			markerBox1 = new google.maps.Marker({
                    position: {
                    	lat:pos.lat(),
                    	lng:pos.lng()
                    }
                    ,
                    map: null
                })



    	}
    });
    myMap._AttachEvents(myMap.gMap, [{
        name: 'click',
        callback: function (e) {
           
        }
    }]);
    var searchBox2 = document.getElementById("searchBox2");
    
    myMap.AutoComplete({
    	element:searchBox2,
    	position:function(pos){
    		
    		markerBox2 = new google.maps.Marker({

                    position: {
                    	lat:pos.lat(),
                    	lng:pos.lng()
                    }
                     
                    ,
                    map: null
                })
    	}
    });
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

    document.getElementById('btnGetDirectionMethodTwoSearchBox1').onclick=function(){
    	//getDirection(travelModes)
        var errorGetDirections=false;
     var direictionsWay= $('input:radio[name=rad1]:checked').val()



        try{
            if(direictionsWay=='car') {

                getDirection('driving',markerBox1,markerBox2);
                
 }
 else if(direictionsWay=='walk') {
    
getDirection('walking',markerBox1,markerBox2); 

}

}
catch(error){
    errorGetDirections=true;

    
}

if (errorGetDirections==false) {
 $.mobile.pageContainer.pagecontainer("change", "#pageMain", {
                transition: "slide"
            });}
 else{

$("#popupDialogDireictionErrorSearchBox").popup("open");
 }
 



    }
        
    document.getElementById('btn2point').onclick = function () {
        $( "#navpanel" ).panel( "close");
       drowPoint1()
    }
     var btnGetDirectionMethodTwoSearchBox = document.getElementById('btnGetDirectionMethodTwoSearchBox');
        btnGetDirectionMethodTwoSearchBox.onclick = function () {
            $.mobile.pageContainer.pagecontainer("change", "#PageGetDirection", {

            });
        }

    
    document.getElementById('btnOk').onclick = function () {

        $("#popupDialogDireictionError").popup("close")
    }
    document.getElementById('btnOkSearchBox').onclick = function () {

        $("#popupDialogDireictionErrorSearchBox").popup("close")
    }
    
    

    function openpoPupDialogDireictionMethod2Point() {
    
        //open the popupDialogDireictionMethod
        $("#popupDialogDireictionMethod2Point").popup("open")
        //add event
        document.getElementById('btnCar').onclick = function () {
            $("#popupDialogDireictionMethod2Point").popup("close")
       

            getDirection('driving',markerPoint1,markerPoint2);
        }
        document.getElementById('btnWalk').onclick = function () {

            $("#popupDialogDireictionMethod2Point").popup("close")

            getDirection('walking',markerPoint1,markerPoint2);
        }
    }

    //call GetDirections in codepros
    function getDirection(travelModes,positionStart,positionEnd) {
    	
        myMap.GetDirections({
            start: new google.maps.LatLng(positionStart.getPosition().lat(), positionStart.getPosition().lng()),
            end: new google.maps.LatLng(positionEnd.getPosition().lat(), positionEnd.getPosition().lng()),
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
                openpoPupDialogDireictionMethod2Point();
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
