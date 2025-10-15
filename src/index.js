// require('dotenv').config({path:'./env'})

import dotenv from "dotenv"
import connectdb from "./DB/index.js"

dotenv.config({
    path:'./env'
})
connectdb()








/*
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

            app.listen(process.env.PORT, () => {
                console.log(`App listening on server at the ${process.env.PORT}`)
            })

        } catch (error){
            console.error("ERROR:", error)
            throw error

        }
    })()
*/
