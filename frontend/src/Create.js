import React from 'react';
import './Create.css'; 

function Create() {
    return (
        <div className='container'>
            <div className='form-container'>
                <form>
                    <h2>Add Member</h2>
                    <div className='form-group'>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder='Enter name' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="email">E-mail</label>
                        <input type="text" id="email" placeholder='Enter e-mail' />
                    </div>
                    <button className='btn-submit'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Create;
