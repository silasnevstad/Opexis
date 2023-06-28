import { useState, useContext } from 'react';
import { signInWithGoogle } from '../services/firebase';
// import { UserContext } from '../context/UserContext';
import { UIContext } from '../context/UIContext';
import '../styles/SignUpModal.css'

const SignUpModal = ({ onSignUp, onLogin }) => {
    // const { userApiKey, setUserApiKey } = useContext(UserContext);
    const { signUpModalOpen, setSignUpModalOpen } = useContext(UIContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [logginIn, setLogginIn] = useState(false);

    const handleGoogleLogin = () => {
        signInWithGoogle()
        .then(result => {
            if (result.success) {
                setSignUpModalOpen(false);
            } else {
                alert(result.error);
            }
        })
        .catch(error => {
            console.error(error);
            alert(error);
        });
    }
    

    const handleConfirm = () => {
        if (!email || !password) {
            alert('Please fill out all fields');
            return;
        }
        if (logginIn) {
            onLogin(email, password);
        } else {
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            onSignUp(email, password);
        }
    }

    const renderAuthForm = () => (
        <div className="small-modal-body">
            <form className="small-modal-form">
                <div className="input-field-container">
                    <input
                        type={'text'}
                        id={"email"}
                        placeholder=""
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={!email ? '' : 'non-empty'}
                    />
                    <label htmlFor={"email"}>Email</label>
                </div>
                <div className="input-field-container">
                    <input
                        type={'password'}
                        id={"password"}
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={!password ? '' : 'non-empty'}
                    />
                    <label htmlFor={"password"}>Password</label>
                </div>
                {!logginIn &&
                <div className="input-field-container">
                    <input
                        type={'password'}
                        id={"confirm-password"}
                        placeholder=""
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={!confirmPassword ? '' : 'non-empty'}
                    />
                    <label htmlFor={"confirm-password"}>Confirm Password</label>
                </div>}
            </form>
            <button className="small-modal-button blue" onClick={handleConfirm}>{logginIn ? 'Log In' : 'Sign Up'}</button>
            <p className="small-modal-footer-text" onClick={() => setLogginIn(!logginIn)}>{logginIn ? 'Don\'t have an account? Sign up' : 'Already have an account? Log in'}</p>
            <div className="small-modal-splitter">
                <div className="small-modal-splitter-line" />
                <span className="small-modal-splitter-text">or</span>
                <div className="small-modal-splitter-line" />
            </div>
            <button onClick={handleGoogleLogin} className="google-btn" type="button">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" className="google-logo" />
                <span>Sign up with Google</span>
            </button>
        </div>
    )

    return (
        <div className={`small-modal ${signUpModalOpen ? 'open' : ''}`}>
            <div className="small-modal-content">
                <div className="small-modal-header">
                    <h4 className="small-modal-title">{logginIn ? 'Log In' : 'Sign Up'}</h4>
                </div>
                {renderAuthForm()}
                <div className="small-modal-footer">
                    <button className="small-close-button" onClick={() => setSignUpModalOpen(false)}>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div> 
            </div>
        </div>
    );
}

export default SignUpModal;
