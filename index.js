import { initiateApp } from "./src/uitils/initiateApp.js";
import { config } from "dotenv";
config({path:'./config/dev.env'})

import express from 'express'
const app = express()



initiateApp(app,express)