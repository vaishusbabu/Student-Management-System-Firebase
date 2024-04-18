import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { auth } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';



function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);


    const defaultAdminEmail = 'admin@gmail.com';
    const defaultAdminPassword = 'admin@123';

    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = values;

        if (email === defaultAdminEmail && password === defaultAdminPassword) {
            localStorage.setItem('loggedInUserEmail', email);
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            alert('Admin Login Success');
            console.log('Login Success');
            navigate('/AdminHome');
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('user', user);
            localStorage.setItem('loggedInUserEmail', email);
            const userData = await getDoc(doc(db, 'users', user.uid));
            if (userData.exists()) {
                const userDataObj = userData.data();
                if (userDataObj.userType === 'student') {
                    alert('Student login successful');
                    navigate('/studenthome');
                } else if (userDataObj.userType === 'manager') {
                    alert('Manager login successful');
                    localStorage.setItem('loggedInUserName', userDataObj.name);
                    navigate('/managerhome');
                } else if (userDataObj.userType === 'admin') {
                    alert('Admin login successful');
                    navigate('/adminhome');
                }
            } else {
                alert('User data not found');
            }
        } catch (err) {
            console.error('Error logging in:', err);
            alert('Error logging in. Please try again.');
        }
    };

    return (
        <div>
            <div className="formContainer">
                <div className="formWrapper">
                    <span className="title" logo>
                        Login
                    </span>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 row">
                            <div className="col-sm-12">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <div className="col-sm-12">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    value={values.password}
                                    onChange={handleChange}
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
                        </div>
                        <button type="submit" className="button">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
