import mongoose from "mongoose";


type ConnectionObject ={
    isConnected? : number
}

const connection: ConnectionObject = {};

async function dbConnect ():Promise<void>{
    if (connection.isConnected) {
        console.log('Already connected to Database');
    }
    try {
        const db = await mongoose.connect(process.env.MONGOURI || '', {})
        connection.isConnected = db.connections[0].readyState
        console.log('Connected to Database');
    } catch (error) {
        console.log('Database connection error', error)
        process.exit(1)
    }
}

export default dbConnect;