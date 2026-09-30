from django.contrib import admin

from .models import Cliente, Alquiler, Factura


# =========================================
# CLIENTES
# =========================================

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "codigo_cliente",
        "nombre",
        "correo",
        "fecha_registro",
    )

    search_fields = (
        "nombre",
        "correo",
    )

    ordering = (
        "-id",
    )


# =========================================
# ALQUILERES
# =========================================

@admin.register(Alquiler)
class AlquilerAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "cliente",
        "equipos",
        "dias_iniciales",
        "dias_adicionales",
        "modalidad",
    )

    search_fields = (
        "cliente__nombre",
        "cliente__correo",
    )

    list_filter = (
        "modalidad",
    )

    ordering = (
        "-id",
    )


# =========================================
# FACTURAS
# =========================================

@admin.register(Factura)
class FacturaAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "alquiler",
        "subtotal",
        "total",
    )

    search_fields = (
        "alquiler__cliente__nombre",
        "alquiler__cliente__correo",
    )

    ordering = (
        "-id",
    )