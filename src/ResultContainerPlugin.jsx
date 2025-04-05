import React, { useEffect } from 'react';

function filterResults(results) {
  let filteredResults = [];
  for (let i = 0; i < results.length; ++i) {
    if (i === 0) {
      filteredResults.push(results[i]);
      continue;
    }
    if (results[i].decodedText !== results[i - 1].decodedText) {
      filteredResults.push(results[i]);
    }
  }
  return filteredResults;
}

const ResultContainerTable = ({ data }) => {
  const results = filterResults(data);
  return (
    <table className="Qrcode-result-table">
      <thead>
        <tr>
          <td>#</td>
          <td>Decoded Text</td>
          <td>Format</td>
        </tr>
      </thead>
      <tbody>
        {results.map((result, i) => {
          console.log(result);
          return (
            <tr key={i}>
              <td>{i}</td>
              <td>{result.decodedText}</td>
              <td>{result.result.format.formatName}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const ResultContainerPlugin = (props) => {
  const results = filterResults(props.results);

  // Assume that when results are available, one of them is the successfully scanned result.
  // And that the scanned result contains the Cloudinary link.
  useEffect(() => {
    if (results.length > 0) {
      // Replace with logic to pick the correct Cloudinary URL from the scan.
      const cloudinaryLink = "https://res.cloudinary.com/dno2asrsh/image/upload/v1743854520/qr_codes/chukwuebuka_Offor_qr.png";

      // Call the API endpoint with the Cloudinary link
      fetch('https://software-invite-api-self.vercel.app/guest/scan-qrcode/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrData: cloudinaryLink }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // Optionally handle the API response data here.
          console.log('API call success:', data);
          // Navigate back to the blog URL.
          window.location.href = 'https://www.softinvite.com/blog';
        })
        .catch((error) => {
          console.error('API call error:', error);
          // Handle the error as needed.
        });
    }
  }, [results]);

  return (
    <div className="Result-container">
      <div className="Result-header">Scanned results ({results.length})</div>
      <div className="Result-section">
        <ResultContainerTable data={results} />
      </div>
    </div>
  );
};

export default ResultContainerPlugin;
