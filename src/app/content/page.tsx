import { auth } from "@clerk/nextjs"
import prisma from "@/lib/db/prisma"
export default async function ContentPage() {
    const { userId } = auth();

    if (!userId) throw Error("userId undefined");
  
    const allNotes = await prisma.note.findMany({ where: { userId } });
  
    return <div>{JSON.stringify(allNotes)}</div>;
}