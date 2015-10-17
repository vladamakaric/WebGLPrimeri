var gl;
var t = 0;

var cube;
var cameraY = 100;
var cameraDistance = 100;

var fovy = 60;
var texture;

var sharedUniforms;


var phongProgram;
var basicProgram;


window.onload = function init()
{
	var canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.viewport( 0, 0, canvas.width, canvas.height );

	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.enable(gl.DEPTH_TEST);

	phongProgram = initProgram(gl, "phong-vshader", "phong-fshader", {
		normal: {name: "aNormal_ms"},
		vertex: {name: "aVertexPosition_ms"},
		texcoord: {name: "aTexcoord"}
	}, 
	{
		lightPosition_ws : {name: "uLightPosition_ws", setter: gl.uniform3fv}
	}
	);

	sharedUniforms = {
		P: {name: "P", setter: setMat4fv(gl)},
		M: {name: "M", setter: setMat4fv(gl)},
		V: {name: "V", setter: setMat4fv(gl)}
	};

	useProgram(phongProgram, gl);

	bindUniformsToProgram(sharedUniforms, phongProgram.id, gl);

	phongProgram.uniforms.lightPosition_ws.set(flatten([100,30,0]));
	
	cube = createCube(gl);

	texture = loadTexture(gl,"crate.jpg");

	setUpEventHandling(canvas);
	render();
};

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
	t+=0.009;

	sharedUniforms.P.set(flatten(perspective(fovy, 1, 10, 1000)));
	sharedUniforms.V.set(flatten(lookAt([cameraDistance*Math.cos(t),(cameraDistance/100)*cameraY,cameraDistance*Math.sin(t)], [0,0,0], [0,1,0])));
	
	setProgramAttributes(gl, cube, phongProgram); 

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indxBuffer);

	var x= -60; 
	var z= -60; 
	
	var modelMat;
	for(var i=0; i<5; i++){
		for(var j=0; j<5; j++){
			modelMat = mult(translate(x+i*30, 5, z+j*30), scalem(5,5,5));
			sharedUniforms.M.set(flatten(modelMat));
			gl.drawElements(cube.primtype, cube.nIndices, gl.UNSIGNED_SHORT, 0);
		}
	}

	requestAnimFrame( render );
}
