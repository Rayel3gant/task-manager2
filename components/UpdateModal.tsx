import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
Form,
FormControl,
FormDescription,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from './ui/button'
import { CalendarIcon, Pencil } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { format } from "date-fns"
import { Calendar } from './ui/calendar'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { updateTaskAction } from '@/services/taskOperations'
import { toast } from 'sonner'


const formSchema = z.object({
  dueDate: z.date().optional(), // Optional Date object
  status: z.enum(["pending", "in-progress", "completed"]).optional(), // Optional enum
});


const UpdateModal = ({_id, dueDate, status , setTaskUpdate}:{_id:string,dueDate:string,status:string,setTaskUpdate: React.Dispatch<React.SetStateAction<boolean>>}) => {

    const validStatus = ["pending", "in-progress", "completed"].includes(status)
    ? (status as "pending" | "in-progress" | "completed")
    : undefined;

    const parsedDueDate = dueDate ? new Date(dueDate) : undefined;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dueDate:parsedDueDate,
            status:validStatus      
        },
    })
    const [isOpen, setIsOpen] = useState(false);

    
    const onSubmit=async(values: z.infer<typeof formSchema>)=> {
        console.log(values)
        try {
                
              const success = await updateTaskAction({
                _id,
                status: values.status ?? "pending", // Fallback to default
                dueDate: values.dueDate ?? new Date(),
              });
              if (success) {
                setTaskUpdate(true)
                console.log("Task updated successfully!");
                toast("Task updated", {
                    action: {
                      label: "Close",
                      onClick: () => toast.dismiss(), // Dismiss the toast
                    },
                });

              } 

              setIsOpen(false)
        } catch (error) {
              console.error("Error creating task:", error);
        } 
    }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <div  className=" cursor-pointer text-[5px] p-1.5 md:text-[8px] md:p-2.5 rounded-full bg-white text-black  hover:scale-95 hover:bg-black hover:text-white transition-all duration-500"><Pencil/></div>
        </DialogTrigger>

        <DialogContent className="w-11/12 mx-auto sm:w-[425px] rounded-xl">
            <DialogHeader className='flex flex-col items-start'>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription className='text-left'>
                Make changes to your task here. Click save when you&apos;re done.
                </DialogDescription>
            </DialogHeader>
        

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 w-full flex-1 flex flex-col items-start gap-y-3">
            

                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={field.onChange}
                            
                                disabled={(date) => date < new Date(new Date().toDateString())}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormDescription>
                            The task submission deadline will be set for or prior to this date.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Task Status</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="pending" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                Pending
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="in-progress" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                In-progress
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="completed" />
                                </FormControl>
                                <FormLabel className="font-normal">Completed</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-fit mt-4">Submit</Button>
            </form>
            </Form>
        
        </DialogContent>
    </Dialog>
  )
}

export default UpdateModal