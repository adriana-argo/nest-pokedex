import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, createParamDecorator } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';


//Lo recibimos del Controller
@Injectable()
export class PokemonService { 
  //Para hacer ref: a la DB mongo
  constructor(
    //Para injectarlo
    @InjectModel(Pokemon.name)//Esto viene del pokemon.module
    private readonly pokemonModel:Model<Pokemon>
  ){}
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    //1ro llamamos al pokemonModel y esperamos la resp.
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
      
    } catch (error) {
      this.handleExceptions(error);
     
    }
  }

  async findAll() {
    return `This action returns all pokemon`;
    
  }

  async findOne(term: string) {
    // return `This action returns a #${id} pokemon`;
    
    
    let pokemon: Pokemon;
    //1ro verificar si el ID es un numero, pq es un string
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({nro:term})
    }
//Mongo ID
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }
//Name
if(!pokemon){
  pokemon = await this.pokemonModel.findOne({name:term.toLocaleLowerCase().trim()});
}
//Si no encuentra nad

if(!pokemon) throw new NotFoundException(`Not found pokemon ${term}`)

    return pokemon;
  }

 async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term); //Metodo hecho en la busqueda 
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
        await pokemon.updateOne(updatePokemonDto);
    } catch (error) {
      
        this.handleExceptions(error);
      
    }
    return {...pokemon.toJSON(), ...updatePokemonDto} ;
  }

 async remove(id: string) {
    // return `This action removes a #${id} pokemon`;
  //   const pokemon = await this.findOne(id)
  // await pokemon.deleteOne();
    
    // return {id}

  //  const result = await this.pokemonModel.findByIdAndDelete(id);

  const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
  if(deletedCount === 0)
    throw new BadRequestException(`Pokemon with id "${id}", not found `);
   return;
  }


  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`pokemon exists in DB ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException('Can`t create Pokemon -Check server logs');
  }
}
