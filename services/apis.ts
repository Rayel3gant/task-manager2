const BASE_URL =process.env.NEXT_PUBLIC_BACKEND_URL

export const endpoints = {
    CREATETASK_API: BASE_URL + "/createTask",
    GETALLTASKS_API: BASE_URL + "/getAllTasks",
    UPDATETASK_API: BASE_URL + "/updateTask",
    DELETETASK_API: BASE_URL + "/deleteTask",
}