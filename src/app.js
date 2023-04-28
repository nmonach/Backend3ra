import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`Server ok en puerto: ${PORT}`);
});
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productManager = new ProductManager('./products.json');//instanciamos la clase para tener acceso los metodos que tenemos en la clase ProductManager

app.get('/products', async(req, res) => {
        const {limit} = req.query
    try {
        const products = await productManager.getAllProducts(parseInt(limit));
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
});

app.get('/products/:pid', async(req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(parseInt(pid));
        if(product){
            res.status(200).json({ message: 'Product found', product })
        } else {
            res.status(404).send('Product not found')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.post('/products', async (req, res)=>{
    try {
        console.log(req.body);
        const product = req.body;
        const newProduct = await productManager.createProduct(product);
        res.json(newProduct);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.put('/products/:id', async(req, res) => {
    try {
        const product = req.body;
        const { id } = req.params;
        const productFile = await productManager.getProductById(parseInt(id));
        if(productFile){
            await productManager.updateProduct(product, parseInt(id));
            res.send(`Product updated`);
        } else {
            res.status(404).send('Product not found')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
});

app.delete('/products/:id', async(req, res)=>{
    try {
        const { id } = req.params;
        const products = await productManager.getAllProducts();
        if(products.length > 0){
            await productManager.deleteProductById(parseInt(id));
            res.send(`Product id: ${id} deleted`);
        } else {
            res.send(`Product id: ${id} not found`);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
});

app.delete('/products', async(req, res)=>{
    try {
        await productManager.deleteAllProducts();
        res.send('All products deleted')
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
})


