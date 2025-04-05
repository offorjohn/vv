import React, { useState } from 'react';
import './App.css';
import Html5QrcodePlugin from './Html5QrcodePlugin.jsx';
import ResultContainerPlugin from './ResultContainerPlugin.jsx';

const App = (props) => {
  const [decodedResults, setDecodedResults] = useState([]);

  const onNewScanResult = (decodedText, decodedResult) => {
    console.log("App [result]", decodedResult);
    setDecodedResults(prev => [...prev, decodedResult]);

    // Send scanned URL to the endpoint
    fetch('https://software-invi-api-self.vercel.app/guest/scan-qrcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ qrData: decodedText }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Successfully sent QR data:', data);
        // After successfully updating the endpoint, navigate to the blog link
        window.location.assign("https://www.softinvite.com/blog");
      })
      .catch(error => {
        console.error('Error sending QR data:', error);
      });
  };

  return (
    <div className="App">
      <section className="App-section">
        <div className="App-section-title">Html5-qrcode React demo</div>
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
