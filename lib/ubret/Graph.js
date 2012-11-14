// Generated by CoffeeScript 1.3.3
(function() {
  var BaseTool, Graph,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseTool = window.Ubret.BaseTool || require('./base_tool');

  Graph = (function(_super) {

    __extends(Graph, _super);

    function Graph(opts) {
      this.drawAxes = __bind(this.drawAxes, this);

      this.start = __bind(this.start, this);

      this.setupGraph = __bind(this.setupGraph, this);

      var compiled;
      Graph.__super__.constructor.call(this, opts);
      compiled = _.template(this.template, {
        selector: this.selector
      });
      this.el.html(compiled);
      this.width = opts.width || this.el.width();
      this.height = opts.height || this.el.height();
      this.margin = opts.margin || {
        left: 60,
        top: 20,
        bottom: 60,
        right: 40
      };
      this.format = opts.format ? d3.format(opts.format) : d3.format(',.02f');
      this.color = opts.color || '#0172E6';
      this.selectionColor = opts.selectionColor || '#CD3E20';
    }

    Graph.prototype.setupGraph = function() {
      var axis, key, _i, _ref, _ref1;
      for (axis = _i = 1, _ref = this.axes; 1 <= _ref ? _i <= _ref : _i >= _ref; axis = 1 <= _ref ? ++_i : --_i) {
        key = "axis" + axis;
        if ((_ref1 = this[key]) === "" || _ref1 === (void 0)) {
          return;
        }
      }
      this.el.find('svg').empty();
      this.graphHeight = this.height - (this.margin.top + this.margin.bottom);
      this.graphWidth = this.width - (this.margin.left + this.margin.right);
      this.svg = d3.select("" + this.selector + " svg").attr('width', this.width).attr('height', this.height).append('g').attr('transform', "translate(" + this.margin.left + ", " + this.margin.top + ")");
      this.setupData();
      this.drawAxes();
      return this.drawData();
    };

    Graph.prototype.start = function() {
      return this.setupGraph();
    };

    Graph.prototype.drawAxes = function() {
      var xAxis, yAxis;
      this.x = d3.scale.linear().range([0, this.graphWidth]).domain(this.xDomain);
      xAxis = d3.svg.axis().scale(this.x).orient('bottom');
      this.svg.append('g').attr('class', 'x axis').attr('transform', "translate(0, " + this.graphHeight + ")").call(xAxis);
      this.svg.append('text').attr('class', 'x label').attr('text-anchor', 'middle').attr('x', this.graphWidth / 2).attr('y', this.graphHeight + 40).text(this.formatKey(this.axis1));
      this.y = d3.scale.linear().range([this.graphHeight, 0]).domain(this.yDomain);
      yAxis = d3.svg.axis().scale(this.y).orient('left');
      this.svg.append('g').attr('class', 'y axis').attr('transform', "translate(0, 0)").call(yAxis);
      return this.svg.append('text').attr('class', 'y label').attr('text-anchor', 'middle').attr('y', -60).attr('x', -(this.graphHeight / 2)).attr('transform', "rotate(-90)").text(this.formatKey(this.axis2));
    };

    Graph.prototype.bufferAxes = function(domain) {
      var border, i, _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = domain.length; _i < _len; i = ++_i) {
        border = domain[i];
        if (border > 0) {
          _results.push(border = border - (border * 0.15));
        } else {
          _results.push(border = border + (border * 0.15));
        }
      }
      return _results;
    };

    return Graph;

  })(BaseTool);

  if (typeof require === 'function' && typeof module === 'object' && typeof exports === 'object') {
    module.exports = Graph;
  } else {
    window.Ubret['Graph'] = Graph;
  }

}).call(this);