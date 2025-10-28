// require('dotenv').config({path:'./env'})


import { app } from './app.js'

// database connection there
import connectdb from "./DB/index.js"
import dotenv from "dotenv"
 dotenv.config({
    path: './env'
})
connectdb()

    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is ready at ${process.env.PORT}`);
        });
        app.on("error", (error) => {
            console.error("ERRORR:", error)
            throw error
        })
    })
    .catch((error) => {
        console.log("mongo DB connection failed", error);
    });
    
    app.get('/api/v1',(req,res)=>{
        res.send('hello sir')
    })
    
/* in this particular file that goiing to be stored ; ;   ;
           import mongoose, { connect } from "mongoose";
          import { DB_NAME } from "./constants";
    import express from "express"
    const app = express()
    (async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
            app.on("error", (error) => {
                console.error("ERRORR:", error)
                throw error
            })

            app.listen(process.env.PORT, () => {  //ye try me lete hai
                console.log(`App listening on server at the ${process.env.PORT}`)
            })

        } catch (error){
            console.error("ERROR:", error)
            throw error

        }
    })()
*/
