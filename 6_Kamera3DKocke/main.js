var gl;

var t = 0;

var tPosBuff, sPosBuff;
var tColBuff;
var sColBuff;
var vPosition;
var vertColor;
var projectionTLoc, modelTLoc, cameraTLoc;

function createGrid(xLines, zLines){

	var verts = [];
	var colors = [];

	var width = xLines-1;
	var lenght = zLines-1;
	
	var x=-width/2;
	var z=-lenght/2

	for(var i=0; i<xLines; i++){
			verts.push(x+i, 0, z);
			verts.push(x+i, 0, -z);
			colors.push(1,1,1,1);
			colors.push(1,1,1,1);
	}

	for(var i=0; i<zLines; i++){
			verts.push(x, 0, z+i);
			verts.push(-x, 0, z+i);
			colors.push(1,1,1,1);
			colors.push(1,1,1,1);
	}

	console.log(verts);
	console.log(colors);

	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

	var colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	return {vertBuffer:vertexBuffer, colorBuffer:colorBuffer, vertSize:3, nVerts:verts.length/3, colorSize:4, nColors: colors.length/4, primtype: gl.LINES};
}




//Generisanje geometrije za ose koordinatnog sistema
function createCoordSys(gl){

	//duzi koje definisu ose
	var verts = [
		//x
		1.0,0.0,0.0, 
		0.0,0.0,0.0,
		//y
		0.0,0.0,0.0,
		0.0,1.0,0.0,
		//z
		0.0,0.0,0.0,
		0.0,0.0,1.0
	];

	var colors = [
		1.0, 0.0, 0.0, 1.0, 
		1.0, 0.0, 0.0, 1.0, 

		0.0, 1.0, 0.0, 1.0, 
		0.0, 1.0, 0.0, 1.0, 

		0.0, 0.0, 1.0, 1.0, 
		0.0, 0.0, 1.0, 1.0
	];

	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

	var colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	return {vertBuffer:vertexBuffer, colorBuffer:colorBuffer, vertSize:3, nVerts:6, colorSize:4, nColors: 6, primtype: gl.LINES};
}


function createCube(gl) {

	// Vertex Data
	var vertexBuffer;
	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	var verts = [
		// Front face
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,

		// Back face
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, -1.0, -1.0,

		// Top face
		-1.0, 1.0, -1.0,
		-1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, -1.0,

		// Bottom face
		-1.0, -1.0, 1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0, 1.0,
		-1.0, -1.0, 1.0,

		// Right face
		1.0, -1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,

		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0, 1.0,
		-1.0, 1.0, 1.0,
		-1.0, 1.0, -1.0
			];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

	// Color data
	var colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

	var faceColors = [
		[1.0, 0.0, 0.0, 1.0], // Front face
		[0.0, 1.0, 0.0, 1.0], // Back face
		[0.0, 0.0, 1.0, 1.0], // Top face
		[1.0, 1.0, 0.0, 1.0], // Bottom face
		[1.0, 0.0, 1.0, 1.0], // Right face
		[0.0, 1.0, 1.0, 1.0]  // Left face
			];

	var vertexColors = [];
	for (var i in faceColors) {
		var color = faceColors[i];
		for (var j=0; j < 4; j++) {
			vertexColors = vertexColors.concat(color);
		}
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

	// Index data (defines the triangles to be drawn)
	var cubeIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

	//indeksi u niz verts, koji svaka tri indeksa cine jedan trougao,
	//na kraju ce se kocka crtati sa gl.TRIANGLES, da se nebi neki vertexi ponavljali vise puta
	//cesto se koristi indeksiranje, tako sto se napravi poseban index bafer (element bafer), 
	//koji indeksira vertex bafer.
	var cubeIndices = [
		0, 1, 2,      0, 2, 3,    // Front face
		4, 5, 6,      4, 6, 7,    // Back face
		8, 9, 10,     8, 10, 11,  // Top face
		12, 13, 14,   12, 14, 15, // Bottom face
		16, 17, 18,   16, 18, 19, // Right face
		20, 21, 22,   20, 22, 23  // Left face
			];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

	var cube = {vertBuffer:vertexBuffer, colorBuffer:colorBuffer, indxBuffer:cubeIndexBuffer,
		vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices:36,
		primtype: gl.TRIANGLES};

	return cube;
}

var cube;
var coordSys;
var grid;
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
	render();
};

var t=0;
function render() {
	gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
	t+=0.009;

	var modelMat;

	//podesava se kamera tako da gleda u centar globalnog koordinatnog sistema i rotira se oko y ose
	gl.uniformMatrix4fv(cameraTLoc, false, flatten(lookAt([100*Math.cos(t),100,100*Math.sin(t)], [0,0,0], [0,1,0])));

	modelMat = scalem(10, 10, 10);
	gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));
	//////////coordsys
	gl.bindBuffer(gl.ARRAY_BUFFER, coordSys.vertBuffer);
	gl.vertexAttribPointer(vPosition, coordSys.vertSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, coordSys.colorBuffer);
	gl.vertexAttribPointer(vertColor, coordSys.colorSize, gl.FLOAT, false, 0, 0);

	gl.lineWidth(2);
	gl.drawArrays(coordSys.primtype, 0, coordSys.nVerts);

	//////////////////////////////////////////////////////////////////////////////cube
	

	gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertBuffer);
	gl.vertexAttribPointer(vPosition, cube.vertSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorBuffer);
	gl.vertexAttribPointer(vertColor, cube.colorSize, gl.FLOAT, false, 0, 0);

	//podesava index bafer od kocke za trenutni ELEMENT_ARRAY_BUFFER
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indxBuffer);

	modelMat = mult(translate(30, 10, 30), scalem(10,10,10));
	gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));
	//Poziv za crtanje koji radi isto kao i drawArrays, osim sto ne ide redom po baferima vezanim za
	//atribute, nego ide po indeksima koji su dati u trenutno vezanom ELEMENT_ARRAY_BUFFER-u.
	gl.drawElements(cube.primtype, cube.nIndices, gl.UNSIGNED_SHORT, 0);

	////////////////////////////////////////////////////////////
	
	console.log(grid);
	modelMat = scalem(20, 20, 20);
	gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));

	gl.bindBuffer(gl.ARRAY_BUFFER, grid.vertBuffer);
	gl.vertexAttribPointer(vPosition, grid.vertSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, grid.colorBuffer);
	gl.vertexAttribPointer(vertColor, grid.colorSize, gl.FLOAT, false, 0, 0);

	gl.lineWidth(1);
	gl.drawArrays(grid.primtype, 0, grid.nVerts);

	requestAnimFrame( render );
}
