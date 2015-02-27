(function(window,Codepros){
      //namespace.widgetName
	$.widget( "codepros.codepros", {
      // default options
      options: { },
 
      // the constructor
      _create: function() {
        var element = this.element[0],
            options = this.options;
        this.map = Codepros.CreateNew(element,options);
      },
 
      // called when created, and later when changing options
      _refresh: function() {
        
      },
      Zoom: function(zoomLevel){
        return this.map.Zoom(zoomLevel);
      },
      getAllMarkers: function(){
        return this.map.markers.items;
      },
      addMarker: function( opts ) {
        var self = this;
        console.log()
        if(opts.location){
          //Sending Null
          this.map.Geocode({
            address : opts.location,
            success:function(results){
              results.forEach(function(result){
                opts.lat = result.geometry.location.lat();
                opts.lng = result.geometry.location.lng();
                self.map.CreateMarker(opts);
                console.log(this.geocoder);
              });
            },
            error: function(status){
              console.error(status);
            }
          })
        } else {
          return this.map.CreateMarker(opts);  
        }
      },
      findMarkers: function( callback ){
        return this.map.FindBy(callback);
      },

      removeMarkers: function( callback ){
        this.map.RemoveBy( callback );
      },
      _destroy: function() {
        
      },
 
      _setOptions: function() {
      
      
      },
 
      _setOption: function( key, value ) {
   
      }
  });
 
})(window,Codepros);