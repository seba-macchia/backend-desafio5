import {promises as fs} from 'fs';
import { v4 as uuidv4 } from 'uuid';



export class CartManager {
  constructor() {
    this.carts = [];
    this.path = 'cart.json';
  }

  getCarts = async () => {
    const carts = await fs.readFile(this.path, 'utf-8');
    const cartsJson = JSON.parse(carts)
    return cartsJson ;
    }
    
  getCartsProducts = async (id) => {
    const carts = await this.getCarts();
    const cart = carts.find(cart => cart.id === id);

    if (cart) {
      return cart.productos;
    } else {
      console.log('Carrito no encontrado');
    }

  }
  addCart = async () => {
    const id = uuidv4();
    const NewCart = {
      id,
      productos: [],
    };
    this.carts = await this.getCarts()
    this.carts.push(NewCart);

    await fs.writeFile(this.path, JSON.stringify(this.carts));
    return NewCart;
  }

  addProductToCart = async (cartId, productId) => {
    try {
      const carts = await this.getCarts();
      const index = carts.findIndex(cart => cart.id === cartId);
  
      if (index !== -1) {
        const cartProducts = await this.getCartsProducts(cartId);
        const existingProductIndex = cartProducts.findIndex(product => product.productId === productId);
  
        if (existingProductIndex !== -1) {
          // Incrementar la cantidad del producto existente
          cartProducts[existingProductIndex].quantity += 1;
        } else {
          // Agregar un nuevo producto al carrito con cantidad 1
          cartProducts.push({ productId, quantity: 1 });
        }
  
        // Utilizar la propiedad 'productos' y no dejar el array vacío
        carts[index].productos = cartProducts;
  
        // Escribir en el archivo
        await fs.writeFile(this.path, JSON.stringify(carts));
        console.log('Producto agregado con éxito');
      } else {
        console.log('Carrito no encontrado');
      }
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  }
  
  

}

export default CartManager;