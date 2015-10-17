function setAttributes(gl, obj, vAtribLoc, tcAtribLoc){
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertBuffer);
	gl.vertexAttribPointer(vAtribLoc, obj.vertSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, obj.texCoordBuffer);
	gl.vertexAttribPointer(tcAtribLoc, 2, gl.FLOAT, false, 0, 0);
}

function createFloatArrayBuffer(gl, array){
	var arrBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, arrBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
	return arrBuffer;
}

function loadTexture(gl,filename){

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	//posto se tekstura ucitava asinhrono, dok se ne ucita prava slika u teksturu se stavlja 1 piksel crvene boje, 
	//cisto da ako dodje do crtanja pre nego sto se slika ucita.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
				  new Uint8Array([255, 0, 0, 255]));

	// Asynchronously load an image
	var image = new Image();
	image.src = filename;
	image.onload = function(){

	  gl.bindTexture(gl.TEXTURE_2D, texture);
	  //kopiranje piksela sa slike u teksturu
	  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	  //kreiranje mipmapa,tj. manjih verzija slike, za lakse samplovanje pri razlicitim velicinama geometrije
	  gl.generateMipmap(gl.TEXTURE_2D);
	}

	return texture;
}

function createPlane(gl){

	var vertexBuffer = createFloatArrayBuffer(gl, [	
		-1.0, 0.0, -1.0,
		1.0, 0.0, -1.0,
		1.0, 0.0, 1.0,
		-1.0, 0.0, 1.0
			]);

	var texCoordBuff = createFloatArrayBuffer(gl, [
				0,1, 
				1,1,
				1,0,
				0,0
			]);

		return {vertBuffer: vertexBuffer, texCoordBuffer: texCoordBuff,
		vertSize:3, nVerts:4, 
		primtype: gl.TRIANGLE_FAN};
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

	var texCoordBuff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuff);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
				0,1, 
				1,1,
				1,0,
				0,0,

				0,1, 
				1,1,
				1,0,
				0,0,

				0,1, 
				1,1,
				1,0,
				0,0,

				0,1, 
				1,1,
				1,0,
				0,0,

				0,1, 
				1,1,
				1,0,
				0,0,

				0,1, 
				1,1,
				1,0,
				0,0
					]), gl.STATIC_DRAW);

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

	var cube = {vertBuffer:vertexBuffer, indxBuffer:cubeIndexBuffer, texCoordBuffer: texCoordBuff,
		vertSize:3, nVerts:24, nIndices:36,
		primtype: gl.TRIANGLES};

	return cube;
}
