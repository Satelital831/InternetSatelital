function calcularTotal() {
    let total = 0;
    document.querySelectorAll(".productos input:checked").forEach((producto) => {
        total += parseFloat(producto.value);
    });

    document.getElementById("total").textContent = total;
}

function mostrarLogin() {
    document.body.style.background = "linear-gradient(to bottom, #1e3799, #000000)";
    document.getElementById("login").style.display = "block";
}

function iniciarSesion() {
    let usuario = document.getElementById("usuario").value;
    let password = document.getElementById("password").value;

    if (usuario && password) {
        document.getElementById("login").style.display = "none";
        iniciarCarga(usuario);
    } else {
        alert("Ingrese usuario y contraseña.");
    }
}

function iniciarCarga(usuario) {
    document.getElementById("loading").style.display = "block";
    let barra = document.getElementById("barraCarga");
    let progreso = 0;
    let intervalo = setInterval(() => {
        progreso += 33;
        barra.style.width = progreso + "%";
        if (progreso >= 100) {
            clearInterval(intervalo);
            document.getElementById("loading").style.display = "none";
            generarTicket(usuario);
        }
    }, 1000);
}

function generarTicket(usuario) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let productosSeleccionados = [];

    // Obtener productos seleccionados en Servicios
    document.querySelectorAll(".productos input:checked").forEach((producto) => {
        productosSeleccionados.push({ nombre: producto.dataset.nombre, precio: parseFloat(producto.value) });
    });

    // Unir ambos arrays
    let productosFinales = [...carrito, ...productosSeleccionados];

    if (productosFinales.length === 0) {
        alert("No hay productos seleccionados para generar el ticket.");
        return;
    }

    let fecha = new Date().toLocaleString();
    let total = productosFinales.reduce((acc, producto) => acc + producto.precio, 0);
    let productosHTML = productosFinales.map(producto => `<p>${producto.nombre} - $${producto.precio}</p>`).join("");

    localStorage.setItem("fechaHora", fecha);
    localStorage.setItem("nombreUsuario", usuario);
    localStorage.setItem("detalleCompra", productosHTML);
    localStorage.setItem("totalTicket", total);

    alert("¡Gracias por tu compra!");
    window.location.href = "ticket.html"; // Redirige al ticket
}

// Código dentro de "ticket.html" para cargar los datos guardados
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("fechaHora").textContent = localStorage.getItem("fechaHora");
    document.getElementById("nombreUsuario").textContent = localStorage.getItem("nombreUsuario");
    document.getElementById("detalle-compra").innerHTML = localStorage.getItem("detalleCompra");
    document.getElementById("totalTicket").textContent = localStorage.getItem("totalTicket");
});

const productos = [
    { nombre: "Impresión B/N", precio: 15, categoria: "impresion", imagen: "c.jpg" },
    { nombre: "Impresión Color", precio: 20, categoria: "impresion", imagen: "d.jpg" },
    { nombre: "Fotocopias", precio: 10, categoria: "impresion", imagen: "e.jpg" },
    { nombre: "Renta de PC", precio: 50, categoria: "servicios", imagen: "f.jpg" },
    { nombre: "Digitalización", precio: 30, categoria: "servicios", imagen: "g.jpg" },
    { nombre: "Encuadernado", precio: 40, categoria: "papeleria", imagen: "h.jpg" },
    { nombre: "Pluma Azul", precio: 5, categoria: "papeleria", imagen: "i.jpg" },
    { nombre: "Pluma Negra", precio: 5, categoria: "papeleria", imagen: "j.jpg" },
    { nombre: "Hojas Blancas (100pz)", precio: 25, categoria: "papeleria", imagen: "k.jpg" },
    { nombre: "Pegamento", precio: 15, categoria: "papeleria", imagen: "l.jpg" }
];

function mostrarProductos(productosFiltrados = productos) {
    const contenedor = document.getElementById("productosCatalogo");
    contenedor.innerHTML = "";
    
    productosFiltrados.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p>Precio: $${producto.precio}</p>
            <button onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})">Agregar al carrito</button>
        `;
        contenedor.appendChild(div);
    });
}

function filtrarProductos() {
    const categoria = document.getElementById("categoriaFiltro").value;
    const precioMax = document.getElementById("precioFiltro").value;
    
    let productosFiltrados = productos;

    if (categoria !== "todos") {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);
    }

    if (precioMax) {
        productosFiltrados = productosFiltrados.filter(p => p.precio <= precioMax);
    }

    mostrarProductos(productosFiltrados);
}

function agregarAlCarrito(nombre, precio) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push({ nombre, precio });
    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert(`${nombre} agregado al carrito.`);
}

document.addEventListener("DOMContentLoaded", () => mostrarProductos());

function mostrarCarrito() {
    window.location.href = "servicios.html";
}

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const listaCarrito = document.getElementById("listaCarrito");
    listaCarrito.innerHTML = "";

    let total = 0;
    carrito.forEach((producto, index) => {
        listaCarrito.innerHTML += `<p>${producto.nombre} - $${producto.precio} <button onclick="eliminarDelCarrito(${index})">Eliminar</button></p>`;
        total += producto.precio;
    });

    document.getElementById("totalCarrito").textContent = total;
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem("carrito");
    cargarCarrito();
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("listaCarrito")) {
        cargarCarrito();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("fechaHora").textContent = localStorage.getItem("fechaHora");
    document.getElementById("nombreUsuario").textContent = localStorage.getItem("nombreUsuario");
    document.getElementById("detalle-compra").innerHTML = localStorage.getItem("detalleCompra");
    document.getElementById("totalTicket").textContent = localStorage.getItem("totalTicket");
});

function publicarComentario() {
    let comentario = document.getElementById("cajaComentarios").value;
    if (comentario.trim() === "") {
        alert("Por favor, escribe un comentario antes de publicarlo.");
        return;
    }

    let listaComentarios = document.getElementById("seccionComentarios");
    let nuevoComentario = document.createElement("div");
    nuevoComentario.classList.add("comentario");
    nuevoComentario.innerHTML = `
        <p><strong>Anónimo:</strong> ${comentario}</p>
        <button onclick="darLike(this)">👍 Like <span>0</span></button>
        <button onclick="responderComentario(this)">Responder</button>
        <div class="respuestas"></div>
    `;

    listaComentarios.appendChild(nuevoComentario);
    document.getElementById("cajaComentarios").value = "";
}

function darLike(boton) {
    let contador = boton.querySelector("span");
    contador.textContent = parseInt(contador.textContent) + 1;
}

function responderComentario(boton) {
    let contenedorRespuestas = boton.nextElementSibling;
    let inputRespuesta = document.createElement("input");
    let botonEnviar = document.createElement("button");

    inputRespuesta.placeholder = "Escribe tu respuesta...";
    botonEnviar.textContent = "Enviar";

    botonEnviar.onclick = () => {
        let respuestaTexto = inputRespuesta.value.trim();
        if (respuestaTexto !== "") {
            let nuevaRespuesta = document.createElement("p");
            nuevaRespuesta.innerHTML = `<strong>Anónimo:</strong> ${respuestaTexto}`;
            contenedorRespuestas.appendChild(nuevaRespuesta);
            inputRespuesta.remove();
            botonEnviar.remove();
        }
    };

    contenedorRespuestas.appendChild(inputRespuesta);
    contenedorRespuestas.appendChild(botonEnviar);
}

function publicarTestimonio() {
    let testimonio = document.getElementById("cajaTestimonios").value;
    if (testimonio.trim() === "") {
        alert("Por favor, escribe un testimonio antes de publicarlo.");
        return;
    }

    let listaTestimonios = document.getElementById("listaTestimonios");
    let nuevoTestimonio = document.createElement("div");
    nuevoTestimonio.classList.add("testimonio");
    nuevoTestimonio.innerHTML = `
        <p><strong>Anónimo:</strong> ${testimonio}</p>
        <button onclick="darLike(this)">👍 Like <span>0</span></button>
        <button onclick="responderTestimonio(this)">Responder</button>
        <div class="respuestas"></div>
    `;

    listaTestimonios.appendChild(nuevoTestimonio);
    document.getElementById("cajaTestimonios").value = "";
}

function darLike(boton) {
    let contador = boton.querySelector("span");
    contador.textContent = parseInt(contador.textContent) + 1;
}

function responderTestimonio(boton) {
    let contenedorRespuestas = boton.nextElementSibling;
    let inputRespuesta = document.createElement("input");
    let botonEnviar = document.createElement("button");

    inputRespuesta.placeholder = "Escribe tu respuesta...";
    botonEnviar.textContent = "Enviar";

    botonEnviar.onclick = () => {
        let respuestaTexto = inputRespuesta.value.trim();
        if (respuestaTexto !== "") {
            let nuevaRespuesta = document.createElement("p");
            nuevaRespuesta.innerHTML = `<strong>Anónimo:</strong> ${respuestaTexto}`;
            contenedorRespuestas.appendChild(nuevaRespuesta);
            inputRespuesta.remove();
            botonEnviar.remove();
        }
    };

    contenedorRespuestas.appendChild(inputRespuesta);
    contenedorRespuestas.appendChild(botonEnviar);
}
