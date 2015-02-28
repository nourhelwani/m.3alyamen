(function (window, Codepros) {
   var myMap = Codepros.CreateNew(document.getElementById("container"),{
        center: new google.maps.LatLng(33.51849923765608,36.287841796875),
        zoom:13,
        geocoder:true,
        styles:[{
            featureType:'poi',
            elementtype:'labels',
            stylers:[
            {   visibility:'off'    }
            ]
        }]
    });
 //search
    var input = document.getElementById("text-field");
    //myMap.PushControl(input,'top');
    myMap.AutoComplete(input);
    myMap._AttachEvents(myMap.gMap,[{
            name:'click',
            callback:function(e){
                console.log(e.latLng.lat());
                console.log(e.latLng.lng());
                //alert("clicked");
            }
        }]);
   
    //get location btn and push to map
    var btnLocation = document.getElementById("btnLocation");
    myMap.PushControl(btnLocation, 'bottom_right');
    //event
    btnLocation.onclick = function () {
        myMap.MarkCurrentPosition();
    }
//
    var mark1;
    var mark2;
 
    //get location btn and push to map
    var btnLocation = document.getElementById("btnLocation");
    myMap.PushControl(btnLocation, 'bottom_right');
    //event
    btnLocation.onclick = function () {
        myMap.MarkCurrentPosition();
    }
    //add events
    document.getElementById('btnGetDirection').onclick = function () {
      popupDialogGetDirectionMethod();
    }
    document.getElementById('btnOk').onclick=function(){
    	 $("#popupDialogDireictionError").popup("close")
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
        $.mobile.pageContainer.pagecontainer("change", "#PageGetDirection", {
            transition: "slide"
        });
    }}

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
        myMap.GetDirections({
            start: new google.maps.LatLng(mark1.position.lat(),mark1.position.lng()),
            end: new google.maps.LatLng(mark2.position.lat(), mark2.position.lng()),
            travelMode: travelModes,
            panel: "directions"
        });
        myMap.clearMark(mark1);
        myMap.clearMark(mark2);
    }
    //to drow first point1 and call drowPoont2() 
    function drowPoint1() {
        //open popupDialogDireictionHint 
        //add event to map
        myMap._OnOnce({
		obj:myMap.gMap,
		event:'click',
		
			callback: function (e) {
                //marksLatLong.point1Lat = e.latLng.lat();
                //marksLatLong.point1Lng = e.latLng.lng();
                 mark1 = new google.maps.Marker({
                        position:{
                            lat: e.latLng.lat(),
                            lng:e.latLng.lng(),
                        },
                        map:this.gMap
                    })
                //call drowPoint2()
                drowPoint2();
                
            }
		})}

    function drowPoint2() {
    	myMap._OnOnce({
		obj:myMap.gMap,
		event:'click',
		callback:function (e){
			 //marksLatLong.point2Lat = e.latLng.lat();
               // marksLatLong.point2Lng = e.latLng.lng();
                 mark2 = new google.maps.Marker({
                        position:{
                            lat: e.latLng.lat(),
                            lng:e.latLng.lng(),
                        },
                        map:this.gMap
                    })
                 openpoPupDialogDireictionMethod2Point();
               myMap._OnOnce({
		obj:myMap.gMap,
		event:'click',
		callback:function (e){
           $.mobile.pageContainer.pagecontainer("change", "#pagePanel", {
            transition: "slideup"
        });
                       clear();
                        //google.maps.event.clearListeners(myMap.gMap, 'click');
                    }
                });
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
