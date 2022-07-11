let express = require('express')
let router = express.Router();
let multer = require('multer');
const ProductImage = require('../models/ProductImage');
const storage = require('../utils/multerConfig')


//POST NEW PRODUCT IMAGE
router.post('/upload/:productId', multer({ storage: storage }).single('picture'), async (req, res) => {
    try { 
    await ProductImage.findOneAndDelete({productId: req.params.productId})
    const newImage = new ProductImage({
        productId: req.params.productId,
        path: req.file.filename
    })
    const savedImage = await newImage.save()
    res.status(201).json({msg: "image Uploaded", savedImage})
    } catch (error) {
        console.log('Server error: image not uploaded:', error.message)
    }  
})

//GET PRODUCT IMAGE
router.get("/:productId", async (req, res) => {
    try {
        const image = await ProductImage.findOne({ productId: req.params.productId });
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL PRODUCT IMAGES
router.get("/", async (req, res) => {
    try {
        const images = await ProductImage.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json(error);
    }
});


// delete image
router.delete('/delete/:imageId', async (req, res) => {
    const  _id  = req.params.imageId;
    try {
    const image = await ProductImage.findOneAndDelete({ _id });
    res.status(200).json({ msg: "image deleted", image });
    } catch (error) {
        console.log('image not deleted',error);
    }
});


module.exports = router;