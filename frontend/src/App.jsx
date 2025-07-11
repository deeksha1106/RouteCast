import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const driverIcon = new L.Icon({
  iconUrl: '/images/driver-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});


const defaultLocation = {
  lat: 26.9124,
  lng: 75.7873,
};

function App() {
  const [location, setLocation] = useState(null);
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${backendUrl}/location/driver_001`);

        
        if (
          res.status === 200 &&
          res.data &&
          typeof res.data.lat === 'number' &&
          typeof res.data.lng === 'number'
        ) {
          console.log('✅ Received location:', res.data);
          setLocation({ lat: res.data.lat, lng: res.data.lng });
        } else {
          console.warn('⚠️ No valid data received. Using last or default location.');
        
          setLocation((prev) => prev ?? defaultLocation);
        }
      } catch (error) {
        console.error('❌ Error fetching location:', error);
        setLocation((prev) => prev ?? defaultLocation);
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
