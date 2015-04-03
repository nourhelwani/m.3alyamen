(function(window,google,list,$){

    var Codepros=(function(){
        //Constructor
        function Codepros( element,mapOption ){
            this.gMap = new google.maps.Map(element,mapOption);
            this.markers=list.Create();
            
            this.directionsDisplay = new google.maps.DirectionsRenderer()
            //Remember To Provide a Style for a Cluterer
            //Cuz it Needs a VPN Connection to get the default.
            if(mapOption.markerClusterer){
                this.markerClusterer = new MarkerClusterer(this.gMap , []); 
            }
            if(mapOption.geocoder){
                this.geocoder = new google.maps.Geocoder();
            }
        }
        Codepros.prototype={
            Zoom:function( zoomLevel ){
                if(zoomLevel){
                    this.gMap.setZoom(zoomLevel);
                } else {
                    return this.gMap.getZoom();
                }
            },
            Center:function( LatLng ){
                if(LatLng){
                    this.gMap.setCenter(LatLng);
                } else {
                    return this.gMap.getCenter();
                }
            },
            _AttachEvents:function( obj,events ){
                var eventsHandlers = [],
                    eventHandler;
                var self = this;
                events.forEach(function(event){
                    eventHandler = self._On({
                        obj:obj,
                        event:event.name,
                        callback:event.callback
                    });
                    eventsHandlers.push(eventHandler);
                });
                return eventsHandlers;
            },
            _On:function( options ){
                //One Event For Each Decelration
                var self = this;
                var eventHandler = google.maps.event.addListener(options.obj,options.event,function(e){
                    options.callback.call(self,e,options.obj);
                });
                return eventHandler;
            },
            _OnOnce:function( options ){
                var self = this;
                google.maps.event.addListenerOnce(options.obj,options.event,function(e){
                    options.callback.call(self,e,options.obj);
                });
            },
            _DetachEvents:function( eventsHandlers ){
                var self = this;
                eventsHandlers.forEach(function(event){
                    self._Off(event);
                })
            },
            _DetachEventsForObject:function( obj ){
                google.maps.event.clearInstanceListeners(obj);
            },
            _Off:function( eventHandler ){
                google.maps.event.removeListener(eventHandler);
            },
            CreateMarker:function( options ){
                var marker,
                    self = this;
                //Error While Calling Need To Fix
                //Pass it to jQueryUI
                /*if(options.location){
                    this.Geocode({
                        address:options.location,
                        success:function(results){
                            results.forEach(function(result){
                                options.position={
                                    lat : result.geometry.location.lat(),
                                    lng : result.geometry.location.lng()
                                }
                                marker = this._AddMarker(options);
                                console.log(marker);
                            })
                            alert("Done");
                        },
                        error:function(status){
                            console.error(status);
                        }
                    });
                } else {
                    options.position={
                    lat:options.lat,
                    lng:options.lng
                    };
                    marker = this._AddMarker(options);
                }*/
                options.position={
                    lat:options.lat,
                    lng:options.lng
                };
                marker = this._AddMarker(options);
                this.markers.add(marker);
                if(this.markerClusterer){
                    this.markerClusterer.addMarker(marker); 
                }
                if(options.events){
                    this._AttachEvents(marker,options.events);
                    //this._On({
                    //  obj:marker,
                    //  event:options.event.name,
                    //  callback:options.event.callback
                    //})
                    //Dealing With Multible Events
                }
                if(options.content){
                    this._On({
                        obj:marker,
                        event:'click',
                        callback:function(){
                            var infoWindow = new google.maps.InfoWindow({
                                content:options.content
                            });
                            infoWindow.open(this.gMap,marker);
                        }
                    })
                }
                return marker;
            },
            _AddMarker:function( options ){
                options.map=this.gMap;
                return new google.maps.Marker(options);
            },
            /*AddInfoWindow:function(content,marker){
                this._On({
                    obj:marker,
                    event:'click',
                    callback:function(){
                        var infoWindow=new google.maps.InfoWindow({
                            content:content
                        });
                        infoWindow.open(this.gMap,marker);
                    }
                })
            },*/
            RemoveMarker:function( marker ){
                var indexOf=this.markers.indexOf(marker);
                if(indexOf!=-1){
                    this.markers.splice(indexOf,1);
                    marker.setMap(null);
                }
            },
            Geocode:function( geoCoderOptions ){
                if(geoCoderOptions.location){
                    Request={address : geoCoderOptions.location,}
                }else if(geoCoderOptions.latLng){
                    Request={latLng : geoCoderOptions.latLng}
                }
                this.geocoder.geocode(Request,function(results,status){
                    if(status === google.maps.GeocoderStatus.OK){
                        geoCoderOptions.success.call(this,results,status);
                    } else {
                        geoCoderOptions.error.call(this,status);
                    }
                
                })
            },
            /*reverseGeocoding:function(geoCoderOptions){
                this.geocoder.geocode({
                    //request
                    latLng:geoCoderOptions.latLng
                },function(results,status){
                    if(status == google.maps.GeocoderStatus.OK){
                        geoCoderOptions.success.call(this,results,status);
                    }else{
                        geoCoderOptions.error.call(this,status);    
                    }
                
                });
            },*/
            FindBy:function( callback ){
                return this.markers.find(callback);
            },
            RemoveBy:function( callback,action ){
                var self = this;
                return self.markers.find(callback,function(markers){
                    markers.forEach(function(marker){
                        if(self.markerClusterer){
                            self.markerClusterer.removeMarker(marker);
                        } else {
                            marker.setMap(null);                            
                        }
                    });
                })
            },
            CalculateDistance:function( options ){
                var result = google.maps.geometry.spherical.computeDistanceBetween(options.start,
                                                                                   options.end,
                                                                                   options.radius);
                return result;
            },
            GetDirections:function( directionOption ){
                var self = this;
                switch(directionOption.travelMode){
                    case 'driving':
                    directionOption.travelMode = google.maps.TravelMode.DRIVING;
                    break;
                    default:
                    directionOption.travelMode= google.maps.TravelMode.WALKING;
                    break;
                }
                var directionsService = new google.maps.DirectionsService(),
                    //directionsDisplay = new google.maps.DirectionsRenderer(),
                    bounds = new google.maps.LatLngBounds();
                    this.directionsDisplay.setMap(this.gMap);
                if(directionOption.panel){
                    this.directionsDisplay.setPanel(document.getElementById(directionOption.panel));
                }
                //bounds.extend(directionOption.start);
                //bounds.extend(directionOption.end);
                //this.gMap.fitBounds(bounds);
                var request = {
                    origin : directionOption.start,
                    destination : directionOption.end,
                    travelMode : directionOption.travelMode
                };
                directionsService.route(request,function(response,status){
                    if(status == google.maps.DirectionsStatus.OK){
                        self.directionsDisplay.setDirections(response);
                        directionOption.success.call(this,true);
                    } else {
                        directionOption.error.call(this,false);
                    }
                });
            },
            ClearRoutes:function(){
                this.directionsDisplay.setMap(null);
            },
            clearMark:function(mark){
            	mark.setMap(null);

            },
            GetCurrentPosition:function( callback ) {
                var self = this;
                if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(function(position){
                        //Self = Codepros
                        //'this' in getCurrentPosition refers to navigator
                        //console.log(self);
                        callback.call(self,position);
                    });
                }
            },
            GetLocationByIP:function(){
                var self = this;
                $.getJSON('http://www.telize.com/geoip',function( response ){
                    var location = new google.maps.LatLng( response.latitude,response.longitude );
                    self.Center(location);  
                })
                return location;
            },
            MarkCurrentPosition:function(){
                this.GetCurrentPosition(function(position){
                    //console.dir(position);
                    var objPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    this.Center(objPosition);
                    this.Zoom(16);
 
                    var marker = new google.maps.Marker({
                        position:{
                            lat:objPosition.lat(),
                            lng:objPosition.lng()
                        },
                        map:this.gMap
                    });
                })
            },
            AutoComplete:function( options ){

                var self = this;
                var autoComplete = new google.maps.places.Autocomplete(options.element,{
                    componentRestrictions: {country: 'sy'}
                });
                autoComplete.bindTo('bounds',this.gMap);
                
                var infoWindow = new google.maps.InfoWindow(),
                    marker = new google.maps.Marker({
                        map:this.gMap,
                        anchorPoint:new google.maps.Point(0,-29)
                    });
                this._On({
                    obj:autoComplete,
                    event:'place_changed',
                    callback:function(){
                        infoWindow.close();
                        marker.setVisible(false);
                        var place = autoComplete.getPlace();
                        console.log(place);
                  
                        if(!place.geometry){
                            console.log("Not Found in Places..");
                         options.error.call(self,"true");
                            return;
                        }
                        if(place.geometry.viewport){
                            self.gMap.fitBounds(place.geometry.viewport);
                        } else {
                            self.gMap.fitBounds(place.geometry.viewport);
                            self.Zoom(17);
                        }
                        marker.setIcon(({
                            url:place.icon,
                            size:new google.maps.Size(50,50),
                            origin:new google.maps.Point(0,0),
                            anchor:new google.maps.Point(17,34),
                            scaledSize:new google.maps.Size(35,35)
                        }));
                         marker.setPosition(place.geometry.location);
                        options.position.call(self,place.geometry.location);
             if (options.showMarker) {

                        marker.setVisible(true);
                    }

                        console.dir(place);
                        var address = '';
                        if(place.address_components) {
                            address = [
                            (place.address_components[0] && place.address_components[0].short_name || ''),
                            (place.address_components[1] && place.address_components[1].short_name || ''),
                            (place.address_components[2] && place.address_components[2].short_name || '')
                            ].join(' ');
                        }
                        infoWindow.setContent("<div><strong>"+place.name+"</strong></div>"+address);
                        if (options.showMarker) {
                        infoWindow.open(self.gMap,marker);
                    }
                    }   
                });
            },

            PushControl:function( element,position ){   
                switch(position){
                    case 'top_center':
                        position = google.maps.ControlPosition.TOP_CENTER;
                        break;
                    case 'top_left':
                        position = google.maps.ControlPosition.TOP_LEFT;
                        break;
                    case 'top_right':
                        position = google.maps.ControlPosition.TOP_RIGHT;
                        break;
                    case 'left_top':
                        position = google.maps.ControlPosition.LEFT_TOP;
                        break;
                    case 'right_top':
                        position = google.maps.ControlPosition.RIGHT_TOP;
                        break;
                    case 'left_center':
                        position = google.maps.ControlPosition.LEFT_CENTER;
                        break;
                    case 'right_center':
                        position = google.maps.ControlPosition.RIGHT_CENTER;
                        break;
                    case 'left_bottom':
                        position = google.maps.ControlPosition.LEFT_BOTTOM;
                        break;
                    case 'right_bottom':
                        position = google.maps.ControlPosition.RIGHT_BOTTOM;
                        break;
                    case 'bottom_center':
                        position = google.maps.ControlPosition.BOTTOM_CENTER;
                        break;
                    case 'bottom_left':
                        position = google.maps.ControlPosition.BOTTOM_LEFT;
                        break;
                    case 'bottom_right':
                        position = google.maps.ControlPosition.BOTTOM_RIGHT;
                        break;
                    case 'top':
                        position = google.maps.ControlPosition.TOP;
                        break;
                    case 'bottom':
                        position = google.maps.ControlPosition.BOTTOM;
                        break;
                    case 'left':
                        position = google.maps.ControlPosition.LEFT;
                        break;
                    case 'right':
                        position = google.maps.ControlPosition.RIGHT;
                        break;
                }
                this.gMap.controls[position].push(element);
            }   
        };
        return Codepros;
    })();
    Codepros.CreateNew=function( element,mapOption ){
        return new Codepros(element,mapOption);
    }
    window.Codepros=Codepros;
})(window,google,list,jQuery);
