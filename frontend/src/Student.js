import React, { useEffect, useState } from 'react'; 
import axios from 'axios';

function Student() {
    const [students, setStudents] = useState([]); 

    useEffect(() => {
        axios.get('http://localhost:8084/')
            .then(res => {
               
                console.log('API Response:', res.data);

              
                if (Array.isArray(res.data)) {
                    setStudents(res.data);
                } else {
                    console.error('API did not return an array:', res.data);
                    setStudents([]); 
                }
            })
            .catch(err => {
                console.error('Error fetching data from API:', err.message || err);
                setStudents([]); 
            });
    }, []);

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-75 bg-white rounded'>
                <button className='btn btn-success'> Add</button>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody> 
                        {
                            Array.isArray(students) && students.length > 0 ? (
                                students.map((student, i) => (
                                    <tr key={i}>
                                        <td>{student.Id}</td>
                                        <td>{student.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">No students available</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Student;
