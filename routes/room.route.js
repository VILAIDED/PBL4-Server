const router = require('express').Router()
const {createRoom,getRoomByType} = require('../controller/room.controller')
const {verifyToken} = require('../controller/auth.controller')


router.route('/create').post(verifyToken,createRoom)
router.route('/roombytype/:type').get(getRoomByType)

module.exports = router