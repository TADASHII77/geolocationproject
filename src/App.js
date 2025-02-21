import platform from "platform";
import { useState, useEffect, useRef } from "react";

function App() {
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState("");

  const hasSentWhatsApp = useRef(false); // Track WhatsApp message sent
  const hasSentEmail = useRef(false); // Track Email sent

  const handleClick = () => {
    setSubmittedName(name);
    localStorage.setItem("firstname", name);
  };

  const handleClick2 = () => {
    localStorage.removeItem("firstname");
    setSubmittedName("");
  };



  const getDeviceInfo = () => {
    const info = {
      name: platform.name,   // Browser name (e.g., "Chrome")
      version: platform.version, // Browser version
      os: platform.os.family, // OS (e.g., "Windows 10", "iOS 15")
      manufacturer: platform.manufacturer || "Unknown", // Manufacturer (if available)
      model: platform.product || "Unknown" // Device Model (if available)
    };
    setDeviceInfo(info);

  };
  

  

  const getAddressFromCoordinates = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.address) {
        setAddress(data.address);
      } else {
        console.error("Unable to fetch address");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem("firstname");
    if (storedName) {
      setSubmittedName(storedName);
    }
    getDeviceInfo();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  // 📲 Function to send data to WhatsApp (Only Once)
  const sendToWhatsApp = () => {
    // if (hasSentWhatsApp.current) return; // Prevent re-sending

    const message = `Name: ${submittedName}
Location: Latitude ${location.latitude}, Longitude ${location.longitude}
Address: ${JSON.stringify(address)}
Device Info: ${deviceInfo}`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = process.env.REACT_APP_WHATSAPP_NUMBER; 
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");

    hasSentWhatsApp.current = true; // Mark as sent
  };

  // 📧 Function to send data to Gmail (Only Once)
  const sendToEmail = () => {
    // if (hasSentEmail.current) return; // Prevent re-sending

    const subject = "User Details";
    const body = `Name: ${submittedName}
Location: Latitude ${location.latitude}, Longitude ${location.longitude}
Address: ${JSON.stringify(address)}
Device Info: ${deviceInfo}`;
const email = process.env.REACT_APP_EMAIL;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    hasSentEmail.current = true; // Mark as sent
  };

  useEffect(() => {
    if (location.latitude && location.longitude) {
      getAddressFromCoordinates(location.latitude, location.longitude);
      
      sendToWhatsApp(); // Runs only once
      // sendToEmail(); // Runs only once
    }
  }, [location]);

  return (
    <div className="App">
      <div style={{ width: "15rem" }}>
        <label>Type name</label>
        <input
          placeholder="Enter your name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleClick}>Click to save localStorage</button>
        <button onClick={handleClick2}>Clear localStorage</button>
        <p>{submittedName}</p>

        <div>
          {location.latitude && location.longitude ? (
            <p>
              Your location: Latitude: {location.latitude}, Longitude: {location.longitude}
            </p>
          ) : (
            <p>Loading location...</p>
          )}
        </div>

        {address && (
          <div>
            <div>{JSON.stringify(address)}</div>
            <div>
              <div>
                <strong>State District:</strong> {address.state_district}
              </div>
              <div>
                <strong>State:</strong> {address.state}
              </div>
              <div>
                <strong>ISO Code:</strong> {address["ISO3166-2-lvl4"]}
              </div>
              <div>
                <strong>Postcode:</strong> {address.postcode}
              </div>
              <div>
                <strong>Country:</strong> {address.country}
              </div>
              <div>
                <strong>Country Code:</strong> {address.country_code}
              </div>
            </div>
          </div>
        )}

        <div>
        <strong>Device Info:</strong>
        <pre>{JSON.stringify(deviceInfo, null, 2)}</pre>
        </div>

        {/* Buttons to Send Data */}
        <button onClick={sendToWhatsApp}>Send to WhatsApp</button>
        <button onClick={sendToEmail}>Send to Gmail</button>
      </div>
    </div>
  );
}

export default App;


// import './App.css';
// import { useState, useEffect } from 'react';

// function App() {
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');
//   const [address, setAddress] = useState('');

//   // Fetch the address using OpenStreetMap's Nominatim API
//   const getAddressFromCoordinates = async (lat, lon) => {
//     const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       console.log(data)

//       if (data.address) {
//         setAddress(data.address);
//         console.log('Address:', data.address);
//       } else {
//         console.error("Unable to fetch address");
//       }
//     } catch (error) {
//       console.error("Error fetching address:", error);
//     }
//   };

//   // Handle button click
//   const handleClick = () => {
//     if (latitude && longitude) {
//       getAddressFromCoordinates(latitude, longitude);
//     } else {
//       alert("Please enter both latitude and longitude");
//     }
//   };

//   return (
//     <div className="App">
//       <div style={{ width: '20rem', margin: '0 auto' }}>
//         <label>Enter Latitude:</label>
//         <input
//           type="text"
//           value={latitude}
//           onChange={(e) => setLatitude(e.target.value)}
//           placeholder="Latitude"
//         />
//         <br />
//         <label>Enter Longitude:</label>
//         <input
//           type="text"
//           value={longitude}
//           onChange={(e) => setLongitude(e.target.value)}
//           placeholder="Longitude"
//         />
//         <br />
//         <button onClick={handleClick}>Get Address</button>

//         {address && (
//           <div>
//             <h3>Address:</h3>
//             <pre>{JSON.stringify(address, null, 2)}</pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

