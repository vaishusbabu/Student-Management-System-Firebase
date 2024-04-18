import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ModalLogin from './ModalLogin';

function ViewAllUsers() {
    const [studentData, setStudentData] = useState([]);
    const [managerData, setManagerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModalConfimation, setModalConfirmation] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState('');
    const [deleteUserType, setDeleteUserType] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            console.log('Attempting to fetch user data...');
            try {
                const studentQuery = query(collection(db, 'users'), where('userType', '==', 'student'));
                const studentSnapshot = await getDocs(studentQuery);
                const students = studentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                console.log("students", students);
                setStudentData(students);

                const managerQuery = query(collection(db, 'users'), where('userType', '==', 'manager'));
                const managerSnapshot = await getDocs(managerQuery);
                const managers = managerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                console.log("managers", managers);
                setManagerData(managers);

                setLoading(false);
                console.log('User data fetched successfully.');
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleDelete = async (id, userType) => {
        setDeleteUserId(id);
        setDeleteUserType(userType);
        setModalConfirmation(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            await deleteDoc(doc(db, 'users', deleteUserId));
            if (deleteUserType === 'student') {
                setStudentData(studentData.filter((student) => student.id !== deleteUserId));
            } else if (deleteUserType === 'manager') {
                setManagerData(managerData.filter((manager) => manager.id !== deleteUserId));
            }
            // alert(`(${deleteUserType}) User deleted`)
            console.log(`User deleted from Firestore (${deleteUserType}) with ID ${deleteUserId}`);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
        setModalConfirmation(false);
    };

    // const handleDelete = async (id, userType) => {
    //     {
    //         showModalConfimation && (
    //             <ModalLogin closeModal={setModalConfirmation} />
    //         )
    //     }
    //     try {
    //         await deleteDoc(doc(db, 'users', id));
    //         if (userType === 'student') {
    //             setStudentData(studentData.filter((student) => student.id !== id));
    //         } else if (userType === 'manager') {
    //             setManagerData(managerData.filter((manager) => manager.id !== id));
    //         }
    //         alert(`(${userType}) User deleted`)
    //         console.log(`User deleted from Firestore (${userType}) with ID ${id}`);
    //     } catch (error) {
    //         console.error('Error deleting user:', error);
    //     }
    // };


    return (
        <div>

            <div className="navbar">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/adminhome">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/viewalluser">View All Users</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Registration</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <div className="formContainer">
                <div className="formWrapper">
                    <h3>View all Students</h3>
                    <hr />
                    <div className="row">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Sl.no</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Manager</th>
                                    <th scope="col">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6">Loading...</td>
                                    </tr>
                                ) : (
                                    studentData.map((student, index) => (
                                        <tr key={student.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.mobileNumber}</td>
                                            <td>{student.manager}</td>
                                            <td><button type="button" className="btn btn-danger" onClick={() => handleDelete(student.id, 'student')}>Delete</button></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="formWrapper">
                    <h3>View all Managers</h3>
                    <hr />
                    <div className="row">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Sl.no</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5">Loading...</td>
                                    </tr>
                                ) : (
                                    managerData.map((manager, index) => (
                                        <tr key={manager.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{manager.name}</td>
                                            <td>{manager.email}</td>
                                            <td>{manager.mobileNumber}</td>
                                            <td><button type="button" className="btn btn-danger" onClick={() => handleDelete(manager.id, 'manager')}>Delete</button></td>


                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {showModalConfimation && (
                    <ModalLogin closeModal={() => setModalConfirmation(false)} handleDeleteConfirmation={handleDeleteConfirmation} />
                )}
            </div>

        </div>
    );
}

export default ViewAllUsers;

