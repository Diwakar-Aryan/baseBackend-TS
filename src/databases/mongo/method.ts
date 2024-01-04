import MongoClientClass from "./setup"
import {} from 'mongodb'

export class MongoMethod {
    mongoClient: MongoClientClass = MongoClientClass.initialize()
    static instance: MongoMethod
    private constructor() {
    }
  
    public static initialize() {
      if (!this.instance) {
        this.instance = new MongoMethod();
      }
      return this.instance;
    }

    public async findOne(collection_name: string,params:any){
        try {
            let collection = this.mongoClient.collection(collection_name)
            let data = await collection.find(params).toArray();        
            return data[0] || {};
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    
    public async findAll(collection_name: string,params: any){
        try {
            let collection = this.mongoClient.collection(collection_name);
            let data = await collection.find(params).toArray(); 
            console.log(data);
            
            return data || {}
        } catch (error) {
            console.log(error);
            throw error
            
        }
    }
    
    public async insertOne(collection_name:string,params:any) {
        try {
            let collection = this.mongoClient.collection(collection_name);
            collection.insertOne(params)
        } catch (error) {
            
        }
    }
    
    public async findAndUpdateuser(filter:any,update:any,collection_name: string){
        try {
            let collection = this.mongoClient.collection(collection_name);
            return await collection.findOneAndUpdate(filter,update,{upsert: true})
        } catch (error) {
            
        }
    }



}