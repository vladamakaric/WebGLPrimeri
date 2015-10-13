var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	//niz temena trouglova, parovi x,y koordinata, 
	//iako smo ih zadali sa dvodimenzionim vektorima GL ce ih prosiriti na 4D i
	//staviti da w=1. Drugim recima ove koordinate se nalaze u ClipSpace-u.
    var vertices = new Float32Array([-1, -1, 0, 1, 1, -1]);

    gl.viewport( 0, 0, canvas.width, canvas.height );

	//boja pozadine
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //Ucitavanje shader-a i bafer atributa.  
	//kreiranje shader programa
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );

	//podesavanjem naseg programa za trenutni shader program (GL stanje)
    gl.useProgram( program );
    
    
	//Trazi se bafer od WebGL-a, WebGL vraca njegov redni broj. Taj redni broj sluzi kao
	//reference (pokazivac) na taj bafer.
    var bufferId = gl.createBuffer();


	//Kazemo WebGL-u koji bafer je trenutno aktivan, sa kojim cemo da radimo, 
	//to podesava varijablu gl.ARRAY_BUFFER koja predstavlja interno stanje GL-a 
	//na bufferId.
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

	
	//kopira podatke u trenutno aktivan bafer
    gl.bufferData( gl.ARRAY_BUFFER,vertices, gl.STATIC_DRAW );

	
    //uzima lokaciju atributa u shader-u
    var vPosition = gl.getAttribLocation( program, "vPosition" );

	//////////////////////////////////////////////////////////////////////////////
	//podesava trenutno aktivni GL_ARRAY_BUFFER kao source buffer za atribut vPosition 
	//cak i kada bind-ujemo drugi bafer, informacija o source baferu za ovaj atribut ostaje
	//zapisana u GL-kontekstu 
	//
	//Detalji govore kolko su podaci veliki (vektor sa 2 g.FLOAT-a), i kako su rasporedjeni u baferu
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
	//svaki piksel boji bojom pozadine koju smo podesili sa gl.clearColor
    gl.clear( gl.COLOR_BUFFER_BIT );

	//pokrece trenutno aktivan shader program za 3 instance atributa, to jest
	//tri puta poziva vertex shader, a posto 3 vertexa cine jedan trougao, 
	//samo jedan ce biti nacrtan, i fragmnt shader ce biti pozvan za svaki piksel tog trougla
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}
