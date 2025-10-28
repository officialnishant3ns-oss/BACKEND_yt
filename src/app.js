import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors({    //for set of cors
    origin:process.env.CORS_ORIGIN ,
    Credential:true
}))
app.use(express.json({  //data from form
    limit:"16kb"
}))
app.use( express.urlencoded({  //data from url
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public"))  //public static for public
app.use(cookieParser())


//routes import
import userrouter from '../src/Routes/user.routes.js'

//routes declaration
app.use('api/v1/user',userrouter)

export  { app } 