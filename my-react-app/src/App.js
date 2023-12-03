import React,{useState, useEffect}from 'react';
import axios from 'axios' ;

function App(){
  const [tasks, setTasks]= useState([]);
  const [newTask , setNewTask] = useState('');
}

useEffect(()=>{
  axios.get('http://localhost:3000/tasks')
  .then(response=>{
    setTasks(response.data);
  })
  .catch(error=>{
    console.error('Error fetching tasks:',error);
  });
},[]);

const handleAddTask = () =>{
  axios.post('http://localhost:3000/tasks', {title : newTask })
  .then(response=>{
    setTasks([...tasks, response.data]);
    setNewTask('');
  })
  .catch(error=>{
    console.error('Error adding task : ', error);
  });
};

return ( 
  <div>
    <h1>Task Manager App</h1>
    <ul>
      {task.map(task=>(
        <li key={task._id}>{task.title}</li>
      ))}
    </ul>
    <div>
      <input
      type="text"
      value={newTask}
      onChange = {e=>setNewTask(e.target.value)}
      placeholder='Enter Task Title'
      />
  
  <button onClick={handleAddTask}>Add Task</button>
    </div>

  </div>
);

export default App; 