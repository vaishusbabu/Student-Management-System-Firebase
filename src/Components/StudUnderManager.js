import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "../firebase";

function StudUnderManager() {
    const [students, setStudents] = useState([]);
    const loggedInUserName = localStorage.getItem('loggedInUserName');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentQuery = query(collection(db, 'users'), where('manager', '==', loggedInUserName));
                const studentSnapshot = await getDocs(studentQuery);
                const studentData = studentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setStudents(studentData);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, [loggedInUserName]);

    return (
        <div>
            <div className='navbar'>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/ManagerHome">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/editmanager">Update Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/passwordmanager">Password Change</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/studundermanager">Batch Student Details </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <div className='formContainer'>
                <div className='formWrapper'>
                    <h6>Students Under Your Management</h6>
                    <div className="row">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Sl.no</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.mobileNumber}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudUnderManager;
