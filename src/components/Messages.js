import '../styles/Messages.css';

const Messages = ({ messages, loading }) => {
    // messages = [{content: 'hello', isUser: true}, {content: 'hi', isUser: false}}]
    return (
        <div className="App-main-right-messages">
            {/* loop through messages and apply different styling based on user or not */}
            {messages.map((message, index) => {
                return (
                    <div key={index} className={`App-main-right-messages-message ${message.isUser ? 'user' : 'bot'}`}>
                        {message.content}
                    </div>
                )
            })}
            {loading && <div className="loading"></div>}
        </div>
    )
}

export default Messages;
