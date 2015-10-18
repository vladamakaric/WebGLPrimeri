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
		lightPosition_ws : {name: "uLightPosition_ws", setter: gl.uniform3fv}
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


	function sq(x,y){
		var scale = -0.05;
		return 40 + scale*Math.pow(x, 2) + scale*Math.pow(y, 2);
	}



	surface = Surface(sq, 0,0, 30,30, 20,20);

	
	texture = loadTexture(gl,"crate.jpg");
	texture2 = loadTexture(gl,"metal.jpg");

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

	var sharedUniformData = {P: flatten(flatten(perspective(fovy, 1, 10, 1000))),
							 V: flatten(lookAt([cameraDistance*Math.cos(t),(cameraDistance/100)*cameraY,cameraDistance*Math.sin(t)], [0,0,0], [0,1,0]))};

	useProgram(gl, phongProgram, sharedUniforms, sharedUniformData);
	phongProgram.uniforms.lightPosition_ws.set(flatten(lightPosition));

	//mora se zvati svaki frejm, jer koristimo dva shader programa, 
	//drugim recima vertexAttrib pokazivaci nisu deo stanja programa, nego su vezani za globalno
	//OpenGL stanje, to jest za trenutno aktivni program.
	//e.g. ako povezemo atribut programa sa nekim baferom na GPU, taj atribut predstavlja samo offset u trenutnom programu,
	//kao "slot", kada ucitamo drugi shader program, u njemu ce taj ofset biti neki drugi atribu i taj ofset ce onda pokazivati
	//na neki drugi bafer.
	/////////////////////////////////////////////////////////////////////
	setProgramAttributes(gl, cube, phongProgram); 
	var x= -60; 
	var z= -60; 
	
	gl.bindTexture(gl.TEXTURE_2D, texture);
	var modelMat;
	for(var i=0; i<5; i++){
		for(var j=0; j<5; j++){
			modelMat = mult(translate(x+i*30, 5, z+j*30), scalem(5,5,5));
			sharedUniforms.M.set(flatten(modelMat));
			drawObject(gl, cube);
		}
	}

	//////////////////////

	setProgramAttributes(gl, cone, phongProgram); 

	modelMat = mult(translate(0, 0, 0), scalem(20,20,20));
	sharedUniforms.M.set(flatten(modelMat));

	gl.bindTexture(gl.TEXTURE_2D, texture2);
	drawObject(gl, cone);

	///////////////////
	useProgram(gl, primitiveProgram, sharedUniforms, sharedUniformData);

	modelMat = mult(translate(lightPosition[0], lightPosition[1], lightPosition[2]), scalem(5,5,5));
	sharedUniforms.M.set(flatten(modelMat));

	setProgramAttributes(gl, lightModel, primitiveProgram); 
	drawObject(gl, lightModel);

	sharedUniforms.M.set(flatten(scalem(1,1,1)));

	setProgramAttributes(gl, surface, primitiveProgram); 
	drawObject(gl, surface);

	requestAnimFrame( render );
}
