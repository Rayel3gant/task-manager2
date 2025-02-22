'use client'

import { HoverEffect } from '@/components/ui/card-hover-effect';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect'
import { getAllTasksAction, Task } from '@/services/taskOperations';
import React, { Fragment, useEffect, useState } from 'react'

const words = [
  {
    text: "No tasks to see here..."
  },
  {
    text: "yet.",
    className: "text-blue-500 dark:text-blue-500",
  },
];

const Page = () => {
  const [taskData,setTaskData]=useState<Task[]>([]);
  const [taskUpdate,setTaskUpdate]=useState(false)
  
  const fetchTasks = async () => {
    console.log("here")
    try {
      const result = await getAllTasksAction();
      if(result){
        setTaskData(result)
        console.log(result)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(()=>{
    fetchTasks()
  },[])
  

  //  if ticket updates , fetch data again
    useEffect(()=>{
      if(taskUpdate){
        fetchTasks()
        setTaskUpdate(false)
      }
    },[taskUpdate])
  
  return (
    <Fragment>
    {
      (taskData.length===0)?(
        <div className='flex h-[calc(100vh-5rem)] w-screen justify-center items-center'>
          <TypewriterEffectSmooth words={words} />
        </div>
      ):(
        <div className='mt-6 md:mt-12 mb-12 md:mb-20 min-h-[calc(100vh-5rem)] w-full'>
          <HoverEffect items={taskData} setTaskUpdate={setTaskUpdate} className='mt-6 md:mt-12' />
        </div>
      )
    }
    </Fragment>
  )
}

export default Page