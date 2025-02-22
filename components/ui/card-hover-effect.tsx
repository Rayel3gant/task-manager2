'use client'
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {Trash2 } from "lucide-react";
import { useState } from "react";

import { deleteTaskAction } from "@/services/taskOperations";
import Loader from "../Loader";
import UpdateModal from "../UpdateModal";


const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const HoverEffect = ({
  items,
  className,
  setTaskUpdate
}: {
  items: {
    title: string;
    description: string;
    _id:string,
    dueDate:string,
    status:string,
    priority:string
  }[];
  className?: string;
  setTaskUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading,setLoading]=useState(false)

  const deleteHandler=(taskId:string)=>{
    console.log("task id",taskId)
    setLoading(true)
    setTaskUpdate(true)
    deleteTaskAction(taskId)
    setLoading(false)
  }


  

  return (
    <>
    {
      (loading===true)?(
        <div className="w-full h-[calc(100vh-5rem)] flex items-center justify-center ">
          <Loader/>
        </div>
      ):(
        <div
      className={cn(
        "w-11/12 md:w/3/4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item?._id}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          
          <Card className='text-white w-11/12 mx-auto uppercase'>
            

            <div className="w-full flex flex-col gap-y-2 text-sm">
              
              <div className="flex flex-col gap-y-0">
                <div className="text-[12px] sm:text-2xl font-bold">{item.title}</div>
                <div className="text-[7px]  sm:text-[10px] overflow-hidden text-ellipsis max-h-12 line-clamp-2">{item.description}</div>
              </div>

              <div className="flex flex-col gap-y-0 mt-3 text-[9px] sm:text-[12px]">
                <div className="">Task has {item.priority} priority.</div>
                <div className="">Task is in {item.status} state.</div>
              </div>
              <div className=" text-[10px] sm:text-sm font-bold">Due date:  {formatDate(item.dueDate)}</div>
             
              <div className="flex items-center gap-x-3 mt-2">
                <div onClick={()=>deleteHandler(item._id)} className=" cursor-pointer text-[5px] p-1.5 md:text-[8px] md:p-2.5 hover:bg-red-500 hover:scale-95 hover:text-black transition-all duration-500  rounded-full bg-red-500 text-white"><Trash2/></div>
                <UpdateModal _id={item._id} dueDate={item.dueDate} status={item.status} setTaskUpdate={setTaskUpdate} />
                
              </div>
            </div>
            

          </Card>

         
        </div>



      ))}
        </div>
      )
    }
    </>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

