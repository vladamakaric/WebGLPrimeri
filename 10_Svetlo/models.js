function createFloatArrayBuffer(gl, elSize, array){
	var arrBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, arrBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
	return {id: arrBuffer, elSize: elSize};
}

function loadTexture(gl,filename){

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
				  new Uint8Array([255, 0, 0, 255]));

	var image = new Image();
	image.src = filename;
	image.onload = function(){
	  gl.bindTexture(gl.TEXTURE_2D, texture);
	  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	  gl.generateMipmap(gl.TEXTURE_2D);
	}

	return texture;
}

function createCube(gl) {

	var normalBuffer = createFloatArrayBuffer(gl, 3, [
			0,0,1.0,
			0,0,1.0,
			0,0,1.0,
			0,0,1.0,

			0,0,-1.0,
			0,0,-1.0,
			0,0,-1.0,
			0,0,-1.0,

			0,1.0,0,
			0,1.0,0,
			0,1.0,0,
			0,1.0,0,

			0,-1.0,0,
			0,-1.0,0,
			0,-1.0,0,
			0,-1.0,0,

			1.0,0,0,
			1.0,0,0,
			1.0,0,0,
			1.0,0,0,

			-1.0,0,0,
			-1.0,0,0,
			-1.0,0,0,
			-1.0,0,0
				]);

	var vertexBuffer = createFloatArrayBuffer(gl, 3, [
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
			]);


	var texCoordBuffer = createFloatArrayBuffer( gl, 2, [
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
					]);

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

	//imena buffer-a odgovaraju imenima atributa u js objektu koji 
	//predstavlja shader program, da bi se lako povezali
	var attribBuffers = {vertex: vertexBuffer,
				   normal: normalBuffer,
				   texcoord: texCoordBuffer};

	var cube = {indxBuffer:cubeIndexBuffer,attribBuffers,  
		nVerts:24, nIndices:36, primtype: gl.TRIANGLES};

	return cube;
}
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
