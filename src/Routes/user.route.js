import{Router}  from 'express'
import { registerUser } from '../Controlers/User.controler.js'
import { LogoutUser } from '../Controlers/User.controler.js'
import { loginuser } from '../Controlers/User.controler.js'
import { verifyjwt } from '../MiddleWare/auth.middleware.js'
import{refreshAccessToken,
   changePassword,} 
   from '../Controlers/User.controler.js'
   

   
const router= Router()
router.route("/register").post( registerUser)
router.route("/Login").post(loginuser)
router.route("/Logout").post(verifyjwt,LogoutUser)
router.route("/refresh_token").post(refreshAccessToken)
router.route("/changed-password").post(verifyjwt,changePassword)


export default router