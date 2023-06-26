import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { UIContext } from '../context/UIContext';
import '../styles/SignUpModal.css'

const AccountModal = ({ handleLogout }) => {
    const { userApiKey, userEmail, setUserApiKey } = useContext(UserContext);
    const { accountModalOpen, setAccountModalOpen } = useContext(UIContext);
    const [settingApiKey, setSettingApiKey] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const handleConfirm = () => {
        if (settingApiKey) {
            if (!apiKey) {
                alert('Please fill out all fields');
                return;
            }
            setUserApiKey(apiKey);
        } else {
            setSettingApiKey(true);
        }
    }

    return (
        <div className={`small-modal ${accountModalOpen ? 'open' : ''}`}>
            <button className='small-close-button' type="button" onClick={() => setAccountModalOpen(false)}>
                <span className="small-close-button-text">×</span>
            </button>
            <div className="small-modal-content">
                <div className="small-modal-header">
                    <h4 className="small-modal-title">{settingApiKey ? 'API Key' : 'Account'}</h4>
                </div>
                <div className="small-modal-body">
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
                        <div className="input-field-container">
                            <p className="small-modal-body-text">{userEmail}</p>
                            {userApiKey ? 
                                <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <p className="small-modal-body-text">{userApiKey ? `API Key ` : 'No API Key set'}</p>
                                    {!settingApiKey && userApiKey && <p className="small-modal-body-text bold">{`...${userApiKey.slice(-4)}`}</p>}
                                </span>
                                :
                                <p className="small-modal-body-text">No API Key set</p>
                            }
                        </div>
                    }
                </div>
                <div className="small-modal-footer">
                    <button className="small-modal-button redwhitehover" onClick={handleLogout}>{settingApiKey ? 'Cancel' : 'Log Out'}</button>
                    <button className="small-modal-button green" onClick={handleConfirm}>{settingApiKey ? 'Save' : 'Set API Key'}</button>
                </div>
                {/* <p className="small-modal-footer-text" onClick={() => setLogginIn(!logginIn)}>{logginIn ? 'Don\'t have an account? Sign up' : 'Already have an account? Log in'}</p> */}
            </div>
        </div>
    );
}

export default AccountModal;
