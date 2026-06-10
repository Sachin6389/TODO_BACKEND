import express from 'express'
import cors from  'cors'
const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    
    
}))
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true,limit:"10mb"}));
app.use(express.static("Public"));
import userRoute from './Routes/user.route.js'
import taskRoute from './Routes/task.route.js'
app.use("/api/v1/users", userRoute)
app.use("/api/v1/tasks", taskRoute)

export default app