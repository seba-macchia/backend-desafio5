const fs = require('fs/promises')
const crypto = require('crypto');

class ProductManager {
  constructor() {
    this.products = [];
    this.path = 'products.json';
  }

  getProducts = async () => {
    try {
      const products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
      return products;
    } catch (error) {
      return [];
    }
  }

  getProductsById = async (id) => {
    const products = await this.getProducts();
    const product = products.find(product => product.id === id);
    if (product){
      return product;
    }else{
      console.log('Producto no encontrado');
    }
  }

  addProduct = async ({title, description, price, thumbnail, code, stock, status, category}) => {
    const id =  crypto.randomBytes(16).toString('hex');
    const newProduct = {id, title, description, price, thumbnail, code, stock, status, category};
    
    this.products = await this.getProducts()
    this.products.push(newProduct)

    await fs.writeFile(this.path, JSON.stringify(this.products));

    return newProduct;
  }

  updateProduct = async (id, {... data}) => {
    const products = await this.getProducts();
    const index = products.findIndex(product => product.id === id)
    if (index !== -1){
      products[index] = {id, ... data}
      await fs.writeFile(this.path, JSON.stringify(products));
      return products[index];
    }
    else{
      console.log('Producto no encontrado');
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex(product => product.id === id)
    if (index !== -1){
      products.splice(index, 1);
      await fs.writeFile(this.path, JSON.stringify(products));
    }
    else{
      console.log('Producto no encontrado')
    }
  }
}

module.exports = ProductManager