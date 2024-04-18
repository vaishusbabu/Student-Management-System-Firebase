
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import './Modal.css'

function ModalLogin({ closeModal, handleDeleteConfirmation }) {
    return (
        <div className='modalBackground'>
            <div className='modalContainer'>
                <div className='titleCloseBtn'>
                    <button onClick={() => closeModal(false)}>X</button>
                </div>
                <div className='title'>
                    <div className="body">
                        <p>Are you sure ?</p>
                        <div className="footer">
                            <button className="btn btn-danger" onClick={() => handleDeleteConfirmation()}>Delete</button>
                            <button className="btn btn-secondary" onClick={() => closeModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalLogin;

