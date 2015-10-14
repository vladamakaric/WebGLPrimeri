var gl;

var t = 0;

var tPosBuff, sPosBuff;
var tColBuff;
var sColBuff;
var vPosition;
var vertColor;
var projectionTLoc, modelTLoc;


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	var triangleVertices = new Float32Array([-1, -1,
									  0, 1, 
									  1, -1]);

    var squareVertices = new Float32Array([-1, -1, 
									-1, 1, 
									1, 1,
									1, -1]);

    var triangleColor = new Float32Array([
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ]);

    var squareColor = new Float32Array([
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 0.0, 1.0
    ]);

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	projectionTLoc = gl.getUniformLocation(program, "u_proj");
	modelTLoc = gl.getUniformLocation(program, "u_model");

	gl.uniformMatrix4fv(projectionTLoc, false, flatten(ortho(0, 100, 0, 100, -10,10)));

    vPosition = gl.getAttribLocation( program, "vPosition" );
    vertColor = gl.getAttribLocation( program, "vertColor" );

    gl.enableVertexAttribArray( vPosition );
    gl.enableVertexAttribArray( vertColor );

	///////////////////////////////////////
    tPosBuff = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tPosBuff  );
    gl.bufferData( gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW );
	/////////////////////////////////////////////
    sPosBuff = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, sPosBuff );
    gl.bufferData( gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW );
	//////////////////////////////////////
    sColBuff = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, sColBuff);
    gl.bufferData( gl.ARRAY_BUFFER, squareColor, gl.STATIC_DRAW );
	//////////////////////////////////////
    tColBuff = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tColBuff);
    gl.bufferData( gl.ARRAY_BUFFER, triangleColor, gl.STATIC_DRAW );
	//////////////////////////////////////


    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

	t+=0.1;
	var primitiveArray = [0,1,1,0,1];
	var positionArray = [[20,20], [40,40], [60,60], [10,100],[50,50]];
	var primitiveLength = [3, 4];
	var primitiveType = [gl.TRIANGLES, gl.TRIANGLE_FAN];
	var primitiveColorBuffer = [tColBuff, sColBuff];
	var primitivePosBuffer = [tPosBuff, sPosBuff];
	var anim = true;

	primitiveArray.forEach(function(prim, indx){
		gl.bindBuffer( gl.ARRAY_BUFFER, primitiveColorBuffer[prim]);
		gl.vertexAttribPointer( vertColor, 4, gl.FLOAT, false, 0, 0 );
		gl.bindBuffer( gl.ARRAY_BUFFER, primitivePosBuffer[prim]);
		gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );

		var modelMat;
		
		if(prim==0)
			modelMat = scalem(10, 10+5*Math.sin(t/2), 1);
		else
			modelMat = scalem(10+10*Math.sin(t), 10+10*Math.cos(t), 1);


		modelMat = mult(translate(positionArray[indx][0], positionArray[indx][1], 0), modelMat);

		gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));
		gl.drawArrays( primitiveType[prim],0, primitiveLength[prim] );
	});

	requestAnimFrame( render );
}
