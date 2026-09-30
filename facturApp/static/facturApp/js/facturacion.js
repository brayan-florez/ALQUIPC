const btnRegistrarCliente =
    document.getElementById("btnRegistrarCliente");


btnRegistrarCliente.addEventListener("click", function () {

    const nombre =
        document.getElementById("nombreCliente").value.trim();

    const correo =
        document.getElementById("correo").value.trim();

    const csrfToken =
        document.querySelector(
            "[name=csrfmiddlewaretoken]"
        ).value;


    if (nombre === "") {

        mostrarMensaje(
            "Debe ingresar el nombre del cliente.",
            "error"
        );

        return;
    }


    if (correo === "") {

        mostrarMensaje(
            "Debe ingresar el correo del cliente.",
            "error"
        );

        return;
    }


    fetch("/registrar-cliente/", {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            "X-CSRFToken": csrfToken

        },

        body: JSON.stringify({

            nombre: nombre,

            correo: correo

        })

    })

    .then(response => response.json())

    .then(data => {

        if (data.exito) {

            document.getElementById("idCliente").value =
                data.codigo_cliente;


            mostrarMensaje(
                "Cliente registrado correctamente. ID asignado: "
                + data.codigo_cliente,
                "exito"
            );

        } else {

            mostrarMensaje(
                data.mensaje,
                "error"
            );

        }

    })

    .catch(error => {

        console.error(error);

        mostrarMensaje(
            "Ocurrió un error al registrar el cliente.",
            "error"
        );

    });

});



const btnCalcular =
    document.getElementById("btnCalcular");


btnCalcular.addEventListener("click", function () {

    const idCliente =
        document.getElementById("idCliente").value.trim();

    const equipos =
        parseInt(
            document.getElementById("equipos").value
        );

    const dias =
        parseInt(
            document.getElementById("dias").value
        );

    const tipoAlquiler =
        document.getElementById("tipoAlquiler").value;

    const diasAdicionales =
        parseInt(
            document.getElementById("diasAdicionales").value
        );


    // =========================================
    // VALIDACIONES
    // =========================================

    if (idCliente === "") {

        mostrarMensaje(
            "Primero debe registrar un cliente.",
            "error"
        );

        return;
    }


    if (equipos < 2) {

        mostrarMensaje(
            "Debe alquilar mínimo 2 equipos.",
            "error"
        );

        return;
    }


    if (dias < 1) {

        mostrarMensaje(
            "Debe ingresar mínimo 1 día.",
            "error"
        );

        return;
    }


    if (tipoAlquiler === "") {

        mostrarMensaje(
            "Debe seleccionar una modalidad.",
            "error"
        );

        return;
    }


    if (diasAdicionales < 0) {

        mostrarMensaje(
            "Los días adicionales no pueden ser negativos.",
            "error"
        );

        return;
    }


    // =========================================
    // TOKEN CSRF
    // =========================================

    const csrfToken =
        document.querySelector(
            "[name=csrfmiddlewaretoken]"
        ).value;


    // =========================================
    // ENVIAR DATOS A DJANGO
    // =========================================

    fetch("/registrar-alquiler/", {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            "X-CSRFToken": csrfToken

        },

        body: JSON.stringify({

            codigo_cliente: idCliente,

            equipos: equipos,

            dias_iniciales: dias,

            dias_adicionales: diasAdicionales,

            modalidad: tipoAlquiler

        })

    })

    .then(response => {

        console.log(
            "Código de respuesta:",
            response.status
        );

        return response.json();

    })

    .then(data => {

        console.log(
            "Respuesta de Django:",
            data
        );

        window.ultimaFactura = data;


        if (!data.exito) {

            mostrarMensaje(
                data.mensaje,
                "error"
            );

            return;
        }


        // =========================================
        // NOMBRE DE LA MODALIDAD
        // =========================================

        let nombreModalidad = "";


        if (data.modalidad === "ciudad") {

            nombreModalidad =
                "Dentro de la ciudad";
        }


        if (data.modalidad === "fuera") {

            nombreModalidad =
                "Fuera de la ciudad";
        }


        if (data.modalidad === "establecimiento") {

            nombreModalidad =
                "Dentro del establecimiento";
        }


        // =========================================
        // MOSTRAR RESULTADO
        // =========================================

        const detalleFactura =
            document.getElementById("detalleFactura");


        detalleFactura.innerHTML = `

            <p>
                <strong>Número de factura:</strong>
                ${data.numero_factura}
            </p>

            <p>
                <strong>ID Cliente:</strong>
                ${data.codigo_cliente}
            </p>

            <p>
                <strong>Equipos:</strong>
                ${data.equipos}
            </p>

            <p>
                <strong>Días iniciales:</strong>
                ${data.dias_iniciales}
            </p>

            <p>
                <strong>Días adicionales:</strong>
                ${data.dias_adicionales}
            </p>

            <p>
                <strong>Modalidad:</strong>
                ${nombreModalidad}
            </p>

            <hr>

            <p>
                <strong>
                    Valor días iniciales:
                </strong>

                ${formatearMoneda(
                    Number(data.valor_inicial)
                )}
            </p>

            <p>
                <strong>
                    Valor días adicionales:
                </strong>

                ${formatearMoneda(
                    Number(data.valor_adicional)
                )}
            </p>

            <p>
                <strong>
                    Descuento días adicionales:
                </strong>

                ${formatearMoneda(
                    Number(data.descuento_adicional)
                )}
            </p>

            <p>
                <strong>
                    Subtotal:
                </strong>

                ${formatearMoneda(
                    Number(data.subtotal)
                )}
            </p>

            <p>
                <strong>
                    Ajuste por modalidad:
                </strong>

                ${formatearMoneda(
                    Number(data.valor_modalidad)
                )}
            </p>

            <h3>
                Total:
                ${formatearMoneda(
                    Number(data.total)
                )}
            </h3>

        `;


        document.getElementById(
            "resultado"
        ).style.display = "block";


        mostrarMensaje(
            data.mensaje,
            "exito"
        );

    })

    .catch(error => {

        console.error(
            "Error al registrar alquiler:",
            error
        );


        mostrarMensaje(
            "Ocurrió un error al registrar el alquiler.",
            "error"
        );

    });

});


function formatearMoneda(valor) {

    return valor.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
}


function mostrarMensaje(texto, tipo) {

    const mensaje = document.getElementById("mensaje");

    mensaje.textContent = texto;

    mensaje.className = "mensaje " + tipo;

    mensaje.style.display = "block";
}

// =========================================
// PREPARAR CORREO
// =========================================

const btnCorreo =
    document.getElementById("btnCorreo");


btnCorreo.addEventListener("click", function () {

    if (!window.ultimaFactura) {

        mostrarMensaje(
            "Primero debe calcular una factura.",
            "error"
        );

        return;
    }


    const factura = window.ultimaFactura;


    const asunto =
        "Factura ALQUIPC #" +
        factura.numero_factura;


    const cuerpo = `

Hola ${factura.nombre_cliente},

Gracias por utilizar los servicios de ALQUIPC.

Detalles de su factura:

Número de factura:
${factura.numero_factura}

ID del cliente:
${factura.codigo_cliente}

Número de equipos:
${factura.equipos}

Días iniciales:
${factura.dias_iniciales}

Días adicionales:
${factura.dias_adicionales}

Modalidad:
${factura.modalidad}

Valor días iniciales:
${formatearMoneda(
    Number(factura.valor_inicial)
)}

Valor días adicionales:
${formatearMoneda(
    Number(factura.valor_adicional)
)}

Descuento días adicionales:
${formatearMoneda(
    Number(factura.descuento_adicional)
)}

Subtotal:
${formatearMoneda(
    Number(factura.subtotal)
)}

Ajuste por modalidad:
${formatearMoneda(
    Number(factura.valor_modalidad)
)}

TOTAL:
${formatearMoneda(
    Number(factura.total)
)}

Cordialmente,

ALQUIPC
Sistema de Facturación
    `;


    const enlaceCorreo =
        "mailto:" +
        factura.correo +
        "?subject=" +
        encodeURIComponent(asunto) +
        "&body=" +
        encodeURIComponent(cuerpo);


    window.location.href =
        enlaceCorreo;

});


// =========================================
// NUEVA FACTURA
// =========================================

const btnNuevaFactura =
    document.getElementById("btnNuevaFactura");


if (btnNuevaFactura) {

    btnNuevaFactura.addEventListener(
        "click",
        function (event) {

            // Evitar cualquier comportamiento
            // predeterminado del botón
            event.preventDefault();


            // =====================================
            // LIMPIAR DATOS DEL CLIENTE
            // =====================================

            const nombre =
                document.getElementById("nombreCliente");

            if (nombre) {
                nombre.value = "";
            }


            const correo =
                document.getElementById("correo");

            if (correo) {
                correo.value = "";
            }


            const idCliente =
                document.getElementById("idCliente");

            if (idCliente) {
                idCliente.value = "";
            }


            // =====================================
            // RESTABLECER DATOS DEL ALQUILER
            // =====================================

            const equipos =
                document.getElementById("equipos");

            if (equipos) {
                equipos.value = 2;
            }


            const dias =
                document.getElementById("dias");

            if (dias) {
                dias.value = 1;
            }


            const tipoAlquiler =
                document.getElementById("tipoAlquiler");

            if (tipoAlquiler) {
                tipoAlquiler.value = "";
            }


            const diasAdicionales =
                document.getElementById(
                    "diasAdicionales"
                );

            if (diasAdicionales) {
                diasAdicionales.value = 0;
            }


            // =====================================
            // OCULTAR RESULTADO
            // =====================================

            const resultado =
                document.getElementById("resultado");

            if (resultado) {
                resultado.style.display = "none";
            }


            // =====================================
            // LIMPIAR MENSAJE
            // =====================================

            const mensaje =
                document.getElementById("mensaje");

            if (mensaje) {

                mensaje.textContent = "";

                mensaje.style.display = "none";
            }


            // =====================================
            // ELIMINAR FACTURA TEMPORAL
            // =====================================

            window.ultimaFactura = null;


            // =====================================
            // VOLVER AL NOMBRE DEL CLIENTE
            // =====================================

            if (nombre) {
                nombre.focus();
            }

        }
    );

}

// =========================================
// FACTURAS DEL HISTORIAL
// =========================================

let facturasHistorial = [];
// =========================================
// HISTORIAL DE FACTURAS
// =========================================

const btnHistorial =
    document.getElementById("btnHistorial");


if (btnHistorial) {

    btnHistorial.addEventListener(
        "click",
        function () {

            cargarHistorial();

        }
    );

}


// =========================================
// CARGAR HISTORIAL
// =========================================

function cargarHistorial() {

    fetch("/historial-facturas/")

        .then(response => {

            return response.json();

        })

        .then(facturas => {

            facturasHistorial = facturas;


            document.getElementById(
                "historial"
            ).style.display = "block";


            mostrarFacturas(
                facturasHistorial
            );

        })

        .catch(error => {

            console.error(
                "Error:",
                error
            );

            mostrarMensaje(
                "No fue posible cargar el historial.",
                "error"
            );

        });

}


// =========================================
// MOSTRAR FACTURAS
// =========================================

function mostrarFacturas(facturas) {

    const lista =
        document.getElementById(
            "listaHistorial"
        );


    if (facturas.length === 0) {

        lista.innerHTML = `
            <p>
                No se encontraron facturas.
            </p>
        `;

        return;
    }


    let contenido = "";


    facturas.forEach(
        function (factura) {

            let nombreModalidad =
                factura.modalidad;


            if (
                factura.modalidad ===
                "ciudad"
            ) {

                nombreModalidad =
                    "Dentro de la ciudad";

            }


            if (
                factura.modalidad ===
                "fuera"
            ) {

                nombreModalidad =
                    "Fuera de la ciudad";

            }


            if (
                factura.modalidad ===
                "establecimiento"
            ) {

                nombreModalidad =
                    "Dentro del establecimiento";

            }


            contenido += `

                <div class="factura-historial">

                    <h3>
                        Factura #${factura.numero}
                    </h3>


                    <p>
                        <strong>
                            Cliente:
                        </strong>

                        ${factura.nombre}
                    </p>


                    <p>
                        <strong>
                            ID:
                        </strong>

                        ${factura.cliente}
                    </p>


                    <p>
                        <strong>
                            Correo:
                        </strong>

                        ${factura.correo}
                    </p>


                    <p>
                        <strong>
                            Equipos:
                        </strong>

                        ${factura.equipos}
                    </p>


                    <p>
                        <strong>
                            Días iniciales:
                        </strong>

                        ${factura.dias}
                    </p>


                    <p>
                        <strong>
                            Días adicionales:
                        </strong>

                        ${factura.dias_adicionales}
                    </p>


                    <p>
                        <strong>
                            Modalidad:
                        </strong>

                        ${nombreModalidad}
                    </p>


                    <p class="total-historial">

                        <strong>
                            Total:
                        </strong>

                        ${formatearMoneda(
                            Number(
                                factura.total
                            )
                        )}

                    </p>

                </div>

            `;

        }
    );


    lista.innerHTML =
        contenido;

}


// =========================================
// BUSCAR FACTURAS
// =========================================

const buscarFactura =
    document.getElementById(
        "buscarFactura"
    );


if (buscarFactura) {

    buscarFactura.addEventListener(
        "input",
        function () {

            const texto =
                buscarFactura.value
                    .toLowerCase()
                    .trim();


            const resultados =
                facturasHistorial.filter(
                    function (factura) {

                        return (

                            factura.numero
                                .toString()
                                .includes(texto)

                            ||

                            factura.nombre
                                .toLowerCase()
                                .includes(texto)

                            ||

                            factura.cliente
                                .toLowerCase()
                                .includes(texto)

                            ||

                            factura.correo
                                .toLowerCase()
                                .includes(texto)

                        );

                    }
                );


            mostrarFacturas(
                resultados
            );

        }
    );

}