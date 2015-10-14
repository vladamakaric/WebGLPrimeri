var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = new Float32Array([-1, -1, 0, 1, 1, -1]);

	//niz boja RGBA za svaki vertex
    var colors = new Float32Array([
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ]);

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	///////////////////////////////////////
    var positionBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBufferId );
    gl.bufferData( gl.ARRAY_BUFFER,vertices, gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	///////////////////////////////////////////////
	//podesavanje bafera koji ce drzati boje za svaki vertex
	//////////////////////////////////////
    var colorBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW );

	//bafer se vezuje za atribut vertColor u vertex shaderu
    var vertColor = gl.getAttribLocation( program, "vertColor" );
    gl.vertexAttribPointer( vertColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertColor );
    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
	//naredba za tri poziva trenutnog programa u rezimu crtanja trouglova, 
	//za svaki poziv programa atributi se ucitavaju iz njima podesenih bafera
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}
