const fs = require('fs').promises;


class Contenedor {
    constructor(file) {
        this.file = file;
    
        
    }

    

    async save(product) {
        const array = await this.getAll();
        array.push(product);
        await fs.writeFile(this.file, JSON.stringify(array, null, 2));
        return product.id;
    }

    async getById(id) {
        const array = await this.getAll();
        return array.find(el => el.id == id);
    }

    async getAll() {
        try {
            const content = await fs.readFile(this.file, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            await fs.writeFile(this.file, JSON.stringify([], null, 2));
            return [];
        }
    }
}

const express = require('express');
const app = express();

const productsFile = './productos.txt';
const prodContainer = new Contenedor(productsFile);

app.get('/productos', async (req, res) => {
    const prods = await prodContainer.getAll();
    res.send(prods);
});

app.get('/productoRandom', async (req, res) => {
    const prods = await prodContainer.getAll();
    const i = Math.floor(Math.random() * prods.length);
    res.send(prods[i]);
});

const productos = [
    {
        "title": "Escuadra",
        "price": 123.45,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"
    },
    {
         "title": "Calculadora",
         "price": 234.56,
         "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png"
    },
    {
        "title": "Globo Terráqueo",
        "price": 345.67,
        "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"
    }
]

productos.forEach(producto => prodContainer.save(producto));


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
