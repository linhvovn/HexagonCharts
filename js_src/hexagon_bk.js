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
		
		this.data = HEXAGONS.UTIL.inheritProperties(options, {
			parent : "svg",
			center : new HEXAGONS.POINT(50, 50),
			r: 50,
			draggable: false
		});

		this.shapes = {};
		this.attrs = {};
		
		//Allow child class setup extra default properties
		this._initExtraProperties();		
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
	};

	/**
	 * Draw object on page
	 */
	HEXAGONS._BASE.prototype.draw = function() {
			//put content into group element
			this._prepareDrawing();
			
			this._beforeDraw();
			
			// Append this.group inside this.parent
			d3.select(this.parent).node().appendChild(this.group);
			
			this._afterDraw();
	};

	/**
	 * Init the content of group object before attach group to page
	 */
	HEXAGONS._BASE.prototype._prepareDrawing = function() {
		console.log("Execute _prepareDrawing : Init the content of group object before attach group to page");
		console.log(this);
	};
	
	/**
	 * Allow child class setup extra default properties
	 */
	HEXAGONS._BASE.prototype._initExtraProperties = function() {
		console.log("Execute _initExtraProperties: Allow child class setup extra default properties");
		console.log(this);
	};
	
	HEXAGONS._BASE.prototype._beforeDraw = function() {
		console.log("Execute _beforeDraw");
	};
	
	HEXAGONS._BASE.prototype._afterDraw = function() {
		console.log("Execute _afterDraw");
	};

	/***************************************************************************
	 * HEXAGONS
	 * Extended: _BASE
	 * Extras:
	 * 
	 * attrs:{
	 * 	shapeData:{
	 * 		top: {p1,p2,p3,p4,p5,p6},
	 * 		leftRect: {p1,p2,p3,p4},
	 * 		botRect: {p1,p2,p3,p4},
	 * 		rightRect: {p1,p2,p3,p4}
	 * 	},
	 *  width,
	 *  height,
	 *  deep
	 * }
	 **************************************************************************/

	//@Overried	 
	HEXAGONS.HEXAGON.prototype._initExtraProperties = function() {
		this.data = HEXAGONS.UTIL.inheritProperties(this.data, {
			groupClass : "hexagon",
			faces:{
				topClass: "top",
				leftClass: "left",
				bottomClass: "bottom",
				rightClass: "right"
			}
		});
		
		if (this.data.draggable){
			this.data.groupClass = this.data.groupClass + " "+"draggable";
		}
		
		//used to mark relatives existing
		this.attrs={
				around : [ false, false, false, false, false, false ],
				fullRelative : false
		};
	}
	
	//@Overried
	HEXAGONS.HEXAGON.prototype._prepareDrawing = function() {
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
		
		d3.select(this.group).selectAll("polygon").data(hexagonData).enter()
		.append("polygon")
		.attr("class",function(d){ return d.clazz})
		.attr("points",function(d){ return d.points})
		;		
	};		
	
	/**
	 * UTIL: Method used by others charts
	 */
	HEXAGONS.HEXAGON.prototype.isLeft = function(hexagon) {
		return this.data.center.isLeft(hexagon.data.center);
	};

	HEXAGONS.HEXAGON.prototype.isBottom = function(hexagon) {
		return !this.data.center.isTop(hexagon.data.center);
	};
	
	// Mark the existing of one relative
	HEXAGONS.HEXAGON.prototype._setRelative = function(position,value) {
		var isFullRelative = function(around){
			var fullRelative = false;
			for (var i = 0; i < around.length; ++i) {
				if (around[i] == false) {
					return;
				}
			}		
			fullRelative = true;			
		}
		
		this.attrs.around[position] = value != undefined ? value : true;		
		this.attrs.fullRelative = isFullRelative(this.attrs.around);		
	};

	//Calculate next relative position
	HEXAGONS.HEXAGON.prototype._getNextRelative = function() {
		var _getRelativeCenter = function(type) {
				switch (type) {
					case HEXAGONS.CONST.HEXAGON.RELATEIVE_TYPE.TOP: {
						return {
							x : this.data.center.x,
							y : this.data.center.y - this.attrs.height
						};
					}
						;
					case HEXAGONS.CONST.HEXAGON.RELATEIVE_TYPE.TOP_RIGHT: {
						return {
							x : this.data.center.x + (0.75 * this.attrs.width),
							y : this.data.center.y - (this.attrs.height / 2)
						};
					}
						;
					case HEXAGONS.CONST.HEXAGON.RELATEIVE_TYPE.BOT_RIGHT: {
						return {
							x : this.data.center.x + (0.75 * this.attrs.width),
							y : this.data.center.y + (this.attrs.height / 2)
						};
					}
						;
					case HEXAGONS.CONST.HEXAGON.RELATEIVE_TYPE.BOT: {
						return {
							x : this.data.center.x,
							y : this.data.center.y + this.attrs.height
						};
					}
						;
					case HEXAGONS.CONST.HEXAGON.RELATEIVE_TYPE.BOT_LEFT: {
						return {
							x : this.data.center.x - (0.75 * this.attrs.width),
							y : this.data.center.y + (this.attrs.height / 2)
						};
					}
						;
					case HEXAGONS.CONST.HEXAGON.RELATEIVE_TYPE.TOP_LEFT: {
						return {
							x : this.data.center.x - (0.75 * this.attrs.width),
							y : this.data.center.y - (this.attrs.height / 2)
						};
					};
				};
		
			};
			
		if (!this.attrs.fullRelative) {
			var i = 0;
			for (i = 0; i < HEXAGONS.CONST.HEXAGON.MAX_RELATIVE; ++i) {
				if (!this.attrs.around[i]) {
					break;
				}
			}
			if (i < HEXAGONS.CONST.MAX_RELATIVE) {
				return {
					position : i,
					center : _getRelativeCenter(i)
				};
			} else {
				this.attrs.fullRelative = true;
			}
		}
		return null;
	};
	
	/**
	 * ANIMATION/EVENT
	 */
	
	/**
	 * Move current hexagon to another position
	 */
	HEXAGONS.HEXAGON.prototype.moveTo = function(x,y){			
		this.attrs.currentPosition = new HEXAGONS.POINT(x,y);	
		d3.select(this.group)
		  .transition()
		  .style("transform","translate("+x+"px,"+y+"px)");	  
	}
	

})();
