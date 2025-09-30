const express = require('express')
const router = express.Router()
const orderController = require('../controller/orderContoller')


router.post('/', orderController.createOrder)
router.get('/', orderController.getCurrentOrder)



module.exports = router