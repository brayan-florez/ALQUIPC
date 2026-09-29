from django.contrib import admin

from .models import Cliente, Alquiler, Factura


admin.site.register(Cliente)
admin.site.register(Alquiler)
admin.site.register(Factura)