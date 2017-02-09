/**
 * HEXAGONS Signature
 */
(function() {
	window.HEXAGONS = {
		UTIL : {
			/**
			 * Check every property in _default and copy to options (if not
			 * exist)
			 */
			inheritProperties : function(options, _default) {
				if (options != undefined){
					for (i in _default) {
						if (options[i] == undefined) {
							options[i] = _default[i];
						}
					}
				}else{
					options = _default;
				}
				
				return options;
			},
			/**
			 * Cross-browser Object.create()
			 * 
			 * @param proto
			 * @returns {F}
			 */
			_inheritClass_ : function(proto) {
				function F() {
				}
				;
				F.prototype = proto;
				return new F();
			},
			/**
			 * Util function which help to inherit object definition
			 * 
			 * @param Child
			 * @param Parent
			 */
			extend : function(Child, Parent) {
				Child.prototype = HEXAGONS.UTIL
						._inheritClass_(Parent.prototype);
				Child.prototype.constructor = Child;
				Child.parent = Parent.prototype;
			},
			/**
			 * Create in memory
			 * 
			 * @tag
			 * @param attrs
			 * @param tag
			 * @returns
			 */
			createInMemoryGroup : function(attrs, tag) {
				var newTag = tag ? tag : "g";
				var newElement = document.createElementNS(
						"http://www.w3.org/2000/svg", newTag);
				if (attrs) {
					for ( var attr in attrs) {
						newElement.setAttribute(attr, attrs[attr] ? attrs[attr]
								: "");
					}
				}
				return newElement;
			},
			getPointString : function(points) {
				var st = "";
				for ( var p in points) {
					if (points[p] instanceof HEXAGONS.POINT){
						st = st + points[p].getString() + " ";
					}					
				}
				return st;
			}
		},

		CONST : {
			HEXAGON : {
				MAX_RELATIVE : 6,
				RELATEIVE_TYPE : {
					TOP : 0,
					TOP_RIGHT : 1,
					BOT_RIGHT : 2,
					BOT : 3,
					BOT_LEFT : 4,
					TOP_LEFT : 5
				},
				OPPOSITE_TYPE : [ 3, 4, 5, 0, 1, 2 ],
				HEXAGON_DEG : (Math.PI * 2) / 6,
				HEXAGON_DEEP_RATIO : 3
			},
			TOWER:{
				TOWER_RADIUS_RATIO : 2 / 3
			}
		},

		POINT : function(x, y) {
			this.x = x;
			this.y = y;
		},
		_BASE : function(options) {
				this.init(options);
		},

		HEXAGON : function(options) {
			HEXAGONS.HEXAGON.parent.constructor.apply(this, arguments);
		},
		TOWER : function(options) {
			HEXAGONS.TOWER.parent.constructor.apply(this, arguments);
		},
		HEXAGON_TOWER : function(options) {
			HEXAGONS.HEXAGON_TOWER.parent.constructor.apply(this, arguments);
		},
		HEXAGON_FLOWER : function(options) {
			HEXAGONS.HEXAGON_FLOWER.parent.constructor.apply(this, arguments);
		},
		HEXAGON_CHART : function(options) {
			HEXAGONS.HEXAGON_CHART.parent.constructor.apply(this, arguments);
		}

	};

	HEXAGONS.UTIL.extend(HEXAGONS.HEXAGON, HEXAGONS._BASE);
	HEXAGONS.UTIL.extend(HEXAGONS.TOWER, HEXAGONS._BASE);
	HEXAGONS.UTIL.extend(HEXAGONS.HEXAGON_TOWER, HEXAGONS._BASE);
	HEXAGONS.UTIL.extend(HEXAGONS.HEXAGON_FLOWER, HEXAGONS._BASE);
	HEXAGONS.UTIL.extend(HEXAGONS.HEXAGON_CHART, HEXAGONS._BASE);

	/**
	 * POINT
	 */
	HEXAGONS.POINT.prototype = {
		init : function() {
			return this.x + "," + this.y;
		},
		getString : function() {
			return this.x + "," + this.y;
		}
	}

	/***************************************************************************
	 * BASESHAPE
	 * Define flow to setup a chart
	 **************************************************************************/

	/**
	 * Default options:{
	 * 			parent: //parent element of chart,
	 * 			center: //center point of chart,
	 * 			groupClass: //css class for the group object
	 * }
	 * 
	 * Init main attributes:
	 * data: (options)
	 * parent: d3 parent object
	 * group : 
	 * shapes : child shapes
	 * attrs: extra attributes
	 */
	HEXAGONS._BASE.prototype.init = function(options) {
		this.shapes = {};
		this.attrs = {};		
		//Allow child class setup extra default properties
		this._initExtraProperties(options);	
		
		this.data.center = new HEXAGONS.POINT(this.data.center.x, this.data.center.y);
		
		//select parent as d3 object
		this.parent = d3.select(this.data.parent).node();
		// Create group object
		if (this.data.css != undefined) {
			this.data.css.class = this.data.groupClass;
		} else {
			this.data.css = {
				class : this.data.groupClass
			};
		}		
		this.group = HEXAGONS.UTIL.createInMemoryGroup(this.data.css);
		
		// Append this.group inside this.parent
		d3.select(this.parent).node().appendChild(this.group);
		
		//put content into group element
		this.draw();
		
	};

	/**
	 * ABSTRACT
	 */

	/**
	 * Init the content of group object before attach group to page
	 */
	HEXAGONS._BASE.prototype.draw = function() {
		console.log("Execute draw : Init the content of group object before attach group to page");
		console.log(this);
	};
	
	/**
	 * Allow child class setup extra default properties
	 */
	HEXAGONS._BASE.prototype._initExtraProperties = function() {
		console.log("Execute _initExtraProperties: Allow child class setup extra default properties");
		console.log(this);
	};
	
	HEXAGONS._BASE.prototype.detach = function() {
		d3.select(this.group).selectAll("polygon").remove();
	};

	/***************************************************************************
	 * HEXAGONS
	 * Extended: _BASE
	 * Extras:
	 * 
	 * attrs:{
	 *  width,
	 *  height,
	 *  deep
	 * }
	 **************************************************************************/

	//@Overried	 
	HEXAGONS.HEXAGON.prototype._initExtraProperties = function(options) {
		this.data = HEXAGONS.UTIL.inheritProperties(options, {
			parent : "svg",	
			groupClass : "hexagon",
			faces:{
				topClass: "top",
				leftClass: "left",
				bottomClass: "bottom",
				rightClass: "right"
			},
			center : {x: 50, y:50},
			r: 50,
			draggable: false
		});	
	}
	
	//@Overried
	HEXAGONS.HEXAGON.prototype.draw = function() {
		//view port
		this.attrs.width = 2 * this.data.r;
		this.attrs.height = this.attrs.width
				* Math.sin(HEXAGONS.CONST.HEXAGON.HEXAGON_DEG);
		this.attrs.deep = this.data.r / HEXAGONS.CONST.HEXAGON.HEXAGON_DEEP_RATIO;
		
		//top shape data
		var x = this.data.center.x, y = this.data.center.y, r = this.data.r,
		_calculatePoint_ = function(i, dx, dy, r) {
			var a = HEXAGONS.CONST.HEXAGON.HEXAGON_DEG;
			var xAxis = r * Math.cos(a * i) + dx;
			var yAxis = r * Math.sin(a * i) + dy;
			var x = Math.abs(xAxis), y = Math.abs(yAxis * Math.cos(2 * Math.PI / 3));
			return new HEXAGONS.POINT(x, y);
		},
		topFace = {
				p1 :  _calculatePoint_(1, x, y, r),
				p2 :  _calculatePoint_(2, x, y, r),
				p3 :  _calculatePoint_(3, x, y, r),
				p4 :  _calculatePoint_(4, x, y, r),
				p5 :  _calculatePoint_(5, x, y, r),
				p6 :  _calculatePoint_(6, x, y, r),
				clazz: this.data.faces.topClass
		};		
		topFace.points = HEXAGONS.UTIL.getPointString(topFace);
		//side data
		var _calculateRectPoints = function(p1, p2,deep,clazz) {
			var p3 = new HEXAGONS.POINT(p2.x, p2.y + deep), p4 = new HEXAGONS.POINT(p1.x, p1.y
					+ deep);
			return {
				points : HEXAGONS.UTIL.getPointString({p1 : p1,p2 : p2,p3 : p3,p4 : p4}),
				clazz: clazz
			};
		},
		hexagonData = [topFace,
			_calculateRectPoints(topFace.p3,topFace.p2,this.attrs.deep,this.data.faces.leftClass),
			_calculateRectPoints(topFace.p2,topFace.p1,this.attrs.deep,this.data.faces.bottomClass),
			_calculateRectPoints(topFace.p1,topFace.p6,this.attrs.deep, this.data.faces.rightClass)];
		
		d3.select(this.group).selectAll("polygon").data(hexagonData)
		.enter()
		.append("polygon")
		.attr("class",function(d){ return d.clazz})
		.attr("points",function(d){ return d.points})
		;		
	};		
	
	HEXAGONS.HEXAGON.prototype.getRelativeCenter = function(type) {
		switch (type) {
//			case 0: {//top
//				return {
//					x : this.data.center.x,
//					y : this.data.center.y - this.attrs.height
//				};
//			}
//			case 1: {//top_right
//				return {
//					x : this.data.center.x + (0.75 * this.attrs.width),
//					y : this.data.center.y - (this.attrs.height / 2)
//				};
//			}
			case 1: {//bot_right
				return {
					x : this.data.center.x + (0.75 * this.attrs.width),
					y : this.data.center.y + (this.attrs.height / 2)
				};
			}
			case 2: {//bottom
				return {
					x : this.data.center.x,
					y : this.data.center.y + this.attrs.height
				};
			}
			case 0: {//bot_left
				return {
					x : this.data.center.x - (0.75 * this.attrs.width),
					y : this.data.center.y + (this.attrs.height / 2)
				};
			}
//			case 0: {//top_left
//				return {
//					x : this.data.center.x - (0.75 * this.attrs.width),
//					y : this.data.center.y - (this.attrs.height / 2)
//				};
//			}
		}
		;
	};
	
	/***************************************************************************
	 * TOWER
	 * Extended: _BASE
	 * Extras:
	 * 
	 **************************************************************************/
	
	//@Override
	HEXAGONS.TOWER.prototype._initExtraProperties = function(options) {
		this.data = HEXAGONS.UTIL.inheritProperties(options, {
			parent : "svg",	
			groupClass : "tower",			
			center : {x: 50, y:50},
			r: 50,
			draggable: false,
			datasource: [1,1,1]
		});		
	}
	
	//@Override
	HEXAGONS.TOWER.prototype.draw = function() {		
		if (this.data.datasource.length >0){
			var currRadius = this.data.r;
			var currX = this.data.center.x, currY = this.data.center.y;
			for (var i = 0; i < this.data.datasource.length; ++i) {
				if (this.data.datasource[i] > 0) {
					for (var j = 0; j < this.data.datasource[i]; ++j) {
						var currFloorData = {
							center : {x: currX, y: currY},
							r : currRadius,
							parent : this.group,
							groupClass : "towerFloor level"+i+" subLevel"+j,
						};
						var currFloor = new HEXAGONS.HEXAGON(currFloorData);
						currFloor.draw();
						currY = currY - 2 * currFloor.attrs.deep;
					}
					currY =  currY + currFloor.attrs.deep;
				}
				currRadius = currRadius/2;
			}
		}
	}
	
	/***************************************************************************
	 * COUNTRY
	 * Extended: _BASE
	 * Extras:
	 * 
	 **************************************************************************/
	//@Override
	HEXAGONS.HEXAGON_TOWER.prototype._initExtraProperties = function(options) {
		this.data = HEXAGONS.UTIL.inheritProperties(options, {
			parent : "svg",	
			groupClass : "hexagon-tower",			
			center : {x: 50, y:50},
			r: 50,
			draggable: false,
			datasource: [[1],[1],[1]]
		});		
	};
	
	//@Override
	HEXAGONS.HEXAGON_TOWER.prototype.draw = function() {
		var _this = this;
		
		//draw base
		this.base =  new HEXAGONS.HEXAGON({
			parent: _this.group,
			center: _this.data.center,
			r: _this.data.r
		});
		
		if (this.data.datasource != undefined && this.data.datasource.length >0){
			//draw towers
			var baseBounding = d3.select(this.base.group).select(".top").node().getBBox(),
			allY = this.base.data.center.y - baseBounding.height / 4, positions = [],
			towerLine = {
				start: baseBounding.x + baseBounding.width * 0.25,
				end: baseBounding.x + baseBounding.width * 0.75
			}
			,currX = towerLine.start, 
			step = this.data.datasource.length >1 ? (towerLine.end - towerLine.start) / (this.data.datasource.length-1) : baseBounding.width,
			r = step/2;
			for (var i = 0; i < this.data.datasource.length; ++i) {
				positions[i] = {
					center : new HEXAGONS.POINT(currX, allY)
				};
				currX = currX + step;
				
				new HEXAGONS.TOWER({
					parent: _this.group,
					center: positions[i].center,
					groupClass: "hexagon on"+i,
					r: r,
					datasource: _this.data.datasource[i]
				});
			}
		}
	};
	
	/***************************************************************************
	 * COUNTRY
	 * Extended: _BASE
	 * Extras:
	 * 
	 **************************************************************************/
	//@Override
	HEXAGONS.HEXAGON_FLOWER.prototype._initExtraProperties = function(options) {
		this.data = HEXAGONS.UTIL.inheritProperties(options, {
			parent : "svg",	
			groupClass : "hexagon-flower",			
			center : {x: 50, y:50},
			r: 50,
			draggable: false,
			noOfSimpleLeave:-1,
			datasource: [
				[],
				[],
				[],
				[],
			]
		});		
	};
	
	//@Override
	HEXAGONS.HEXAGON_FLOWER.prototype.draw = function() {
		var hexagonQueue = [],_this=this,datasource = this.data.datasource;
		
		if (datasource != undefined && datasource.length>0){
			var currentHexagon = new HEXAGONS.HEXAGON_TOWER({
				r:_this.data.r,
				groupClass:"hexagon-tower leave0",
				center : _this.data.center,
				datasource: datasource[0]
			}),
			hexagonQueue = [],currentRelative = -1;
			
			currentHexagon.relative = [false,false,false];
			
			for (var i = 1; i<datasource.length && currentHexagon != undefined; ++i){
				while (currentRelative == -1 || currentHexagon.relative[currentRelative]){
					currentRelative = currentRelative +1;
					if (currentRelative >= 3){
						currentRelative = 0;
						currentHexagon = hexagonQueue.shift();
					}
				}
				
				var newHexagon = new HEXAGONS.HEXAGON_TOWER({
					r: _this.data.r,
					groupClass: "hexagon-tower leave"+i,
					center : currentHexagon.base.getRelativeCenter(currentRelative),
					datasource: datasource[i]
				});
				currentHexagon.relative[currentRelative] = true;
				newHexagon.relative = [false,false,false];
				
				hexagonQueue.push(newHexagon);
			}
		}
		
	};
})();
