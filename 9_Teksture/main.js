var gl;
var t = 0;
var vPosition;
var texCoordLoc;

var cube;
var cameraY = 100;
var cameraDistance = 100;

var fovy = 60;
var texture;
var texture2;
var plane;
var uniforms;
var attributes;

function setMat4fv(gl){
	return function(loc, data){
		gl.uniformMatrix4fv(loc, false, data);
	}
}

function Uniform(name, setter, gl, program){
	var loction = gl.getUniformLocation(program, name); 
	return {loc: loction, set: function(data) {
		setter.call(gl, loction, data); 
	} };
}

function loadAttributes(attributes, gl, program){
	$.each(attributes, function(k, v) {
		console.log(v.name);
		v.loc = gl.getAttribLocation( program, v.name );
		console.log(v.loc);
		gl.enableVertexAttribArray( v.loc  );
	});
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

	attributes = {
		normal: {name: "aNormal_ms"},
		vertex: {name: "aVertexPosition_ms"},
		texcoord: {name: "aTexcoord"}
	};

	loadAttributes(attributes, gl, program);

	uniforms = {
		P : Uniform("P", setMat4fv(gl), gl, program),
		M : Uniform("M", setMat4fv(gl), gl, program),
		V : Uniform("V", setMat4fv(gl), gl, program),
		lightPosition_ws : Uniform("uLightPosition_ws", gl.uniform3fv, gl, program)};

	uniforms.lightPosition_ws.set(flatten([100,30,0]));
	
	cube = createCube(gl);
	plane = createPlane(gl);

	texture = loadTexture(gl,"crate.jpg");
	texture2 = loadTexture(gl,"road.jpg");

	setUpEventHandling(canvas);
	render();
};



function render() {
	gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
	t+=0.009;

	uniforms.P.set(flatten(perspective(fovy, 1, 10, 1000)));

	uniforms.V.set(flatten(lookAt([cameraDistance*Math.cos(t),(cameraDistance/100)*cameraY,cameraDistance*Math.sin(t)], [0,0,0], [0,1,0])));
	
	setAttributes(gl, cube, attributes); 

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indxBuffer);

	var x= -60; 
	var z= -60; 
	
	var modelMat;
	//aktivacija prve teksture za kutije
	gl.bindTexture(gl.TEXTURE_2D, texture);
	for(var i=0; i<5; i++){
		for(var j=0; j<5; j++){
			modelMat = mult(translate(x+i*30, 5, z+j*30), scalem(5,5,5));
			uniforms.M.set(flatten(modelMat));
			gl.drawElements(cube.primtype, cube.nIndices, gl.UNSIGNED_SHORT, 0);
		}
	}


	//aktivacija druge teksture za put
	// gl.bindTexture(gl.TEXTURE_2D, texture2);
	// gl.uniformMatrix4fv(modelTLoc, false, flatten(scalem(100,100,100)));
    //
	// setAttributes(gl, plane, vPosition, texCoordLoc);
	// gl.drawArrays(plane.primtype, 0, plane.nVerts);

	requestAnimFrame( render );
}
