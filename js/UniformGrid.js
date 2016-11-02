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
      * @param cell 2d array of cells
      * @param id the id of the next object to be added to the grid
      * @param returnIds all ids already returned, gets reset after a retrieve
	  */
	function UniformGrid( x, y, width, height, cellWidth, cellHeight ) {		
		this.x	    = x             || -10;
		this.y		= y             || -10;
		this.width  = width         ||  20;
		this.height = height        ||  20;
        this.cellWidth  = cellWidth ||   1;
		this.cellHeight = cellHeight||   1; 
        this.cell = [];
        this.id = 0;
        this.returnIds=[];
        
        for(var i=0; i<this.height; i++)
        {
            this.cell[i]=[];
            for(var j=0; j<this.width; j++)
            {
                this.cell[i][j] = {
                    x: this.x+j,
                    y: this.y+i,
                    objectList:[]
                }
            }
        }
	};
	
	
	/*
	 * old way to add to grid, travers through the grid, don not use.
	 */
	UniformGrid.prototype.oldAdd = function(vertices,id) {
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
    UniformGrid.prototype.add = function(vertices, faces) {
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
                        this.cell[i][j].objectList.push({objectFaces: faces,
                                                         id: this.id});
                }

        }
        this.id++;
    };
    
    //old way of retrieving objects, travers through the grid, don not use.
	UniformGrid.prototype.oldRetrieve = function(vertices) {
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
    
    //retrieves the faces of objects on the line specified by vertices
	UniformGrid.prototype.retrieveF = function(vertices) {
        var points = this.supercover_line(vertices[0],vertices[1]);
        var returnObjects = [];
        var returnIds = [];
        
        for(var p=0; p<points.length; p++)
        {
            var floorX = Math.floor(points[p].x-this.x);
            var floorY = Math.floor(points[p].y-this.y);

            returnObjects.concat(getObject(floorX,floorY));
        }
        this.returnIds = [];
        return returnObjects;
    };
      //get objects to rotate
    UniformGrid.prototype.getObjToRotate =function(mouse, line) {
        var m = (line[0].y-line[1].y)/(line[0].x-line[1].x);
        var b = line[0].y-m*line[0].x;
        var comparePoint = m*mouse.x+b;
        
        var above;
        
        //mouse above line
        if(comparePoint<mouse.y)
            above = true;
        //mouse below line
        else if(comparePoint>mouse.y)
            above = false;
        //mouse on line
        else
            return;
        
        //get all objects on mouse side of line
        var points = this.supercover_line(vertices[0],vertices[1]);
        var returnObjects = [];
        
        if(above)
        {
            //get all cells on mouse side of line
            for(var p=0; p<points.length; p++)
            {
                points[p].y += this.cellHeight; 
                var floorX = Math.floor(points[p].x-this.x);
                var floorY = Math.floor(points[p].y-this.y);
                
                for(var h = floorY; h<this.height+this.y;h+=this.cellHeight)
                    returnObjects.concat(getObject(floorX,h));
            }
            
            //get all cells on mouse line and determine if they are on mouse side of the line
            var possibleObjects = retrieveF(line);
            for(var o=0; o<possibleObjects.length; o++)
                for(var v=0; v<possibleObjects[o].length; v++)
                {
                    var x = geometry[possibleObjects[o][v]].x;
                    var y = geometry[possibleObjects[o][v]].y;
                    comparePoint = m*x+b;
                    
                    //object above line
                    if(comparePoint<y)//work out ids
                    {
                        returnObjects.push(possibleObjects[o]);
                        break;
                    }
                    //object below line
                    //else if(comparePoint>y)
                        
                    //object on line
                    //else       
                }
                    

      
        }
            
 
        //get all cells on the line and compare there objects to see if they are on the mouse side of the line
    }  
        
    UniformGrid.prototype.getObjects =function(x, y) {
        var retObj = [];
        if(x>=0 && y>=0 && x<this.width && y<this.height)
            for(var k = 0; k<this.cell[y][x].objectList.length;k++ ) 
            {
                if(!this.returnIds.includes( this.cell[y][x].objectList[k].id ))
                {
                    retObj.push(this.cell[y][x].objectList[k].objectFaces);
                    this.returnIds.push(this.cell[y][x].objectList[k].id);
                }
            }
        return retObj;
    };
    //used to retrieve objects on the line with points p0 and p1
     UniformGrid.prototype.supercover_line =function(p0, p1) {
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
    UniformGrid.prototype.clear =function() {
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
	window.UniformGrid = UniformGrid;	

})(window, Math);