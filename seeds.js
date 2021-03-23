const mongoose = require('mongoose');

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true})
    .then(() => {
        console.log("Mongo Connected!")
    })
    .catch(err => {
        console.log("Could not connect to Mongo.")
        console.log(err);
    })

/* const p = new Product({
    name: 'Ruby Grapefruit',
    price: 1.99,
    category: 'fruit'
})

p.save().then(p => {
    console.log(p);
}).catch(e => {
    console.log(e);
});
 */

 const seedProducts = [
    {
        name: 'Lemon Squash',
        price: 2.99,
        category: 'fruit'
    },
    {
        name: 'Rasbary Squeez',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Carrots',
        price: 1.99,
        category: 'vegetable'
    },
    {
        name: 'Goat Cheese',
        price: 1.99,
        category: 'dairy'
    }
 ]

 Product.insertMany(seedProducts)
 .then(res => {
    console.log(res)
 }).catch(e => {
    console.log(e)
 });
