import express from "express";
import {ProductManager} from "./models/productManager.js"
import {CartManager} from "./models/cartManager.js"
import { routerProd } from "./routes/products.routes.js";
import { routerCart } from "./routes/carts.routes.js";


const PORT = 8080

const app = express()

export const productManager = new ProductManager;
export const cartManager = new CartManager;


// Middlewares

app.use(express.json()) // permitir enviar y recibir archivos JSON
app.use(express.urlencoded({extended: true})) // permitir extensiones en la url

// Routes
app.use('/api/products', routerProd)
app.use('/api/carts', routerCart)



app.listen(PORT, (req, res) =>{
  console.log(`Server corriendo en el puerto ${PORT}`)
})