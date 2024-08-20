import { z } from 'zod'
const balance = localStorage.getItem('balance') || 0

export const betSchema = z.object({
    bet_price: z.number().min(0).max(+balance),
})

export type IBetSchema = z.infer<typeof betSchema>
