import React, { useRef, useState } from 'react';
import IdleTimer from 'react-idle-timer';
import Modal from 'react-modal'
import { useNavigate } from "react-router-dom"


Modal.setAppElement('#root')


function IdleTimerContainer(props) {
   
    const idleTimeout=process.env.REACT_APP_IDLE_TIMEOUT                                        // Declare idle Timeout minutes
    const idleTimerRef = useRef(null)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const sessionTimeOutRef = useRef(null)
    const navigate = useNavigate()

    const stayActive = (e) => {
        setModalIsOpen(false);
        clearTimeout(sessionTimeOutRef.current)
    }

    const logout = () => {
        localStorage.clear();
        navigate('/login')
    }

    const onIdle = () => {
        setModalIsOpen(true);
        sessionTimeOutRef.current = setTimeout(logout, 10 * 1000)
    }


    return (
        <div>
            <Modal className="modal" isOpen={modalIsOpen}>
                <h2>You've been idle for a while !</h2>
                <h3>You will be Logge out soon</h3>
                <button onClick={stayActive}>Stay Active</button>
            </Modal>

            <IdleTimer ref={idleTimerRef} timeout={idleTimeout *(60 * 1000)} onIdle={onIdle} >
                {props.children}
            </IdleTimer>
        </div>)
}

export default IdleTimerContainer;
