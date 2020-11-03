const api = (function(){
/*-----------------------------*/
/* 			API  REST          */
/*-----------------------------*/
function getURL(id) {
	return "https://5f904bf5e0559c0016ad66dc.mockapi.io/lista/" + (id ? id : "");
}

/*  GET   */
async function getProdWeb() {
	let url = getURL() + "?" + Date.now();

	try {
		let prods = await $.ajax({url, method: "get"});
		return prods;
	} catch (error) {
		console.log("Error getProdWeb", error);
		let prods = leerListaProductosLocal(listaProductos);
		return prods;
	}
}

/*  POST  */
async function postProdWeb(prod) {
	try {
		return await $.ajax({url: getURL(), method: "post", data: prod});
	} catch (error) {
		return "Error postProdWeb" + error;
	}
}

/*  PUT  */
async function putProdWeb(id, prod) {
	try {
		return await $.ajax({url: getURL(id), method: "put", data: prod});
	} catch (error) {
		return "Error putProdWeb" + error;
	}
}

/*  DELETE  */
async function deleteProdWeb(id) {
	try {
		return await $.ajax({url: getURL(id), method: "delete"});
	} catch (error) {
		return "Error deleteProdWeb" + error;
	}
}

/*  DELETE  ALL*/

async function deleteALLProdWeb() {
	let porcentaje = 0;
	let cont_prods = listaProductos.length;
	let progress = document.querySelector("progress");
	progress.value = 0;
	progress.style.display = "block";
	let btnBorrarproductos = document.querySelector("#btn-borrar-productos");
	btnBorrarproductos.setAttribute("disabled", true);

	for (let i = 0; i < cont_prods; i++) {
		porcentaje = parseInt((i * 100) / cont_prods);
		progress.value = porcentaje;
		console.log(porcentaje + "%");
		try {
			await $.ajax({url: getURL(listaProductos[i].id), method: "delete"});
		} catch (error) {
			throw "Error deleteALLProdWeb" + error;
		}
	}
	porcentaje = 100;
	console.log(porcentaje + "%");
	progress.value = porcentaje;

	setTimeout(() => {
		progress.style.display = "none";
		btnBorrarproductos.removeAttribute("disabled");
	}, 4000);
}
    return {
        getProdWeb,
        postProdWeb,
        putProdWeb,
        deleteProdWeb,
        deleteALLProdWeb
    }
})()
