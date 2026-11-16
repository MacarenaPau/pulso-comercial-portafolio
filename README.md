# Pulso Comercial

Portafolio de Macarena Mendoza Burgos. Aplicación de control de gestión para consultar cierres diarios con la voz y comparar las ventas de las sucursales de una empresa.

## Explorar

Abre index.html y elige una empresa y un período. Las barras ordenan las tiendas por ventas. El total y la respuesta del asistente se calculan desde la misma colección de cierres.

La muestra contiene 60 cierres sintéticos de cinco sucursales ficticias, repartidas entre Casa Nube y Luz Austral, del 1 al 12 de noviembre de 2026. Los importes en pesos chilenos se generan mediante una fórmula reproducible en datos.js.

## Prueba de ejemplo

Di «Pulso, ¿cuánto vendió Aurora el 12 de noviembre de 2026?». La respuesta esperada es $189.100. El micrófono requiere permiso y un navegador compatible. Para probar desde otro dispositivo, sirve el sitio mediante HTTPS. El panel se puede explorar con los filtros.

Con Node.js instalado, ejecuta `node prueba.cjs` para verificar los datos y la interpretación de la consulta. El sitio usa HTML, CSS, JavaScript, Canvas y las funciones de voz del navegador. No requiere compilación.

## Archivos principales

- index.html y estilo.css contienen la interfaz adaptable.
- datos.js contiene el conjunto sintético y las consultas.
- panel.js muestra los totales y el gráfico.
- voz.js, locucion.js y orbita.js controlan las órdenes, las respuestas habladas y la animación.
