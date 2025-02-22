const moment=require("moment")
const Task=require("../models/Task")

const createTask=async(req,res)=>{
    try{
        const { title , description , priority , dueDate } =req.body;
        console.log("title",title)
        console.log("description",description)
        console.log("priority",priority)
        console.log("date",dueDate)
        if(!title ||!description || !dueDate){
            return res.status(400).json({
                success:false,
                message:'task parameters missing'
            })
        }

        // parsing date
        const parsedDate = moment.utc(dueDate, 'DD/MM/YYYY', true);
        // Validate the parsed date
        if (!parsedDate.isValid()) {
            return res.status(400).send({ message: 'Invalid date format. Use DD/MM/YYYY.' });
        }
        const parsedDueDate = parsedDate.toDate();
		
        
        const newTask= await Task.create({
            title,
            description,
            priority: priority || "medium",
            dueDate:parsedDueDate
        })

        res.status(200).json({
            success:true,
            message:'task created',
            data:newTask
        })
    } catch(error){
        console.log(error)
        console.log("error in creating task")
        return res.status(500).json({
            success:false,
            message:"error in creating task"
        })
    }
}


const updateTask=async(req,res)=>{
    try{
        const { taskId ,  title , description , priority , dueDate , status } =req.body;

        if(!taskId){
            return res.status(400).json({
                success:false,
                message:"task id missing"
            })
        }

        const taskData=await Task.findById(taskId)

        if(!taskData){
            return res.status(400).json({
                success:false,
                message:"invalid task id"
            })
        }

        let parsedDueDate;
        if(dueDate.length){
            // parsing date
            const parsedDate = moment.utc(dueDate, 'DD/MM/YYYY', true);
            // Validate the parsed date
            if (!parsedDate.isValid()) {
                return res.status(400).send({ message: 'Invalid date format. Use DD/MM/YYYY.' });
            }
            parsedDueDate = parsedDate.toDate();		
        }
        

        const updateFields = {};
		if (title && title !== taskData.title) updateFields.title = title;
		if (description && description !== taskData.description) updateFields.description = description;
		if (priority && priority !== taskData.priority) updateFields.priority = priority;
		if (status && status !== taskData.status) updateFields.status = status;
		if (dueDate && parsedDueDate.toISOString() !== taskData.dueDate.toISOString()) updateFields.dueDate = parsedDueDate;

		// if no data given ,return
		if (Object.keys(updateFields).length === 0) {
			return res.status(400).json({
                success:false,
                message:"no data for updation"
            })
		}

		const data = await Task.findByIdAndUpdate(
			taskId,
			{ $set: updateFields },
			{ new: true }
		)

        res.status(200).json({
            success:true,
            message:"task updated",
            data:data
        })


    } catch(error){
        console.log(error)
        console.log("error in updating task")
        return res.status(500).json({
            success:false,
            message:"error in updating task"
        })
    }
}

const deleteTask=async(req,res)=>{
    try{
        const { taskId } =req.body;

        if(!taskId){
            return res.status(400).json({
                success:false,
                message:"task id missing"
            })
        }

        const taskData= await Task.findById(taskId)

        if(!taskData){
            return res.status(400).json({
                success:false,
                message:'invalid task id'
            })
        }
        await Task.findByIdAndDelete(taskId)
        return res.status(200).json({
            success:true,
            message:'task deleted'
        })
    } catch(error){
        console.log(error)
        console.log("error in deleting task")
        return res.status(500).json({
            success:false,
            message:"error in deleting task"
        })
    }
}

const getAllTask=async(req,res)=>{
    try{
        const taskData=await Task.find({})


        console.log("sending data to frontend")
        return res.status(200).json({
            success:true,
            message:"tasks list",
            data:taskData
        })
    } catch(error){
        console.log(error)
        console.log("error in getting tasks list")
        return res.status(500).json({
            success:false,
            message:"error in getting tasks list"
        })
    }
}


module.exports={createTask , updateTask , deleteTask , getAllTask}