const router = require("express").Router();
const Product = require("../models/Product");
const { 
    isAuthenticated, 
    isAuthorized, 
    adminAuthorization
} = require('./middlewares')


//POST NEW PRODUCT
router.post("/", adminAuthorization, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});

//EDIT PRODUCT
router.put("/:productId", adminAuthorization, async (req, res) => {
    try {
        const editedProduct = await Product.findOneAndUpdate(
            req.params.productId,
            {$set: req.body},
            { new: true }
        );
        res.status(200).json(editedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});

//DELETE PRODUCT
router.delete("/:productId", adminAuthorization, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete({_id : req.params.productId});
        res.status(200).json({msg: "Product has been deleted...", deletedProduct});
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET ONE PRODUCT
router.get("/:productId", async (req, res) => {
    try {
        const product = await Product.findOne({_id : req.params.productId});
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const queryCategory = req.query.category
    try {
        let products;
        if (queryCategory) {
            products = await Product.find({
                categories: {
                    $in: [queryCategory]
                }
            }).sort({ createdAt: -1 })
        } else {
            products = await Product.find().sort({ createdAt: -1 })
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
