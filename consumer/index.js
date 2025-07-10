const { Kafka } = require('kafkajs');
const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
  url: process.env.REDIS_URL,
});
client.connect();

const kafka = new Kafka({
  clientId: 'location-consumer',
  brokers: [process.env.KAFKA_BROKER],
  ssl: true,
  sasl: {
    mechanism: process.env.KAFKA_SASL_MECHANISM, // 'plain'
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
});

const consumer = kafka.consumer({ groupId: 'location-group' });

const consume = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.TOPIC_NAME, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const location = JSON.parse(message.value.toString());
      console.log('✅ Received:', location);
      await client.set(location.driverId, JSON.stringify(location));
    },
  });
};

consume();
