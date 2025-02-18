import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState('');

  const handleClick = () => {
    setSubmittedName(name);
    localStorage.setItem('firstname', name);
  };

  const handleClick2 = () => {
    localStorage.removeItem('firstname');
    setSubmittedName('');
  };

  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    setDeviceInfo(userAgent);
  };

  const getAddressFromCoordinates = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.address) {
        setAddress(data.address);
        console.log('Full Address:', data.address);
      } else {
        console.error('Unable to fetch address');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem('firstname');
    if (storedName) {
      console.log('localStorage', storedName);
      setSubmittedName(storedName);
    }
    getDeviceInfo();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      getAddressFromCoordinates(location.latitude, location.longitude);
    }
  }, [location]);

  return (
    <div className="App">
      <div style={{ width: '15rem' }}>
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
            <p>Your location: Latitude: {location.latitude}, Longitude: {location.longitude}</p>
          ) : (
            <p>Loading location...</p>
          )}
        </div>

        {address && (
          <div>
            <div><strong>House Name:</strong> {address.house_number || "Not Available"}</div>
            <div><strong>Street:</strong> {address.road || "Not Available"}</div>
            <div><strong>Gali Number / Area:</strong> {address.suburb || address.neighbourhood || "Not Available"}</div>
            <div><strong>City:</strong> {address.city || address.town || "Not Available"}</div>
            <div><strong>State:</strong> {address.state || "Not Available"}</div>
            <div><strong>Postcode:</strong> {address.postcode || "Not Available"}</div>
            <div><strong>Country:</strong> {address.country || "Not Available"}</div>
          </div>
        )}

        <div>
          <strong>Device Info:</strong>
          <p>{deviceInfo}</p>
        </div>
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

