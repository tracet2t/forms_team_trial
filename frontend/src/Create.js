import React, {useState} from 'react';
import axios from 'axios';
import './Create.css'; 

function Create() {
    const[name, setName] = useState('')
    const[email, setEmail] = useState('')
    function handleSubmit (event){
        event.preventDefault();
        axios.post('http://localhost:8085/create', {name, email})
    }
    return (
        <div className='container'>
            <div className='form-container'>
                <form onSubmit = {handleSubmit}> 
                    <h2>Add Member</h2>
                    <div className='form-group'>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder='Enter name'
                         onChange ={e => setName(e.target.value)}
                          />
                       
                        
                    </div>
                    <div className='form-group'>
                        <label htmlFor="email">E-mail</label>
                        <input type="text" id="email" placeholder='Enter e-mail'
                        onChange ={e => setEmail(e.target.value)}
                         />
                    </div>
                    <button className='btn-submit'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Create;
