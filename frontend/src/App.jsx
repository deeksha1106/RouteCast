import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 🧭 Create custom driver icon
const driverIcon = new L.Icon({
  iconUrl: '/images/driver-icon.png', // from public folder
  iconSize: [40, 40], // adjust as needed
  iconAnchor: [20, 40], // point of the icon which corresponds to marker location
  popupAnchor: [0, -40],
  shadowUrl: null, // or provide a shadow image if needed
});

function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get('http://localhost:3001/location/driver_001');
        console.log('Received location:', res.data);
        setLocation({ lat: res.data.lat, lng: res.data.lng });
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {!location ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading driver location...</p>
      ) : (
        <MapContainer center={[location.lat, location.lng]} zoom={15} style={{ height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.lat, location.lng]} icon={driverIcon}>
            <Popup>Driver is here 🚚</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default App;
