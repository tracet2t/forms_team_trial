import React, { useEffect, useState } from 'react'; 
import axios from 'axios';

function Student() {
    const [students, setStudents] = useState([]); 

    useEffect(() => {
        axios.get('http://localhost:8084/')
            .then(res => setStudents(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-75 bg-white rounded'>
                <button className='btn btn-success'>Add</button>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Number</th>
                        </tr>
                    </thead>
                    <tbody> 
                        {
                            students.map((student, i) => (
                                <tr key={i}>
                                    <td>{student.Id}</td>
                                    <td>{student.Name}</td>
                                    <td>{student.Email}</td>
                                    <td>{student.Number}</td> 
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Student;
