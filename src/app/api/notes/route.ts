import { notesIndex } from "@/lib/db/pinecone";
import { getEmbedding } from "@/lib/openai";
import { createContentSchema, deleteContentSchema, updateContentSchema } from "@/lib/validation/content"
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
       const embedding = await getEmbeddingForNote(title, content);

       const note = await prisma?.$transaction(async (tx) => {
         const note = await tx.note.create({
           data: {
             title,
             content,
             userId,
           },
         });
   
         await notesIndex.upsert([
           {
             id: note.id,
             values: embedding,
             metadata: { userId },
           },
         ]);
   
         return note;
       });
    }
    catch (error) {
        console.log(error)
        return Response.json({error: "Internal servor error"},{status: 500})
    }
}
export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const parseResult = updateContentSchema.safeParse(body);

        if (!parseResult.success){
                console.log(parseResult.error)
                return Response.json({error:"Invalid Input"}, {status: 400})
        }
        const {id,title,content} = parseResult.data;

        const note = await prisma?.note.findUnique({where: {id}})
        if (!note) {
            return Response.json({error:"Note Not Found"}, {status: 404})

        }
        const {userId} = auth()

        if (!userId || userId !== note.userId){
                return Response.json({error: "Unauthorized"}, {status: 401})
        }

        const updatedNote = await prisma?.note.update({
            where: {id},
            data:{
                title,
                content
            }
        })
        return Response.json({updatedNote},{status: 200})

        }
    catch (error) {
        console.error(error)
        return Response.json({error: "Internal Servor Error"},{status: 500})
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json()
        const parseResult = deleteContentSchema.safeParse(body);

        if (!parseResult.success){
                console.log(parseResult.error)
                return Response.json({error:"Invalid Input"}, {status: 400})
        }
        const {id} = parseResult.data;

        const note = await prisma?.note.findUnique({where: {id}})
        if (!note) {
            return Response.json({error:"Note Not Found"}, {status: 404})

        }
        const {userId} = auth()

        if (!userId || userId !== note.userId){
                return Response.json({error: "Unauthorized"}, {status: 401})
        }

        await prisma?.note.delete({where : {id}})

        return Response.json({message: "Note Deleted"},{status: 200})

        }
    catch (error) {
        console.error(error)
        return Response.json({error: "Internal Servor Error"},{status: 500})
    }
}
async function getEmbeddingForNote(title: string,content: string | undefined) {
    return getEmbedding(title + "\n\n"  + content ?? "")
}