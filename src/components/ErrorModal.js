import { useState, useContext } from 'react';
import { UIContext } from '../context/UIContext';
import '../styles/SignUpModal.css'

const SignUpModal = ({ }) => {
    // const { userApiKey, setUserApiKey } = useContext(UserContext);
    const { setIsError } = useContext(UIContext);

    return (
        <div className={`small-modal`}>
            <div className="small-modal-content">
                <div className="small-modal-header">
                    <h4 className="small-modal-title">Oops! Error</h4>
                </div>
                <div className="small-modal-footer">
                    <button className="small-close-button" onClick={() => setIsError(false)}>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div> 
            </div>
        </div>
    );
}

export default SignUpModal;
