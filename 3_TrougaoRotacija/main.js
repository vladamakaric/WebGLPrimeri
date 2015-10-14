var gl;

//globalna promenjive ugla rotacije
var theta = 0;
//globalna promenjiva pozicije uniformne promenjive u vert shaderu
var ltransfLocation;
window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = new Float32Array([-1, -1, 0, 1, 1, -1]);

    var colors = new Float32Array([
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ]);

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	//uzima lokaciju uniformne promenjive u_ltransf za trenutno aktivan shader program
	ltransfLocation = gl.getUniformLocation(program, "u_ltransf");

	///////////////////////////////////////
    var positionBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBufferId );
    gl.bufferData( gl.ARRAY_BUFFER,vertices, gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

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
	//pre pocetka svakog frejma se svaki piksel podesi na clearColor
    gl.clear( gl.COLOR_BUFFER_BIT );


	//svakog frejma se ugao povecava
	theta+=0.1;

	//svakog frejma se u trenutno aktivan shader program, u lokaciju ltransfLocation salje 
	//matrica rotacije za theta stepeni, matrice u OpenGL-u se specificiraju column major,
	//to jest prvi red je ustvari prva kolona, etc, kao da se specificira transponovana matrica.
	gl.uniformMatrix2fv(ltransfLocation, false, [Math.cos(theta), Math.sin(theta), 
												-Math.sin(theta), Math.cos(theta)]);
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

	//browseru kazemo da ponovo pozove nasu render funkciju kad je vreme da se iscrta novi frejm
	//Bolje nego da mi zovemo funkciju svakih x milisekundi jer browser najbolje zna kada je najbolje azurirati sliku,
	//mozda je tab u kome je nasa aplikacija nekativan, ili je prozor minimizovan,...
	requestAnimFrame( render );
}
