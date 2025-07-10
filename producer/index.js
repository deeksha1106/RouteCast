require('dotenv').config();
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'driver-producer',
  brokers: [process.env.KAFKA_BROKER],
  ssl: true, 
  sasl: {
    mechanism: process.env.KAFKA_SASL_MECHANISM,
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
});

const producer = kafka.producer();

const sendLocation = async () => {
  try {
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
        topic: process.env.TOPIC_NAME,
        messages: [{ value: JSON.stringify(location) }],
      });

      console.log('📡 Sent location:', location);
    }, 3000);
  } catch (err) {
    console.error('❌ Producer error:', err);
  }
};

sendLocation();
