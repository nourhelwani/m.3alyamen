(function (window, Codepros) {
    //vars
    var markerPoint1;
    var markerPoint2;
    var markerBox1;
    var markerBox2;
    var markerpost1;
    var markerpost2;
     var myLocation;
     var gpsMarker;
    var h = window.innerHeight;
    //custmize the size 
    document.getElementById('container').style.height = 501;
    //map option
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

    //main search box
    var input = document.getElementById("text-field");
    //add auto compulte to main saerch
    myMap.AutoComplete({
        element: input,
        position: function (pos) {

        },
        error: function (error) {
            document.getElementById('popupTextContent').innerHTML = "sorry place not found";
            $("#popupText").popup("open");


        }
    });
//btn get loaction
    var btnLocation = document.getElementById("btnLocation");
    btnLocation.onclick = function () {
   var ua = navigator.userAgent.toLowerCase();
   var isAndroid = ua.indexOf("android") > -1; 
   if(isAndroid) {
    clearAllMarkes();
  Android.showMsgActivity();
   var location= Android.getLocationByGps(" ");
       if (location) {
        var res = location.split(" ");
        var myLatlng = new google.maps.LatLng(res[0],res[1]);
         gpsMarker= new google.maps.Marker({
      position: myLatlng,
      map: myMap.gMap,
      title: 'my location'
  });
         myMap.Center(myLatlng);
         myMap.Zoom(16);
        
     }
//if fail in get location by gps 
else{
    markCurebtLocation();
    }


  
}
//if not android 
else{
    markCurebtLocation();
}


    }
    // push controls
    myMap.PushControl(btnLocation, 'bottom_right');
    myMap.PushControl(pan, 'top_center');

//post Code !!
    document.getElementById('btncallpostCodeRequsetRecived').onclick=function(){
    	clearAllMarkes();
    	initializeVariable();
    	clearListnerClick();
    var userName=document.getElementById('hiddenUserName').value;
    var PhoneNumber=document.getElementById('hiddenPhoneNumber').value;
       document.getElementById('popupConfirmRequstContent').innerHTML = "you hava recived a requset post code from "+userName+"\n do you want to approve it ?";
       $("#popupConfirmRequst").popup("open");
       document.getElementById("btnPostRequsetNo").onclick=function(){
        $("#popupConfirmRequst").popup("close");
    }
   document.getElementById("btnPostRequsetYes").onclick=function(){
   $("#popupConfirmRequst").popup("close");
     var location= Android.getLocationByGps("");
      if (location) {
       var res = location.split(" "); 
        Android.PostCode(res[0],res[1],PhoneNumber,userName,"RES");
      }
        else{

            document.getElementById('popupTextContent').innerHTML = "can't find your location check gps setting";
            $("#popupText").popup("open");

            }  
     

    	 }
    	
    } 
    document.getElementById('btncallpostCodeRecived').onclick=function(){
        //lat lng from sms
   var postCodeLatLng=document.getElementById('hiddenLatLng').value;
   //user name from  sms
   var postCodeUserName=document.getElementById('hiddenUserName').value;
   
       //lat lng from my lcation
      document.getElementById('popupConfirmContent').innerHTML = "you hava recived a post code from "+postCodeUserName+"\n do you want to show it ?";
       $("#popupConfirm").popup("open");
       document.getElementById("btnPostNo").onclick=function(){
        $("#popupConfirm").popup("close");
 }
    document.getElementById("btnPostYes").onclick=function(){
  $("#popupConfirm").popup("close"); 
  	
   var location= Android.getLocationByGps(" ");
       if (location&&postCodeLatLng) {

         var myLocationRes = location.split(" ");
         var myLocationLatlng = new google.maps.LatLng(myLocationRes[0],myLocationRes[1]);
        markerpost1 = new google.maps.Marker({
      position: myLocationLatlng,
      map: myMap.gMap,
      title: 'my location'
  });
         var PostCodeRes = postCodeLatLng.split(" ");
         var PostCodeLatlng = new google.maps.LatLng(PostCodeRes[0],PostCodeRes[1]);
         markerpost2 = new google.maps.Marker({
      position: PostCodeLatlng,
      map: myMap.gMap,
      title: 'friend location'
  });
        
        getDirection("walk",markerpost1,markerpost2);
        clearAllMarkes();
     
     }

else{ 

    document.getElementById('popupTextContent').innerHTML = "Erorr on reciving post code: can't find your location check gps setting";
    $("#popupText").popup("open");
   
    }
}

    }
 
    document.getElementById("btnSendPostCode").onclick=function(){
    	clearAllMarkes();
    	initializeVariable();	
    		var PhoneNumber=document.getElementById('txtPhoneNumber').value;
            var userName=document.getElementById('txtUserName').value;
    	 var postCodeMode = $('input:radio[name=rad2]:checked').val();
    	 if (postCodeMode=="RES") {
    	 	
    	 
     var location= Android.getLocationByGps("");
      if (location) {
       var res = location.split(" "); 
        Android.PostCode(res[0],res[1],PhoneNumber,userName,"RES");
         $("#popupPostCode").popup("close");

      }
        else{
            document.getElementById('popupTextContent').innerHTML = "can't find your location check gps setting";
            $("#popupPostCode").popup("close");
            $("#popupText").popup("open");

            }  
     

    	 }
    	 else{
    	 	Android.PostCode("0","0",PhoneNumber,userName,"REQ");
         $("#popupPostCode").popup("close");
    	     }
      
     }
       

document.getElementById("PostCode").onclick=function(){
	clearAllMarkes();
	clearListnerClick();
    $("#navpanel").panel("close");
     $("#popupPostCode").popup("open");
}
// end of post code 



//panel show directions  controls
    document.getElementById('btnClosePanel').onclick = function () {
        clearListnerClick();
        $.mobile.pageContainer.pagecontainer("change", "#pageMain", {
            transition: "slide"
        });
    }
    document.getElementById('btnMinimizePanel').onclick = function () {
        $.mobile.pageContainer.pagecontainer("change", "#pageMain", {
            transition: "slide"
        });
    }
    //end of panel show directions

    //get dirextions 2 saerch box page  
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
                clearAllMarkes();

            }
            else if (direictionsWay == 'walk') {
            	

                getDirection('walking', markerBox1, markerBox2);
                clearAllMarkes();

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
        clearAllMarkes();
    	initializeVariable();
    
        $("#navpanel").panel("close");
        drowPoint1()
    }
    var btnGetDirectionMethodTwoSearchBox = document.getElementById('btnGetDirectionMethodTwoSearchBox');
    btnGetDirectionMethodTwoSearchBox.onclick = function () {
    	clearAllMarkes();
    	initializeVariable();
    	clearListnerClick();
        
       
        $.mobile.pageContainer.pagecontainer("change", "#PageGetDirection", {

        });
    }
    document.getElementById('btnCar').onclick = function () {
        $("#popupDialogDireictionMethod2Point").popup("close")
        
        getDirection('driving', markerPoint1, markerPoint2);
        clearAllMarkes();
    }
    document.getElementById('btnWalk').onclick = function () {

        $("#popupDialogDireictionMethod2Point").popup("close")

        getDirection('walking', markerPoint1, markerPoint2);
        clearAllMarkes();
    }
    document.getElementById('btnOk').onclick = function () {

        $("#popupText").popup("close");
    }

    document.getElementById('btnOkSearchBox').onclick = function () {

        $("#popupText1").popup("close");
    }
    //end get directions page 

    //call GetDirections in codepros
    function getDirection(travelModes, positionStart, positionEnd) {
        myMap.GetDirections({
            start: new google.maps.LatLng(positionStart.getPosition().lat(), positionStart.getPosition().lng()),
            end: new google.maps.LatLng(positionEnd.getPosition().lat(), positionEnd.getPosition().lng()),
            travelMode: travelModes,
            panel: "directions",
            error: function () {
                document.getElementById('popupTextContent').innerHTML = "direction not avaliable";
                $("#popupText").popup("open");
                

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
        clearListnerClick();
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
                
               


            }
        }

	);
    }

function markCurebtLocation(){
	myMap.GetCurrentPosition(function(position){
 if (myLocation) {
 	myMap.clearMark(myLocation);
 };                  
                    var objPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    this.Center(objPosition);
                    this.Zoom(16);
 
                    myLocation = new google.maps.Marker({
                        position:{
                            lat:objPosition.lat(),
                            lng:objPosition.lng()
                        },
                        map:this.gMap
                    });
                })
            }

   
    function initializeVariable(){
     myMap.ClearRoutes();
     markerPoint1=null;
     markerPoint2=null;
     markerBox1=null;
     markerBox2=null;
     markerpost1=null;
     markerpost2=null;
    }
    function clearAllMarkes(){
  
if (markerPoint1) {

	myMap.clearMark(markerPoint1);
}
if (markerPoint2) {

	myMap.clearMark(markerPoint2);
}


if (markerBox1) {
	myMap.clearMark(markerBox1);}
if (markerBox2) {
	myMap.clearMark(markerBox2);
}
if (markerpost1) {
	myMap.clearMark(markerpost1);
}
if (markerpost2) {

	myMap.clearMark(markerpost2);
}
if(gpsMarker){
    myMap.clearMark(gpsMarker);
}

}
function clearListnerClick(){
	google.maps.event.clearListeners(myMap.gMap, 'click');
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
