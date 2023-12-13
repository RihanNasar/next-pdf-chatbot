import { CreateContentSchema, createContentSchema } from "@/lib/validation/content";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "./dialog";
  

import { Button } from "./button";  
import { Textarea } from "./textarea";
import LoadingButton from "./loading-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
interface AddContentDialogProps {
    open: boolean,
    setOpen: (open: boolean) => void,

}

export default function AddContentDialog({open,setOpen}:AddContentDialogProps) {
    const form = useForm<CreateContentSchema>({
        resolver: zodResolver(createContentSchema),
        defaultValues: {
            title: "",
            content: "",
        }
    })

    async function onSubmit(input: CreateContentSchema) {
        try {
            const response = await fetch("/api/notes",{
                method: "POST",
                body: JSON.stringify(input)
            })

            if (!response.ok) throw Error("Status Code : " + response.status)
            form.reset()
        }
        catch(error){
            console.log(error)
            alert("something went wrong. please try again")
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
            <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    )

}