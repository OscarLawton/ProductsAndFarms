const express = require('express');
var bodyParser = require('body-parser')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Product = require('./models/product');
const Farm = require('./models/farm')
const categories = ['fruit', 'vegetable', 'dairy']


mongoose.connect('mongodb://localhost:27017/farmStandTake2', {useNewUrlParser: true})
    .then(() => {
        console.log("Mongo Connected!")
    })
    .catch(err => {
        console.log("Could not connect to Mongo.")
        console.log(err);
    })

app.set('views', path.join(__dirname, 'views'));
app.set ('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    const farms = await Farm.find({})
    res.render('farm/index', { farms })
})

// Farm Routes
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({})
    res.render('farm/index', { farms })
})

app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate('products')
    res.render('farm/show', { farm })
})

app.get('/farm/new', (req, res) => {
    res.render('farm/new')
})

app.post('/farm', async (req, res) => {
    const newFarm = new Farm(req.body)
    await newFarm.save()
    res.redirect('farms')
})

app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params
    const farm = await Farm.findById(id)
    res.render('products/new', { categories, id, farm})
})

app.post('/farms/:id/products', async (req, res) => {
    console.log('hello 1')
    const { id } = req.params
    const farm = await Farm.findById(id)
    const { name, price, category } = req.body
    const product = new Product({ name, price, category})
    farm.products.push(product)
    product.farm = farm
    await farm.save()
    await product.save()
    res.redirect(`/farms/${id}`)
})

app.delete('/farms/:id', async (req, res) => {
    console.log("DELETING")
    const farm = await Farm.findByIdAndDelete(req.params.id)
    res.redirect('/farms')
})

// Product Routes

app.get('/products', async (req, res) => {
    const {category} = req.query;
    if(category){
        const products = await Product.find({ category }).populate('farm', 'name');
        /* for(var x = 0; x < products.length; x++){
            console.log(products[x])
        } */
        products.forEach((product) => {
            console.log(product)
        })
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({}).populate('farm', 'name')
        /* for(var x = 0; x < products.length; x++){
            console.log(products[x])
        } */
        for(let product of products){
            console.log(product.farm.name)
        }
        res.render('products/index', {products, category: "All"});
    }   
});

app.get('/products/new', (req, res) => {
    res.render('products/new');
});

app.get('/products/:id/edit', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product })
});

app.post('/products', async (req, res) => {
    const newProduct = await new Product(req.body);
    await newProduct.save();
    res.redirect('/products')
    //res.redirect('products/',new)
});

app.put('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body,{runValidators: true, new: true});
    res.redirect('/products/'+product._id)
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('farm', 'name')
    res.render('products/show', { product });
});

app.delete('/products/:id', async (req, res) => {
    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
});

app.listen(3000, () => {
    console.log("It's alive!!!!!!!");
});

