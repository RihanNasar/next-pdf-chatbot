import { createContentSchema } from "@/lib/validation/content"
import { auth } from "@clerk/nextjs";

export async function POST(req: Request){
    try {
       const body = await req.json()
       const parseResult = createContentSchema.safeParse(body);

       if (!parseResult.success){
            console.log(parseResult.error)
            return Response.json({error:"Invalid Input"}, {status: 400})
       }
       const {title,content} = parseResult.data;
       const {userId} = auth()

       if (!userId){
            return Response.json({error: "Unauthorized"}, {status: 401})
       }

       const note = await prisma?.note.create({
        data:{
            title,
            content,
            userId
        }
       })

       return Response.json({note},{status: 201})
    }
    catch (error) {
        console.log(error)
        return Response.json({error: "Internal servor error"},{status: 500})
    }
}