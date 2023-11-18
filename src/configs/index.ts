import 'dotenv/config'
export default class configClass {

  private static _instance: configClass;
  private constructor() {}

  public static initialize() {
    if (!this._instance) {
      this._instance = new configClass();
    }
    return this._instance;
  }

  get ServerInfo(){
    return {PORT: process.env.PORT}
  }

  get MongoConfigDetails(){
    return { mongo_uri: process.env.mongo_uri || '',mongo_db_name : process.env.mongo_db_name }
  }
  
  get ConfigDetails(){
    return {privateKey : process.env.privateKey || '', pubicKey : process.env.publicKey || ''}
  }

  get Salt(){
    return {salt:process.env.salt || ''}
  }

 
}
