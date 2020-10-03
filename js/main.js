/*-----------------------------*/
/* VARIABLES  GLOBALES         */
/*-----------------------------*/
let listaProductos = [
	{nombre: "Frontier", cantidad: 15, precio: 1250000.0},
	{nombre: "Sentra", cantidad: 9, precio: 1800000.0},
	{nombre: "Kicks", cantidad: 21, precio: 1400000.0},
	{nombre: "Murano", cantidad: 18, precio: 1450000.0},
];

let crearLista = true;
let ul;

/*-----------------------------*/
/* FUNCIONES GLOBALES          */
/*-----------------------------*/

function cambiarCantidad(index, el) {
	let cantidad = Number(el.value);
	console.log("cambiar cantidad", index, cantidad);
	listaProductos[index].cantidad = cantidad;
}

function cambiarPrecio(index, el) {
	let precio = Number(el.value);
	console.log("cambiar precio", index, precio);
	listaProductos[index].precio = precio;
}

function borrarProd(index) {
	console.log("Borrar item", index);
	listaProductos.splice(index, 1);
	renderLista();
}

function renderLista() {
	if (crearLista) {
		ul = document.createElement("ul");
		ul.classList.add("demo-list-icon", "mdl-list", "w-100");
		document.getElementById("lista").appendChild(ul);
	}

	ul.innerHTML = "";

	listaProductos.forEach((prod, index) => {
		ul.innerHTML += `<li class="mdl-list__item">
          <!-- Campo Icono del auto -->
          <span class="mdl-list__item-primary-content w-10">
            <i class="material-icons mdl-list__item-icon">shopping_cart</i>
          </span>
          <span class="mdl-list__item-primary-content w-30">
            ${prod.nombre}
          </span>
          <!-- Cantidad de entrada del auto -->
          <span class="mdl-list__item-primary-content w-20 ">
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input class="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" onchange=cambiarCantidad(${index},this) value="${prod.cantidad}" id="sample-cantidad-${index}">
              <label class="mdl-textfield__label" for="sample-cantidad-${index}">Cantidad</label>
              <span class="mdl-textfield__error">Input no es una Cantidad!</span>
              </div>
          </span>
          <!-- Precio de entrada del auto -->
          <span class="mdl-list__item-primary-content w-20 ml-item">
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input
                class="mdl-textfield__input"
                type="text" onchange=cambiarPrecio(${index},this) value="${prod.precio}"
                pattern="-?[0-9]*(\.[0-9]+)?"
                id="sample-precio-${index}"
              />
              <label class="mdl-textfield__label" for="sample-precio-${index}">Precio</label>
              <span class="mdl-textfield__error"
                >Input no es un precio!</span>
            </div>
          </span>
          <!-- Boton para eliminar el producto -->
          <span>
            <button onclick=borrarProd(${index})
              class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored w-20 ml-item">
              <i class="material-icons">remove_shopping_cart</i>
            </button>
          </span>
      </li>`;
	});

	if (crearLista) {
		document.getElementById("lista").appendChild(ul);
	} else {
		componentHandler.upgradeElements(ul);
	}
	crearLista = false;
}

function configurarListeners() {
	/* Ingreso de Productos */
	document
		.getElementById("btn-agregar-producto")
		.addEventListener("click", () => {
			console.log("btn-entrada-producto");
			let input = document.getElementById("ingreso-producto");
			let producto = input.value;
			console.log(producto);
			if (producto) {
				listaProductos.push({nombre: producto, cantidad: 1, precio: 0});
				renderLista();
				input.value = null;
			}
		});

	/* Borrar todos los productos */
	document
		.getElementById("btn-borrar-productos")
		.addEventListener("click", () => {
			console.log("btn-borrar-producto");
			swal({
				title: "Estas seguro?",
				text: "Una vez borrado no vas poder recuperar la informacion",
				icon: "error",
				buttons: true,
				dangerMode: true,
			}).then((willDelete) => {
				if (willDelete) {
					swal("Tus datos han sido borrados ", {
						icon: "success",
					});
					listaProductos = [];
					renderLista();
				} else {
					swal("Tus datos no han sido borrados", {icon: "warning"});
				}
			});
		});
}

function start() {
	console.log("Super Lista");
	configurarListeners();
	renderLista();
}
/*-----------------------------*/
/*  EJECUCIONES                */
/*-----------------------------*/
start();
