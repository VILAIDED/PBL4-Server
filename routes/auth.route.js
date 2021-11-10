const router = require('express').Router()
const User = require('../model/user')
const {register,signin,logined,verifyToken} = require('../controller/auth.controller')


router.route('/register').post(register);
router.route('/login').post(signin);
router.route('/logined').get(verifyToken,logined);
router.get('/',async (req,res)=>{
    const users = await User.find();
    return res.status(200).json(users)
})

module.exports = router;