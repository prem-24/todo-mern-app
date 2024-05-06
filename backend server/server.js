const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors')
// Function to connect to MongoDB
async function connectToDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mern-app');
        console.log("MongoDB connected!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

connectToDB();

// Schema creation
const todoSchema = new mongoose.Schema({
    title: {
        required:true,
        type:String,
    },
    desc: String,
});

// Model creation
const todoModel = mongoose.model('todo', todoSchema);

const app = express();
app.use(express.json());
app.use(cors());
// Todos post method
app.post('/todos', async (req, res) => {
    const { title, desc } = req.body;
    try {
        const newTodo = new todoModel({ title, desc });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error("Error saving todo:", error);
        res.status(500).json({ message: "Failed to save todo" });
    }
});

// Todos get all items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find({});
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Failed to fetch todos" });
    }
});



// Todos put all items
app.put('/todos/:id', async (req, res) => {
    try {
        const { title, desc } = req.body;
        const id = req.params.id;
        const updateTodos = await todoModel.findByIdAndUpdate(
            id,
            { title, desc },
            {new:true}
        );
        
        res.status(200).json(updateTodos);

       if(!updateTodos) {
        return res.status(401).json({message:"update not found!!!"})
       }

    } catch (error) {
        console.error("Error update todos:", error);
        res.status(500).json({ message: "Failed to fetch todos" });
    }
});





// Todos delete  item
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
      const deleteItem = await todoModel.findByIdAndDelete(id)
        res.status(203).json(deleteItem);
    } catch (error) {
        console.error("Error deleting todos:", error);
        res.status(500).json({ message: "Failed to delete todos" });
    }
});



const port = 8000;

// Server listening
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Error handling
app.use((err, req, res, next) => {
    console.error("Internal server error:", err);
    res.status(500).send('Something broke!');
});
