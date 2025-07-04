
const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'driver-producer', brokers: ['localhost:9092'] });

const producer = kafka.producer();

const sendLocation = async () => {
  await producer.connect();
  const driverId = 'driver_001';

  setInterval(async () => {
    const location = {
      driverId,
      lat: 26.8 + Math.random() * 0.1,
      lng: 75.8 + Math.random() * 0.1,
      timestamp: Date.now(),
    };
    await producer.send({
      topic: 'driver-locations',
      messages: [{ value: JSON.stringify(location) }],
    });
    console.log('📡 Sent location:', location);
  }, 3000);
};

sendLocation();
