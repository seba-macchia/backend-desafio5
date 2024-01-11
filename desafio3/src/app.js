// Importa las promesas de 'fs' (sistema de archivos) y el framework 'express'.
const fs = require('fs').promises;
const express = require('express');

// Clase que gestiona productos y su persistencia en un archivo.
class ProductManager {
  constructor(filePath) {
    // Ruta del archivo donde se almacenarán los productos.
    this.path = filePath;
    // Último ID de producto utilizado.
    this.lastProductId = 0;
  }

  // Inicializa la instancia cargando productos desde el archivo o inicializa datos vacíos.
  async initialize() {
    try {
      // Lee el contenido del archivo.
      const data = await fs.readFile(this.path, 'utf8');
      // Parsea el contenido como JSON o asigna un array vacío si hay un error.
      this.products = JSON.parse(data) || [];
      // Calcula el último ID de producto.
      this.lastProductId = this.calculateLastId();
    } catch (error) {
      // En caso de error, inicializa con un array vacío y último ID en 0.
      this.products = [];
      this.lastProductId = 0;
    }
  }

  // Calcula el último ID de producto en base al array actual de productos.
  calculateLastId() {
    const lastProduct = this.products[this.products.length - 1];
    return lastProduct ? lastProduct.id : 0;
  }

  // Lee el contenido del archivo y lo parsea como JSON.
  async readFromFile() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // En caso de error, retorna null.
      return null;
    }
  }

  // Escribe el array de productos en el archivo en formato JSON.
  async writeToFile() {
    const data = JSON.stringify(this.products, null, 2);
    await fs.writeFile(this.path, data);
  }

  // Añade un nuevo producto al array y lo guarda en el archivo.
  async addProduct(product) {
    // Desestructura las propiedades del producto.
    const { title, description, price, thumbnail, code, stock } = product;

    // Verifica que todas las propiedades obligatorias estén presentes.
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    // Verifica si ya existe un producto con el mismo código.
    if (this.products.some(existingProduct => existingProduct.code === code)) {
      throw new Error("El código ya existe");
    }

    // Crea un nuevo producto con un ID único.
    const newProduct = {
      id: ++this.lastProductId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    // Agrega el nuevo producto al array y guarda en el archivo.
    this.products.push(newProduct);
    await this.writeToFile();
  }

  // Obtiene la lista de productos con un límite opcional.
  getProducts(limit) {
    return limit ? this.products.slice(0, limit) : this.products.slice();
  }

  // Obtiene un producto por su ID.
  async getProductById(id) {
    const product = this.products.find(product => product.id === id);
    // Lanza un error si el producto no existe.
    if (!product) {
      throw new Error("El producto no existe");
    }
    return product;
  }

  // Actualiza un producto por su ID.
  async updateProduct(id, updatedProduct) {
    const index = this.products.findIndex(product => product.id === id);
    // Lanza un error si el producto no existe.
    if (index === -1) {
      throw new Error("El producto no existe");
    }

    // Actualiza las propiedades del producto y guarda en el archivo.
    this.products[index] = { ...this.products[index], ...updatedProduct };
    await this.writeToFile();
  }

  // Elimina un producto por su ID.
  async deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    // Lanza un error si el producto no existe.
    if (index === -1) {
      throw new Error("El producto no existe");
    }

    // Elimina el producto del array y guarda en el archivo.
    this.products.splice(index, 1);
    await this.writeToFile();
  }
}

// Crea una instancia de Express.
const app = express();
// Puerto en el que se ejecutará el servidor.
const port = 8080;
// Crea una instancia de la clase ProductManager con un archivo específico.
const productManager = new ProductManager('../productos.json');

// Middleware para permitir a Express trabajar con datos en formato JSON.
app.use(express.json());

// Ruta para obtener la lista de productos.
app.get('/products', async (req, res) => {
  try {
    // Obtiene el límite de productos desde los parámetros de la solicitud.
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    // Inicializa la instancia de ProductManager y obtiene la lista de productos.
    await productManager.initialize();
    const products = productManager.getProducts(limit);
    // Envía la lista de productos como respuesta en formato JSON.
    res.json({ products });
  } catch (error) {
    // Maneja errores y responde con un código de estado 500 y el mensaje de error.
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener un producto por su ID.
app.get('/products/:pid', async (req, res) => {
  try {
    // Obtiene el ID del producto desde los parámetros de la solicitud.
    const productId = parseInt(req.params.pid);
    // Inicializa la instancia de ProductManager y obtiene el producto por ID.
    await productManager.initialize();
    const product = await productManager.getProductById(productId);
    // Envía el producto como respuesta en formato JSON.
    res.json({ product });
  } catch (error) {
    // Maneja errores y responde con un código de estado 404 y el mensaje de error.
    res.status(404).json({ error: error.message });
  }
});

// Inicia el servidor en el puerto especificado.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
