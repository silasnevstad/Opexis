import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SimpleLoader from './SimpleLoader';
import { ProjectContext } from '../context/ProjectContext';
import { UIContext } from '../context/UIContext';
import '../styles/Code.css';

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)`
    width: 100% !important;
    overflow: auto !important;

    @media (max-width: 768px) {
        font-size: 0.9em !important;
        width: 95% !important;
    }
`;

const Code = () => {
    const { projects, activeProjectIndex, selectedFileIndex } = useContext(ProjectContext);
    const { loading } = useContext(UIContext);
    const project = projects[activeProjectIndex];
    const [code, setCode] = useState("");
    // const [filename, setFilename] = useState("");
    const [language, setLanguage] = useState("");

    useEffect(() => {
        if (selectedFileIndex === null) {
            return;
        }
        const outputFile = project.outputFiles[selectedFileIndex];
        if (!outputFile || typeof outputFile.filename !== 'string') {
            return;
        }
        setCode(outputFile.code);
        // setFilename(outputFile.filename);
        setLanguage(outputFile.filename.split(".").pop());
    }, [selectedFileIndex, project, loading]);

    const languageMap = {
        js: "javascript",
        py: "python",
        swift: "swift",
        java: "java",
        rb: "ruby",
        c: "c",
        cpp: "cpp",
        cs: "csharp",
        go: "go",
        php: "php",
        rs: "rust",
        ts: "typescript",
        html: "html",
    };

    const syntaxHighlighterLanguage = languageMap[language] || language;

    if (loading) {
        return (
            <div className="loader-outer-container">
                <div className="loader-title">
                    AI is generating your code...
                </div>
                <SimpleLoader />
            </div>
        )
    }

    return (
        <div className="code-container">
            <StyledSyntaxHighlighter 
                language={syntaxHighlighterLanguage} 
                style={dracula}
                wrapLongLines={true}
            >
                {code}
            </StyledSyntaxHighlighter>
        </div>
    )
}

export default Code;