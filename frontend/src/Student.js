import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Student.css'; // Import the CSS file

function Student() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8085/')
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

    const handleUpdate = (id) => {
        console.log('Update student with ID:', id);
    };

    const handleDelete = (id) => {
        console.log('Delete student with ID:', id);
    };

    return (
        <div className='container'>
            <div className='table-container'>
                <Link to="/create" className='btn button-add'>Add</Link>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(students) && students.length > 0 ? (
                            students.map((student, i) => (
                                <tr key={i}>
                                    <td>{student.Number}</td>
                                    <td>{student.ID}</td>
                                    <td>{student.email}</td>
                                    <td>
                                        <button
                                            className='btn button-update'
                                            onClick={() => handleUpdate(student.ID)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className='btn button-delete'
                                            onClick={() => handleDelete(student.ID)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className='no-students'>No students available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Student;
