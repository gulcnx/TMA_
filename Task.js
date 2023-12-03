const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required : true,
    },
    description : String ,
    completed:{
        type:Boolean,
        default:false,
   },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

const Task = require('./models/Task');
 
app.post('/tasks', async (req,res)=>{
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task0);
    } catch (error) {
        res.status(400).send(error);
    }
});


app.get('/tasks', async(req,res)=>{
    try {
        const tasks = await Task.find();
        res.send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/tasks/:id', async(req,res)=>{
    const id = req.params.id;

   try {
    const task = await Task.findById(id);
    if(!task){
        return res.status(404).send();
    }
    res.send(task);
   } catch (error) {
    res.status(500).send(error);
   }
});


app.patch('/tasks/:id', async(req,res)=>{
    const id = req.params.id ;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title' , 'description','completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

if(!isValidOperation){
    return res.status(400).send({error : 'Invalid updates!'});
}

try {
    const task = await Task.findByIdAndUpdate(id , req.body , {new: true, runValidators: true});
    if(!task){
        return res.status(404).send();
    }
    res.send(task);
} catch (error) {
    res.status(400).send(error);
}
});

app.delete('/tasks/:id', async(req,res)=>{
    const id = req.params.id;
try {
    const task = await Task.findByIdAndDelete(id);
    if(!task){
        return res.status(404).send();
    }
} catch (error) {
    res.status(500).send(error);
}

});