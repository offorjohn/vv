import React, { useState, useEffect } from 'react';
import './App.css';
import Html5QrcodePlugin from './Html5QrcodePlugin.jsx';
import ResultContainerPlugin from './ResultContainerPlugin.jsx';

const App = (props) => {
    const [decodedResults, setDecodedResults] = useState([]);

    const onNewScanResult = (decodedText, decodedResult) => {
        console.log("App [result]", decodedResult);
        setDecodedResults(prev => [...prev, decodedResult]);
    };

    useEffect(() => {
        // Set a timer to navigate after 5 seconds (5000 milliseconds)
        const timer = setTimeout(() => {
            window.location.href = "https://www.softinvite.com/blog";
        }, 5000);

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="App">
            <section className="App-section">
                <div className="App-section-title"> Html5-qrcode React demo</div>
                <br />
                <br />
                <br />
                <Html5QrcodePlugin
                    fps={10}
                    qrbox={250}
                    disableFlip={false}
                    qrCodeSuccessCallback={onNewScanResult}
                />
                <ResultContainerPlugin results={decodedResults} />
            </section>
        </div>
    );
};

export default App;
