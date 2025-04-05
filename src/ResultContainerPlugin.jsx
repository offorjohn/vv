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

  useEffect(() => {
    if (results.length > 0) {
      // Replace with logic to pick the correct Cloudinary URL from the scan.
      const cloudinaryLink = "https://res.cloudinary.com/dno2asrsh/image/upload/v1743877380/qr_codes/stanley_offor_qr.png";

      // Set a timeout of three seconds before sending the API request.
      const timer = setTimeout(() => {
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
            console.log('API call success:', data);
            // Navigate back to the blog URL.
            window.location.href = 'https://www.softinvite.com/blog';
          })
          .catch((error) => {
            console.error('API call error:', error);
          });
      }, 3000);

      // Cleanup the timeout if the component unmounts before the timeout fires.
      return () => clearTimeout(timer);
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