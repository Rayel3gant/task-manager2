"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import Loader from "@/components/Loader"
import {  createTaskAction } from "@/services/taskOperations"
import { toast } from "sonner"


const formSchema = z.object({
  title: z.string().min(5, {
    message: "Task Title must be at least 5 characters.",
  })
  .max(30, {
    message: "Task Title must not be longer than 30 characters.",
  }),
  description: z
    .string()
    .min(75, {
      message: "Task Description must be at least 75 characters.",
    })
    .max(150, {
      message: "Task Description must not be longer than 150 characters.",
    }),
  dueDate: z.date({
    required_error: "Task Due date is required.",
  }),
  priority:z.enum(["low", "medium", "high"])
})


const TaskForm=()=> {
  const [loading,setLoading]=useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description:"",
      priority:"medium"

    },
  })
 
  const onSubmit=async(values: z.infer<typeof formSchema>)=> {
    console.log(values)    
      setLoading(true);

    try {
      const success = await createTaskAction(values);
      if (success) {
        console.log("Task created successfully!");
        toast("Task created", {
            action: {
              label: "Close",
              onClick: () => toast.dismiss(), // Dismiss the toast
            },
        });
        form.reset()
      } 
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  }



  return (
    
    <>
    {
      (loading===true)?(
        <div className="w-full h-screen flex justify-center items-center">
          <Loader/>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-20 w-11/12 md:w-3/4 lg:w-1/2 mx-auto flex-1 flex flex-col gap-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="describe your task"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        selected={field.value}
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
              name="priority"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Task Priority</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="low" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Low
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="medium" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Medium
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="high" />
                        </FormControl>
                        <FormLabel className="font-normal">High</FormLabel>
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
      )
    }
    </>
  )
}

export default TaskForm