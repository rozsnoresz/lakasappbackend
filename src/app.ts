import express, { Router } from "express";
import mongoose from "mongoose";
import IController from "./interfaces/controller_interface";
import cors from "cors";




export default class App {
    public app: express.Application;


    constructor(controllers: IController[]) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors());

        const port: number | any = process.env.PORT || 8001;
        console.log("port: ", port);
        this.connectToTheDatabase().then(() => {
            this.app.listen(port, () => {
                console.log('Server is running on port ' + port);
            });
        });

        controllers.forEach(controller => {
            this.app.use("/api", controller.router);
        });
    }

    private async connectToTheDatabase() {
        mongoose.set("strictQuery", true);
        try {
            console.log("Connecting to the database...");

            await mongoose.connect("mongodb+srv://admin:admin@lakasapp.8f6we5u.mongodb.net/?retryWrites=true&w=majority", { connectTimeoutMS: 10000 });
            console.log("Connected to the database!");

        } catch (error: any) {
            console.log({ message: "Nincs mongoszerver" });
        }

    }
}
