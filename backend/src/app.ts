import express from "express";
import bodyParser from "body-parser";
import slotsRouter from "./routes/slots.js";
import weekRouter from "./routes/week.js";
import cors from "cors";

const app = express();

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(bodyParser.json());
app.use(cors(
    {   
        origin: allowedOrigin,
        credentials: true, 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], 
        allowedHeaders: ['Content-Type'] 
    }
));

app.use("/slots", slotsRouter);
app.use("/week", weekRouter);


export default app;
