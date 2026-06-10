import { asyncHandler } from "../Utiles/AscynHandler.js";
import { ApiError } from "../Utiles/ApiError.js";
import { Apiresponse } from "../Utiles/ApiResponse.js";
import { Task } from "../Models/task.Models.js";

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
      throw new ApiError(400, "Title, description, status are required");
    }
    const task = await Task.create({
      title,
      description,
      status,
      userId: req.user._id,
    });
    res
      .status(201)
      .json(new Apiresponse(201, task, "Task created successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    res
      .status(status)
      .json(
        new Apiresponse(status, null, error.message || "Failed to create task"),
      );
  }
});

// Get all tasks for the logged-in user
const getTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    res
      .status(200)
      .json(new Apiresponse(200, tasks, "Tasks fetched successfully"));
  } catch (error) {
    console.log(error);
    const status = error.statusCode || 500;
    res
      .status(status)
      .json(
        new Apiresponse(status, null, error.message || "Failed to fetch tasks"),
      );
  }
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const { title, description } = req.body;
    const userId = req.user._id;
    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { title, description },
      {
        returnDocument: "after",
      },
    );
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    res
      .status(200)
      .json(new Apiresponse(200, task, "Task updated successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    res
      .status(status)
      .json(
        new Apiresponse(status, null, error.message || "Failed to update task"),
      );
  }
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user._id;
    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    res
      .status(200)
      .json(new Apiresponse(200, null, "Task deleted successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    res
      .status(status)
      .json(
        new Apiresponse(status, null, error.message || "Failed to delete task"),
      );
  }
});

//single task get by id
const updatestatus = asyncHandler(async (req, res) => {
  const { TaskId, status } = req.body;
  try {
    if (!TaskId || !status) {
      throw new ApiError(400, "TaskId and status are required");
    }
    const userId = req.user._id;
    const task = await Task.findByIdAndUpdate(
      TaskId,
      { status },
      {
        returnDocument: "after",
      },
    );
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    return res
      .status(200)
      .json(new Apiresponse(200, task, "Task status updated successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          "Something went wrong while updating task status",
        ),
      );
  }
});
const singletask = asyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    return res
      .status(200)
      .json(new Apiresponse(200, task, "succesfull get task details"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Something went wrong at fetching task",
        ),
      );
  }
});
export {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  singletask,
  updatestatus,
};
