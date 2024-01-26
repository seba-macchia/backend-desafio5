const express = require('express')
const handlebars = require('express-handlebars')
const homeRouter = require('./routes/home.routes')
const realTimeProductsRouter = require('./routes/realTimeProducts.routes')
const path = require('path')
const http = require('http')
const {Server} = require('socket.io')
const app = express()
const ProductManager = require('./src/models/productManager')

const productManager = new ProductManager('./products.json')

const PORT = 8080 || process.env.PORT

// SERVER HTTP
const server = http.createServer(app);

// PUBLIC 
app.use(express.static(__dirname + '/public'))

// ENGINE (Motor de plantillas)
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, "/views"))

//ROUTES
app.use('/home', homeRouter);
app.use('/realTimeProducts', realTimeProductsRouter);


// SOCKET SERVER
const io = new Server(server)
io.on('connection', (socket) =>{
    console.log(`Nuevo cliente conectado ${socket.id}`)

  socket.on("getProducts", async () => {
    try {
      const products = await productManager.getProducts();
      socket.emit("productsData", products);
    } catch (error) {
      console.error("Error al obtener productos:", error.message);
    }
  });

  socket.on("new-product", async (data) => {
    try{
      await productManager.addProduct(data);
      const arrProducts = await productManager.getProducts();
      socket.emit("all-products", arrProducts);
    }
    catch (error) {
      console.error("Error al agregar producto:", error.message);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      productManager.deleteProduct(productId);
      socket.emit("productDeleted", productId);
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
  }
});
});

server.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`)
})