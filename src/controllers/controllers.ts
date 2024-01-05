import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller_interface";
import mongoose from "mongoose";
import datasModel from "../models/datas.model";
import houseModel from "../models/house.model";


export default class UserController implements Controller {
  public router = Router();
  public datas = datasModel;
  public house = houseModel;

  constructor() {
    this.router.post("/house", (req, res, next) => {
      this.createHouse(req, res).catch(next);
    });

    this.router.get("/houses", (req, res, next) => {
      this.getHouses(req, res).catch(next);
    });

    this.router.get("/house/:id", (req, res, next) => {
      this.getHouseById(req, res).catch(next);
    });

    this.router.put("/house/:id", (req, res, next) => {
      this.putHouse(req, res).catch(next);
    });

    this.router.delete("/house/:id", (req, res, next) => {
      this.deleteHouse(req, res).catch(next);
    });

    this.router.get("/payment/:id", (req, res, next) => {
      this.getPaymentById(req, res).catch(next);
    });

    this.router.get("/using/:id", (req, res, next) => {
      this.getUsingById(req, res).catch(next);
    });

    this.router.post("/datas", (req, res, next) => {
      this.createDatas(req, res).catch(next);
    });

    this.router.put("/payment-add/:id", (req, res, next) => {
      this.addPayment(req, res).catch(next);
    });

    this.router.put("/using-add/:id", (req, res, next) => {
      this.addUsing(req, res).catch(next);
    });

    this.router.put("/payment/:id", (req, res, next) => {
      this.putPayment(req, res).catch(next);
    });

    this.router.put("/using/:id", (req, res, next) => {
      this.putUsing(req, res).catch(next);
    });





  }

  private createHouse = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const createdDocument = new this.house({
        ...body
      });
      createdDocument["_id"] = new mongoose.Types.ObjectId();
      const savedDocument = await createdDocument.save();
      res.send({ new: savedDocument, message: "OK" });
    } catch (error: any | Error) {
      res.status(400).send({ message: error.message });
    }
  };

  private getHouses = async (req: Request, res: Response) => {
    try {
      const data = await this.house.find();

      if (data.length > 0) {
        res.send(data);
      } else {
        res.status(404).send({ message: `Házak nem találhatóak!` });
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  };

  private getHouseById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data = await this.house.findById(id);
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({ message: `Nincs ház!` });
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  private putHouse = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const body = req.body;
      const modificationResult = await this.house.replaceOne({ _id: id }, body, { runValidators: true });
      if (modificationResult.modifiedCount) {
        res.send({ message: `OK` });
      } else {
        res.status(404).send({ message: `Felhasználó a(z) ${id} azonosítóval nem található!` });
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  };

  private deleteHouse = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updatedDoc = await this.house.findById(id);
      if (updatedDoc) {
        const modificationResult = await this.house.deleteOne({ _id: id });
        if (modificationResult.deletedCount) {
          res.send({ message: `OK` });
        } else {
          res.status(404).send({ message: `Ház a(z) ${id} azonosítóval nem található!` });
        }
      } else {
        res.status(404).send({ message: `Ház a(z) ${id} azonosítóval nem található!` });
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  };

  private getPaymentById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const type = req.query.type;
      const year = req.query.year;
      const data = await this.datas.findById(id);
      if (data) {
        res.send(data.payment.filter((payment: any) => payment.type == type && payment.year == year));
      } else {
        res.status(404).send({ message: `Nincs ház!` });
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  private getUsingById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const type = req.query.type;
      const year = req.query.year;
      const data = await this.datas.findById(id);
      if (data) {
        res.send(data.using.filter((using: any) => using.type == type && using.year == year));
      } else {
        res.status(404).send({ message: `Nincs ház!` });
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  }

  private createDatas = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const createdDocument = new this.datas({
        ...body
      });
      createdDocument["_id"] = new mongoose.Types.ObjectId();
      const savedDocument = await createdDocument.save();
      res.send({ new: savedDocument, message: "OK" });
    } catch (error: any | Error) {
      res.status(400).send({ message: error.message });
    }
  };

  private addPayment = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const type = req.query.type;
      const year = req.query.year;
      const modificationData: any = await this.datas.findById(id);
      const body = req.body;
      if(!modificationData) {
        res.status(404).send({ message: `Ház a(z) ${id} azonosítóval nem található!` });
        return {};
      }
      modificationData.payment.filter((payment: any) => payment.type == type).data.filter((data: any) => data.year == year).month.push(body);
      const modificationResult = await this.house.replaceOne({ _id: id }, modificationData, { runValidators: true });
      if (modificationResult.modifiedCount) {
        res.send({ message: `OK` });
      } else {
        res.status(404).send({ message: `Ház a(z) ${id} azonosítóval nem található!` });
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  };

  private addUsing = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const type = req.query.type;
      const year = req.query.year;
      const modificationData: any = await this.datas.findById(id);
      const body = req.body;
      if(!modificationData) {
        res.status(404).send({ message: `Ház a(z) ${id} azonosítóval nem található!` });
        return {};
      }
      modificationData.using.filter((using: any) => using.type == type).data.filter((data: any) => data.year == year).month.push(body);
      const modificationResult = await this.house.replaceOne({ _id: id }, modificationData, { runValidators: true });
      if (modificationResult.modifiedCount) {
        res.send({ message: `OK` });
      } else {
        res.status(404).send({ message: `Ház a(z) ${id} azonosítóval nem található!` });
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  };

  private putPayment = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const type = req.query.type;
      const year = req.query.year;
      const modificationData: any = await this.datas.findById(id);
      const body = req.body;
      if(!modificationData) {
        res.status(404).send({ message: `Ház a(z) ${id} azonosítóval nem található!` });
        return {};
      }
      modificationData.payment.filter((payment: any) => payment.type == type).data.filter((data: any) => data.year == year).month.filter((month: any) => month.month == body.month).payment = body.payment;
      const modificationResult = await this.house.replaceOne({ _id: id }, modificationData, { runValidators: true });
      if (modificationResult.modifiedCount) {
        res.send({ message: `OK` });
      } else {
        res.status(404).send({ message: `Ház a(z) ${id} azonosítóval nem található!` });
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  };

  private putUsing = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const type = req.query.type;
      const year = req.query.year;
      const modificationData: any = await this.datas.findById(id);
      const body = req.body;
      if(!modificationData) {
        res.status(404).send({ message: `Ház a(z) ${id} azonosítóval nem található!` });
        return {};
      }
      modificationData.using.filter((using: any) => using.type == type).data.filter((data: any) => data.year == year).month.filter((month: any) => month.month == body.month).using = body.using;
      const modificationResult = await this.house.replaceOne({ _id: id }, modificationData, { runValidators: true });
      if (modificationResult.modifiedCount) {
        res.send({ message: `OK` });
      } else {
        res.status(404).send({ message: `Ház a(z) ${id} azonosítóval nem található!` });
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  };

}
