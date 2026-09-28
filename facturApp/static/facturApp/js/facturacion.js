const idCliente = document.getElementById("idCliente");




const btnCalcular = document.getElementById("btnCalcular");

btnCalcular.addEventListener("click", function () {

    // Obtener los datos del formulario

    const idCliente = document.getElementById("idCliente").value.trim();

    const equipos = Number(
        document.getElementById("equipos").value
    );

    const dias = Number(
        document.getElementById("dias").value
    );

    const tipoAlquiler = document.getElementById("tipoAlquiler").value;

    const diasAdicionales = Number(
        document.getElementById("diasAdicionales").value
    );


    // Validar ID del cliente

    if (idCliente === "") {

        alert("Ingrese el ID del cliente.");

        return;
    }


    // Validar cantidad de equipos

    if (equipos < 2) {

        alert("La cantidad mínima de equipos es 2.");

        return;
    }


    // Validar días iniciales

    if (dias < 1) {

        alert("Debe ingresar al menos 1 día de alquiler.");

        return;
    }


    // Validar tipo de alquiler

    if (tipoAlquiler === "") {

        alert("Seleccione el tipo de alquiler.");

        return;
    }


    // Validar días adicionales

    if (diasAdicionales < 0) {

        alert("Los días adicionales no pueden ser negativos.");

        return;
    }


    // Precio de un equipo por día

    const precioPorDia = 35000;


    // Calcular valor de los días iniciales

    const valorInicial =
        equipos * dias * precioPorDia;


    // Calcular valor de los días adicionales

    const valorAdicional =
        equipos * diasAdicionales * precioPorDia;


    // Calcular descuento por días adicionales

    let porcentajeDescuentoAdicional =
        diasAdicionales * 0.02;


    // Máximo descuento: 10%

    if (porcentajeDescuentoAdicional > 0.10) {

        porcentajeDescuentoAdicional = 0.10;
    }


    const descuentoAdicional =
        valorAdicional * porcentajeDescuentoAdicional;


    // Valor de los días adicionales después del descuento

    const valorAdicionalFinal =
        valorAdicional - descuentoAdicional;


    // Subtotal

    const subtotal =
        valorInicial + valorAdicionalFinal;


    // Variables para incremento/descuento de modalidad

    let porcentajeModalidad = 0;

    let valorModalidad = 0;

    let descripcionModalidad = "";


    // Determinar modalidad

    if (tipoAlquiler === "ciudad") {

        descripcionModalidad = "Dentro de la ciudad";

    }


    else if (tipoAlquiler === "fuera") {

        porcentajeModalidad = 0.05;

        valorModalidad =
            subtotal * porcentajeModalidad;

        descripcionModalidad = "Fuera de la ciudad";

    }


    else if (tipoAlquiler === "establecimiento") {

        porcentajeModalidad = -0.05;

        valorModalidad =
            subtotal * porcentajeModalidad;

        descripcionModalidad =
            "Dentro del establecimiento";

    }


    // Calcular total

    const total =
        subtotal + valorModalidad;


    // Mostrar resultado

    const resultado =
        document.getElementById("resultado");

    const detalleFactura =
        document.getElementById("detalleFactura");


    resultado.style.display = "block";


    detalleFactura.innerHTML = `

        <p>
            <strong>ID del cliente:</strong>
            ${idCliente}
        </p>

        <p>
            <strong>Equipos alquilados:</strong>
            ${equipos}
        </p>

        <p>
            <strong>Días iniciales:</strong>
            ${dias}
        </p>

        <p>
            <strong>Días adicionales:</strong>
            ${diasAdicionales}
        </p>

        <p>
            <strong>Tipo de alquiler:</strong>
            ${descripcionModalidad}
        </p>

        <hr>

        <p>
            <strong>Valor días iniciales:</strong>
            ${formatearMoneda(valorInicial)}
        </p>

        <p>
            <strong>Valor días adicionales:</strong>
            ${formatearMoneda(valorAdicional)}
        </p>

        <p>
            <strong>Descuento días adicionales:</strong>
            ${formatearMoneda(descuentoAdicional)}
        </p>

        <p>
            <strong>Ajuste por modalidad:</strong>
            ${formatearMoneda(valorModalidad)}
        </p>

        <hr>

        <h3>
            TOTAL A PAGAR:
            ${formatearMoneda(total)}
        </h3>

    `;

});


function formatearMoneda(valor) {

    return valor.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });

}