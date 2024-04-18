import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase";



function EditManager() {
    const [errors, setErrors] = useState({});
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


    const validate = () => {
        const newErrors = {};

        if (!userData || isEmpty(userData.name)) {
            newErrors.name = 'Please enter your name.';
        }

        if (!userData || isEmpty(userData.mobileNumber)) {
            newErrors.mobileNumber = 'Please enter your mobile number.';
        } else if (!isValidPhoneNumber(userData.mobileNumber.toString())) {
            newErrors.mobileNumber = 'Please enter a valid phone number.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            try {
                await updateDoc(doc(db, 'users', userData.id), {
                    name: userData.name,
                    mobileNumber: userData.mobileNumber
                });
                console.log('Data updated successfully');
                alert('Updated Successfully');
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        }
    };

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
                    <h6>Edit Profile</h6>
                    <form onSubmit={handleSubmit}>


                        {userData && (
                            <div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    />
                                    {errors.name && <div className="text-danger">{errors.name}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input
                                        readOnly
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mobileNumber" className="form-label">Mobile Number:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="mobileNumber"
                                        value={userData.mobileNumber}
                                        onChange={(e) => setUserData({ ...userData, mobileNumber: e.target.value })}
                                    />
                                    {errors.mobileNumber && <div className="text-danger">{errors.mobileNumber}</div>}
                                </div>
                                <button type="submit" className="btn btn-success">
                                    Submit
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditManager