import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { UIContext } from '../context/UIContext';
import '../styles/SignUpModal.css'

const AccountPage = ({ userEmail, handleLogout }) => {
    return (
        <div className="big-modal-content">
            <div className="big-modal-body">
                <div className="big-field-container">
                    <div className="big-modal-body-text">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> */}
                        {userEmail}
                    </div>
                </div>
            </div>
            <div className="big-modal-footer">
                <button className="small-modal-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

const PreferencesPage = ({ userApiKey, settingApiKey, setSettingApiKey, apiKey, setApiKey, handleConfirm }) => {
    const toggleSettingApiKey = () => {
        setSettingApiKey(!settingApiKey);
    }

    return (
        <div className="big-modal-content">
            <div className="big-modal-body">
                {settingApiKey ?
                    <div className="input-field-container" style={{ marginBottom: '20px', marginTop: '20px' }}>
                        <input
                            type={'text'}
                            id={"api-key"}
                            placeholder=""
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className={!apiKey ? '' : 'non-empty'}
                        />
                        <label htmlFor={"api-key"}>Set API Key</label>
                    </div>
                    :
                    <p className="small-modal-body-text">{userApiKey === "" ? 'No API Key set' : `${userApiKey}`}</p>
                }
            </div>
            <div className="big-modal-footer">
                {settingApiKey ?
                    <>
                        <button className="small-modal-button-close" onClick={toggleSettingApiKey}>Cancel</button>
                        <button className="small-modal-button" onClick={handleConfirm}>Save</button>
                    </>
                    :
                    <button className="small-modal-button" onClick={toggleSettingApiKey}>Set API Key</button>
                }

            </div>
        </div>
    )
}

const AccountModal = ({ handleLogout }) => {
    const { userApiKey, userEmail, setUserApiKey } = useContext(UserContext);
    const { setAccountModalOpen } = useContext(UIContext);
    const [curentPage, setCurrentPage] = useState('account');
    const [settingApiKey, setSettingApiKey] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const handleConfirm = () => {
        if (settingApiKey) {
            if (!apiKey) {
                alert('Please fill out all fields');
                return;
            }
            setUserApiKey(apiKey);
            setSettingApiKey(false);
        } else {
            setSettingApiKey(true);
        }
    }

    const handleChangePage = (page) => {
        setCurrentPage(page);
        setSettingApiKey(false);
    }

    return (
        <div className="big-modal">
            {curentPage === 'account' ?
                <div className="big-modal-header">
                    <div className="big-modal-header-title">
                        
                        Account
                    </div>
                </div>
            :
                <div className="big-modal-header">
                    <div className="big-modal-header-title">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> */}
                        Preferences
                    </div>
                </div>
            }
            <div className="big-modal-inner">
                <div className="big-modal-left">
                    <div className={curentPage === 'account' ? "big-modal-title active" : "big-modal-title"} onClick={() => handleChangePage('account')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Account
                    </div>
                    <div className={curentPage === 'preferences' ? "big-modal-title active" : "big-modal-title"} onClick={() => handleChangePage('preferences')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> */}
                        {/* Said preferences */}
                        Preferences
                    </div>
                </div>
                <div className="big-modal-right">
                    <button className='big-close-button'type="button" onClick={() => setAccountModalOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    {curentPage === 'account' ? <AccountPage userEmail={userEmail} handleLogout={handleLogout} /> : <PreferencesPage userApiKey={userApiKey} settingApiKey={settingApiKey} setSettingApiKey={setSettingApiKey} apiKey={apiKey} setApiKey={setApiKey} handleConfirm={handleConfirm} />}
                </div>
            </div>
        </div>
    );
}

export default AccountModal;
