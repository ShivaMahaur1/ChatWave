import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey=process.env.CHATWAVE_API_KEY
const apiSecret=process.env.CHATWAVE_API_SECRET

if(!apiKey || !apiSecret){
    console.error("Stream api key or secret is missing")
}

const streamclient=StreamChat.getInstance(apiKey,apiSecret)

export const upsertStreamUser=async (userData)=>{
    try {
        await streamclient.upsertUsers([userData])
        return userData
    } catch (error) {
        console.error("Error in upserting stream user",error)
    }
}

export const generateStreamToken=(userId)=>{
    try {
        const userIdStr=userId.toString()
        return streamclient.createToken(userIdStr)
    } catch (error) {
        console.log("Error in generateStreamToken",error.message)
    }
}