function bindUniformsToProgram(uniforms, program, gl){
	function bindOne(uniform){
		var location = gl.getUniformLocation(program, uniform.name);
		uniform.set = function(data){
			uniform.setter.call(gl, location, data); 
		}
	}

	Object.keys(uniforms).forEach(function(uk){
		bindOne(uniforms[uk]);
	});
}
function loadAttributes(attributes, gl, program){
	$.each(attributes, function(k, v) {
		v.loc = gl.getAttribLocation( program, v.name );
		gl.enableVertexAttribArray( v.loc  );
	});
}

function ShaderProgram(gl, vsId, fsId, attribs, uniforms){
	var programId = initShaders( gl, vsId, fsId);
	loadAttributes(attribs, gl, programId);
	bindUniformsToProgram(uniforms, programId, gl);
	return {id: programId, attributes: attribs, uniforms};
}

function useProgram(gl, program, sharedUniforms, sharedUniformData){
	sharedUniforms = sharedUniforms || {};
	sharedUniformData = sharedUniformData || {};

	gl.useProgram( program.id );
	bindUniformsToProgram(sharedUniforms, program.id, gl);
	setUniformData(sharedUniforms, sharedUniformData);
}

function drawObject(gl, obj){
	if(obj.indxBuffer!=undefined){
		gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
		return;
	}

	gl.drawArrays(obj.primtype, 0, obj.nVerts);
}

function setProgramAttributes(gl, obj, program){
	var attributes = program.attributes;
	Object.keys(obj.attribBuffers).forEach(function(attribName){

		var aBuffer = obj.attribBuffers[attribName];
		gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer.id);
		gl.vertexAttribPointer(attributes[attribName].loc, aBuffer.elSize, gl.FLOAT, false, 0, 0);
	});

	if(obj.indxBuffer!=undefined){
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indxBuffer);
	}
}

function setMat3fv(gl){
	return function(loc, data){
		gl.uniformMatrix3fv(loc, false, data);
	}
}
function setMat4fv(gl){
	return function(loc, data){
		gl.uniformMatrix4fv(loc, false, data);
	}
}
