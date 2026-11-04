# Integración numérica con Simpson 1/3

Aplicación en HTML, CSS y JavaScript para calcular la energía consumida por servidores durante un intervalo de tiempo.

## Abrir el sistema

Descarga el repositorio y abre `index.html` en tu navegador. No requiere instalación ni conexión a internet.

## Función

P(t) = 10 + 5t sen(πt/6) + exp(0,2t), en kW; t en horas.

## Funcionalidad

- Entradas a, b y n, con validación mediante excepciones.
- Rechazo de n impar, no entero, cero o negativo.
- Simpson 1/3 compuesto usando arreglos de puntos, valores y coeficientes.
- Tabla de evaluación y análisis de convergencia para n = 2, 4, 6, 12 y 24.
- Cálculo de la cota de error solicitada y de una cota conservadora válida.

## Ejemplo

Con a = 0, b = 6 y n = 6, la energía aproximada es **128,921195317 kWh**.

La guía proporciona M = 0,45, que produce 0,015 kWh como cota formal. Ese M no limita la cuarta derivada de esta función. La aplicación explica la diferencia y muestra también una cota segura.

## Archivos

- `index.html`: interfaz.
- `styles.css`: estilos adaptables a pantalla.
- `app.js`: cálculo, validación y tablas.
