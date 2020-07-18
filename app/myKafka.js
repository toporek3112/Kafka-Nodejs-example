const kafka = require("kafka-node")
const JSONStream = require('JSONStream');

const brokerList = process.env.BROKER_LIST
console.log("BROKER LIST: " + brokerList);

const kafkaClient = new kafka.KafkaClient({
    kafkaHost: brokerList,
    autoConnect: true,
});

const producer = new kafka.Producer(kafkaClient, { partitionerType: 1 })
const consumerGroupStream = new kafka.ConsumerGroupStream({ kafkaHost: brokerList.split(',')[0], groupId: "test-node-group", encoding: "utf8" }, ["first_topic"])

exports.writeToKafka = (message) => {
    let payload = [
        { topic: 'first_topic', messages: message }
    ]

    producer.send(payload, (err, data) => {
        if (err) {console.log(err);return}
        console.log(data);
    })

    producer.on('error', function (err) { console.error(err); })
}

exports.readFromKafka = () => {
    return consumerGroupStream.pipe(JSONStream.stringify())
}