jq(function() {	
	//se define que la barra de arriba tenga una posición fija en la pantalla
	jq("div[data-role=header]").toolbar({ position: "fixed" });
	
	//Al mostrar una nueva pagina, comprueba en que página se está y muestra los correspondientes iconos de "volver atrás"
	jq( window ).on( "pagebeforeshow", function( event, data ) {
		//Si estamos en el menu, se ocultan los botones de "vover atrás" y "actualizar"
		if(jq.mobile.activePage.attr('id') == 'menu'){
			jq(".back-to-menu i").hide();
			jq(".button-update i").hide();
		}
		//Si estamos en la pagina de Facebook, muestra el boton de "actualizar"
		if(jq.mobile.activePage.attr('id') == 'facebook')
			jq(".button-update i").show();
		//Y si no estamos en el menu, muestra el boton de "volver atrás"
		if(jq.mobile.activePage.attr('id') != 'menu')
			jq(".back-to-menu i").show();
		
		//Aqui resetea el alto de la página actual, para que la barra de navegacion se mantenga arriba
		jq.mobile.resetActivePageHeight();
	});	
	
	//Al pulsar sobre el icono de "volver atrás", vamos al inicio de la aplicación
	jq(".back-to-menu").on("tap", function() {
		//Resetea el hash de la URL
		window.location.hash = '';
		//Se ocultan los botons de volver atrás y actualizar
		jq(".back-to-menu i").hide();
		jq(".button-update i").hide();
		//Navegamos a la pagina principal
		jq.mobile.navigate( "#menu");
		//Resetea el alto de la página actual, para que la barra de navegacion se mantenga arriba
		jq.mobile.resetActivePageHeight();
	});
	
	//Al pulsar sobre un icono del menu principal, comprobamos la accion y ejecutamos lo que haga falta
	jq("[data-accion=open-page],[data-accion=open-link]").on("tap",function(event) {
		event.preventDefault();
		//recogemos la id (nombre de la pagina) y la accion, que puede ser "open_page"(Para abrir paginas internas de la aplacicion) o "open-link" que abre directamente el enlace, como los pdfs, contacto o llamada
		var id= jq(this).data("id");
		var accion = jq(this).data("accion");
		switch(accion){
			case "open-page":
				cargarPagina(id);
				break;
			case "open-link":
				window.open(jq(this).data("href"));
				break;
		}
	});
});

function onLoad() {
	//Al cargar la apliación, resetea la altura de la pagina principal, esto es un fix, que seguramente se pueda prescindir
	jq.mobile.resetActivePageHeight();
}

//Funcion que se llama para cargar las paginas
function cargarPagina(pagina) {
	//se llama al loading, para mostrar el icono de "cargando"
	jq.mobile.loading( "show" );
	//Se comprueba si ya se ha cargado la pagina en la aplicacion
	if(jq("div[id='"+pagina+"']").length==0) {
		//Se crea la pagina en la aplicacion, con los datos de la pagina, y se crea el contendor
		var jqdiv = jq("<div>", {id: pagina, "data-role": "page"});
		jq("body").append(jqdiv);
		//Cargamos la pagina seleccionada y la colocamos en el contenedor correspondiente.
		jq(jqdiv).load(pagina+".html",function() {
			window.location.hash = pagina;
			jq(".back-to-menu i").show();
			if(pagina=="facebook")
				jq(".button-update i").show();
			jq.mobile.navigate( "#"+pagina, function() {
				jq.mobile.loading( "hide" );
				jq.mobile.resetActivePageHeight();
			});
		});
	}else {
		//Si ya esta cargada en la aplicacion, simplemente navegamos a la pagina
		jq.mobile.navigate( "#"+pagina, function() {
			jq.mobile.loading( "hide" );
			jq.mobile.resetActivePageHeight();
		});
	}	
}
