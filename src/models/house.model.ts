
import { Schema, model } from "mongoose";

const houseSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            readonly: true
        },
        name: {
            type: String,
            required: true,
        },
        types: {
            type: Array,
            required: true,
        },
        datas_id: {
            type: String,
            required: true,
        },
    },
    { versionKey: false },
);

const houseModel = model("house", houseSchema, "House");


export default houseModel;