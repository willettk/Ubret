
Graph = window.Ubret.Graph or require('./Graph')

class Scatter2D extends Graph
  name: 'Scatterplot'
  axes: 2
  
  template:
    """
    <div class="scatter-2d">
      <div id="<%- selector %>">
        <svg></svg>
      </div>
    </div>
    """
  
  constructor: (opts) ->
    super opts
  
  setupData: =>
    # Create Dimensions for Axes
    console.log @dimensions
    @createDimensions [@axis1, @axis2]
    # Get data from crossfilter object
    data = @dimensions.uid.top(Infinity)
    console.log 'here-setup'
    console.log data
    @graphData = _.map(data, (d) => _.pick(d, @axis1, @axis2))
    @xDomain = d3.extent(@graphData, (d) => d[@axis1])
    @yDomain = d3.extent(@graphData, (d) => d[@axis2])

  drawData: =>
    @points = @svg.append('g').selectAll('circle')
        .data(@graphData)
      .enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 1.5)
        .attr('cx', (d) => @x(d[@axis1]))
        .attr('cy', (d) => @y(d[@axis2]))
        .on('mouseover', @displayTooltip)
        .on('mouseout', @removeTooltip)
  
  drawBrush: =>
    @svg.append('g')
      .attr('class', 'brush')
      .attr('width', @graphWidth)
      .attr('height', @graphHeight)
      .attr('height', @graphHeight)
      .attr('opacity', 0.5)
      .attr('fill', '#CD3E20')
      .call(d3.svg.brush().x(@x).y(@y)
      .on('brushend', @brushend))
  
  brushend: =>
    # Clear existing filters
    for axis, dimension of @dimensions
      dimension.filterAll()
      
    d = d3.event.target.extent()
    x = d.map( (x) -> return x[0])
    y = d.map( (x) -> return x[1])
    
    # Select all items within the range
    # TODO: Pass these data down the chain
    @dimensions[@axis1].filter(x)
    @dimensions[@axis2].filter(y)
    top   = @dimensions[@axis1].top(Infinity)
    data  = _.map(top, (d) => _.pick(d, @axis1, @axis2))
    console.log data
  
  
if typeof require is 'function' and typeof module is 'object' and typeof exports is 'object'
  module.exports = Scatter2D
else
  window.Ubret['Scatter2D'] = Scatter2D