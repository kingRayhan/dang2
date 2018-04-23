const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');


router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.get('/store/:slug', catchErrors(storeController.getStore));

router.post('/add', 
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStroe),
); // create new store
router.get('/stores/:id/edit', catchErrors(storeController.editStroe)); // Edit Page


router.post('/add/:id', 
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStroe)
); // update a store


module.exports = router;