class GestorProductos {
  constructor() {
    this.listaProductos = [];
    this.ultimoIdProducto = 0;
  }

  agregarProducto(nombre, descripcion, precio, imagen, codigo, stock) {
    const nuevoProducto = {
      id: ++this.ultimoIdProducto,
      nombre,
      descripcion,
      precio,
      imagen,
      codigo,
      stock,
    };

    const productoExistente = this.listaProductos.find(producto => producto.codigo === codigo);
    if (productoExistente) {
      throw new Error("El código ya existe");
    }

    if (!nombre || !descripcion || !precio || !imagen || !codigo || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    this.listaProductos.push(nuevoProducto);
  }

  obtenerProductos() {
    return this.listaProductos;
  }

  obtenerProductoPorId(id) {
    const producto = this.listaProductos.find(producto => producto.id === id);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    return producto;
  }
}

// Pruebas
const gestorProductos = new GestorProductos();

// Prueba 1
console.log("Prueba 1:");
console.log("Productos iniciales:", gestorProductos.obtenerProductos());

// Prueba 2
console.log("\nPrueba 2:");
gestorProductos.agregarProducto("Producto 1", "Descripción del producto 1", 100, "Imagen 1", "abc123", 20);
console.log("Productos después de agregar uno:", gestorProductos.obtenerProductos());

// Prueba 3
console.log("\nPrueba 3:");
try {
  gestorProductos.agregarProducto("Producto 2", "Descripción del producto 2", 150, "Imagen 2", "abc123", 25);
} catch (error) {
  console.error(error.message);
}

// Prueba 4
console.log("\nPrueba 4:");
try {
  const productoEncontrado = gestorProductos.obtenerProductoPorId(1);
  console.log("Producto encontrado por ID:", productoEncontrado);
} catch (error) {
  console.error(error.message);
}

// Prueba 5
console.log("\nPrueba 5:");
try {
  const productoNoEncontrado = gestorProductos.obtenerProductoPorId(999);
  console.log("Producto encontrado por ID:", productoNoEncontrado);
} catch (error) {
  console.error(error.message);
}
