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
        
        for(var i=0; i<this.height; i+=this.cellHeight)
        {
            this.cell[i]=[];
            for(var j=0; j<this.width; j+=this.cellWidth)
            {
                this.cell[i][j] = {
                    x: this.x+j,
                    y: this.y+i,
                    objectList:[]
                }
            }
        }
	};
    UniformGrid.prototype.getGridLines = function() {
        var retLines=[];
        for(var i=this.x; i<=this.x+this.width; i+=this.cellWidth)
        {
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(i,this.y,0.1));
            geometry.vertices.push(new THREE.Vector3(i,this.y+this.height,0.1));
            var material = new THREE.LineBasicMaterial({color: 0xc05c5c});
            var line = new THREE.Line(geometry, material);
            line.name = "gridLine";
            line.visable = false;

            retLines.push(line);
        }
        
        for(var i=this.y; i<=this.y+this.height; i+=this.cellHeight)
        {
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(this.x,i,0.1));
            geometry.vertices.push(new THREE.Vector3(this.x+this.width,i,0.1));
            var material = new THREE.LineBasicMaterial({color: 0xc05c5c});
            var line = new THREE.Line(geometry, material);
            line.name = "gridLine";
            line.visable = false;

            retLines.push(line);
        }
        return retLines;
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
        maxX = Math.floor(maxX);
        minY = Math.floor(minY);
        maxY = Math.floor(maxY);
        
        for(var i=minY-this.y; i<=maxY-this.y; i+=this.cellHeight)
        {
                for(var j=minX-this.x; j<=maxX-this.x; j+=this.cellWidth)
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
	UniformGrid.prototype.retrieveF = function(vertices,clearIds=true) {
        var points = this.supercover_line(vertices[0],vertices[1]);
        var returnObjects = [];
        var returnIds = [];
        
        for(var p=0; p<points.length; p++)
        {
            var floorX = Math.floor(points[p].x-this.x);
            var floorY = Math.floor(points[p].y-this.y);

            returnObjects = returnObjects.concat(this.getObjects(floorX,floorY));
        }
        if(clearIds)
            this.returnIds = [];
        return returnObjects;
    };
      //get objects to rotate
    UniformGrid.prototype.getObjToRotate =function(mouse, line, vertices) {
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
        var points = this.supercover_line(line[0],line[1]);
        var returnObjects = [];
        //if(Math.abs(points[points.length-1].x-points[0].x)>3)
        //{
            while(points[points.length-1].x+1<this.width+this.x)
                points.push(new THREE.Vector2(points[points.length-1].x+1, points[points.length-1].y));
            while(points[0].x-1>this.x)
                points.unshift(new THREE.Vector2(points[0].x-1, points[0].y));
        //}
                                           
        if(above)
        {
            //get all cells on mouse side of line
            for(var p=0; p<points.length; p++)
            {                
                //only include cell if it is truely on mouse side of the line.
               // if(p+1==points.length || (points[p].x!=points[p+1].x && points[p].y!=points[p+1].y))
                //{
                    var floorX = Math.floor(points[p].x-this.x);
                    var floorY = Math.floor(points[p].y-this.y);

                    for(var h = floorY; h<this.height;h+=this.cellHeight)
                    {
                        for(var o=0; o<this.cell[h][floorX].objectList.length; o++)
                        {
                            var possibleObjects = this.cell[h][floorX].objectList[o].objectFaces;
                            var ObjectID =this.cell[h][floorX].objectList[o].id; 
                            var x1 = vertices[possibleObjects.a].x;
                            var y1 = vertices[possibleObjects.a].y;

                            var x2 = vertices[possibleObjects.b].x;
                            var y2 = vertices[possibleObjects.b].y;

                            var x3,y3;
                            if(possibleObjects.c !='undefined')
                            {
                                x3 = vertices[possibleObjects.c].x;
                                y3 = vertices[possibleObjects.c].y;
                            }

                            //object above line
                            var diff;
                            comparePoint = m*x1+b;
                            diff = Math.abs(comparePoint - y1);
                            if(comparePoint<y1 && !this.returnIds.includes(ObjectID) && diff>0.0000001)
                            {
                                //possibleObjects has already bean ID checked
                                returnObjects.push(possibleObjects);
                                this.returnIds.push(ObjectID);
                                continue;
                            }

                            comparePoint = m*x2+b;
                            diff = Math.abs(comparePoint - y2);
                            if(comparePoint<y2 && !this.returnIds.includes(ObjectID) && diff>0.0000001)
                            {
                                //possibleObjects has already bean ID checked
                                returnObjects.push(possibleObjects);
                                this.returnIds.push(ObjectID);
                                continue;
                            }

                            if(possibleObjects.c !='undefined')
                            {
                                comparePoint = m*x3+b;
                                diff = Math.abs(comparePoint - y3);
                                if(comparePoint<y3 && !this.returnIds.includes(ObjectID) && diff>0.0000001)
                                {
                                    //possibleObjects has already bean ID checked
                                    returnObjects.push(possibleObjects);
                                    this.returnIds.push(ObjectID);
                                    continue;
                                }
                            }
                            //object below line
                            //else if(comparePoint>y)

                            //object on line
                            //else       
                        } 
                    }
                //}
            }
        }
        
        var oppositobjects=[];
        for(var y=0; y<this.height; y++)
        {
            for(var x=0; x<this.width; x++)
            {
                for(var k = 0; k<this.cell[y][x].objectList.length;k++ ) 
                {
                    if(!this.returnIds.includes( this.cell[y][x].objectList[k].id ))
                    {
                        oppositobjects.push(this.cell[y][x].objectList[k].objectFaces);
                        this.returnIds.push(this.cell[y][x].objectList[k].id);
                    }
                }
            }
        }
        this.returnIds=[];
        return [returnObjects,oppositobjects];
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
        for (var ix = 0, iy = 0; ix < nx && iy < ny;) {
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
                this.cell[i][j].objectList=[]; 
            }
        }
        this.id = 0;
    };
	//make Quadtree available in the global namespace
	window.UniformGrid = UniformGrid;	

})(window, Math);