const { Kafka } = require('kafkajs');
const redis = require('redis');
const client = redis.createClient();

client.connect();

const kafka = new Kafka({ clientId: 'location-consumer', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'location-group' });

const consume = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'driver-locations', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const location = JSON.parse(message.value.toString());
      console.log('✅ Received:', location);
      await client.set(location.driverId, JSON.stringify(location));
    },
  });
};

consume();
