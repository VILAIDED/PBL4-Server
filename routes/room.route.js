const router = require('express').Router()
const {createRoom,getRoomByType,getAllRoom,setSpeaker,addUserToRoom} = require('../controller/room.controller')
const {verifyToken} = require('../controller/auth.controller')

router.route('/create').post(verifyToken,createRoom)
router.route('/roombytype/:type').get(getRoomByType)
router.route('/').get(getAllRoom);
router.route('/speaker/:roomId').put(setSpeaker);
router.route('/adduser/:roomId').put(addUserToRoom);
module.exports = router