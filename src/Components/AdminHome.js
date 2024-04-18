import React from 'react';
import { Link } from 'react-router-dom';


function AdminHome() {
    return (
        <div>
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
                            <li class="nav-item">
                                <Link to={'/'}>Logout</Link >
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default AdminHome;
