from django.db import models


class Cliente(models.Model):

    nombre = models.CharField(max_length=100)

    correo = models.EmailField()

    fecha_registro = models.DateTimeField(auto_now_add=True)

    activo = models.BooleanField(default=True)

    @property
    def codigo_cliente(self):
        return f"ALQ-{self.id:06d}"

    def __str__(self):
        return self.nombre


class Alquiler(models.Model):

    MODALIDADES = [
        ("ciudad", "Dentro de la ciudad"),
        ("fuera", "Fuera de la ciudad"),
        ("establecimiento", "Dentro del establecimiento"),
    ]

    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        related_name="alquileres"
    )

    equipos = models.PositiveIntegerField()

    dias_iniciales = models.PositiveIntegerField()

    dias_adicionales = models.PositiveIntegerField(default=0)

    modalidad = models.CharField(
        max_length=20,
        choices=MODALIDADES
    )

    fecha_alquiler = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Alquiler de {self.cliente.nombre}"


class Factura(models.Model):

    alquiler = models.OneToOneField(
        Alquiler,
        on_delete=models.PROTECT,
        related_name="factura"
    )

    valor_inicial = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    valor_adicional = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    porcentaje_descuento_adicional = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    descuento_adicional = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    porcentaje_modalidad = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    valor_modalidad = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    total = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    fecha_factura = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Factura {self.id}"