BaseController = require('./BaseController')
_ = require('underscore/underscore')

class Map extends BaseController
  @mapOptions =
    attributionControl: false
    
  # Set the default image path
  L.Icon.Default.imagePath = 'css/images'

  name: "Map"
  
  constructor: ->
    super
    @subscribe @subChannel, @process
    @html require('views/map')()
    @createSky()
    @plotObjects()
    
  createSky: =>
    @map = L.map("sky", Map.mapOptions).setView([0, 180], 6)
    @layer = L.tileLayer('/tiles/#{zoom}/#{tilename}.jpg',
      maxZoom: 7
    )
    @layer.getTileUrl = (tilePoint) ->
      zoom = @_getZoomForUrl()
      convertTileUrl = (x, y, s, zoom) ->
        pixels = Math.pow(2, zoom)
        d = (x + pixels) % (pixels)
        e = (y + pixels) % (pixels)
        f = "t"
        g = 0
        while g < zoom
          pixels = pixels / 2
          if e < pixels
            if d < pixels
              f += "q"
            else
              f += "r"
              d -= pixels
          else
            if d < pixels
              f += "t"
              e -= pixels
            else
              f += "s"
              d -= pixels
              e -= pixels
          g++
        x: x
        y: y
        src: f
        s: s

      url = convertTileUrl(tilePoint.x, tilePoint.y, 1, zoom)
      return "/tiles/#{zoom}/#{url.src}.jpg"

    @layer.addTo @map
  
  plotObject: (coords, options) =>
    L.circle(coords, 500, options).addTo(@map)
    
  plotObjects: =>
    options =
      color: '#0172E6'
    
    for subject in @subjects
      coords = subject.coords
      circle = @plotObject coords, options
      circle.zooniverse_id = subject.zooniverse_id
      console.log subject
      circle.bindPopup require('views/map_popup')({subject})

  process: (message) =>
    console.log message
    @selected message.item_id if message.message == "selected"
 
  selected: (itemId) ->
    item = _.find @subjects, (subject) ->
      subject.zooniverse_id = itemId

    latlng = new L.LatLng(item.coords[0], item.coords[1])
    @map.panTo latlng
  
module.exports = Map