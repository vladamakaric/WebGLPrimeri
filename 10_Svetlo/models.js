function setAttributes(gl, obj, attributes){

	console.log(attributes.vertex.loc + " " + attributes.texcoord.loc + " " + attributes.normal.loc);

	gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertBuffer);
	gl.vertexAttribPointer(attributes.vertex.loc, obj.vertSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, obj.texCoordBuffer);
	gl.vertexAttribPointer(attributes.texcoord.loc, 2, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, obj.normalBuffer);
	gl.vertexAttribPointer(attributes.normal.loc, 3, gl.FLOAT, false, 0, 0);
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


	var normalBuffer = createFloatArrayBuffer(gl, [
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


	var vertexBuffer = createFloatArrayBuffer(gl, [
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


	var texCoordBuff = createFloatArrayBuffer( gl,[
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

	var cube = {vertBuffer:vertexBuffer, indxBuffer:cubeIndexBuffer, normalBuffer: normalBuffer, texCoordBuffer: texCoordBuff,
		vertSize:3, nVerts:24, nIndices:36,
		primtype: gl.TRIANGLES};

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
