class ProductManager {
  constructor() {
    this.productsList = [];
    this.lastProductId = 0;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.productsList.some(product => product.code === code)) {
      throw new Error("El código ya existe");
    }

    const newProduct = {
      id: ++this.lastProductId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.productsList.push(newProduct);
  }

  getProducts() {
    return this.productsList;
  }

  getProductById(id) {
    const product = this.productsList.find(product => product.id === id);
    if (!product) {
      throw new Error("Not found");
    }
    return product;
  }
}

// Pruebas
const productManager = new ProductManager();

// Prueba 1
console.log("Prueba 1:");
console.log("Productos iniciales:", productManager.getProducts());

// Prueba 2
console.log("\nPrueba 2:");
productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log("Productos después de agregar uno:", productManager.getProducts());

// Prueba 3
console.log("\nPrueba 3:");
try {
  productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
} catch (error) {
  console.error(error.message);
}

// Prueba 4
console.log("\nPrueba 4:");
try {
  const foundProduct = productManager.getProductById(1);
  console.log("Producto encontrado por ID:", foundProduct);
} catch (error) {
  console.error(error.message);
}

// Prueba 5
console.log("\nPrueba 5:");
try {
  const notFoundProduct = productManager.getProductById(999);
  console.log("Producto encontrado por ID:", notFoundProduct);
} catch (error) {
  console.error(error.message);
}
