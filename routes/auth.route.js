const router = require('express').Router()
const User = require('../model/user')
const {register,signin,logined,verifyToken,editProfile, userChangePassword,uploadImageProfile} = require('../controller/auth.controller')
const imageUpload = require('../middlewares/uploadImage')

router.route('/register').post(register);
router.route('/login').post(signin);
router.route('/logined').get(verifyToken,logined);
router.route('/editprofile').put(verifyToken,editProfile)
router.route('/changepassword').put(verifyToken,userChangePassword)
router.route('/uploadprofile').put([imageUpload.single("profile"),verifyToken],uploadImageProfile);
router.get('/',async (req,res)=>{
    const users = await User.find();
    return res.status(200).json(users)
})

module.exports = router;