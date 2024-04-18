// const handleSubmit = (e) => {
//     e.preventDefault();
//     const newErrors = {};
//     const { name, email, password, mobileNumber, userType, manager, ...data } = formData;

//     if (isEmpty(name)) {
//         newErrors.name = 'Please enter your name.';
//     }
//     if (isEmpty(email)) {
//         newErrors.email = 'Please enter your email.';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//         newErrors.email = 'Please enter a valid email address.';
//     }
//     if (isEmpty(password)) {
//         newErrors.password = 'Please enter your password.';
//     } else if (password.length < 6) {
//         newErrors.password = 'Password must be at least 6 characters.';
//     }
//     if (isEmpty(mobileNumber)) {
//         newErrors.mobileNumber = 'Please enter your mobile number.';
//     } else if (!isValidPhoneNumber(mobileNumber)) {
//         newErrors.mobileNumber = 'Please enter a valid phone number.';
//     }
//     if (userType === 'student' && isEmpty(manager)) {
//         newErrors.manager = 'Please select a manager.';
//     }

//     if (Object.keys(newErrors).length === 0) {
//         console.log('Form Data:', formData);
//         let localStorageKey = userType === 'student' ? 'studentFormData' : userType === 'manager' ? 'managerFormData' : 'userFormData';
//         let storedData = JSON.parse(localStorage.getItem(localStorageKey)) || [];

//         storedData.push(formData);

//         localStorage.setItem(localStorageKey, JSON.stringify(storedData));
//         console.log(`Form data saved to localStorage (${userType}):`, storedData);

//         setFormData({
//             name: '',
//             email: '',
//             password: '',
//             mobileNumber: '',
//             userType: ' ',
//             manager: ''
//         });
//         setErrors({});
//     } else {
//         setErrors(newErrors);
//     }
// };

// const managerData = JSON.parse(localStorage.getItem('managerFormData'));
// console.log('Manager Data:', managerData);

// //////////
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { isValidPhoneNumber } from 'react-phone-number-input';
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { auth, storage, db } from "../firebase";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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

//         if (!name.trim()) {
//             newErrors.name = 'Please enter your name.';
//         }
//         if (!email.trim()) {
//             newErrors.email = 'Please enter your email.';
//         } else if (!/\S+@\S+\.\S+/.test(email)) {
//             newErrors.email = 'Please enter a valid email address.';
//         }
//         if (!password.trim()) {
//             newErrors.password = 'Please enter your password.';
//         } else if (password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters.';
//         }
//         if (!mobileNumber.trim()) {
//             newErrors.mobileNumber = 'Please enter your mobile number.';
//         } else if (!isValidPhoneNumber(mobileNumber)) {
//             newErrors.mobileNumber = 'Please enter a valid phone number.';
//         }
//         if (userType === 'student' && !manager.trim()) {
//             newErrors.manager = 'Please select a manager.';
//         }
//         if (Object.keys(newErrors).length === 0) {
//             try {
//                 const res = await createUserWithEmailAndPassword(auth, email, password);
//                 const storageRef = ref(storage, name);
//                 const uploadTask = uploadBytesResumable(storageRef, data.file);

//                 uploadTask.on('state_changed',
//                     null,
//                     (error) => {
//                         setErrors({ message: 'Error uploading file' });
//                     },
//                     async () => {
//                         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//                         await updateProfile(res.user, {
//                             displayName: name,
//                             photoURL: downloadURL
//                         });
//                         await setDoc(doc(db, "users", res.user.uid), {
//                             uid: res.user.uid,
//                             displayName: name,
//                             email,
//                             photoURL: downloadURL
//                         });
//                         await setDoc(doc(db, "userChats", res.user.uid), {});
//                         console.log('User registered successfully:', res.user.uid);
//                     }
//                 );
//             } catch (err) {
//                 setErrors({ message: err.message });
//             }

//             setFormData({
//                 name: '',
//                 email: '',
//                 password: '',
//                 mobileNumber: '',
//                 userType: ' ',
//                 manager: ''
//             });
//             setErrors({});
//         } else {
//             setErrors(newErrors);
//         }
//     };

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
//                                         {/* Render manager options here */}
//                                     </select>
//                                     {errors.manager && <div className="text-danger">{errors.manager}</div>}
//                                 </div>
//                             )}
//                         <button type="submit" className="btn btn-primary">Submit</button>
//                     </form>
//                     {errors.message && <div className="text-danger">{errors.message}</div>}
     

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';

function ViewAllUsers() {
    const [studentData, setStudentData] = useState([]);
    const [managerData, setManagerData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const studentRef = db.collection('users').where('userType', '==', 'student');
                const studentSnapshot = await studentRef.get();
                const students = studentSnapshot.docs.map((doc) => doc.data());
                setStudentData(students);

                const managerRef = db.collection('users').where('userType', '==', 'manager');
                const managerSnapshot = await managerRef.get();
                const managers = managerSnapshot.docs.map((doc) => doc.data());
                setManagerData(managers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleDelete = async (index, userType) => {
        try {
            const userData = userType === 'student' ? studentData : managerData;
            const userId = userData[index].uid;
            await db.collection('users').doc(userId).delete();

            if (userType === 'student') {
                const updatedStudents = [...studentData];
                updatedStudents.splice(index, 1);
                setStudentData(updatedStudents);
            } else if (userType === 'manager') {
                const updatedManagers = [...managerData];
                updatedManagers.splice(index, 1);
                setManagerData(updatedManagers);
            }

            console.log(`User deleted from Firestore (${userType}) at index ${index}`);
        } catch (error) {
            console.error('Error deleting user:', error);
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
                    <h6>View all Students </h6>
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
                                {studentData.map((student, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.mobileNumber}</td>
                                        <td>{student.manager}</td>
                                        <td><button type="button" className="btn btn-danger" onClick={() => handleDelete(index, 'student')}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='formWrapper'>
                    <h6>View all Managers </h6>
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
                                {managerData.map((manager, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{manager.name}</td>
                                        <td>{manager.email}</td>
                                        <td>{manager.mobileNumber}</td>
                                        <td><button type="button" className="btn btn-danger" onClick={() => handleDelete(index, 'manager')}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewAllUsers;
