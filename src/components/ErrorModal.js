import { useState, useContext } from 'react';
import { UIContext } from '../context/UIContext';
import emailjs from '@emailjs/browser';
import '../styles/SignUpModal.css'

const ErrorModal = ({isSidebarOpen}) => {
    // const { userApiKey, setUserApiKey } = useContext(UserContext);
    const { setIsError } = useContext(UIContext);
    const [feedback, setFeedback] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [isSuccess, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (!feedback) {
            setLoading(false);
            return;
        }

        // Send the form data to EmailJS
        emailjs.send('service_hc9akgh', 'template_damsors', { feedback }, '5zJalJbOIpV3-eipy')
            .then((response) => {
                setLoading(false);
                setSuccess(true);
            })
            .catch((err) => {
                setLoading(false);
            });
    };

    return (
        <div className={isSidebarOpen ? `error-modal sidebar-open` : `error-modal`}>
            <div className="error-modal-content">
                <div className="error-image">
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" fill="none">
                        <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" strokeLinejoin="round" strokeLinecap="round"></path>
                    </svg>
                </div>
                <div className="small-modal-header">
                    <h4 className="small-modal-title">Oops! Error</h4>
                </div>
                <div className="error-modal-body">
                    <p className="error-modal-body-text">This project is still in its beta phase, sorry for the inconvenience. If you'd like please let me know what went wrong.</p>
                    <div className="small-modal-section">
                        <form className="small-modal-form">
                            <div className="input-field-container">
                                <input
                                    type={'text'}
                                    id={"feedback"}
                                    placeholder="Any feedback is helpful!"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className={!feedback ? '' : 'non-empty'}
                                />
                                {/* <label htmlFor={"feedback"}>feedback</label> */}
                            </div>
                        </form>
                        <button className="small-modal-button blue" onClick={handleSubmit}>
                            {isLoading ? 'Sending...' : isSuccess ? 'Sent!' : 'Submit Feedback'}
                        </button>
                    </div>
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

export default ErrorModal;
