import mongoose  from "mongoose";
import { DB_NAME } from "../constant.js";

const connectedDB = async () => {
    try {
        const connectionResult = await mongoose.connect(`${process.env.MANGODB_URL}/${DB_NAME}`)
        console.log(`\n MangoDB connected !! `);
        
    } catch (error) {
        console.log("mangoDB connection faild",error);
        process.exit(1)
        
    }
    
}
export default connectedDB;