import express from "express";
import mongoose from "mongoose";
import Person from "./model/Person.js";
import Task from "./model/Task.js";
import Plan from "./model/Plan.js";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
const app = express();

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

const SECRETKEY = process.env.SECRETKEY;
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

const connectDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("mongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

connectDb();

app.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await Person.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const newUser = new Person({
      name,
      email,
      password: hashedpassword,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
      SECRETKEY,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true, // cannot be accessed via JS
      secure: false, // true in production (HTTPS)
      sameSite: "strict", // CSRF protection
      maxAge: 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await Person.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Please sign up first!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      SECRETKEY,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true, // cannot be accessed via JS
      secure: false, // true in production (HTTPS)
      sameSite: "strict", // CSRF protection
      maxAge: 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Welcome back",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, SECRETKEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid token" });
  }
};

app.get("/dashboard-data", authMiddleware, async (req, res) => {
  try {
    const currentUser = await Person.findById(req.user.id);
    // FETCH PLANS
    const plans = await Plan.find({
      userId: req.user.id,
    });

    const topPlans = [...plans]
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);

    // FETCH TASKS

    const tasks = await Task.find({
      userId: req.user.id,
    });

    // PLANS SUMMARY

    const totalPlans = plans.length;

    const activePlans = plans.filter((plan) => plan.status === "active").length;

    const completedPlans = plans.filter(
      (plan) => plan.status === "completed",
    ).length;

    const expiredPlans = plans.filter(
      (plan) => plan.status === "expired",
    ).length;

    // TASKS SUMMARY

    const totalTasks = tasks.length;

    const pendingTasks = tasks.filter(
      (task) => task.status === "pending",
    ).length;

    const completedTasks = tasks.filter(
      (task) => task.status === "completed",
    ).length;

    const failedTasks = tasks.filter((task) => task.status === "failed").length;

    // RESPONSE

    res.json({
      user: currentUser,

      plansSummary: {
        totalPlans,
        activePlans,
        completedPlans,
        expiredPlans,
      },

      tasksSummary: {
        totalTasks,
        pendingTasks,
        completedTasks,
        failedTasks,
      },
      topPlans,

      plans,
      tasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { title, deadline, category } = req.body;
    if (!title || !deadline || category === "Category") {
      return res.status(401).json("Please fill all the blinks");
    }

    const newTask = new Task({
      title,
      deadline,
      category,
      userId: req.user.id,
    });

    await newTask.save();
    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.id,
    });

    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching tasks",
    });
  }
});

// edit route
app.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, deadline, category } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
      },
      {
        title,
        deadline,
        category,
      },
      { new: true },
    );

    if (!updatedTask) {
      return res.status(404).json("task is not found");
    }

    res.json(updatedTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating task",
    });
  }
});

//delete route
app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
      deletedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deleting task",
    });
  }
});

//change the status of the task to completed
app.put("/tasks/:id/status", authMiddleware, async (req, res) => {
  try {
    console.log("USER:", req.user);

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status === "completed") {
      return res.json(task);
    }

    task.status = "completed";
    await task.save();

    const user = await Person.findById(req.user.id);

    console.log("FOUND USER:", user);

    user.streak += 1;

    console.log("NEW STREAK:", user.streak);

    if (user.streak >= 40) {
      user.badge = "🥇 Gold Master";
      user.achievement = "40 tasks completed in a row";
    } else if (user.streak >= 15) {
      user.badge = "💎 Diamond Pro";
      user.achievement = "15 tasks completed in a row";
    } else if (user.streak >= 5) {
      user.badge = "🔥 Rising Star";
      user.achievement = "5 tasks completed in a row";
    }

    await user.save();

    console.log("SAVED USER:", user);

    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
// put method to update the Task when the deadline is reached but the user still didnt finish the task
app.put("/tasks/:id/fail", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // prevent failing twice
    if (task.status === "failed") {
      return res.json(task);
    }

    task.status = "failed";
    await task.save();

    const user = await Person.findById(req.user.id);

    user.streak = 0;
    user.badge = "No Badge";
    user.achievement = "Start again";

    await user.save();

    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update task",
    });
  }
});

//Add plan Route
app.post("/plan", authMiddleware, async (req, res) => {
  try {
    const { title, startDate, days, progress, status } = req.body;

    const activePlans = await Plan.countDocuments({
      userId: req.user.id,
      status: "active",
    });

    if (activePlans >= 6) {
      return res.status(400).json({
        message: "You can only have 6 active plans",
      });
    }

    const plan = new Plan({
      title,
      startDate,
      progress,
      status,
      days,
      userId: req.user.id,
    });

    await plan.save();

    res.status(201).json({
      message: "Plan created successfully",
      plan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add plan",
    });
  }
});

app.get("/plan", authMiddleware, async (req, res) => {
  try {
    const plans = await Plan.find({
      userId: req.user.id,
    });

    const now = new Date();

    const updatedPlans = await Promise.all(
      plans.map(async (plan) => {
        // milliseconds in 30 days
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;

        const isExpired = now - new Date(plan.startDate) > thirtyDays;

        // only expire active plans
        if (isExpired && plan.status === "active") {
          plan.status = "expired";

          await plan.save();
        }

        return plan;
      }),
    );

    res.json(updatedPlans);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching plans",
    });
  }
});

//get one plan but see in detail , get using the id of the plan
app.get("/plan/:id", authMiddleware, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    res.json(plan);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch single plan",
    });
  }
});

app.put("/plan/:id/day/:dayNumber", authMiddleware, async (req, res) => {
  try {
    const { task, completed } = req.body;

    const plan = await Plan.findById(req.params.id);

    const day = plan.days.find(
      (d) => d.dayNumber === Number(req.params.dayNumber),
    );

    if (!day) {
      return res.status(404).json({
        message: "Day not found",
      });
    }

    day.task = task;
    day.completed = completed;

    plan.progress = plan.days.filter((d) => d.completed).length;

    if (plan.progress === 30) {
      plan.status = "completed";
    }

    await plan.save();

    res.json(plan);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update day",
    });
  }
});

app.delete("/plan/:id", authMiddleware, async (req, res) => {
  try {
    const deletedPlan = await Plan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedPlan) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }

    res.json({
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error deleting plan",
    });
  }
});

//forgot password route
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Person.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = jwt.sign({ id: user._id }, SECRETKEY, {
      expiresIn: "15m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    console.log("Sending email to:", email);
    console.log("Reset link:", resetLink);

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({
      message: "Reset link sent to email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

//reset password route

app.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, SECRETKEY);

    const hashedPassword = await bcrypt.hash(password, 10);

    await Person.findByIdAndUpdate(decoded.id, {
      password: hashedPassword,
    });

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid or expired token",
    });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({
    message: "Logged out successfully",
  });
});
