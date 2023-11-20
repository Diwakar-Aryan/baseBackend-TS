import { MongoMethod } from "@/databases/mongo/method"

interface iWriteStreamFactory {
     getStreamObjects(type:string):any
}


export default class writeStreamFactory implements iWriteStreamFactory {
    getStreamObjects(type:string) {
        switch (type) {
            case "Mongo":
                return MongoMethod.initialize()
            default:
                return null
        }
    }
}