import json

from decimal import Decimal

from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render

from .models import Cliente, Alquiler, Factura


def inicio(request):

    return render(
        request,
        "facturApp/inicio.html"
    )


def registrar_cliente(request):

    if request.method != "POST":

        return JsonResponse(
            {
                "exito": False,
                "mensaje": "Método no permitido."
            },
            status=405
        )

    try:

        datos = json.loads(request.body)

        nombre = datos.get("nombre", "").strip()

        correo = datos.get("correo", "").strip()


        if nombre == "":

            return JsonResponse(
                {
                    "exito": False,
                    "mensaje": "Debe ingresar el nombre del cliente."
                },
                status=400
            )


        if correo == "":

            return JsonResponse(
                {
                    "exito": False,
                    "mensaje": "Debe ingresar el correo del cliente."
                },
                status=400
            )


        cliente_existente = Cliente.objects.filter(
            correo__iexact=correo
        ).first()

        if cliente_existente:

            return JsonResponse(
                {
                    "exito": False,
                    "mensaje": (
                        "Ya existe un cliente registrado "
                        "con este correo."
                    ),
                    "codigo_cliente":
                        cliente_existente.codigo_cliente
                },
                status=400
            )


        cliente = Cliente.objects.create(
            nombre=nombre,
            correo=correo
        )


        return JsonResponse(
            {
                "exito": True,
                "mensaje": "Cliente registrado correctamente.",
                "codigo_cliente": cliente.codigo_cliente,
                "nombre": cliente.nombre,
                "correo": cliente.correo
            }
        )


    except json.JSONDecodeError:

        return JsonResponse(
            {
                "exito": False,
                "mensaje": "Los datos enviados no son válidos."
            },
            status=400
        )


def registrar_alquiler(request):

    if request.method != "POST":

        return JsonResponse(
            {
                "exito": False,
                "mensaje": "Método no permitido."
            },
            status=405
        )


    try:

        datos = json.loads(request.body)


        codigo_cliente = datos.get(
            "codigo_cliente",
            ""
        ).strip()

        equipos = int(
            datos.get("equipos", 0)
        )

        dias_iniciales = int(
            datos.get("dias_iniciales", 0)
        )

        dias_adicionales = int(
            datos.get("dias_adicionales", 0)
        )

        modalidad = datos.get(
            "modalidad",
            ""
        ).strip()


        # =========================================
        # VALIDACIONES
        # =========================================

        if not codigo_cliente.startswith("ALQ-"):

            return JsonResponse(
                {
                    "exito": False,
                    "mensaje": "El ID del cliente no es válido."
                },
                status=400
            )


        try:

            id_cliente = int(
                codigo_cliente.replace("ALQ-", "")
            )

        except ValueError:

            return JsonResponse(
                {
                    "exito": False,
                    "mensaje": "El ID del cliente no es válido."
                },
                status=400
            )


        try:

            cliente = Cliente.objects.get(
                id=id_cliente
            )

        except Cliente.DoesNotExist:

            return JsonResponse(
                {
                    "exito": False,
                    "mensaje": "El cliente no existe."
                },
                status=404
            )


        if equipos < 2:

            return JsonResponse(
                {
                    "exito": False,
                    "mensaje": "El alquiler mínimo es de 2 equipos."
                },
                status=400
            )


        if dias_iniciales < 1:

            return JsonResponse(
                {
                    "exito": False,
                    "mensaje": "Debe ingresar mínimo 1 día."
                },
                status=400
            )


        if dias_adicionales < 0:

            return JsonResponse(
                {
                    "exito": False,
                    "mensaje": "Los días adicionales no pueden ser negativos."
                },
                status=400
            )


        modalidades_validas = [
            "ciudad",
            "fuera",
            "establecimiento"
        ]


        if modalidad not in modalidades_validas:

            return JsonResponse(
                {
                    "exito": False,
                    "mensaje": "Debe seleccionar una modalidad válida."
                },
                status=400
            )


        # =========================================
        # VALORES DEL ALQUILER
        # =========================================

        precio_por_dia = Decimal("35000")

        valor_inicial = (
            Decimal(equipos)
            * Decimal(dias_iniciales)
            * precio_por_dia
        )


        valor_adicional = (
            Decimal(equipos)
            * Decimal(dias_adicionales)
            * precio_por_dia
        )


        # =========================================
        # DESCUENTO POR DÍAS ADICIONALES
        # =========================================

        porcentaje_descuento = (
            Decimal(dias_adicionales)
            * Decimal("0.02")
        )


        # Máximo 10%
        if porcentaje_descuento > Decimal("0.10"):

            porcentaje_descuento = Decimal("0.10")


        descuento_adicional = (
            valor_adicional
            * porcentaje_descuento
        )


        valor_adicional_final = (
            valor_adicional
            - descuento_adicional
        )


        # =========================================
        # SUBTOTAL
        # =========================================

        subtotal = (
            valor_inicial
            + valor_adicional_final
        )


        # =========================================
        # MODALIDAD
        # =========================================

        porcentaje_modalidad = Decimal("0")


        if modalidad == "fuera":

            porcentaje_modalidad = Decimal("0.05")


        elif modalidad == "establecimiento":

            porcentaje_modalidad = Decimal("-0.05")


        valor_modalidad = (
            subtotal
            * porcentaje_modalidad
        )


        # =========================================
        # TOTAL
        # =========================================

        total = (
            subtotal
            + valor_modalidad
        )


        # =========================================
        # GUARDAR ALQUILER Y FACTURA
        # =========================================

        with transaction.atomic():

            alquiler = Alquiler.objects.create(

                cliente=cliente,

                equipos=equipos,

                dias_iniciales=dias_iniciales,

                dias_adicionales=dias_adicionales,

                modalidad=modalidad

            )


            factura = Factura.objects.create(

                alquiler=alquiler,

                valor_inicial=valor_inicial,

                valor_adicional=valor_adicional,

                porcentaje_descuento_adicional=porcentaje_descuento,

                descuento_adicional=descuento_adicional,

                subtotal=subtotal,

                porcentaje_modalidad=porcentaje_modalidad,

                valor_modalidad=valor_modalidad,

                total=total

            )


        # =========================================
        # RESPUESTA
        # =========================================

        return JsonResponse(
    {
        "exito": True,

        "mensaje": "Alquiler y factura registrados correctamente.",

        "codigo_cliente": cliente.codigo_cliente,

        "numero_factura": factura.id,

        "nombre_cliente": cliente.nombre,

        "correo": cliente.correo,

        "equipos": equipos,

        "dias_iniciales": dias_iniciales,

        "dias_adicionales": dias_adicionales,

        "modalidad": modalidad,

        "valor_inicial": str(valor_inicial),

        "valor_adicional": str(valor_adicional),

        "descuento_adicional": str(
            descuento_adicional
        ),

        "subtotal": str(subtotal),

        "valor_modalidad": str(
            valor_modalidad
        ),

        "total": str(total)
    }
)


    except (ValueError, TypeError):

        return JsonResponse(
            {
                "exito": False,
                "mensaje": "Los datos del alquiler no son válidos."
            },
            status=400
        )


    except json.JSONDecodeError:

        return JsonResponse(
            {
                "exito": False,
                "mensaje": "Los datos enviados no son válidos."
            },
            status=400
        )

    # =========================================
# HISTORIAL DE FACTURAS
# =========================================

def historial_facturas(request):

    facturas = Factura.objects.select_related(
        "alquiler__cliente"
    ).order_by("-id")


    datos = []


    for factura in facturas:

        datos.append({

            "numero": factura.id,

            "cliente": factura.alquiler.cliente.codigo_cliente,

            "nombre": factura.alquiler.cliente.nombre,

            "correo": factura.alquiler.cliente.correo,

            "equipos": factura.alquiler.equipos,

            "dias": factura.alquiler.dias_iniciales,

            "dias_adicionales": factura.alquiler.dias_adicionales,

            "modalidad": factura.alquiler.modalidad,

            "total": str(factura.total),

        })


    return JsonResponse(datos, safe=False)