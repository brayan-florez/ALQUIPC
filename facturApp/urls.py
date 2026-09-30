from django.urls import path

from . import views


urlpatterns = [

    path(
        "",
        views.inicio,
        name="inicio"
    ),

    path(
        "registrar-cliente/",
        views.registrar_cliente,
        name="registrar_cliente"
    ),

    path(
        "registrar-alquiler/",
        views.registrar_alquiler,
        name="registrar_alquiler"
    ),

    path(
    "historial-facturas/",
    views.historial_facturas,
    name="historial_facturas"
),

]