const kafka = require("kafka-node")
const JSONStream = require('JSONStream');


const kafkaClient = new kafka.KafkaClient({
    kafkaHost: 'localhost:9092,localhost:9093,localhost:9094',
    autoConnect: true,
});

const producer = new kafka.Producer(kafkaClient, { partitionerType: 1 })
const consumerGroupStream = new kafka.ConsumerGroupStream({ kafkaHost: "localhost:9092", groupId: "test-node-group", encoding: "utf8" }, ["first_topic"])

exports.writeToKafka = (message) => {
    let payload = [
        { topic: 'first_topic', messages: message }
    ]

    producer.send(payload, (err, data) => {
        console.log(data);
    })

    producer.on('error', function (err) { console.error(err); })
}

exports.readFromKafka = () => {
    return consumerGroupStream.pipe(JSONStream.stringify())
}