/*-----------------------------*/
/* VARIABLES  GLOBALES         */
/*-----------------------------*/
let listaProductos = [];

/*---------LOCALSTORAGE------------------- */
function guardarListaProductosLocal(lista) {
	let prods = JSON.stringify(lista);
	localStorage.setItem("LISTA", prods);
}

function leerListaProductosLocal(lista) {
	let prods = localStorage.getItem("LISTA");
	if (prods) {
		lista = JSON.parse(prods);
	}
	return lista;
}
/*-------------------------------------------*/

async function cambiarCantidad(id, el) {
	let index = listaProductos.findIndex((prod) => prod.id == id);
	let cantidad = Number(el.value);
	console.log("cambiar cantidad", index, id, cantidad);
	listaProductos[index].cantidad = cantidad;

	guardarListaProductosLocal(listaProductos);

	let prod = listaProductos[index];
	try {
		await api.putProdWeb(id, prod);
	} catch (error) {
		console.log("Error putProdWeb Cantidad");
	}
}

async function cambiarPrecio(id, el) {
	let index = listaProductos.findIndex((prod) => prod.id == id);
	let precio = Number(el.value);
	console.log("cambiar precio", id, precio);
	listaProductos[index].precio = precio;
	guardarListaProductosLocal(listaProductos);

	let prod = listaProductos[index];
	try {
		await api.putProdWeb(id, prod);
	} catch (error) {
		console.log("Error putProdWeb precio");
	}
}

async function borrarProd(id) {
	console.log("Borrar item", id);
	//	listaProductos.splice(index, 1);
	try {
		await api.deleteProdWeb(id);
		renderLista();
	} catch (error) {
		console.log("Error deleteProdWeb precio");
	}
}

async function renderLista() {
	try {
		// con FETCH
		/* let datos = await fetch("plantilla-lista.hbs");
	let source = await datos.text(); */
		let source = await $.ajax({url: "plantilla-lista.hbs", method: "get"});

		// HANDLEBARS
		// compile the template
		var template = Handlebars.compile(source);

		listaProductos = await api.getProdWeb();
		//	console.log(listaProductos);

		// Inyecto el codigo compilado con los datos en el HTML
		guardarListaProductosLocal(listaProductos);
		let data = {listaProductos};
		$("#lista").html(template(data));

		// Actualizo los elementos de la lista con el DOM
		let ul = $("#contenedor-lista");
		componentHandler.upgradeElements(ul);
	} catch (error) {
		console.log("Error en render lista", error);
	}
}

function configurarListeners() {
	/* Ingreso de Productos */
	$("#btn-agregar-producto").click(async () => {
		console.log("btn-entrada-producto");

		let input = $("#ingreso-producto");
		let producto = input.val();
		console.log(producto);

		if (producto) {
			// listaProductos.push({nombre: producto, cantidad: 1, precio: 0});
			let prod = {nombre: producto, cantidad: 1, precio: 0};
			let prodPost = await api.postProdWeb(prod);
			console.log("postProdWeb", producto);
			renderLista();
			input.val(null);
		}
	});

	/* Borrar todos los productos */

	$("#btn-borrar-productos").click(() => {
		console.log("btn-borrar-productos");

		if (listaProductos.length) {
			let dialog = $("dialog")[0];
			dialog.showModal();
		}
	});
}

function registrarServiceWorker() {
	if ("serviceWorker" in navigator) {
		this.navigator.serviceWorker
			.register("/sw.js")
			.then((reg) => {
				console.log("El Servico se registro correctamente", reg);
				reg.onupdatefound = () => {
					const installingworker = reg.installing;
					installingworker.onstatechange = () => {
						console.log("SW --->", installingworker.state);
						if (
							installingworker.state === "activated" &&
							this.navigator.serviceWorker.controller
						) {
							console.log("REINICIANDO");
							setTimeout(() => {
								location.reload();
							}, 2000);
						}
					};
				};
			})
			.catch((err) => {
				console.log("Error al registrar el service worker", err);
			});
	} else {
		console.log("No existe el objeto service worker en el navegador");
	}
}
function iniDialog() {
	let dialog = $("dialog")[0];
	//console.log(dialog)
	if (!dialog.showModal) {
		dialogPolyfill.registerDialog(dialog);
	}
	$(".aceptar").click(async () => {
		//listaProductos = []
		try {
			dialog.close();
			await api.deleteALLProdWeb();
			renderLista();
		} catch (error) {
			console.log("deleteAllProdWeb", error);
		}
	});
	$(".cancelar").click(() => {
		dialog.close();
	});
}
function start() {
	registrarServiceWorker();
	configurarListeners();
	iniDialog();
	renderLista();
	//pruebaCaches();
}
/*-----------------------------*/
/*  EJECUCIONES                */
/*-----------------------------*/
//start();
// window.onload = start;
//window.addEventListener("DOMContentLoaded", start);
$(document).ready(start);

/*----------------------------------------------*/
/*  Prueba de Caches Storage (CACHES)           */
/*----------------------------------------------*/
function pruebaCaches() {
	if (window.caches) {
		console.log("El Browser soporta caches");
		caches.keys().then(console.log);
		caches.open("cache-v1.1").then((cache) => {
			//console.log(cache);
			cache.addAll(["/index.html", "js/main.js"]);
			cache.put("/index.html", new Response("Hola mundo!"));
			cache.match("/index.html").then((recurso) => {
				if (recurso) {
					console.log("Recurso encontrado");
				} else {
					console.log("Recurso no encontrado");
				}
			});
			cache.keys().then((recursos) => {
				recursos.forEach((recurso) => {
					console.log("Url: ", recurso.url);
				});
			});
			cache.keys().then((recursos) => {
				console.log("Recursos de la lista", recursos);
			});
			caches.keys().then((nombres) => {
				console.log("Nombres de Caches:", nombres);
			});
		});
	} else {
		console.log("El Browser NO soporta caches");
	}
}
