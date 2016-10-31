/*
 * Javascript Uniform Grid 
 * @author Russell Michal
 */

;(function(window, Math) {
 	
	 /*
	  * Uniform Grid  Constructor
	  * @param x lower left corner of Uniform Grid default -10
	  * @param y lower left corner of Uniform Grid default -10
	  * @param width width of Uniform Grid default 20
	  * @param height height of Uniform Grid default 20  
      * @param cellWidth width of each cell in Uniform Grid default 1
      * @param cellHeight height of each cell in Uniform Grid default 1
	  */
	function uniformGrid( x, y, width, height, cellWidth, cellHeight ) {		
		this.x	    = x             || -10;
		this.y		= y             || -10;
		this.width  = width         ||  20;
		this.height = height        ||  20;
        this.cellWidth  = cellWidth ||   1;
		this.cellHeight = cellHeight||   1; 
        this.cell = [];
        this.id = 0;
        
        for(var i=0; i<this.height; i++)
        {
            this.cell[i]=[];
            for(var j=0; j<this.width; j++)
            {
                this.cell[i][j] = {
                    x: this.x+j,
                    y: this.y+i,
                    objectList:[{objectVertices:[],objectFaces:[], id:-1}]
                }
            }
        }
	};
	
	
	/*
	 * old way to add to grid, travers through the grid, don not use.
	 */
	uniformGrid.prototype.oldAdd = function(vertices,id) {
        var minX=100 , maxX=-100, minY=100 , maxY=-100;
        for(var i=0; i<vertices.length; i++)
        {  
            if(minX!= Math.min(minX,vertices[i].x))
                minX = vertices[i].x;
            if(maxX!= Math.max(maxX,vertices[i].x))
                maxX = vertices[i].x;
            if(minY!= Math.min(minY,vertices[i].y))
                minY = vertices[i].y;
            if(maxY!= Math.max(maxY,vertices[i].y))
                maxY = vertices[i].y;
        }
        minX = Math.floor(minX);
        maxX = Math.ceil(maxX);
        minY = Math.floor(minY);
        maxY = Math.ceil(maxY);
        
        for(var i=0; i<this.height; i++)
        {
            if( this.cell[i][0].y>=minY && this.cell[i][0].y<=maxY)
                for(var j=0; j<this.width; j++)
                {
                    if(this.cell[i][j].x>=minX && this.cell[i][j].x<=maxX)
                    {
                        //lastId = this.cell[i][j].objectVerticesList[this.cell[i][j].objectVerticesList.length-1].id;
                        this.cell[i][j].objectList.push({objectVertices: vertices,
                                                         id: this.id});
                    }
                    else if(this.cell[i][j].x>maxX)
                        break;
                }
            else if(this.cell[i][0].y>maxY)
                break;
        }
        this.id++;
    };
    
    //adds the object with vertices and faces to the grid
    uniformGrid.prototype.add = function(vertices, faces) {
        var minX=100 , maxX=-100, minY=100 , maxY=-100;
        for(var i=0; i<vertices.length; i++)
        {  
            if(minX!= Math.min(minX,vertices[i].x))
                minX = vertices[i].x;
            if(maxX!= Math.max(maxX,vertices[i].x))
                maxX = vertices[i].x;
            if(minY!= Math.min(minY,vertices[i].y))
                minY = vertices[i].y;
            if(maxY!= Math.max(maxY,vertices[i].y))
                maxY = vertices[i].y;
        }
        minX = Math.floor(minX);
        maxX = Math.ceil(maxX);
        minY = Math.floor(minY);
        maxY = Math.ceil(maxY);
        
        for(var i=minY-this.y; i<=maxY-this.y; i++)
        {
                for(var j=minX-this.x; j<=maxX-this.x; j++)
                {
                        //lastId = this.cell[i][j].objectList[this.cell[i][j].objectList.length-1].id;
                        this.cell[i][j].objectList.push({objectVertices: vertices,
                                                         objectFaces: faces,
                                                         id: this.id});
                }

        }
        this.id++;
    };
    
    //old way of retrieving objects, travers through the grid, don not use.
	uniformGrid.prototype.oldRetrieve = function(vertices) {
        var points = this.supercover_line(vertices[0],vertices[1]);
        var returnObjects = [];
        var returnIds = [];
        
        for(var p=0; p<points.length; p++)
        {
            for(var i=0; i<this.height; i++)
            {
                if( points[p].y>=this.cell[i][0].y && points[p].y<=this.cell[i][0].y+ this.cellHeight)
                    for(var j=0; j<this.width; j++)
                    {
                        if(points[p].x>=this.cell[i][j].x && points[p].x<=this.cell[i][j].x+ this.cellWidth)
                        {
                            //lastId = this.cell[i][j].objectList[this.cell[i][j].objectList.length-1].id;

                            for(var k = 1; k<this.cell[i][j].objectList.length;k++ ) 
                            {
                                if(!returnIds.includes(this.cell[i][j].objectList[k].id) && this.cell[i][j].objectList.length>1)
                                {
                                returnObjects.push(this.cell[i][j].objectList[k].objectVertices);
                                returnIds.push(this.cell[i][j].objectList[k].id);
                                }
                            }
                            break;
                        }
                    }
            }   

        }
        return returnObjects;
    };
    //retrieves the vertices of objects on the line specified by vertices
	uniformGrid.prototype.retrieveV = function(vertices) {
        var points = this.supercover_line(vertices[0],vertices[1]);
        var returnObjects = [];
        var returnIds = [];
        
        for(var p=0; p<points.length; p++)
        {
            var floorX = Math.floor(points[p].x-this.x);
            var floorY = Math.floor(points[p].y-this.y);
            if(floorX>=0 && floorY>=0 && floorX<this.width && floorY<this.height)
                for(var k = 1; k<this.cell[floorY][floorX].objectList.length;k++ ) 
                {
                    if(!returnIds.includes( this.cell[floorY][floorX].objectList[k].id ) && this.cell[floorX][floorX].objectList.length>1)
                    {
                        returnObjects.push(this.cell[floorY][floorX].objectList[k].objectVertices);
                        returnIds.push(this.cell[floorY][floorX].objectList[k].id);
                    }
                }
        }
        return returnObjects;
    };
    //retrieves the faces of objects on the line specified by vertices
	uniformGrid.prototype.retrieveF = function(vertices) {
        var points = this.supercover_line(vertices[0],vertices[1]);
        var returnObjects = [];
        var returnIds = [];
        
        for(var p=0; p<points.length; p++)
        {
            var floorX = Math.floor(points[p].x-this.x);
            var floorY = Math.floor(points[p].y-this.y);

            if(floorX>=0 && floorY>=0 && floorX<this.width && floorY<this.height)
                for(var k = 1; k<this.cell[floorY][floorX].objectList.length;k++ ) 
                {
                    if(!returnIds.includes( this.cell[floorY][floorX].objectList[k].id ) && this.cell[floorX][floorX].objectList.length>1)
                    {
                        returnObjects.push(this.cell[floorY][floorX].objectList[k].objectFaces);
                        returnIds.push(this.cell[floorY][floorX].objectList[k].id);
                    }
                }
        }
        return returnObjects;
    };
    
    //used to retrieve objects on the line with points p0 and p1
     uniformGrid.prototype.supercover_line =function(p0, p1) {
        var dx = p1.x-p0.x, dy = p1.y-p0.y;
        var nx = Math.abs(dx), ny = Math.abs(dy);
        var sign_x = dx > 0? this.cellWidth : -1*this.cellWidth,
            sign_y = dy > 0? this.cellHeight: -1*this.cellHeight;

        var p = new THREE.Vector2(p0.x, p0.y);
        var points = [new THREE.Vector2(p.x, p.y)];
        for (var ix = 0, iy = 0; ix < nx || iy < ny;) {
            if ((ix+0.5) / nx == (iy+0.5) / ny) {
                // next step is diagonal
                p.x += sign_x;
                p.y += sign_y;
                ix++;
                iy++;
            } else if ((ix+0.5) / nx < (iy+0.5) / ny) {
                // next step is horizontal
                p.x += sign_x;
                ix++;
            } else {
                // next step is vertical
                p.y += sign_y;
                iy++;
            }
            points.push(new THREE.Vector2(p.x, p.y));
        }
        return points;
    };
    
    //clears the grid
    uniformGrid.prototype.clear =function() {
        for(var i=0; i<this.height; i++)
        {
            for(var j=0; j<this.width; j++)
            {
                this.cell[i][j] = {
                    x: this.x+j,
                    y: this.y+i,
                    objectList:[{objectVertices:[], objectFaces:[], id:-1}]
                };
            }
        }
    }
	//make Quadtree available in the global namespace
	window.uniformGrid = uniformGrid;	

})(window, Math);