"use server"

import { apiConnector } from "@/lib/utils"
import { endpoints } from "./apis"
import axios from "axios"

export type TaskData = {
  title: string;
  description: string;
  priority: string;
  dueDate: Date;
};


type updateTaskData={
  _id:string,
  status:string
  dueDate: Date;
}

export type CreateTaskResponse = {
  success: boolean;
  message: string;
  data?: any; // Replace with the specific data structure if known
};


  
const CreateNewTask = async (data: TaskData): Promise<boolean> => {
  try {
    const formattedDate = new Date(data.dueDate)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");

    console.log(formattedDate)

    console.log("here 1")
    const response = await apiConnector({
      method: "POST",
      url: endpoints.CREATETASK_API,
      bodyData: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: formattedDate,
      },
    });

    console.log("here 2")
    console.log(response)


    console.log("task created")


    return true; // Return a boolean directly
  } catch (error:any) {

    console.error("Error in CreateNewTask:", error);

    if (error.response) {
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Data:", error.response.data); // Backend error message
    }
    return false; // Return a boolean directly
  }
};


export const createTaskAction = async (data: TaskData): Promise<boolean> => {
  return await CreateNewTask(data);
};



const updateTask=async(data:updateTaskData): Promise<boolean>=>{
  try {
    const formattedDate = new Date(data.dueDate)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");

    console.log(formattedDate)

    console.log("here 1")
    const response = await apiConnector({
      method: "POST",
      url: endpoints.UPDATETASK_API,
      bodyData: {
        taskId:data._id,
        status:data.status,
        dueDate: formattedDate,
      },
    });

    console.log("here 2")
    console.log(response.data)

    console.log("task updated")


    return true; // Return a boolean directly
  } catch (error:any) {

    console.error("Error in update task:", error);

    if (error.response) {
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Data:", error.response.data); // Backend error message
    }
    return false; // Return a boolean directly
  }
}

export const updateTaskAction = async(data:updateTaskData):Promise<boolean>=>{
  console.log("update data" ,data)
  return await updateTask(data)
}

// Define the structure of a single task
export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the generic response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}



const GetAllTasks = async (): Promise<Task[]> => {
  try {
    const response = await apiConnector<ApiResponse<Task[]>>({
      method: "GET",
      url: endpoints.GETALLTASKS_API,
    });

    if (response.data.success) {
      console.log(response.data);
      return response.data.data; // Return the list of tasks
    } else {
      console.error("Failed to fetch tasks:", response.data.message);
      return [];
    }
  } catch (error: any) {
    console.error("GET_ALL_TASKS_API ERROR............", error);
    return [];
  }
};



export const getAllTasksAction = async () => {
  const tasks = await GetAllTasks();
  return tasks;
 
};


const deleteTask = async (taskId: string): Promise<void> => {
    try {
      const response = await apiConnector({
        method: "POST",
        url: endpoints.DELETETASK_API,
        bodyData: {
          taskId: taskId,
        },
      });
  
      console.log("DELETE TASK API RESPONSE............", response);
    } catch (error: any) {
      console.error("Error in delete task:", error);
  
      if (error.response) {
        console.error("Error Response Status:", error.response.status);
        console.error("Error Response Data:", error.response.data); // Backend error message
      }
    }
};


export const deleteTaskAction = async (taskId: string): Promise<void> => {
  const tasks = await deleteTask(taskId);
  return tasks;
};


  