import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

const createConfig = (props) => {
    let config = {};
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const Html5QrcodePlugin = (props) => {

    useEffect(() => {
        const config = createConfig(props);
        const verbose = props.verbose === true;
        
        // Ensure the success callback exists (for any additional logic)
        if (!props.qrCodeSuccessCallback) {
            throw "qrCodeSuccessCallback is required callback.";
        }

        // Define a custom success callback that will send the data to your endpoint
        const onScanSuccess = (decodedText, decodedResult) => {
            // Optionally, execute any additional logic provided via props
            props.qrCodeSuccessCallback(decodedText, decodedResult);

            // Prepare the payload with the scanned URL
            const payload = {
                qrData: decodedText
            };

            // Send the payload to the endpoint using fetch
            fetch("https://software-invite-api-self.vercel.app/guest/scan-qrcode/hardcode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                console.log("Endpoint update successful:", data);
                // After successfully updating the endpoint, navigate to the specified link
                window.location.href = "https://www.softinvite.com/blog";
            })
            .catch(error => {
                console.error("Error sending QR data to endpoint:", error);
            });
        };

        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        html5QrcodeScanner.render(onScanSuccess, props.qrCodeErrorCallback);

        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner.", error);
            });
        };
    }, [props]);

    return (
        <div id={qrcodeRegionId} />
    );
};

export default Html5QrcodePlugin;
