import {z} from "zod";
export const createContentSchema = z.object({
    title: z.string().min(1,{message: "Title Required"}),
    content: z.string(),
})

export type CreateContentSchema = z.infer<typeof createContentSchema>
export const updateContentSchema = createContentSchema.extend({
    id : z.string().min(1)
})
export const deleteContentSchema = z.object({
    id: z.string().min(1)
})