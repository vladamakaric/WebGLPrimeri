var gl;
var t = 0;
var vPosition;
var projectionTLoc, modelTLoc, cameraTLoc;
var texCoordLoc;

var cube;
var cameraY = 100;
var cameraDistance = 100;

var fovy = 60;
var texture;
var texture2;
var plane;

function setUpEventHandling(canvas){

	var angleInput = document.getElementById("angle");
	angleInput.value = fovy;

	angleInput.oninput = function(){
		fovy = angleInput.value;
	}

	canvas.onmousewheel = function (event){
		var wheel = event.wheelDelta/120;
		cameraDistance+=wheel;
		cameraDistance = Math.max(cameraDistance, 0);
	}

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

	texCoordLoc = gl.getAttribLocation( program, "a_texcoord" );
	vPosition = gl.getAttribLocation( program, "vPosition" );

	gl.enableVertexAttribArray( texCoordLoc  );
	gl.enableVertexAttribArray( vPosition );

	cube = createCube(gl);
	plane = createPlane(gl);

	//ucitavanje GL tekstura, asinhrono
	texture = loadTexture(gl,"crate.jpg");
	texture2 = loadTexture(gl,"road.jpg");

	setUpEventHandling(canvas);
	render();

};



function render() {
	gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
	t+=0.009;

	gl.uniformMatrix4fv(projectionTLoc, false, flatten(perspective(fovy, 1, 10, 1000)));

	gl.uniformMatrix4fv(cameraTLoc, false, flatten(lookAt([cameraDistance*Math.cos(t),(cameraDistance/100)*cameraY,cameraDistance*Math.sin(t)], [0,0,0], [0,1,0])));
	
	setAttributes(gl, cube, vPosition, texCoordLoc);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indxBuffer);

	var x= -60; 
	var z= -60; 
	
	var modelMat;
	//aktivacija prve teksture za kutije
	gl.bindTexture(gl.TEXTURE_2D, texture);
	for(var i=0; i<5; i++){
		for(var j=0; j<5; j++){
			modelMat = mult(translate(x+i*30, 5, z+j*30), scalem(5,5,5));
			gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));
			gl.drawElements(cube.primtype, cube.nIndices, gl.UNSIGNED_SHORT, 0);
		}
	}


	//aktivacija druge teksture za put
	gl.bindTexture(gl.TEXTURE_2D, texture2);
	gl.uniformMatrix4fv(modelTLoc, false, flatten(scalem(100,100,100)));

	setAttributes(gl, plane, vPosition, texCoordLoc);
	gl.drawArrays(plane.primtype, 0, plane.nVerts);

	requestAnimFrame( render );
}
