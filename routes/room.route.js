const router = require('express').Router()
const {createRoom,getRoomByType,getAllRoom} = require('../controller/room.controller')
const {verifyToken} = require('../controller/auth.controller')


router.route('/create').post(verifyToken,createRoom)
router.route('/roombytype/:type').get(getRoomByType)
router.route('/').get(getAllRoom);

module.exports = router