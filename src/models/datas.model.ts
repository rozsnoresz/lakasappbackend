
import { Schema, model } from "mongoose";

const datasSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            readonly: true
        },
        using:{
            type: Array,
        },
        payment:{
            type: Array,
        },
    },
    { versionKey: false },
);

const datasModel = model("data", datasSchema, "Data");


export default datasModel;