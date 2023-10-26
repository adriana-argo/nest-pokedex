//Es la representacion de lo que estamos grabando en la DB

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {
    //id: string lo otorga Mongo
    @Prop({
        unique: true,
        index: true
    })
        name: string;
    @Prop({
        unique: true,
        index: true
     })
        nro: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);