(function (window, google, list) {

    var Codepros = (function () {
        //Constructor
        function Codepros(element, mapOption) {
            this.gMap = new google.maps.Map(element, mapOption);
            this.directionsDisplay = new google.maps.DirectionsRenderer();

            this.markers = list.Create();
            //Remember To Provide a Style for a Cluterer
            //Cuz it Needs a VPN Connection to get the default.
            if (mapOption.markerClusterer) {
                this.markerClusterer = new MarkerClusterer(this.gMap, []);
            }
            if (mapOption.geocoder) {
                this.geocoder = new google.maps.Geocoder();
            }
        }
        Codepros.prototype = {
            Zoom: function (zoomLevel) {
                if (zoomLevel) {
                    this.gMap.setZoom(zoomLevel);
                } else {
                    return this.gMap.getZoom();
                }
            },
            Center: function (LatLng) {
                if (LatLng) {
                    this.gMap.setCenter(LatLng);
                } else {
                    return this.gMap.getCenter();
                }
            },
            _attachEvents: function (obj, events) {
                var self = this;
                events.forEach(function (event) {
                    self._on({
                        obj: obj,
                        event: event.name,
                        callback: event.callback
                    });
                });
            },
            _on: function (options) {
                //One Event For Each Decelration
                var self = this;
                google.maps.event.addListener(options.obj, options.event, function (e) {
                    options.callback.call(self, e, options.obj);
                });
            },
            CreateMarker: function (options) {
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
                options.position = {
                    lat: options.lat,
                    lng: options.lng
                };
                marker = this._AddMarker(options);
                this.markers.add(marker);
                if (this.markerClusterer) {
                    this.markerClusterer.addMarker(marker);
                }
                if (options.events) {
                    this._attachEvents(marker, options.events);
                    //this._on({
                    //	obj:marker,
                    //	event:options.event.name,
                    //	callback:options.event.callback
                    //})
                    //Dealing With Multible Events
                }
                if (options.content) {
                    this._on({
                        obj: marker,
                        event: 'click',
                        callback: function () {
                            var infoWindow = new google.maps.InfoWindow({
                                content: options.content
                            });
                            infoWindow.open(this.gMap, marker);
                        }
                    })
                }
                return marker;
            },
            _AddMarker: function (options) {
                options.map = this.gMap;
                return new google.maps.Marker(options);
            },
            /*AddInfoWindow:function(content,marker){
				this._on({
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
            RemoveMarker: function (marker) {
                var indexOf = this.markers.indexOf(marker);
                if (indexOf != -1) {
                    this.markers.splice(indexOf, 1);
                    marker.setMap(null);
                }
            },
            Geocode: function (geoCoderOptions) {
                this.geocoder.geocode({
                    address: geoCoderOptions.location,
                }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        geoCoderOptions.success.call(this, results, status);
                    } else {
                        geoCoderOptions.error.call(this, status);
                    }
                })
            },
            FindBy: function (callback) {
                return this.markers.find(callback);
            },
            RemoveBy: function (callback, action) {
                var self = this;
                return self.markers.find(callback, function (markers) {
                    markers.forEach(function (marker) {
                        if (self.markerClusterer) {
                            self.markerClusterer.removeMarker(marker);
                        } else {
                            marker.setMap(null);
                        }
                    });
                })
            },
            GetDirections: function (directionOption) {
              //  console.log(directionOption.start);
                switch (directionOption.travelMode) {
                    case 'driving':
                        directionOption.travelMode = google.maps.TravelMode.DRIVING;
                        break;
                    default:
                        directionOption.travelMode = google.maps.TravelMode.WALKING;
                        break;
                }
                var directionsService = new google.maps.DirectionsService(),
					directionsDisplay = this.directionsDisplay,
					bounds = new google.maps.LatLngBounds();
                directionsDisplay.setMap(this.gMap);
                if (directionOption.panel) {
                    directionsDisplay.setPanel(document.getElementById(directionOption.panel));
                }
                //bounds.extend(directionOption.start);
                //bounds.extend(directionOption.end);
                //this.gMap.fitBounds(bounds);

                var request = {
                    origin: directionOption.start,
                    destination: directionOption.end,
                    travelMode: directionOption.travelMode
                };
                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    } else {
                        alert("Direction not available ");
                    }
                });
            },
            ClearRoutes: function () {
                this.directionsDisplay.setMap(null);

            }
            ,

            GetCurrentPosition: function (callback) {
                var self = this;
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        //Self = Codepros
                        //'this' in getCurrentPosition refers to navigator
                        //console.log(self);
                        callback.call(self, position);
                    });
                }
            },
            MarkCurrentPosition: function () {
                this.GetCurrentPosition(function (position) {
                    //console.dir(position);
                    var objPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    this.Center(objPosition);
                    this.Zoom(16);
                    //Cannot use CreateMarker Cuz it's Adding the marker to the List
                    //this.CreateMarker({
                    //	lat:objPosition.lat(),
                    //	lng:objPosition.lng()
                    //});
                    var marker = new google.maps.Marker({
                        position: {
                            lat: objPosition.lat(),
                            lng: objPosition.lng()
                        },
                        map: this.gMap
                    });
                })
            },
            AutoComplete: function (element) {
                var self = this;
                var autoComplete = new google.maps.places.Autocomplete(element, {
                    componentRestrictions: { country: 'sy' }
                });
                autoComplete.bindTo('bounds', this.gMap);

                var infoWindow = new google.maps.InfoWindow(),
					marker = new google.maps.Marker({
					    map: this.gMap,
					    anchorPoint: new google.maps.Point(0, -29)
					});
                this._on({
                    obj: autoComplete,
                    event: 'place_changed',
                    callback: function () {
                        infoWindow.close();
                        marker.setVisible(false);
                        var place = autoComplete.getPlace();
                        console.log(place);
                        if (!place.geometry) {
                            console.log("Not Found in Places..");
                            return;
                        }
                        if (place.geometry.viewport) {
                            self.gMap.fitBounds(place.geometry.viewport);
                        } else {
                            self.gMap.fitBounds(place.geometry.viewport);
                            self.Zoom(17);
                        }
                        marker.setIcon(({
                            url: place.icon,
                            size: new google.maps.Size(50, 50),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(17, 34),
                            scaledSize: new google.maps.Size(35, 35)
                        }));

                        marker.setPosition(place.geometry.location);
                        marker.setVisible(true);

                        console.dir(place);
                        var address = '';
                        if (place.address_components) {
                            address = [
    						(place.address_components[0] && place.address_components[0].short_name || ''),
    						(place.address_components[1] && place.address_components[1].short_name || ''),
    						(place.address_components[2] && place.address_components[2].short_name || '')
                            ].join(' ');
                        }
                        infoWindow.setContent("<div><strong>" + place.name + "</strong></div>" + address);
                        infoWindow.open(self.gMap, marker);
                    }
                });
            },
            PushControl: function (element, position) {
                switch (position) {
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
    Codepros.CreateNew = function (element, mapOption) {
        return new Codepros(element, mapOption);
    }
    window.Codepros = Codepros;
})(window, google, list);