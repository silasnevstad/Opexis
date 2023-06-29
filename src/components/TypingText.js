import React, { useState, useEffect } from 'react';
import '../styles/TypingText.css'

const TypingText = () => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [backspace, setBackspace] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(getRandomTypingSpeed());
    const [isPause, setIsPause] = useState(false); // New pause state

    // List of phrases to display
    const phrases = [
        "Piecing together 0s and 1s", 
        "Booting up the AI", 
        "Working on it...", 
        "Assembling the code snippets...", 
        "Constructing code...",
        "Building digital blueprint...",
        "Initiating the code orchestra...",
        "Generating syntactic sugar...",
        "Deploying algorithmic magic...",
        "Stitching code fabric...",
        "Igniting digital neurons...",
        "Crafting code ecosystem...",
        "Raising the algorithmic curtain...",
        "Weaving binary tapestry...",
        "Energizing the code engine...",
    ];
    

    // Returns a random typing speed between a range
    function getRandomTypingSpeed(){
        return Math.floor(Math.random() * 100 + 50); // between 50 and 150
    }

    //Typing effect
    useEffect(() => {
        if (isPause) return; // if pausing, don't continue with the typing effect

        if (index === phrases.length) setIndex(0);

        if (subIndex === phrases[index].length+1 && !backspace && !isPause) {
            setBackspace(true);
            setIsPause(true); // start pausing
            setTimeout(() => { 
                setIsPause(false); // stop pausing
                setTypingSpeed(30); // set typing speed for deleting
            }, 2000); // pause for 1 second
        } else if (backspace && subIndex === 0 && !isPause) {
            setBackspace(false);
            setIndex((prevIndex) => prevIndex === phrases.length - 1 ? 0 : prevIndex + 1);
            setTypingSpeed(getRandomTypingSpeed());
        }

        const timeout = setTimeout(() => {
            setSubIndex((prevSubIndex) => prevSubIndex + (backspace ? -1 : 1));
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [subIndex, index, backspace, typingSpeed, isPause]); // add isPause to dependencies array

    return (
        <p>{`${phrases[index].substring(0, subIndex)}`}</p>
    )
}

export default TypingText;
