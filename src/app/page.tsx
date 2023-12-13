import { Button } from '@/components/ui/button'
import { SignIn, auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation';
export default function Home() {
  const {userId} = auth();

  if(userId) redirect("/content")
  return (
   <main className="flex flex-col h-screen items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Button size="lg" asChild>
          <Link href="/content">Open</Link>
        </Button>
      </div>
   </main>
  )
}
