import React from 'react'

function Create() {
  return (
    
         <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-75 bg-white rounded p-3'>
                <form>
                    <h2>Add member </h2>
                <div className = 'mb-2'>
                    <label htmlFor="">Name</label>
                    <input type ="text" placeholder='enter name' className='form'/>
                </div>
                <div className = 'mb-2'>
                <label htmlFor="">E-mail</label>
                    <input type ="text" placeholder='enter e-mail' className='form'/>
                </div>
                <button className = 'btn btn-success'>Submit</button>

                
    

                </form>
              
              
                </div>
        
    </div>
  )
}


export default Create;