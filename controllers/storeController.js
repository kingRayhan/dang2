const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const uuid = require('uuid');
const jimp = require('jimp');
const multerOptions = {
    storage: multer.memoryStorage(),
    filfilter(req,file,next)
    {
        const isPhoto = file.mimetype.startsWith('images/');
        if(isPhoto)
        {
            next(null,true);
        }else{
            next({
                message: 'That file type is not allowed'
            } , false);
        }
    }
}
exports.upload = multer(multerOptions).single('photo');
exports.resize = async (req, res, next) => {
    // check if there is no new file to resize
    if (!req.file) {
      next(); // skip to the next middleware
      return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    // now we resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // once we have written the photo to our filesystem, keep going!
    next();
  };


exports.homePage = (req,res) => {
    res.render('index');
}

exports.addStore = (req,res) => {
    res.render('editStore' , { title: 'Add Store'  });
}
exports.createStroe = async (req,res) => {
    const store = new Store(req.body);
    await store.save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect('/');
}
exports.getStores = async (req,res) => {
    const stores = await Store.find();
    res.render('stores', { title: 'Stores' , stores });
}
exports.editStroe = async (req,res) => {
    const id = req.params.id;
    const store = await Store.findOne({_id: id});
    res.render('editStore', { title: `Edit ${store.name}` , store });
}
exports.updateStroe = async (req,res) => {
    const store = await Store.findOneAndUpdate({_id: req.params.id} , req.body , {
        new: true,
        runValidators: true
    }).exec();
    req.flash('success' , `Successfully updated <strong>${store.name}</strong> <a href="/store/${store.slug}/">view Store →</a>`);
    res.redirect(`/stores/${store._id}/edit`);
}


exports.getStore = async (req,res,next) => {
    const store = await Store.findOne({ slug: req.params.slug });
    if(!store) return next();
    
    res.render('store' , { title: store.name , store });
}