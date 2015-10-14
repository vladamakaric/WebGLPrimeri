var gl;


var pbuff1, pbuff2;
var vPosition;

//Funkcija koja vraca matricu za ortogonalnu projekciju
function glOrtho(	
	 left,
 	 right,
 	 bottom,
 	 top,
 	 near,
 	 far)
{
	return new Float32Array([
			2/(right-left),   			 0, 			0, 			0,
					     0,	2/(top-bottom), 	        0, 			0,        
					     0,				 0, -2/(far-near), 			0,        
			-(right+left)/(right-left), -(top+bottom)/(top-bottom),	-(far+near)/(far-near), 1
	]);
}

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = new Float32Array([20, 20, 50, 50, 60, 20]);

    var vertices2 = new Float32Array([10, 30, 50, 99, 99, 0]);

    var colors = new Float32Array([
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ]);

    gl.viewport( 0, 0, canvas.width, canvas.height );

	//promenjena boja pozadine na crnu
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	var	projTransfLoc = gl.getUniformLocation(program, "u_proj");
	gl.uniformMatrix4fv(projTransfLoc, false,glOrtho(0, 100, 0, 100, -10,10));

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPosition );

	///////////////////////////////////////
    pbuff1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, pbuff1 );
    gl.bufferData( gl.ARRAY_BUFFER,vertices, gl.STATIC_DRAW );

	/////////////////////////////////////////////
    pbuff2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, pbuff2 );
    gl.bufferData( gl.ARRAY_BUFFER,vertices2, gl.STATIC_DRAW );
	//////////////////////////////////////
	
    var colorBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW );

    var vertColor = gl.getAttribLocation( program, "vertColor" );
    gl.vertexAttribPointer( vertColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertColor );
    render();
};

//sada ce se ova funkcija zvati svakog frejma
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

	//prvi trougao, aktiviramo njegov bafer
    gl.bindBuffer( gl.ARRAY_BUFFER, pbuff2 );
	//povezemo atribut iz shader-a na trenutno aktivan bafer
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	//iscrtamo prvi trougao
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

	//deaktiviramo bafer prvog trougla i aktiviramo bafer drugog, itd..
    gl.bindBuffer( gl.ARRAY_BUFFER, pbuff1 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

	requestAnimFrame( render );
}
