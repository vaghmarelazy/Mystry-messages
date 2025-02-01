import {z} from "zod"

export const messageSchema = z.object({
    content : z
    .string()
    .min(10, {message : "Content must be at least 10 characters"})
    .max(300,{message: "Content should not be longer than 300 characteres"} )
})