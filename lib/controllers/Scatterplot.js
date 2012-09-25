(function() {
  var BaseController, Scatterplot, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseController = require('./BaseController');

  _ = require('underscore/underscore');

  Scatterplot = (function(_super) {

    __extends(Scatterplot, _super);

    function Scatterplot() {
      this.select = __bind(this.select, this);

      this.render = __bind(this.render, this);

      this.start = __bind(this.start, this);

      this.tooltipDisplay = __bind(this.tooltipDisplay, this);
      Scatterplot.__super__.constructor.apply(this, arguments);
      this.xAxisKey = this.xAxisKey || 'ra';
      this.yAxisKey = this.yAxisKey || 'dec';
      this.createGraph();
    }

    Scatterplot.prototype.name = "Scatterplot";

    Scatterplot.prototype.keys = [];

    Scatterplot.prototype.createGraph = function() {
      this.graph = nv.models.scatterChart().showLegend(false).tooltipXContent(null).tooltipYContent(null).tooltipContent(this.tooltipDisplay).color(d3.scale.category10().range());
      return this.graph.scatter.id(this.channel);
    };

    Scatterplot.prototype.tooltipDisplay = function(series, x, y, object, chart) {
      var datum, point, xAxis, xAxisVal, yAxis, yAxisVal;
      point = object.point;
      datum = _.find(this.data, function(datum) {
        return datum.zooniverse_id === point.zooniverse_id;
      });
      this.publish([
        {
          message: 'selected',
          item_id: point.zooniverse_id
        }
      ]);
      xAxis = this.prettyKey(this.xAxisKey);
      yAxis = this.prettyKey(this.yAxisKey);
      xAxisVal = datum[this.xAxisKey];
      yAxisVal = datum[this.yAxisKey];
      return require('../views/scatterplot_tooltip')({
        xAxisVal: xAxisVal,
        yAxisVal: yAxisVal,
        xAxis: xAxis,
        yAxis: yAxis
      });
    };

    Scatterplot.prototype.start = function() {
      this.addAxis();
      this.filterData();
      return this.addData();
    };

    Scatterplot.prototype.addData = function(options) {
      var subject, svg, _i, _len, _ref;
      options = {
        size: 1,
        shape: 'circle'
      };
      this.series = [
        {
          key: "Group",
          values: []
        }
      ];
      if (this.filteredData) {
        _ref = this.filteredData;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subject = _ref[_i];
          this.series[0].values.push({
            x: subject[this.xAxisKey],
            y: subject[this.yAxisKey],
            size: options.size,
            shape: options.shape,
            zooniverse_id: subject.zooniverse_id
          });
        }
      }
      svg = d3.select("#" + this.channel + " svg").datum(this.series).transition().duration(500).call(this.graph);
      return nv.utils.windowResize(this.graph.update);
    };

    Scatterplot.prototype.addAxis = function(options) {
      options = {
        xAxisFormat: '.02f',
        yAxisFormat: '.02f'
      };
      this.graph.xAxis.axisLabel(this.prettyKey(this.xAxisKey)).tickFormat(d3.format(options.xAxisFormat));
      return this.graph.yAxis.axisLabel(this.prettyKey(this.yAxisKey)).tickFormat(d3.format(options.yAxisFormat));
    };

    Scatterplot.prototype.render = function() {
      return this.html(require('../views/scatterplot')(this));
    };

    Scatterplot.prototype.select = function(itemId) {
      var item, itemIndex;
      d3.select(this.point).classed("hover", false);
      item = _.find(this.series[0].values, function(value) {
        return value.zooniverse_id === itemId;
      });
      itemIndex = _.indexOf(this.series[0].values, item);
      this.point = ".nv-chart-" + this.channel + " .nv-series-0 .nv-point-" + itemIndex;
      d3.select(this.point).classed("hover", true);
      return this.publish([
        {
          message: "selected",
          item_id: itemId
        }
      ]);
    };

    return Scatterplot;

  })(BaseController);

  module.exports = Scatterplot;

}).call(this);