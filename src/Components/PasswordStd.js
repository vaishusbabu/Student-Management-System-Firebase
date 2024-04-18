import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';


function PasswordStd() {
    const [showPassword, setShowPassword] = useState(false);
    const [newshowPassword, setnewShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);
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
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPassword = userData.newPassword;
        const confirmPassword = userData.confirmPassword;

        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match');
            return;
        }
        if (newPassword === userData.password) {
            alert('New password should be different from the current password');
            return;
        }


        try {
            await updateDoc(doc(db, 'users', userData.id), {
                password: newPassword
            });
            console.log('Password updated successfully');
            alert('Password updated successfully');
        } catch (error) {
            console.error('Error updating password:', error);
        }
    }

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
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>

            <div className='formContainer'>
                <div className='formWrapper'>
                    <h6>Password Change</h6>
                    <form onSubmit={handleSubmit}>
                        {userData && (
                            <div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Password :</label>
                                    <input
                                        readOnly
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        id="name"
                                        value={userData.password}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        aria-label="show password"
                                        className="showEyes"
                                        value={showPassword}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <div>
                                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />
                                            }
                                        </div>

                                        <span> </span>
                                    </button>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">New Password :</label>
                                    <input
                                        type={newshowPassword ? "text" : "password"}
                                        className="form-control"
                                        id="newPassword"
                                        value={userData.newPassword}
                                        onChange={(e) => setUserData(prevState => ({ ...prevState, newPassword: e.target.value }))}
                                    />
                                    <button
                                        type="button"
                                        aria-label="show password"
                                        className="showEyes"
                                        value={newshowPassword}
                                        onClick={() => setnewShowPassword(!newshowPassword)}
                                    >
                                        <div>
                                            {newshowPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />
                                            }
                                        </div>

                                        <span> </span>
                                    </button>


                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Confirm  Password :</label>
                                    <input
                                        type={confirmPassword ? "text" : "password"}
                                        className="form-control"
                                        id="confirmPassword"
                                        value={userData.confirmPassword}
                                        onChange={(e) => setUserData(prevState => ({ ...prevState, confirmPassword: e.target.value }))}
                                    />
                                    <button
                                        type="button"
                                        aria-label="show password"
                                        className="showEyes"
                                        value={confirmPassword}
                                        onClick={() => setConfirmPassword(!confirmPassword)}
                                    >
                                        <div>
                                            {confirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />
                                            }
                                        </div>

                                        <span> </span>
                                    </button>
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

export default PasswordStd