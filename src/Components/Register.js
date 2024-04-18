import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from 'firebase/firestore';

function Register() {
    const [errors, setErrors] = useState({});
    const [managers, setManagers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobileNumber: '',
        userType: '',
        manager: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        delete errors[name] //to clear the error message after entering data
    };
    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const managerQuery = query(collection(db, 'users'), where('userType', '==', 'manager'));
                const managerSnapshot = await getDocs(managerQuery);
                const managers = managerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                setManagers(managers);
                console.log("managers", managers);
            } catch (error) {
                console.error('Error fetching managers:', error);
            }
        };

        if (formData.userType === 'student') {
            fetchManagers();
        }
    }, [formData.userType]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        const { name, email, password, mobileNumber, userType, manager, ...data } = formData;

        if (isEmpty(name)) {
            newErrors.name = 'Please enter your name.';
        }
        if (isEmpty(email)) {
            newErrors.email = 'Please enter your email.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (isEmpty(password)) {
            newErrors.password = 'Please enter your password.';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }
        if (isEmpty(mobileNumber)) {
            newErrors.mobileNumber = 'Please enter your mobile number.';
        } else if (!isValidPhoneNumber(mobileNumber)) {
            newErrors.mobileNumber = 'Please enter a valid phone number.';
        }
        if (userType === 'student' && isEmpty(manager)) {
            newErrors.manager = 'Please select a manager.';
        }
        if (userType !== 'student' && userType !== 'manager') {
            newErrors.userType = 'Please select a valid user type.';
        }
        if (Object.keys(newErrors).length === 0) {
            try {
                const res = await createUserWithEmailAndPassword(auth, email, password);

                await updateProfile(res.user, {
                    name: name
                });

                // Create a new document in the 'users' collection with the user's data
                await setDoc(doc(db, "users", res.user.uid), {
                    uid: res.user.uid,
                    name,
                    email,
                    mobileNumber,
                    userType,
                    manager
                });
                alert("User registered successfully")

                console.log('User registered successfully:', res.user.uid);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    mobileNumber: '',
                    userType: '',
                    manager: ''
                });
                setErrors({});
            } catch (err) {
                console.error('Error registering user:', err);
                setErrors({ message: err.message });
            }
        } else {
            setErrors(newErrors);
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

            <div className='formContainer'>
                <div className='formWrapper'>
                    <span className='title' logo>Registration Page </span>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="text"
                                className="form-control"
                                placeholder='Name'
                                aria-describedby="emailHelp"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange} />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                        <div className="mb-3">
                            <input type="email"
                                className="form-control"
                                placeholder='Email'
                                aria-describedby="emailHelp"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange} />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <input type="password"
                                className="form-control"
                                placeholder='Password'
                                aria-describedby="emailHelp"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange} />
                            {errors.password && <div className="text-danger">{errors.password}</div>}
                        </div>
                        <div className="mb-3">
                            <input type="text"
                                className="form-control"
                                placeholder='Mobile Number'
                                aria-describedby="emailHelp"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleInputChange} />
                            {errors.mobileNumber && <div className="text-danger">{errors.mobileNumber}</div>}
                        </div>

                        <div className="mb-3">
                            <select className="form-select"
                                aria-label="User Type"
                                name="userType"
                                value={formData.userType}
                                onChange={handleInputChange}>
                                <option value="normal">User</option>
                                <option value="student">Student</option>
                                <option value="manager">Manager</option>
                            </select>
                            {errors.userType && <div className="text-danger">{errors.userType}</div>}
                        </div>
                        {formData.userType === 'student' && (
                            <div className="mb-3">
                                <select className="form-select"
                                    aria-label="Manager"
                                    name="manager"
                                    value={formData.manager}
                                    onChange={handleInputChange}>
                                    <option>Select Manager</option>
                                    {managers.map((manager, index) => (
                                        <option key={index} value={manager.name}>{manager.name}</option>
                                    ))}
                                </select>
                                {errors.manager && <div className="text-danger">{errors.manager}</div>}
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { isEmpty } from 'lodash';
// import { isValidPhoneNumber } from 'react-phone-number-input';
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { auth, db } from "../firebase";
// import { doc, setDoc } from "firebase/firestore";

// function Register() {
//     const [errors, setErrors] = useState({});
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         mobileNumber: '',
//         userType: ' ',
//         manager: ''
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const newErrors = {};
//         const { name, email, password, mobileNumber, userType, manager, ...data } = formData;

//         if (isEmpty(name)) {
//             newErrors.name = 'Please enter your name.';
//         }
//         if (isEmpty(email)) {
//             newErrors.email = 'Please enter your email.';
//         } else if (!/\S+@\S+\.\S+/.test(email)) {
//             newErrors.email = 'Please enter a valid email address.';
//         }
//         if (isEmpty(password)) {
//             newErrors.password = 'Please enter your password.';
//         } else if (password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters.';
//         }
//         if (isEmpty(mobileNumber)) {
//             newErrors.mobileNumber = 'Please enter your mobile number.';
//         } else if (!isValidPhoneNumber(mobileNumber)) {
//             newErrors.mobileNumber = 'Please enter a valid phone number.';
//         }
//         if (userType === 'student' && isEmpty(manager)) {
//             newErrors.manager = 'Please select a manager.';
//         }
//         if (Object.keys(newErrors).length === 0) {
//             try {
//                 const res = await createUserWithEmailAndPassword(auth, email, password);

//                 await updateProfile(res.user, {
//                     name
//                 });
//                 const userData = {
//                     uid: res.user.uid,
//                     name,
//                     email,
//                     mobileNumber,
//                     userType,
//                     manager
//                 };
//                 await setDoc(doc(db, "users", res.user.uid), userData);

//                 console.log('User registered successfully:', res.user.uid);
//                 setFormData({
//                     name: '',
//                     email: '',
//                     password: '',
//                     mobileNumber: '',
//                     userType: ' ',
//                     manager: ''
//                 });
//                 setErrors({});
//             } catch (err) {
//                 console.error('Error registering user:', err);
//                 setErrors({ message: err.message });
//             }
//         } else {
//             setErrors(newErrors);

//         };
//     }

//     const managerData = JSON.parse(localStorage.getItem('managerFormData'));
//     console.log('Manager Data:', managerData);

//     return (
//         <div>
//             <div className='navbar'>
//                 <nav className="navbar navbar-expand-lg navbar-light bg-light">
//                     <div className="container-fluid">
//                         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//                             <span className="navbar-toggler-icon"></span>
//                         </button>
//                         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                             <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//                                 <li className="nav-item">
//                                     <Link className="nav-link active" aria-current="page" to="/adminhome">Home</Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link className="nav-link active" aria-current="page" to="/viewalluser">View All Users</Link>
//                                 </li>
//                                 <li className="nav-item">
//                                     <Link className="nav-link" to="/register">Registration</Link>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                 </nav>
//             </div>

//             <div className='formContainer'>
//                 <div className='formWrapper'>
//                     <span className='title' logo>Registration Page </span>
//                     <form onSubmit={handleSubmit}>
//                         <div className="mb-3">
//                             <input type="text"
//                                 className="form-control"
//                                 placeholder='Name'
//                                 aria-describedby="emailHelp"
//                                 name="name"

//                                 value={formData.name}
//                                 onChange={handleInputChange} />
//                             {errors.name && <div className="text-danger">{errors.name}</div>}
//                         </div>
//                         <div className="mb-3">
//                             <input type="email"
//                                 className="form-control"
//                                 placeholder='Email'
//                                 aria-describedby="emailHelp"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleInputChange} />
//                             {errors.email && <div className="text-danger">{errors.email}</div>}
//                         </div>
//                         <div className="mb-3">
//                             <input type="password"
//                                 className="form-control"
//                                 placeholder='Password'
//                                 aria-describedby="emailHelp"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleInputChange} />
//                             {errors.password && <div className="text-danger">{errors.password}</div>}
//                         </div>
//                         <div className="mb-3">

//                             <input type="text"
//                                 className="form-control"
//                                 placeholder='Mobile Number'
//                                 aria-describedby="emailHelp"
//                                 name="mobileNumber"
//                                 value={formData.mobileNumber}
//                                 onChange={handleInputChange} />
//                             {errors.mobileNumber && <div className="text-danger">{errors.mobileNumber}</div>}
//                         </div>

//                         <div className="mb-3">
//                             <select className="form-select"
//                                 aria-label="User Type"
//                                 name="userType"
//                                 value={formData.userType}
//                                 onChange={handleInputChange}>
//                                 <option value="user">User</option>
//                                 <option value="student">Student</option>
//                                 <option value="manager">Manager</option>
//                             </select>
//                         </div>
//                         {
//                             formData.userType === 'student' && (
//                                 <div className="mb-3">
//                                     <select className="form-select" aria-label="Manager"
//                                         name="manager"
//                                         value={formData.manager}
//                                         onChange={handleInputChange}>
//                                         <option >Select Manager</option>

//                                         {managerData && managerData.map((manager, index) => (
//                                             <option key={index} value={manager.name}>{manager.name}</option>
//                                         ))}

//                                     </select>

//                                 </div>
//                             )}
//                         <button type="submit" className="btn btn-primary">Submit</button>
//                     </form>

//                 </div>
//             </div>
//         </div >
//     );
// }

// export default Register;
