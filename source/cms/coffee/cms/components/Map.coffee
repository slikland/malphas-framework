class components.Map extends BaseDOM
	@SELECTOR: '.map'
	@ORDER: 0
	@MAP_API: "https://maps.googleapis.com/maps/api/js?key={API_KEY}&libraries=places&callback=initMapComponent"

	constructor:()->
		super

		window.initMapComponent = @initMap

		@_mapsAPI = new BaseDOM({element:"script"})
		@_mapsAPI.attr("async", "")
		@_mapsAPI.attr("defer", "")

		@MAP_API = components.Map.MAP_API.replace("{API_KEY}", @attr("key"))

		@_mapsAPI.attr("src", @MAP_API)
		@appendChild(@_mapsAPI)

		@_zoom = Number(@attr("zoom")) || 4
		@_lat = Number(@attr("lat")) || -14.235004
		@_lng = Number(@attr("lng")) || -51.92527999999999

		@_latInput = @find(".lat-input")
		@_lngInput = @find(".lng-input")
		@_zoomInput = new BaseDOM({element:@find(".zoom-input")})

	initMap:=>
		@_input = @find(".address-input", true)
		@_input.element.on("keydown", @_keyDown)

		@_mapContainer = new BaseDOM({className:"map-container"})
		@_mapContainer.attr("id", "mapContainer")
		@appendChild(@_mapContainer)

		@_geocoder = new google.maps.Geocoder();

		@_map = new google.maps.Map(document.getElementById('mapContainer'), {
			center: {lat: @_lat, lng: @_lng},
			zoom: @_zoom
		})

		@_map.addListener("zoom_changed", @_zoomChanged)

		if @_latInput.value != "" && @_lngInput.value != ""
			location = new google.maps.LatLng({lat: Number(@_latInput.value), lng: Number(@_lngInput.value)})
			@_setLocation(location)
		else
			@_zoomChanged()
			location = @_map.getCenter()

		@_marker = new google.maps.Marker({
			position: location,
			map: @_map,
			draggable: true
		})

		@_marker.addListener("dragend", @_markerDrag)

		@_autocomplete = new google.maps.places.Autocomplete(@_input.element, {types: ['geocode']});
		@_autocomplete.addListener('place_changed', @_placeChange);

	_zoomChanged:=>
		@_zoom = @_map.getZoom()
		@_zoomInput.attr("value", @_zoom)

	_markerDrag:(event)=>
		location = @_marker.getPosition()

		@_setLocation(location)
		@_geocodePosition(location)

	_placeChange:(event)=>
		place = @_autocomplete.getPlace()

		location = new google.maps.LatLng({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}); 

		@_setLocation(location)

		@_marker.setPosition(@_map.getCenter())

	_setMapZoom:(zoom = 14)=>
		@_map.setZoom(zoom)

	_setLocation:(location)=>
		@_map.setCenter(location)
		@_setMapZoom()

		@_latInput.setAttribute("value", location.lat())
		@_lngInput.setAttribute("value", location.lng())

	_keyDown:(event)=>
		if event.keyCode == 13
			event.preventDefault()

	_geocodePosition:(position)=>
		@_geocoder.geocode({'location':position}, @_geoCallback)

	_geoCallback:(results, status)=>
		if status == google.maps.GeocoderStatus.OK
			@_input.attr("value", results[0].formatted_address)
		else
			throw new Error("Ops, looks like GeocoderStatus inst OK!")

	destroy:()->