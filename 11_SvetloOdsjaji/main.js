var gl;
var t = 0;

var cube;
var cameraY = 100;
var cameraDistance = 100;

var fovy = 60;
var texture;
var texture2;

var sharedUniforms;


var phongProgram;
var primitiveProgram;

var lightModel;
var cone;

var lightPosition = [0, 60, 0];
var surface;
var surface2;

window.onload = function init()
{
	var canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.viewport( 0, 0, canvas.width, canvas.height );

	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.enable(gl.DEPTH_TEST);

	phongProgram = ShaderProgram(gl, "phong-vshader", "phong-fshader", {
		normal: {name: "aNormal_ms"},
		vertex: {name: "aVertexPosition_ms"},
		texcoord: {name: "aTexcoord"}
	}, 
	{
		lightPosition_ws : {name: "uLightPosition_ws", setter: gl.uniform3fv},
		N: {name: "N", setter: setMat3fv(gl)}
	}
	);

	sharedUniforms = {
		P: {name: "P", setter: setMat4fv(gl)},
		M: {name: "M", setter: setMat4fv(gl)},
		V: {name: "V", setter: setMat4fv(gl)}
	};

	primitiveProgram = ShaderProgram(gl, "primitive-vshader", "primitive-fshader", {
		vertex: {name: "aVertexPosition_ms"},
		color: {name: "aColor"}
	},
	{});

	useProgram(gl, phongProgram);

	bindUniformsToProgram(sharedUniforms, phongProgram.id, gl);

	
	cube = createCube(gl);
	lightModel = Tetrahedron(gl);
	cone = Cone(gl);


	function sphere(x,y){
		return 40 + Math.sqrt(100 - Math.pow(x,2) - Math.pow(y,2));

	}

	var scale = -0.01;

	function sq(x,y){
		return 40 + scale*Math.pow(x, 2) + scale*Math.pow(y, 2);
	}

	function sqPx(x,y){
		return scale*2*x;
	}

	function sqPy(x,y){
		return scale*2*y;
	}

	var gscale = 20;
	var gxscale = 0.1;
	var gyscale = 0.1;

	function gauss(x,y){
		return gscale*Math.exp(-Math.pow(x*gxscale,2) - Math.pow(y*gyscale,2));
	}

	function gaussPx(x,y){
		return -2*x*gxscale*gxscale*gauss(x,y);
	}

	function gaussPy(x,y){
		return -2*y*gyscale*gyscale*gauss(x,y);
	}

	// surface = Surface(sq, sqPx,sqPy, 60,60, 20,20);
	surface = Surface(gauss, gaussPx, gaussPy, 60,60, 100,100);


	var a = 0.01;
	var s = 4;
	function surf(x,y){
		return s*Math.sin(a*x*y);
	}

	function surfPx(x,y){
		return s*a*y*Math.cos(a*x*y);
	}

	function surfPy(x,y){
		return surfPx(y,x);
	}

	surface2 = Surface(surf, surfPx, surfPy, 70,70, 100,100);
	
	texture = loadTexture(gl,"metal2.jpg");
	texture2 = loadTexture(gl,"wood2.jpg");

	setUpEventHandling(canvas);
	render();
};



function setUniformData(uniforms, data){
	Object.keys(data).forEach(function(k){
		uniforms[k].set(data[k]);
	});
}


function render() {
	gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
	t+=0.009;

	var V =  lookAt([cameraDistance*Math.cos(t),(cameraDistance/100)*cameraY,cameraDistance*Math.sin(t)], [0,0,0], [0,1,0]);
	var M;

	var sharedUniformData = {P: flatten(perspective(fovy, 1, 10, 1000)),
							 V: flatten(V)};

	useProgram(gl, phongProgram, sharedUniforms, sharedUniformData);
	phongProgram.uniforms.lightPosition_ws.set(flatten(lightPosition));


	////////////////////////////////////////////////////
	gl.bindTexture(gl.TEXTURE_2D, texture2);
	setProgramAttributes(gl, cone, phongProgram); 

	M = mult(translate(60, 0, 0), scalem(20,50,20));
	sharedUniforms.M.set(flatten(M));
	phongProgram.uniforms.N.set(flatten(getNormalTransformMat3(V,M)));
	drawObject(gl, cone);

	M = mult(translate(-60, 0, 0), scalem(20,50,20));
	sharedUniforms.M.set(flatten(M));
	phongProgram.uniforms.N.set(flatten(getNormalTransformMat3(V,M)));
	drawObject(gl, cone);

	///////////////////////////////////////////
	gl.bindTexture(gl.TEXTURE_2D, texture);
	setProgramAttributes(gl, surface, phongProgram); 
	M = mult(translate(0, 0, 20), scalem(1,1,1));
	sharedUniforms.M.set(flatten(M));
	phongProgram.uniforms.N.set(flatten(getNormalTransformMat3(V,M)));
	drawObject(gl, surface);
	////////////////////

	setProgramAttributes(gl, surface2, phongProgram); 
	M = mult(translate(0, 0, -50), scalem(1,1,1));
	sharedUniforms.M.set(flatten(M));
	phongProgram.uniforms.N.set(flatten(getNormalTransformMat3(V,M)));
	drawObject(gl, surface);
	///////////////////
	useProgram(gl, primitiveProgram, sharedUniforms, sharedUniformData);

	M = mult(translate(lightPosition[0], lightPosition[1], lightPosition[2]), scalem(5,5,5));

	sharedUniforms.M.set(flatten(M));

	setProgramAttributes(gl, lightModel, primitiveProgram); 
	drawObject(gl, lightModel);


	requestAnimFrame( render );
}
