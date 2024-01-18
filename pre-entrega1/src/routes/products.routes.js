import { Router } from "express";
import { ProductManager } from "../models/productManager.js";

const productManager = new ProductManager("./products.json");

// CRUD PRODUCTOS

const routerProd = Router();

routerProd.get("/", async(req, res) => {
  try{
    const { limit } = req.query
    const products = await productManager.getProducts()
    if (limit){
      const limitProducts = products.slice(0, limit)
      return res.json(limitProducts)
    }
    return res.json(products)

  }catch (error){
      console.log(error)
      res.status(404).send('ERROR AL RECIBIR LOS PRODUCTOS')
    
  }
})

routerProd.get("/:pid", async(req, res) => {
  const { pid } = req.params
  try{
    const product = await productManager.getProductsById(pid)
    if (product){
      return res.json(product)
    }
    return res.send({ error: "Producto no encontrado" })
  }catch(error){
    console.log(error)
    res.status(404).send(`ERROR AL RECIBIR EL PRODUCTO CON ID ${pid}`)
  }
})

routerProd.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status = true,
      category
    } = req.body;

    // Enviar un objeto con las propiedades requeridas al método addProduct
    const respuesta = await productManager.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category
    });

    res.status(200).json(respuesta);
  } catch (error) {
    console.log(error);
    res.status(404).send('ERROR AL AGREGAR PRODUCTO');
  }
});

routerProd.put("/:pid", async(req, res) => {
  const { pid } = req.params;
  try {
    const { title, description, price, thumbnail, code, stock, status = true, category } = req.body;
    const respuesta = await productManager.updateProduct(pid, { title, description, price, thumbnail, code, stock, status, category });
    res.status(200).json(respuesta);
  } catch (error) {
    console.log(error);
    res.status(404).send(`ERROR AL EDITAR EL PRODUCTO CON ID ${pid}`);
  }
});

routerProd.delete("/:pid", async(req, res) => {
  const { pid } = req.params
  try{
      await productManager.deleteProduct(pid)
  
      res.status(200).send("PRODUCTO ELIMINADO")
  }catch (error){
    console.log(error)
    res.status(404).send({ error: `ERROR AL ELIMINAR EL PRODUCTOCON ID ${pid}` })
  }
})


export { routerProd };