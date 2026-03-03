# Phase 3: Kafka Mastery

**Duration:** 1-2 months  
**Level:** Streaming Expert

Apache Kafka is a distributed event streaming platform capable of handling trillions of events per day. It's designed for high throughput, fault tolerance, and real-time data processing.

## Table of Contents

1. [Kafka Core Concepts](#1-kafka-core-concepts)
2. [Kafka Internals (Senior Level)](#2-kafka-internals-senior-level)
3. [Kafka Performance Engineering](#3-kafka-performance-engineering)
4. [Kafka Connect & Streams](#4-kafka-connect--streams)

---

## 1. Kafka Core Concepts

### What is Kafka?

Kafka is a distributed streaming platform that:
- **Publishes and subscribes** to streams of records (like a message queue)
- **Stores** streams of records in a fault-tolerant way
- **Processes** streams of records as they occur

**Real-World Analogy:**

Think of Kafka as a **highway system**:
- **Topics** are different highways (e.g., I-95, Route 66)
- **Partitions** are lanes on the highway
- **Producers** are cars entering the highway
- **Consumers** are cars reading road signs (messages)
- **Brokers** are the highway infrastructure

### 1.1 Topic

**What is a Topic?**

A topic is a category or feed name to which records are published. Like a table in a database or a folder in a filesystem.

**Real-World Example:**

```
Topic: "user-events"
  - user.created
  - user.updated
  - user.deleted

Topic: "order-events"
  - order.created
  - order.shipped
  - order.delivered
```

**Code Example: Creating a Topic**

```java
// Java Example
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

KafkaProducer<String, String> producer = new KafkaProducer<>(props);

// Send message to topic
ProducerRecord<String, String> record = new ProducerRecord<>(
    "user-events", 
    "user-123", 
    "User created: John Doe"
);
producer.send(record);
```

```javascript
// Node.js Example
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function sendMessage() {
    await producer.connect();
    await producer.send({
        topic: 'user-events',
        messages: [{
            key: 'user-123',
            value: 'User created: John Doe'
        }]
    });
}
```

```python
# Python Example
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    key_serializer=str.encode,
    value_serializer=str.encode
)

# Send message to topic
producer.send(
    'user-events',
    key='user-123',
    value='User created: John Doe'
)
producer.flush()
```

### 1.2 Partition

**What is a Partition?**

A topic is divided into partitions. Each partition is an ordered, immutable sequence of records. Think of partitions as **shards** of a topic.

**Why Partitions?**

- **Parallelism**: Multiple consumers can read from different partitions simultaneously
- **Scalability**: Distribute data across multiple brokers
- **Ordering**: Messages within a partition are ordered

**Real-World Example:**

```
Topic: "order-events" (3 partitions)

Partition 0: [msg1, msg4, msg7, ...]
Partition 1: [msg2, msg5, msg8, ...]
Partition 2: [msg3, msg6, msg9, ...]
```

**Key Points:**
- Messages with the same key go to the same partition (ensures ordering for that key)
- More partitions = more parallelism, but also more overhead

**Code Example: Partitioning**

```java
// Java Example - Producer with key (determines partition)
KafkaProducer<String, String> producer = new KafkaProducer<>(props);

// Same key = same partition (ordering guaranteed)
producer.send(new ProducerRecord<>("orders", "order-123", "Order created"));
producer.send(new ProducerRecord<>("orders", "order-123", "Order paid"));
producer.send(new ProducerRecord<>("orders", "order-123", "Order shipped"));
// All three messages go to same partition, maintaining order
```

```javascript
// Node.js Example
await producer.send({
    topic: 'orders',
    messages: [
        { key: 'order-123', value: 'Order created' },
        { key: 'order-123', value: 'Order paid' },
        { key: 'order-123', value: 'Order shipped' }
    ]
});
// All messages with same key go to same partition
```

```python
# Python Example
producer.send('orders', key='order-123', value='Order created')
producer.send('orders', key='order-123', value='Order paid')
producer.send('orders', key='order-123', value='Order shipped')
# All messages with same key go to same partition
```

### 1.3 Replication Factor

**What is Replication Factor?**

Number of copies of each partition across brokers. Ensures fault tolerance.

**Example:**

```
Topic: "orders" (3 partitions, replication factor = 3)

Broker 1: Partition 0 (Leader), Partition 1 (Replica), Partition 2 (Replica)
Broker 2: Partition 0 (Replica), Partition 1 (Leader), Partition 2 (Replica)
Broker 3: Partition 0 (Replica), Partition 1 (Replica), Partition 2 (Leader)
```

**Why Replication?**

- **Fault Tolerance**: If a broker fails, replicas can take over
- **High Availability**: System continues operating during failures

**Best Practice:**

- **Replication Factor = 3**: Good balance of safety and resource usage
- **Minimum = 2**: At least 2 copies for basic fault tolerance

### 1.4 ISR (In-Sync Replicas)

**What is ISR?**

In-Sync Replicas are replicas that are caught up with the leader. They have the latest data.

**Why is ISR Important?**

- Leader can only commit writes when ISR replicas acknowledge
- If a replica falls behind, it's removed from ISR
- Ensures data consistency

**Real-World Example:**

```
Leader: [msg1, msg2, msg3, msg4, msg5]
Replica 1: [msg1, msg2, msg3, msg4, msg5] ← In ISR (caught up)
Replica 2: [msg1, msg2, msg3] ← Out of ISR (lagging behind)
```

### 1.5 Controller

**What is a Controller?**

One broker in the cluster acts as the controller. It manages:
- Partition leadership
- Replica assignment
- Broker failures

**How Controller Works:**

1. One broker is elected as controller
2. If controller fails, another broker becomes controller
3. Controller coordinates cluster operations

**Real-World Analogy:**

Like a traffic controller at an intersection - coordinates all the traffic (partitions and replicas).

### 1.6 Consumer Groups

**What is a Consumer Group?**

A group of consumers that work together to consume a topic. Each partition is consumed by only one consumer in the group.

**Real-World Example:**

```
Topic: "orders" (3 partitions)
Consumer Group: "order-processors" (2 consumers)

Consumer 1: Reads Partition 0 and Partition 1
Consumer 2: Reads Partition 2

If Consumer 2 fails:
Consumer 1: Reads Partition 0, Partition 1, and Partition 2 (rebalancing)
```

**Key Points:**

- **Load Balancing**: Partitions are distributed among consumers
- **Scalability**: Add more consumers to process more partitions
- **Fault Tolerance**: If a consumer fails, its partitions are reassigned

**Code Example: Consumer Group**

```java
// Java Example
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("group.id", "order-processors");
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(Arrays.asList("orders"));

while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<String, String> record : records) {
        System.out.printf("Partition: %d, Offset: %d, Value: %s%n",
            record.partition(), record.offset(), record.value());
        processOrder(record.value());
    }
}
```

```javascript
// Node.js Example
const consumer = kafka.consumer({ groupId: 'order-processors' });

async function consume() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'orders' });
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString()
            });
            await processOrder(message.value.toString());
        }
    });
}
```

```python
# Python Example
from kafka import KafkaConsumer

consumer = KafkaConsumer(
    'orders',
    bootstrap_servers=['localhost:9092'],
    group_id='order-processors',
    key_deserializer=lambda k: k.decode('utf-8'),
    value_deserializer=lambda v: v.decode('utf-8')
)

for message in consumer:
    print(f"Partition: {message.partition}, Offset: {message.offset}, Value: {message.value}")
    process_order(message.value)
```

### 1.7 Offset Management

**What is an Offset?**

An offset is a unique identifier for a record within a partition. It's like a page number in a book.

**Why is Offset Important?**

- Tracks consumer progress
- Allows consumers to resume from where they left off
- Enables replay of messages

**Offset Storage:**

- **Kafka (__consumer_offsets topic)**: Default, managed by Kafka
- **External (ZooKeeper)**: Legacy, being phased out

**Code Example: Manual Offset Management**

```java
// Java Example - Manual Commit
Properties props = new Properties();
props.put("enable.auto.commit", "false"); // Disable auto-commit

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(Arrays.asList("orders"));

while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<String, String> record : records) {
        processOrder(record.value());
    }
    // Manually commit offsets after processing
    consumer.commitSync();
}
```

```javascript
// Node.js Example - Manual Commit
await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        await processOrder(message.value.toString());
        // Manual commit
        await consumer.commitOffsets([{
            topic,
            partition,
            offset: (parseInt(message.offset) + 1).toString()
        }]);
    }
});
```

```python
# Python Example - Manual Commit
consumer = KafkaConsumer(
    'orders',
    bootstrap_servers=['localhost:9092'],
    group_id='order-processors',
    enable_auto_commit=False
)

for message in consumer:
    process_order(message.value)
    # Manual commit
    consumer.commit()
```

### 1.8 Rebalancing

**What is Rebalancing?**

When consumers join or leave a consumer group, partitions are redistributed. This is called rebalancing.

**When Does Rebalancing Occur?**

1. **Consumer joins**: New consumer gets assigned partitions
2. **Consumer leaves**: Partitions are redistributed to remaining consumers
3. **Topic partitions change**: New partitions are assigned

**Types of Rebalancing:**

1. **Eager Rebalancing**: All consumers stop, then partitions are reassigned (old way)
2. **Incremental Rebalancing**: Only affected consumers rebalance (new way, better)

**Code Example: Handling Rebalancing**

```java
// Java Example
ConsumerRebalanceListener listener = new ConsumerRebalanceListener() {
    @Override
    public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
        // Save state before rebalancing
        saveState();
    }
    
    @Override
    public void onPartitionsAssigned(Collection<TopicPartition> partitions) {
        // Restore state after rebalancing
        restoreState();
    }
};

consumer.subscribe(Arrays.asList("orders"), listener);
```

```javascript
// Node.js Example
await consumer.subscribe({ topic: 'orders' }, {
    onPartitionsAssigned: (partitions) => {
        console.log('Partitions assigned:', partitions);
        restoreState();
    },
    onPartitionsRevoked: (partitions) => {
        console.log('Partitions revoked:', partitions);
        saveState();
    }
});
```

```python
# Python Example
from kafka import TopicPartition

class RebalanceListener:
    def on_partitions_revoked(self, revoked):
        print(f'Partitions revoked: {revoked}')
        save_state()
    
    def on_partitions_assigned(self, assigned):
        print(f'Partitions assigned: {assigned}')
        restore_state()

consumer.subscribe(['orders'], listener=RebalanceListener())
```

---

## 2. Kafka Internals (Senior Level)

Understanding Kafka internals separates mid-level from senior engineers. These concepts are crucial for troubleshooting and optimization.

### 2.1 Append-Only Log

**What is Append-Only Log?**

Kafka stores messages in an append-only log structure. Messages are written sequentially and never modified.

**Why Append-Only?**

- **Performance**: Sequential writes are much faster than random writes
- **Simplicity**: No need to manage complex data structures
- **Durability**: Data is written to disk sequentially

**Real-World Analogy:**

Like a diary - you write new entries at the end, you never go back and modify old entries.

**Structure:**

```
Partition 0:
Offset 0: [msg1]
Offset 1: [msg2]
Offset 2: [msg3]
Offset 3: [msg4]
...
```

### 2.2 Zero-Copy

**What is Zero-Copy?**

A technique where data is transferred directly from disk to network without copying through application memory.

**Traditional Approach (With Copy):**

```
Disk → Kernel Buffer → User Space → Kernel Buffer → Network
      (copy)          (copy)        (copy)
```

**Zero-Copy Approach:**

```
Disk → Kernel Buffer → Network
      (no copy to user space)
```

**Benefits:**

- **Performance**: Eliminates unnecessary memory copies
- **CPU Usage**: Reduces CPU overhead
- **Throughput**: Higher message throughput

**How Kafka Uses Zero-Copy:**

Kafka uses `sendfile()` system call to transfer data directly from page cache to network socket.

### 2.3 Page Cache

**What is Page Cache?**

Linux uses page cache to cache file data in memory. Kafka leverages this for high performance.

**How it Works:**

1. Kafka writes messages to disk
2. Linux caches these files in page cache (RAM)
3. Consumers read from page cache (fast!)
4. If data not in cache, read from disk

**Benefits:**

- **Fast Reads**: Reading from RAM is much faster than disk
- **OS Managed**: Linux automatically manages cache
- **No Application Overhead**: Kafka doesn't need to manage its own cache

**Real-World Example:**

```
Message written to disk → Stored in page cache (RAM)
Consumer reads message → Reads from page cache (fast!)
If cache full → OS evicts old data (LRU)
```

### 2.4 Leader Election

**What is Leader Election in Kafka?**

When a partition leader fails, a new leader is elected from the ISR replicas.

**Process:**

1. Controller detects leader failure
2. Controller selects new leader from ISR
3. Controller notifies all brokers
4. Producers and consumers connect to new leader

**Election Criteria:**

- Must be in ISR (In-Sync Replicas)
- Prefer replica with highest offset (most up-to-date)

**Code Example: Understanding Leader Election**

```java
// Java Example - Checking partition leader
AdminClient adminClient = AdminClient.create(props);

DescribeTopicsResult result = adminClient.describeTopics(
    Collections.singleton("orders")
);

TopicDescription topicDescription = result.all().get().get("orders");
for (PartitionInfo partitionInfo : topicDescription.partitions()) {
    System.out.println("Partition: " + partitionInfo.partition());
    System.out.println("Leader: " + partitionInfo.leader().id());
    System.out.println("ISR: " + partitionInfo.inSyncReplicas());
}
```

### 2.5 ISR Shrink

**What is ISR Shrink?**

When a replica falls behind the leader, it's removed from ISR (In-Sync Replicas).

**Why Does ISR Shrink?**

- Replica is too slow to catch up
- Network issues preventing replication
- Broker is overloaded

**Impact:**

- Reduces replication factor
- If ISR shrinks too much, availability risk increases
- Need to monitor ISR size

**Configuration:**

```
replica.lag.time.max.ms = 10000  # Replica removed from ISR if lag > 10s
```

### 2.6 Exactly-Once Internals

**What is Exactly-Once Semantics?**

Guarantee that each message is processed exactly once, even if there are failures.

**How Kafka Achieves Exactly-Once:**

1. **Idempotent Producer**: Prevents duplicate messages from producer
2. **Transactional Producer**: Ensures atomic writes across partitions
3. **Transactional Consumer**: Ensures exactly-once processing

**Components:**

- **Producer ID (PID)**: Unique ID for each producer
- **Sequence Number**: Per-partition sequence to detect duplicates
- **Transaction Coordinator**: Manages transactions

**Code Example: Exactly-Once Producer**

```java
// Java Example
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("enable.idempotence", "true"); // Enable idempotence
props.put("transactional.id", "my-transactional-id"); // Enable transactions

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
producer.initTransactions();

try {
    producer.beginTransaction();
    producer.send(new ProducerRecord<>("topic1", "key", "value1"));
    producer.send(new ProducerRecord<>("topic2", "key", "value2"));
    producer.commitTransaction(); // Atomic commit
} catch (Exception e) {
    producer.abortTransaction(); // Rollback on error
}
```

```javascript
// Node.js Example - Exactly-Once (using transactions)
const producer = kafka.producer({
    transactionalId: 'my-transactional-id',
    maxInFlightRequests: 1,
    idempotent: true
});

await producer.connect();

const transaction = await producer.transaction();
try {
    await transaction.send({
        topic: 'topic1',
        messages: [{ key: 'key', value: 'value1' }]
    });
    await transaction.send({
        topic: 'topic2',
        messages: [{ key: 'key', value: 'value2' }]
    });
    await transaction.commit(); // Atomic commit
} catch (error) {
    await transaction.abort(); // Rollback
}
```

```python
# Python Example - Exactly-Once
from kafka import KafkaProducer
from kafka.errors import KafkaError

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    enable_idempotence=True,
    transactional_id='my-transactional-id'
)

producer.init_transactions()

try:
    producer.begin_transaction()
    producer.send('topic1', key=b'key', value=b'value1')
    producer.send('topic2', key=b'key', value=b'value2')
    producer.commit_transaction()  # Atomic commit
except KafkaError:
    producer.abort_transaction()  # Rollback
```

### 2.7 Transaction Coordinator

**What is Transaction Coordinator?**

A special broker that coordinates transactions across the cluster.

**Responsibilities:**

- Assigns transactional IDs to producers
- Tracks transaction state
- Coordinates transaction commits/aborts

**How it Works:**

1. Producer registers with transaction coordinator
2. Coordinator assigns Producer ID (PID)
3. Producer sends messages with transaction markers
4. Coordinator manages transaction lifecycle

### 2.8 Log Compaction

**What is Log Compaction?**

A mechanism to retain the latest value for each key in a topic. Older messages with the same key are removed.

**Why Log Compaction?**

- **State Stores**: Maintain current state of entities
- **Storage Efficiency**: Don't need all historical updates
- **Faster Recovery**: Smaller log size

**Real-World Example:**

```
Before Compaction:
Offset 0: key="user-123", value="John"
Offset 1: key="user-456", value="Jane"
Offset 2: key="user-123", value="John Doe"  ← Updated
Offset 3: key="user-789", value="Bob"

After Compaction:
Offset 1: key="user-456", value="Jane"
Offset 2: key="user-123", value="John Doe"  ← Latest kept
Offset 3: key="user-789", value="Bob"
```

**Use Cases:**

- User profiles
- Configuration data
- Current account balances

**Code Example: Enabling Log Compaction**

```java
// Java Example - Creating compacted topic
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");

AdminClient adminClient = AdminClient.create(props);

Map<String, String> configs = new HashMap<>();
configs.put("cleanup.policy", "compact"); // Enable compaction

NewTopic newTopic = new NewTopic("user-profiles", 3, (short) 3)
    .configs(configs);

adminClient.createTopics(Collections.singleton(newTopic));
```

---

## 3. Kafka Performance Engineering

Performance tuning is critical for production Kafka deployments. Understanding these concepts separates good engineers from great ones.

### 3.1 Producer Tuning

#### 3.1.1 acks

**What is acks?**

Number of acknowledgments the producer requires before considering a request complete.

**Options:**

- **acks=0**: No acknowledgment (fastest, but can lose data)
- **acks=1**: Leader acknowledgment (balanced)
- **acks=all/-1**: All ISR replicas acknowledgment (safest, but slower)

**When to Use:**

- **acks=0**: Logging, metrics (data loss acceptable)
- **acks=1**: Most use cases (good balance)
- **acks=all**: Financial transactions, critical data

**Code Example: Configuring acks**

```java
// Java Example
Properties props = new Properties();
props.put("acks", "all"); // Wait for all ISR replicas
props.put("retries", 3);
props.put("max.in.flight.requests.per.connection", 1); // Required for exactly-once
```

```javascript
// Node.js Example
const producer = kafka.producer({
    acks: -1, // All ISR replicas
    retries: 3,
    maxInFlightRequests: 1
});
```

```python
# Python Example
producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    acks='all',  # All ISR replicas
    retries=3,
    max_in_flight_requests_per_connection=1
)
```

#### 3.1.2 linger.ms

**What is linger.ms?**

Time to wait before sending a batch. Allows batching multiple messages together.

**Trade-off:**

- **Higher linger.ms**: Better batching, higher latency
- **Lower linger.ms**: Lower latency, less batching

**Best Practice:**

- **linger.ms=10-100ms**: Good balance for most use cases
- **linger.ms=0**: Low latency (no batching delay)

**Code Example: Configuring linger.ms**

```java
// Java Example
props.put("linger.ms", 10); // Wait 10ms to batch messages
props.put("batch.size", 16384); // 16KB batch size
```

#### 3.1.3 batch.size

**What is batch.size?**

Maximum size of a batch in bytes. Larger batches = better throughput, but higher latency.

**Best Practice:**

- **batch.size=16384 (16KB)**: Default, good for most cases
- **batch.size=32768 (32KB)**: Higher throughput
- **batch.size=65536 (64KB)**: Maximum throughput

**Code Example: Configuring batch.size**

```java
// Java Example
props.put("batch.size", 32768); // 32KB batches
props.put("linger.ms", 10); // Wait up to 10ms to fill batch
```

#### 3.1.4 Compression

**What is Compression?**

Compress messages before sending to reduce network usage and improve throughput.

**Compression Types:**

- **none**: No compression
- **gzip**: Good compression ratio, higher CPU
- **snappy**: Fast, lower compression ratio
- **lz4**: Very fast, good compression
- **zstd**: Best compression, newer

**When to Use:**

- **snappy/lz4**: Real-time, low latency
- **gzip/zstd**: High throughput, batch processing

**Code Example: Enabling Compression**

```java
// Java Example
props.put("compression.type", "snappy"); // Fast compression
```

```javascript
// Node.js Example
const producer = kafka.producer({
    compression: CompressionTypes.Snappy
});
```

```python
# Python Example
producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    compression_type='snappy'
)
```

#### 3.1.5 Idempotence

**What is Idempotence?**

Prevents duplicate messages even if producer retries. Required for exactly-once semantics.

**How it Works:**

- Producer gets unique Producer ID (PID)
- Each message gets sequence number per partition
- Broker rejects duplicates based on PID + sequence

**Code Example: Enabling Idempotence**

```java
// Java Example
props.put("enable.idempotence", "true"); // Prevents duplicates
// Automatically sets: acks=all, retries=Integer.MAX_VALUE, max.in.flight.requests.per.connection=1
```

### 3.2 Consumer Tuning

#### 3.2.1 max.poll.records

**What is max.poll.records?**

Maximum number of records returned in a single poll. Controls batch size for processing.

**Trade-off:**

- **Higher**: More records per poll, but longer processing time
- **Lower**: Faster polls, but more overhead

**Best Practice:**

- **max.poll.records=500**: Default, good for most cases
- **max.poll.records=1000-5000**: Batch processing
- **max.poll.records=100**: Low latency processing

**Code Example: Configuring max.poll.records**

```java
// Java Example
props.put("max.poll.records", 500); // Process up to 500 records per poll
```

```javascript
// Node.js Example
const consumer = kafka.consumer({
    groupId: 'my-group',
    maxBytesPerPartition: 1048576, // 1MB per partition
    minBytes: 1,
    maxBytes: 10485760 // 10MB total
});
```

```python
# Python Example
consumer = KafkaConsumer(
    'topic',
    bootstrap_servers=['localhost:9092'],
    group_id='my-group',
    max_poll_records=500
)
```

#### 3.2.2 max.poll.interval.ms

**What is max.poll.interval.ms?**

Maximum time between poll calls before consumer is considered dead.

**Why is it Important?**

If processing takes too long, consumer might be kicked out of group (rebalancing).

**Best Practice:**

- **max.poll.interval.ms=300000 (5 min)**: Default
- Increase if processing takes longer
- Or reduce max.poll.records if processing is slow

**Code Example: Configuring max.poll.interval.ms**

```java
// Java Example
props.put("max.poll.interval.ms", 600000); // 10 minutes
props.put("max.poll.records", 100); // Reduce batch size if needed
```

#### 3.2.3 Manual Commit

**What is Manual Commit?**

Explicitly committing offsets after processing. Gives you control over when offsets are committed.

**When to Use:**

- Critical processing (don't want to lose messages)
- Long-running processing
- Exactly-once semantics

**Code Example: Manual Commit**

```java
// Java Example
props.put("enable.auto.commit", "false"); // Disable auto-commit

// Process messages
for (ConsumerRecord<String, String> record : records) {
    processMessage(record);
}

// Commit after processing
consumer.commitSync(); // Or commitAsync() for async
```

### 3.3 Parallel Processing Design

**How to Design Parallel Processing?**

1. **More Partitions**: More parallelism
2. **More Consumers**: More processing power
3. **Stateless Processing**: Easier to scale
4. **Key-Based Partitioning**: Maintain ordering per key

**Best Practices:**

- **Partitions = Consumers**: One consumer per partition (optimal)
- **More Partitions than Consumers**: Some consumers handle multiple partitions
- **Fewer Partitions than Consumers**: Some consumers idle (waste)

**Code Example: Parallel Processing**

```java
// Java Example - Processing in parallel
ExecutorService executor = Executors.newFixedThreadPool(10);

while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    
    for (ConsumerRecord<String, String> record : records) {
        executor.submit(() -> {
            processMessage(record); // Process in parallel
        });
    }
    
    // Commit after all processing
    consumer.commitSync();
}
```

---

## 4. Kafka Connect & Streams

### 4.1 Kafka Connect

**What is Kafka Connect?**

A framework for connecting Kafka with external systems (databases, file systems, etc.).

**Use Cases:**

- Import data from databases to Kafka
- Export data from Kafka to databases
- Connect to cloud services
- File system integration

#### 4.1.1 Source Connectors

**What are Source Connectors?**

Connectors that import data FROM external systems TO Kafka.

**Examples:**

- **JDBC Source**: Import from databases
- **File Source**: Import from files
- **Debezium**: Change Data Capture (CDC) from databases

**Code Example: JDBC Source Connector**

```json
{
  "name": "jdbc-source",
  "config": {
    "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
    "connection.url": "jdbc:postgresql://localhost:5432/mydb",
    "connection.user": "user",
    "connection.password": "password",
    "table.whitelist": "orders",
    "mode": "incrementing",
    "incrementing.column.name": "id",
    "topic.prefix": "jdbc-",
    "tasks.max": "1"
  }
}
```

#### 4.1.2 Sink Connectors

**What are Sink Connectors?**

Connectors that export data FROM Kafka TO external systems.

**Examples:**

- **JDBC Sink**: Export to databases
- **Elasticsearch Sink**: Export to Elasticsearch
- **S3 Sink**: Export to AWS S3

**Code Example: JDBC Sink Connector**

```json
{
  "name": "jdbc-sink",
  "config": {
    "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
    "connection.url": "jdbc:postgresql://localhost:5432/mydb",
    "connection.user": "user",
    "connection.password": "password",
    "topics": "orders",
    "table.name.format": "orders",
    "insert.mode": "insert",
    "tasks.max": "1"
  }
}
```

#### 4.1.3 CDC with Debezium

**What is CDC (Change Data Capture)?**

Capturing changes in databases and streaming them to Kafka in real-time.

**How Debezium Works:**

1. Monitors database transaction log
2. Captures INSERT, UPDATE, DELETE events
3. Publishes changes to Kafka topics
4. Maintains order and consistency

**Use Cases:**

- Real-time data synchronization
- Event sourcing
- Microservices data replication

### 4.2 Kafka Streams

**What is Kafka Streams?**

A client library for building real-time streaming applications that process data in Kafka.

**Key Concepts:**

- **Stream**: Unbounded sequence of records
- **Table**: Collection of key-value pairs (state)
- **Processor**: Logic that processes streams/tables

#### 4.2.1 Basic Stream Processing

**Code Example: Simple Stream Processing**

```java
// Java Example
Properties props = new Properties();
props.put(StreamsConfig.APPLICATION_ID_CONFIG, "streams-app");
props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");

StreamsBuilder builder = new StreamsBuilder();

// Read from input topic
KStream<String, String> source = builder.stream("input-topic");

// Transform messages
KStream<String, String> transformed = source.mapValues(value -> {
    return value.toUpperCase();
});

// Write to output topic
transformed.to("output-topic");

KafkaStreams streams = new KafkaStreams(builder.build(), props);
streams.start();
```

#### 4.2.2 Windowing

**What is Windowing?**

Grouping records by time windows for aggregation.

**Window Types:**

- **Tumbling Window**: Fixed, non-overlapping windows
- **Hopping Window**: Fixed, overlapping windows
- **Session Window**: Dynamic based on activity

**Code Example: Tumbling Window**

```java
// Java Example - Count events per minute
KStream<String, String> stream = builder.stream("events");

KTable<Windowed<String>, Long> counts = stream
    .groupByKey()
    .windowedBy(TimeWindows.of(Duration.ofMinutes(1)))
    .count();

counts.toStream().to("event-counts");
```

#### 4.2.3 Stateful Processing

**What is Stateful Processing?**

Maintaining state (like a database) while processing streams.

**Use Cases:**

- Aggregations (count, sum, average)
- Joins between streams
- Maintaining current state

**Code Example: Stateful Aggregation**

```java
// Java Example - Word count with state
KStream<String, String> stream = builder.stream("text-input");

KTable<String, Long> wordCounts = stream
    .flatMapValues(value -> Arrays.asList(value.toLowerCase().split("\\W+")))
    .groupBy((key, word) -> word)
    .count();

wordCounts.toStream().to("word-counts");
```

---

## Summary

Phase 3 covers Kafka mastery:

✅ **Kafka Core**: Topics, Partitions, Replication, ISR, Controller, Consumer Groups, Offsets, Rebalancing  
✅ **Kafka Internals**: Append-Only Log, Zero-Copy, Page Cache, Leader Election, Exactly-Once, Log Compaction  
✅ **Performance**: Producer tuning (acks, batching, compression), Consumer tuning (polling, commits)  
✅ **Kafka Connect & Streams**: Source/Sink connectors, CDC, Stream processing, Windowing, Stateful processing

---

## Official Documentation & Resources

### Kafka Official Docs
- **Apache Kafka Documentation**: [kafka.apache.org/documentation](https://kafka.apache.org/documentation/)
- **Kafka Streams Documentation**: [kafka.apache.org/documentation/streams](https://kafka.apache.org/documentation/streams/)
- **Kafka Connect Documentation**: [kafka.apache.org/documentation/#connect](https://kafka.apache.org/documentation/#connect)

### Confluent (Kafka Commercial Support)
- **Confluent Documentation**: [docs.confluent.io](https://docs.confluent.io/)
- **Confluent Blog**: [confluent.io/blog](https://www.confluent.io/blog/)
- **Kafka Tutorials**: [kafka-tutorials.confluent.io](https://kafka-tutorials.confluent.io/)

### Learning Resources
- **Kafka: The Definitive Guide**: Book by Neha Narkhede, Gwen Shapira, and Todd Palino
- **Designing Event-Driven Systems**: Book by Ben Stopford
- **Kafka Summit**: [kafka-summit.org](https://www.kafka-summit.org/)

### Client Libraries
- **Java Client**: [github.com/apache/kafka](https://github.com/apache/kafka)
- **Node.js Client (kafkajs)**: [github.com/tulios/kafkajs](https://github.com/tulios/kafkajs)
- **Python Client (kafka-python)**: [github.com/dpkp/kafka-python](https://github.com/dpkp/kafka-python)

### Tools & Monitoring
- **Kafka Manager**: [github.com/yahoo/kafka-manager](https://github.com/yahoo/kafka-manager)
- **Kafdrop**: [github.com/obsidiandynamics/kafdrop](https://github.com/obsidiandynamics/kafdrop)
- **Kafka UI**: [github.com/provectus/kafka-ui](https://github.com/provectus/kafka-ui)

---

**Next Steps**: Once you've mastered Kafka, proceed to [Phase 4: Industrial Messaging](./phase-4-industrial-messaging.md)
