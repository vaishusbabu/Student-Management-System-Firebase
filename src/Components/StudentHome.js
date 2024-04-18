import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "../firebase";

function StudentHome() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
        const fetchUserData = async () => {
            try {
                const studentQuery = query(collection(db, 'users'), where('email', '==', loggedInUserEmail));
                const studentSnapshot = await getDocs(studentQuery);
                const userData = studentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                if (userData.length > 0) {
                    setUserData(userData[0]);
                } else {
                    console.log('User not found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);



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
                                    <Link className="nav-link active" aria-current="page" to="/studenthome">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/editstd">Update Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/passwordstd">Password Change</Link>
                                </li>
                                <li class="nav-item">
                                    <Link to={'/'}>Logout</Link >
                                </li>

                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <div className='formContainer'>
                <div className='formWrapper'>
                    <h6>View Profile</h6>
                    {userData && (
                        <div>
                            <p>Name: {userData.name}</p>
                            <p>Email: {userData.email}</p>
                            <p>Mobile Number: {userData.mobileNumber}</p>
                            <p>Manager:{userData.manager}</p>
                            <button type="button" className="btn btn-dark">
                                <Link to="/editstd" className="nav-link">Edit Profile</Link>
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentHome;
