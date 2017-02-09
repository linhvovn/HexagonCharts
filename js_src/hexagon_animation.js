/**
	 * ANIMATION/EVENT
	 */
	
	/**
	 * Move current hexagon to another position
	 */
	HEXAGONS._BASE.prototype.moveTo = function(x,y){			
		this.attrs.currentPosition = new HEXAGONS.POINT(x,y);
		d3.selectAll(d3.select(this.group).node().childNodes)
		  .transition()
		  .style("transform","translate("+x+"px,"+y+"px)");	  
	}