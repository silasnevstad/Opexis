import '../styles/Buttons.css'
import styled from 'styled-components'


const Star1 = styled.div`
    position: absolute;
    top: 20%;
    left: 20%;
    width: 25px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 1s cubic-bezier(0.05, 0.83, 0.43, 0.96);
`;

const Star2 = styled.div`
    position: absolute;
    top: 45%;
    left: 45%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
`;

const Star3 = styled.div`
    position: absolute;
    top: 40%;
    left: 40%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
`;

const Star4 = styled.div`
    position: absolute;
    top: 20%;
    left: 40%;
    width: 8px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all .8s cubic-bezier(0, 0.4, 0, 1.01);
`;

const Star5 = styled.div`
    position: absolute;
    top: 25%;
    left: 45%;
    width: 15px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all .6s cubic-bezier(0, 0.4, 0, 1.01);
`;

const Star6 = styled.div`
    position: absolute;
    top: 5%;
    left: 50%;
    width: 5px;
    height: auto;
    filter: drop-shadow(0 0 0 #fffdef);
    z-index: -5;
    transition: all .8s ease;
`;

const Button = styled.button`
    position: relative;
    padding: 12px 35px;
    width: 20rem;
    background: #637fc7;
    font-size: 17px;
    font-weight: 500;
    color: #181818;
    border: 3px solid #637fc7;
    border-radius: 8px;
    box-shadow: 0 0 0 #fec1958c;
    transition: all .3s ease-in-out;
    cursor: pointer;

    &:hover {
        background: transparent;
        color: #516aab;
        box-shadow: 0 0 25px #516aab8c;
    }

    &:hover ${Star1} {
        position: absolute;
        top: -80%;
        left: -30%;
        width: 25px;
        height: auto;
        filter: drop-shadow(0 0 10px #fffdef);
        z-index: 2;
    }

    &:hover ${Star2} {
        position: absolute;
        top: -25%;
        left: 10%;
        width: 15px;
        height: auto;
        filter: drop-shadow(0 0 10px #fffdef);
        z-index: 2;
    }

    &:hover ${Star3} {
        position: absolute;
        top: 55%;
        left: 25%;
        width: 5px;
        height: auto;
        filter: drop-shadow(0 0 10px #fffdef);
        z-index: 2;
    }

    &:hover ${Star4} {
        position: absolute;
        top: 30%;
        left: 80%;
        width: 8px;
        height: auto;
        filter: drop-shadow(0 0 10px #fffdef);
        z-index: 2;
    }

    &:hover ${Star5} {
        position: absolute;
        top: 25%;
        left: 115%;
        width: 15px;
        height: auto;
        filter: drop-shadow(0 0 10px #fffdef);
        z-index: 2;
    }

    &:hover ${Star6} {
        position: absolute;
        top: 5%;
        left: 60%;
        width: 5px;
        height: auto;
        filter: drop-shadow(0 0 10px #fffdef);
        z-index: 2;
    }
`;


const MagicButton = ({ onClick, children }) => {
    return (
        <Button classNameName="App-main-special-button" onClick={onClick}>
            {children}
            <Star1>
                <svg className="fil0" viewBox="0 0 784.11 815.53" style={{shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd'}} version="1.1" xml="preserve" xmlns="http://www.w3.org/2000/svg"><defs></defs><g id="Layer_x0020_1"><metadata id="CorelCorpID_0Corel-Layer"></metadata><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path></g></svg>
            </Star1>
            <Star2>
                <svg className="fil0" viewBox="0 0 784.11 815.53" style={{shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd'}} version="1.1" xml="preserve" xmlns="http://www.w3.org/2000/svg"><defs></defs><g id="Layer_x0020_1"><metadata id="CorelCorpID_0Corel-Layer"></metadata><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path></g></svg>
            </Star2>
            <Star3>
                <svg className="fil0" viewBox="0 0 784.11 815.53" style={{shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd'}} version="1.1" xml="preserve" xmlns="http://www.w3.org/2000/svg"><defs></defs><g id="Layer_x0020_1"><metadata id="CorelCorpID_0Corel-Layer"></metadata><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path></g></svg>
                </Star3>
            <Star4>
                <svg className="fil0" viewBox="0 0 784.11 815.53" style={{shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd'}} version="1.1" xml="preserve" xmlns="http://www.w3.org/2000/svg"><defs></defs><g id="Layer_x0020_1"><metadata id="CorelCorpID_0Corel-Layer"></metadata><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path></g></svg>
            </Star4>
            <Star5>
                <svg className="fil0" viewBox="0 0 784.11 815.53" style={{shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd'}} version="1.1" xml="preserve" xmlns="http://www.w3.org/2000/svg"><defs></defs><g id="Layer_x0020_1"><metadata id="CorelCorpID_0Corel-Layer"></metadata><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path></g></svg>
            </Star5>
            <Star6>
                <svg className="fil0" viewBox="0 0 784.11 815.53" style={{shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd'}} version="1.1" xml="preserve" xmlns="http://www.w3.org/2000/svg"><defs></defs><g id="Layer_x0020_1"><metadata id="CorelCorpID_0Corel-Layer"></metadata><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path></g></svg>
            </Star6>
        </Button>
    )
}

export default MagicButton