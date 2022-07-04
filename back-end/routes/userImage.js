let express = require('express')
let mongoose = require('mongoose');
let router = express.Router();
let multer = require('multer');
const UserImage = require('../models/UserImage');


//post new image

//multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../front-end/public/images');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
}
});

router.post('/upload/:userId', multer({ storage: storage }).single('picture'), async (req, res) => {
    try { 
    await UserImage.findOneAndDelete({userId: req.params.userId})
    const newImage = new UserImage({
        userId: req.params.userId,
        path: req.file.filename
    })
    const savedImage = await newImage.save()
    res.status(201).json({msg: "image Uploaded", savedImage})
    } catch (error) {
        console.log('Server error: image not uploaded:', error.message)
    }  
})

//GET USER IMAGE
router.get("/:userId", async (req, res) => {
    try {
        const image = await UserImage.findOne({ userId: req.params.userId });
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL USERS IMAGES
router.get("/", async (req, res) => {
    try {
        const images = await UserImage.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json(error);
    }
});


// delete image
router.delete('/delete/:imageId', async (req, res) => {
    const  _id  = req.params.imageId;
    try {
    const image = await UserImage.findOneAndDelete({ _id });
    res.status(200).json({ msg: "image deleted", image });
    } catch (error) {
        console.log('image not deleted',error);
    }
});


module.exports = router;