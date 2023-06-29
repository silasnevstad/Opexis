import React, { useState, useEffect } from 'react';
import '../styles/TypingText.css'

const TypingText = () => {
    const phrases = [
        "Piecing together 0s and 1s", 
        "Booting up the AI...", 
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
        "Firing up the logic circuits...",
        "Evoking digital enchantments...",
        "Activating digital alchemy...",
        "Unleashing AI intellect...",
        "Clarifying vision...",
        "Narrowing focus...",
    ];
    // random index for phrases array to start typing
    const [index, setIndex] = useState(Math.floor(Math.random() * phrases.length));
    const [subIndex, setSubIndex] = useState(0);
    const [backspace, setBackspace] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(getRandomTypingSpeed());
    const [isPause, setIsPause] = useState(false); // New pause state

    // Returns a random typing speed between a range
    function getRandomTypingSpeed(){
        return Math.floor(Math.random() * 100 + 50);
    }

    // Typing effect
    useEffect(() => {
        if (isPause) return;

        if (index === phrases.length) setIndex(0);

        if (subIndex === phrases[index].length+1 && !backspace && !isPause) {
            setBackspace(true);
            setIsPause(true);
            setTimeout(() => { 
                setIsPause(false);
                setTypingSpeed(30);
            }, 2000);
        } else if (backspace && subIndex === 0 && !isPause) {
            setBackspace(false);
            setIndex((prevIndex) => {
                let newIndex = Math.floor(Math.random() * phrases.length);
                while(newIndex === prevIndex) {
                    newIndex = Math.floor(Math.random() * phrases.length);
                }
                return newIndex;
            });
            setTypingSpeed(getRandomTypingSpeed());
        }

        const timeout = setTimeout(() => {
            setSubIndex((prevSubIndex) => prevSubIndex + (backspace ? -1 : 1));
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [subIndex, index, backspace, typingSpeed, isPause]);

    return (
        <p>{`${phrases[index].substring(0, subIndex)}`}</p>
    )
}

export default TypingText;
