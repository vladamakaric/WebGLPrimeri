var gl;
var t = 0;
var tPosBuff, sPosBuff;
var tColBuff;
var sColBuff;
var vPosition;
var vertColor;
var projectionTLoc, modelTLoc, cameraTLoc;

var cube;
var coordSys;
var grid;
var cameraY = 100;
var sqMatrixSize = 2;

function setUpEventHandling(canvas){

	$( "#kocke" ).change(function() {
		sqMatrixSize = $(this).val();
	}).val(sqMatrixSize);

	document.onkeydown = checkKey;

	function checkKey(e) {
		e = e || window.event;

		if (e.keyCode == '38') {
			//up
		   cameraY +=5; 
		}
		else if (e.keyCode == '40') {
			//down
		   cameraY -=5; 
		}
		else if (e.keyCode == '37') {
		   // left arrow
		}
		else if (e.keyCode == '39') {
		   // right arrow
		}

	}
}

window.onload = function init()
{
	var canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.viewport( 0, 0, canvas.width, canvas.height );

	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	projectionTLoc = gl.getUniformLocation(program, "u_proj");
	modelTLoc = gl.getUniformLocation(program, "u_model");
	cameraTLoc = gl.getUniformLocation(program, "u_camera");

	gl.uniformMatrix4fv(projectionTLoc, false, flatten(ortho(-100, 100, -100, 100, -2000,2000)));

	vPosition = gl.getAttribLocation( program, "vPosition" );
	vertColor = gl.getAttribLocation( program, "vertColor" );

	gl.enableVertexAttribArray( vPosition );
	gl.enableVertexAttribArray( vertColor );

	cube = createCube(gl);
	coordSys = createCoordSys(gl);
	grid = createGrid(40,40);

	setUpEventHandling(canvas);
	render();

};

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
	t+=0.009;

	var modelMat;
	gl.uniformMatrix4fv(cameraTLoc, false, flatten(lookAt([100*Math.cos(t),cameraY,100*Math.sin(t)], [0,0,0], [0,1,0])));

	modelMat = scalem(10, 10, 10);
	gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));

	//////////coordsys
	setAttributes(gl, coordSys, vPosition, vertColor);

	gl.lineWidth(2);
	gl.drawArrays(coordSys.primtype, 0, coordSys.nVerts);
	////cube
	
	setAttributes(gl, cube, vPosition, vertColor);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indxBuffer);

	var x= -100; 
	var z= -100; 
	
	for(var i=0; i<sqMatrixSize; i++){
		for(var j=0; j<sqMatrixSize; j++){
			modelMat = mult(translate(x+i*30, 5, z+j*30), scalem(5,5,5));
			gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));
			gl.drawElements(cube.primtype, cube.nIndices, gl.UNSIGNED_SHORT, 0);
		}
	}
	
	/////grid
	
	modelMat = scalem(20, 20, 20);
	gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));

	setAttributes(gl, grid, vPosition, vertColor);
	gl.lineWidth(1);
	gl.drawArrays(grid.primtype, 0, grid.nVerts);

	requestAnimFrame( render );
}
