import express from "express";
import bodyParser from "body-parser";
import slotsRouter from "./routes/slots.js";
import weekRouter from "./routes/week.js";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors(
    {   
        origin: 'http://localhost:5173',
        credentials: true, 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], 
        allowedHeaders: ['Content-Type'] 
    }
));

app.use("/slots", slotsRouter);
app.use("/week", weekRouter);


export default app;
