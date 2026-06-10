import{Router}  from 'express'
import {  createTask,
    getTasks,
    updateTask,
    deleteTask,
    updatestatus,
    singletask} from '../Controlers/Task.controler.js'
import { verifyjwt } from '../MiddleWare/auth.middleware.js'
   

   
const router= Router()
router.route("/creatasks").post( verifyjwt, createTask)
router.route("/alltasks").get( verifyjwt, getTasks)
router.route("/updatetasks").put(verifyjwt, updateTask)
router.route("/deletetasks").delete(verifyjwt, deleteTask)
router.route("/updatestatus").post(verifyjwt, updatestatus)
router.route("/task/:id").get(verifyjwt, singletask)


export default router