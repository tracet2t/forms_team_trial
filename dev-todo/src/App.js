
import './App.css';

function App() {
  return (
    <div className="App">
      <h1> FIND FOOD </h1>
      <div className= "todo-wrap">
        <div className="input">
          
       
            <div className='input-item'>    
                    <label> Title </label>
            <input type="text" placeholder='Add your food type here'></input>
            </div>
<br>
</br>
            <div className='input-item'>    
                    <label> Description</label>
            <input type="text" placeholder='Add your food description here'></input>
            </div>
            <br>
            </br>
            <div className='input-item'>    
              <button type='button' className ="Button1"> Add </button>
                </div>    
                <br>
                </br>
            <div className='input-item'>    
                    <label> Title </label>
            <input type="text" placeholder='Add your food type here'></input>
            </div>
            <br>
            </br>
            <div className='input-item'>    
                    <label> Title </label>
            <input type="text" placeholder='Add your food type here'></input>
            </div>
            <br>
            </br>
            <div className='input-item'>    
                    <label> Title </label>
            <input type="text" placeholder='Add your food type here'></input>
            </div>
            <br>
            </br>
        </div>
        <div className="btn-area">
          <button> New  </button>
          <button> New  </button>
        </div>
      </div>

     
    </div>
  );
}

export default App;
