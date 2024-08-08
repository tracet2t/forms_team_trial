import React,{useEffect, useState} from 'react';
import './App.css';
import { BsTrash } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";


function App() {
  const [isCompleteScreen,setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setnewDescription] = useState("");
  const [newDueDate, setDueDate] = useState();

  const handleAddToDo = () =>{
    let newTodoItem = {
      title:newTitle,
      description:newDescription,
      dueDate:newDueDate
    }
    let updatedTodo = [...allTodos];
    updatedTodo.push(newTodoItem);
    setTodos(updatedTodo);
    localStorage.setItem('todolist', JSON.stringify(updatedTodo))
  }

  useEffect(()=>{
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    if(savedTodo){
      setTodos(savedTodo);
    }
  },[])

  return (
    <div className="App">
      <h1>ToDoApp</h1>
      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type='text' value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder='Enter Task Title' />
          </div>
          <div className='todo-input-item'>
            <label>Description</label>
            <input type='text' value={newDescription} onChange={(e)=>setnewDescription(e.target.value)} placeholder='Enter Task Description' />
          </div>
          <div className='todo-input-item'>
            <label>Due Date</label>
            <input type='date' value={newDueDate} onChange={(e)=>setDueDate(e.target.value)} placeholder='Enter Date' />
          </div>
          <div className='todo-input-item'>
            <button type='button' onClick={handleAddToDo} className='primaryBtn'>Add</button>
          </div>
        </div>
        <div className="btn-area">
          <button className={`secondaryBtn ${isCompleteScreen===false && 'active'}`} onClick={()=>setIsCompleteScreen(false)}>Pending</button>
          <button className={`secondaryBtn ${isCompleteScreen===true && 'active'}`} onClick={()=>setIsCompleteScreen(true)}>Completed</button>
        </div>
        <div className='todo-list'>
          {allTodos.map((item,index)=>{
            return(
              <div className='todo-list-item' key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>{item.dueDate}</p>
                </div>
                <div>
                  <BsTrash className='icon' title='Delete?' />
                  <FaCheck className='check-icon' title='Complete?' />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
