/*
 * Javascript Quadtree 
 * @version 1.1.1
 * @licence MIT
 * @author Timo Hausmann
 * https://github.com/timohausmann/quadtree-js/
 */
 
/*
 Copyright © 2012 Timo Hausmann
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENthis. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

;(function(window, Math) {
 	
	 /*
	  * Quadtree Constructor
	  * @param Object bounds		bounds of the node, object with x, y, width, height
	  * @param Integer max_objects		(optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
	  * @param Integer max_levels		(optional) total max levels inside root Quadtree (default: 4) 
	  * @param Integer level		(optional) deepth level, required for subnodes  
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
	 * Split the node into 4 subnodes
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
    uniformGrid.prototype.add = function(vertices, faces, id) {
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