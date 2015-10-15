function setAttributes(gl, obj, vAtribLoc, cAtribLoc){
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertBuffer);
	gl.vertexAttribPointer(vAtribLoc, obj.vertSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
	gl.vertexAttribPointer(cAtribLoc, obj.colorSize, gl.FLOAT, false, 0, 0);
}

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
		-1.0, -1.0, -1.0,
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
