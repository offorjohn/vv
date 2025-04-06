import React, { useEffect } from 'react';

// Default data for testing purposes
const defaultResults = [
  {
    decodedText: "Test QR Code 1",
    result: { format: { formatName: "QR Code" } }
  },
  {
    decodedText: "Test QR Code 2",
    result: { format: { formatName: "QR Code" } }
  },
  {
    decodedText: "Test QR Code 2", // Duplicate to see the filtering in action
    result: { format: { formatName: "QR Code" } }
  }
];

function filterResults(results) {
    console.log('filterResults called with:', results);
    let filteredResults = [];
    for (var i = 0; i < results.length; ++i) {
        console.log(`Iteration ${i}: current result:`, results[i]);
        if (i === 0) {
            console.log('First result, adding to filteredResults');
            filteredResults.push(results[i]);
            continue;
        }

        if (results[i].decodedText !== results[i - 1].decodedText) {
            console.log(`Result ${i} is different from previous result, adding to filteredResults`);
            filteredResults.push(results[i]);
        } else {
            console.log(`Result ${i} is the same as previous result, skipping`);
        }
    }
    console.log('Filtered results:', filteredResults);
    return filteredResults;
}

// Helper function to send filtered results to the backend
const sendResultsToBackend = (results) => {
  fetch('https://languid-southern-swoop.glitch.me/submit-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ results })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Data successfully sent to backend:', data);
  })
  .catch(error => {
    console.error('Error sending data to backend:', error);
  });
};

const ResultContainerTable = ({ data }) => {
    console.log('ResultContainerTable received data:', data);
    const results = filterResults(data);
    console.log('ResultContainerTable filtered results:', results);
    return (
        <table className={'Qrcode-result-table'}>
            <thead>
                <tr>
                    <td>#</td>
                    <td>Decoded Text</td>
                    <td>Format</td>
                </tr>
            </thead>
            <tbody>
                {
                    results.map((result, i) => {
                        console.log(`Rendering row ${i}:`, result);
                        return (
                            <tr key={i}>
                                <td>{i}</td>
                                <td>{result.decodedText}</td>
                                <td>{result.result.format.formatName}</td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
};

const ResultContainerPlugin = (props) => {
    console.log('ResultContainerPlugin props:', props);
    // Use defaultResults if no results are provided
    const results = filterResults(
      (props.results && props.results.length > 0) ? props.results : defaultResults
    );
    console.log('ResultContainerPlugin filtered results:', results);

    // Send results to backend whenever the results change
    useEffect(() => {
      sendResultsToBackend(results);
    }, [results]);

    return (
        <div className='Result-container'>
            <div className='Result-header'>Scanned results ({results.length})</div>
            <div className='Result-section'>
                <ResultContainerTable data={results} />
            </div>
        </div>
    );
};

export default ResultContainerPlugin;
