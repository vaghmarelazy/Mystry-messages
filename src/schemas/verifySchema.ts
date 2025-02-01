import {z} from 'zod'

export const verfySchema = z.object({
    code: z.string().length(6, "Varification code must be at least 6 characters")
})