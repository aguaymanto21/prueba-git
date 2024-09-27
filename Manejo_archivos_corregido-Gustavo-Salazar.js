const fs = require('fs'); //Especificamos Node.js

class ProductManager {
    constructor(path, products = []) {
        this.idCounter = 1;
        this.path = path;
        // Intentamos leer el archivo JSON en el constructor.
        try {
            this.products = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        } catch (error) {
            // Si el archivo no existe o contiene datos no válidos,
            // 'this.products' se inicializa con 'products' (un array vacío por defecto).
            this.products = products;
        }
    }

    //Creamos funcion para agregar los productos
    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Todos los campos son obligatorios');
            return;
        }
    //Si encontramos el producto imprimimos la situacion 'Ya existe'
        if (this.getProductByCode(code)) {
            console.log(`Ya existe un producto con el código ${code}`);
            return;
        }

    //Objeto producto con Autoincremento en ID y demas caracteristcas

        const product = {
            id: this.idCounter++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
    //Agregamos el producto en la matriz de objetos
        this.products.push(product);
        this.saveProducts();
        console.log('Producto agregado correctamente');
    }

    //Creamos funcion actualziar producto si no encontramos el producto con su ID procedemos a enviar mensaje de alerta
    updateProduct(id, updatedProduct) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex < 0) {
            console.log(`Producto con el id ${id} no encontrado`);
            return;
        }

        const product = this.products[productIndex];
        this.products[productIndex] = {...product, ...updatedProduct, id}; 
        this.saveProducts();
        console.log('Producto actualizado correctamente');
    }
    
    //Funcion eliminar producto igualmente debemos encontrar el producto por su ID 
    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex < 0) {
            console.log(`Producto con el id ${id} no encontrado`);
            return;
        }

        this.products.splice(productIndex, 1);
        this.saveProducts();
        console.log('Producto eliminado correctamente');
    }
    
    //La funcion obtener porducto por codigo usa la funcion find para obtener el codigo de manera estricta ===
    getProductByCode(code) {
        return this.products.find((product) => product.code === code);
    }

    //Funcion para obtener el producto por ID
    getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        if (!product) {
            console.log('NOT FOUND');
        }
        return product;
    }
    //Funcion para retornar los productos
    getProducts() {
        return this.products;
    }
    //Funcion para guardar los productos en formato JSON
    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products));
    }
}

//Leemos el archivo antes de trabajar con los productos  despues de definir la clase
const productManager = new ProductManager('./products.json');

console.log(productManager.getProducts()); // Inicializamos todo con los productos leídos del archivo JSON

productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
console.log(productManager.getProducts()); // Agregamos el producto de Prueba

try {
    productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
} catch (error) {
    console.error(error); // Code already exists
}

//Pruebas

console.log(productManager.getProductById(1)); // Probamos buscando producto por Id del producto prueba
console.log(productManager.getProductById(2)); // Probamos buscando producto por Id que no existe

productManager.updateProduct(1, {title: 'producto actualizado', description: 'Prueba de producto actualizado', price: 300, thumbnail: 'Sin imagen', code: 'abc123', stock:30});
console.log(productManager.getProductById(1)); // Imprimimos el producto con id 1 después de ser actualizado

productManager.deleteProduct(1);
console.log(productManager.getProducts()); // Imprimimos la lista de productos después de eliminar el producto con id 1
