# Phase 5: Platform Engineering

**Duration:** 1-2 months  
**Level:** Lead Level

This phase covers platform-level engineering concepts that separate senior engineers from leads and architects. You'll learn how to design, operate, and scale messaging platforms at enterprise scale.

## Table of Contents

1. [Kafka vs RabbitMQ Decision Framework](#1-kafka-vs-rabbitmq-decision-framework)
2. [Enterprise Event Backbone Design](#2-enterprise-event-backbone-design)
3. [Observability & Monitoring](#3-observability--monitoring)
4. [High Availability & Disaster Recovery](#4-high-availability--disaster-recovery)
5. [Security](#5-security)

---

## 1. Kafka vs RabbitMQ Decision Framework

### When to Use What?

Choosing between Kafka and RabbitMQ is one of the most important decisions in messaging architecture. Here's a comprehensive framework.

### Decision Matrix

| Use Case | RabbitMQ | Kafka | Why |
|----------|----------|-------|-----|
| **Task Queue** | ✅ Best | ❌ Not ideal | RabbitMQ designed for task distribution |
| **Event Streaming** | ⚠️ Limited | ✅ Best | Kafka's append-log perfect for streams |
| **High Throughput** | ⚠️ Moderate | ✅ Very High | Kafka's batching and zero-copy |
| **Strict Ordering** | Per queue | Per partition | Both support ordering, different scope |
| **Long-term Storage** | ❌ No | ✅ Yes | Kafka retains messages, RabbitMQ doesn't |
| **Complex Routing** | ✅ Excellent | ⚠️ Limited | RabbitMQ's exchanges are powerful |
| **Low Latency** | ✅ Excellent | ⚠️ Higher | RabbitMQ optimized for low latency |
| **Message TTL** | ✅ Yes | ⚠️ Retention-based | RabbitMQ has per-message TTL |
| **Pub/Sub** | ✅ Yes | ✅ Yes | Both support, different models |
| **Backpressure** | ✅ Built-in | ⚠️ Manual | RabbitMQ has flow control |

### Detailed Use Cases

#### Use RabbitMQ When:

1. **Task Queues**
   - Background job processing
   - Work distribution
   - Request-response patterns

2. **Complex Routing**
   - Need topic/fanout/direct exchanges
   - Dynamic routing rules
   - Header-based routing

3. **Low Latency Requirements**
   - Real-time notifications
   - User-facing features
   - Sub-second response times

4. **Message TTL**
   - Time-sensitive messages
   - Expiring tasks
   - Temporary data

5. **Small to Medium Throughput**
   - < 100K messages/second
   - Moderate message sizes

**Real-World Example: E-commerce Order Processing**

```
Order Service → RabbitMQ (Direct Exchange)
  ├─→ Payment Queue (process payment)
  ├─→ Inventory Queue (reserve inventory)
  └─→ Notification Queue (send email)

Why RabbitMQ?
- Task queue pattern
- Complex routing needed
- Low latency important
- Message TTL for expired orders
```

#### Use Kafka When:

1. **Event Streaming**
   - Event sourcing
   - Stream processing
   - Real-time analytics

2. **High Throughput**
   - Millions of messages/second
   - Large-scale data ingestion

3. **Long-term Storage**
   - Event history
   - Replay capabilities
   - Audit logs

4. **Multiple Consumers**
   - Same data, different processing
   - Data lake ingestion
   - Real-time + batch processing

5. **Time-Series Data**
   - Metrics
   - Logs
   - Telemetry

**Real-World Example: User Activity Tracking**

```
Web App → Kafka Topic: "user-events"
  ├─→ Real-time Analytics (Kafka Streams)
  ├─→ Data Lake (Kafka Connect → S3)
  ├─→ Search Index (Kafka Connect → Elasticsearch)
  └─→ Fraud Detection (Kafka Streams)

Why Kafka?
- High throughput (millions of events)
- Multiple consumers need same data
- Long-term storage for analytics
- Stream processing capabilities
```

### Hybrid Approach

**Many enterprises use both:**

```
RabbitMQ: Task queues, request-response, low latency
Kafka: Event streaming, analytics, high throughput
```

**Example Architecture:**

```
User Action → RabbitMQ (Task Queue)
  └─→ Process order
      └─→ Publish event → Kafka (Event Stream)
          ├─→ Analytics
          ├─→ Data Lake
          └─→ Real-time Dashboard
```

### Decision Framework Questions

Ask these questions to decide:

1. **What's the primary use case?**
   - Task processing → RabbitMQ
   - Event streaming → Kafka

2. **What's the throughput requirement?**
   - < 100K msg/sec → RabbitMQ
   - > 100K msg/sec → Kafka

3. **Do you need message replay?**
   - Yes → Kafka
   - No → Either

4. **Do you need complex routing?**
   - Yes → RabbitMQ
   - No → Either

5. **What's the latency requirement?**
   - < 100ms → RabbitMQ
   - > 100ms → Either

6. **Do multiple consumers need the same data?**
   - Yes → Kafka
   - No → Either

---

## 2. Enterprise Event Backbone Design

### What is an Event Backbone?

An event backbone is the central nervous system of an enterprise, connecting all systems through events. It's like the internet for your company's data.

**Key Principles:**

1. **Centralized**: Single source of truth for events
2. **Decoupled**: Services communicate via events, not direct calls
3. **Scalable**: Handles enterprise-scale traffic
4. **Reliable**: Never loses events
5. **Observable**: Full visibility into event flow

### 2.1 Multi-Tenant Kafka

**What is Multi-Tenancy?**

Supporting multiple teams/organizations on the same Kafka cluster while maintaining isolation.

**Isolation Strategies:**

1. **Topic Prefixes**: `team-a.orders`, `team-b.orders`
2. **Virtual Clusters**: Separate clusters per tenant
3. **ACLs**: Access control lists per tenant
4. **Quotas**: Resource limits per tenant

**Code Example: Multi-Tenant Topic Naming**

```java
// Java Example - Multi-Tenant Topic Naming
public class MultiTenantKafka {
    private String tenantId;
    
    public String getTopicName(String baseTopic) {
        // Enforce naming convention
        return String.format("%s.%s", tenantId, baseTopic);
    }
    
    public void publish(String baseTopic, String message) {
        String fullTopic = getTopicName(baseTopic);
        producer.send(new ProducerRecord<>(fullTopic, message));
    }
}

// Usage
MultiTenantKafka kafka = new MultiTenantKafka("team-a");
kafka.publish("orders", "Order created"); // Publishes to "team-a.orders"
```

```javascript
// Node.js Example
class MultiTenantKafka {
    constructor(tenantId) {
        this.tenantId = tenantId;
    }
    
    getTopicName(baseTopic) {
        return `${this.tenantId}.${baseTopic}`;
    }
    
    async publish(baseTopic, message) {
        const fullTopic = this.getTopicName(baseTopic);
        await producer.send({
            topic: fullTopic,
            messages: [{ value: message }]
        });
    }
}
```

```python
# Python Example
class MultiTenantKafka:
    def __init__(self, tenant_id):
        self.tenant_id = tenant_id
    
    def get_topic_name(self, base_topic):
        return f"{self.tenant_id}.{base_topic}"
    
    def publish(self, base_topic, message):
        full_topic = self.get_topic_name(base_topic)
        producer.send(full_topic, value=message)
```

### 2.2 Topic Governance

**What is Topic Governance?**

Rules and processes for managing topics in an enterprise Kafka cluster.

**Governance Areas:**

1. **Naming Conventions**: Standard topic names
2. **Schema Management**: Data format standards
3. **Lifecycle Management**: Creation, updates, deletion
4. **Access Control**: Who can create/use topics
5. **Resource Limits**: Partitions, retention, quotas

**Naming Convention Example:**

```
{domain}.{entity}.{action}.{version}

Examples:
- ecommerce.order.created.v1
- payment.transaction.completed.v1
- user.profile.updated.v2
```

**Code Example: Topic Governance**

```java
// Java Example - Topic Governance
public class TopicGovernance {
    private static final Pattern TOPIC_PATTERN = 
        Pattern.compile("^[a-z]+\\.[a-z]+\\.[a-z]+\\.[v]\\d+$");
    
    public void createTopic(String topicName, int partitions, int replication) {
        // Validate naming convention
        if (!TOPIC_PATTERN.matcher(topicName).matches()) {
            throw new IllegalArgumentException(
                "Topic name must follow: {domain}.{entity}.{action}.{version}"
            );
        }
        
        // Check permissions
        if (!hasPermission(topicName)) {
            throw new SecurityException("No permission to create topic");
        }
        
        // Create topic with governance config
        Map<String, String> configs = new HashMap<>();
        configs.put("retention.ms", "604800000"); // 7 days
        configs.put("cleanup.policy", "delete");
        
        adminClient.createTopics(Collections.singleton(
            new NewTopic(topicName, partitions, (short) replication)
                .configs(configs)
        ));
    }
}
```

### 2.3 Schema Governance

**What is Schema Governance?**

Managing data schemas to ensure compatibility and prevent breaking changes.

**Why is it Important?**

- Prevents breaking changes
- Ensures data compatibility
- Documents data structure
- Enables evolution

**Schema Registry:**

Tools like Confluent Schema Registry or Apicurio manage schemas.

**Schema Evolution Strategies:**

1. **Backward Compatible**: New schema can read old data
2. **Forward Compatible**: Old schema can read new data
3. **Full Compatible**: Both directions

**Code Example: Schema Evolution (Avro)**

```java
// Java Example - Schema Evolution
// V1 Schema
String schemaV1 = "{\"type\":\"record\",\"name\":\"User\",\"fields\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"name\",\"type\":\"string\"}]}";

// V2 Schema (backward compatible - added optional field)
String schemaV2 = "{\"type\":\"record\",\"name\":\"User\",\"fields\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"email\",\"type\":[\"null\",\"string\"],\"default\":null}]}";

// Producer with schema
KafkaAvroSerializer serializer = new KafkaAvroSerializer();
serializer.configure(Collections.singletonMap(
    AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG,
    "http://localhost:8081"
), false);

Properties props = new Properties();
props.put("value.serializer", serializer.getClass());
KafkaProducer<String, GenericRecord> producer = new KafkaProducer<>(props);
```

### 2.4 Naming Conventions

**Topic Naming Best Practices:**

1. **Use dots as separators**: `domain.entity.action.version`
2. **Lowercase only**: Easier to work with
3. **Be descriptive**: Clear what the topic contains
4. **Include version**: Allow schema evolution
5. **Avoid special characters**: Stick to alphanumeric and dots

**Examples:**

```
✅ Good:
- ecommerce.order.created.v1
- payment.transaction.completed.v1
- user.profile.updated.v2

❌ Bad:
- orders (too generic)
- OrderCreated (mixed case)
- order_created_v1 (underscores)
- order-created (hyphens)
```

### 2.5 Retention Strategy

**What is Retention Strategy?**

How long to keep messages in Kafka topics.

**Factors to Consider:**

1. **Regulatory Requirements**: Legal retention periods
2. **Storage Costs**: Longer retention = more storage
3. **Replay Needs**: How far back to replay
4. **Analytics Needs**: Historical data requirements

**Common Strategies:**

- **Short-term (1-7 days)**: High-volume, real-time data
- **Medium-term (30 days)**: Business events, transactions
- **Long-term (1+ years)**: Compliance, audit logs

**Code Example: Retention Configuration**

```java
// Java Example - Retention Configuration
Map<String, String> configs = new HashMap<>();

// 7 days retention
configs.put("retention.ms", "604800000");

// Or size-based retention
configs.put("retention.bytes", "1073741824"); // 1GB

// Or both (whichever comes first)
configs.put("retention.ms", "604800000");
configs.put("retention.bytes", "1073741824");

NewTopic topic = new NewTopic("orders", 3, (short) 3)
    .configs(configs);
```

### 2.6 Capacity Planning

**What is Capacity Planning?**

Estimating resource needs (brokers, disk, network) for Kafka cluster.

**Key Metrics:**

1. **Message Rate**: Messages per second
2. **Message Size**: Average message size
3. **Retention**: How long to keep messages
4. **Replication Factor**: Number of copies
5. **Partitions**: Number of partitions per topic

**Calculation Example:**

```
Requirements:
- 1M messages/second
- 1KB average message size
- 7 days retention
- Replication factor: 3

Calculation:
- Throughput: 1M msg/sec × 1KB = 1GB/sec
- Daily volume: 1GB/sec × 86400 sec = 86.4TB/day
- 7-day volume: 86.4TB × 7 = 604.8TB
- With replication: 604.8TB × 3 = 1.8PB

Broker Requirements:
- 10 brokers needed
- ~180TB per broker
- Network: 1GB/sec per broker
```

---

## 3. Observability & Monitoring

### What is Observability?

Observability is the ability to understand what's happening inside your system by examining its outputs (metrics, logs, traces).

**Three Pillars:**

1. **Metrics**: Numerical measurements over time
2. **Logs**: Event records
3. **Traces**: Request flow through system

### 3.1 Prometheus

**What is Prometheus?**

Open-source monitoring and alerting toolkit. Industry standard for metrics collection.

**Key Concepts:**

- **Metrics**: Time-series data
- **Scraping**: Pull-based collection
- **PromQL**: Query language
- **Alerting**: Rule-based alerts

**Kafka Metrics to Monitor:**

1. **Broker Metrics**
   - `kafka_server_brokertopicmetrics_bytesin_total`: Incoming bytes
   - `kafka_server_brokertopicmetrics_bytesout_total`: Outgoing bytes
   - `kafka_network_requestmetrics_totaltimems`: Request latency

2. **Consumer Metrics**
   - `kafka_consumer_consumer_lag_sum`: Consumer lag
   - `kafka_consumer_consumer_fetch_rate`: Fetch rate

3. **Producer Metrics**
   - `kafka_producer_producer_total_sent_bytes`: Bytes sent
   - `kafka_producer_producer_record_error_total`: Errors

**Code Example: Exposing Kafka Metrics to Prometheus**

```java
// Java Example - Kafka JMX Metrics
// Kafka exposes metrics via JMX
// Prometheus JMX Exporter can scrape them

// prometheus.yml
/*
scrape_configs:
  - job_name: 'kafka'
    static_configs:
      - targets: ['localhost:9999']  # JMX Exporter port
*/

// Start Kafka with JMX Exporter
// KAFKA_OPTS="-javaagent:jmx_prometheus_javaagent.jar=9999:config.yml" bin/kafka-server-start.sh config/server.properties
```

### 3.2 Grafana

**What is Grafana?**

Open-source analytics and visualization platform. Perfect for visualizing Prometheus metrics.

**Common Dashboards:**

1. **Kafka Overview**: Cluster health, throughput, latency
2. **Topic Details**: Per-topic metrics
3. **Consumer Lag**: Consumer group lag monitoring
4. **Broker Health**: Disk usage, network, CPU

**Key Metrics to Visualize:**

- **Throughput**: Messages/second
- **Latency**: P50, P95, P99 latencies
- **Consumer Lag**: Messages behind
- **Disk Usage**: Storage utilization
- **Error Rate**: Failed requests

### 3.3 JMX Metrics

**What is JMX?**

Java Management Extensions - standard way to expose metrics from Java applications.

**Kafka JMX Metrics:**

Kafka exposes hundreds of metrics via JMX. Key ones:

```
kafka.server:type=BrokerTopicMetrics,name=MessagesInPerSec
kafka.server:type=BrokerTopicMetrics,name=BytesInPerSec
kafka.server:type=BrokerTopicMetrics,name=BytesOutPerSec
kafka.consumer:type=consumer-fetch-manager-metrics,client-id=*
kafka.producer:type=producer-metrics,client-id=*
```

**Code Example: Accessing JMX Metrics**

```java
// Java Example - Reading JMX Metrics
import javax.management.*;
import javax.management.remote.*;

public class JMXMetricsReader {
    public void readMetrics() throws Exception {
        JMXServiceURL url = new JMXServiceURL(
            "service:jmx:rmi:///jndi/rmi://localhost:9999/jmxrmi"
        );
        JMXConnector connector = JMXConnectorFactory.connect(url);
        MBeanServerConnection connection = connector.getMBeanServerConnection();
        
        ObjectName objectName = new ObjectName(
            "kafka.server:type=BrokerTopicMetrics,name=MessagesInPerSec"
        );
        
        Double messagesPerSec = (Double) connection.getAttribute(
            objectName, "OneMinuteRate"
        );
        
        System.out.println("Messages/sec: " + messagesPerSec);
    }
}
```

### 3.4 Queue Depth

**What is Queue Depth?**

Number of messages waiting in a queue (RabbitMQ) or consumer lag (Kafka).

**Why Monitor?**

- **High Queue Depth**: Consumers can't keep up
- **Growing Queue**: System overload
- **Zero Queue**: Healthy system

**RabbitMQ Queue Depth:**

```java
// Java Example - Monitoring Queue Depth
Channel channel = connection.createChannel();
DeclareOk declareOk = channel.queueDeclare("my-queue", true, false, false, null);
int messageCount = declareOk.getMessageCount(); // Queue depth
```

**Kafka Consumer Lag:**

```java
// Java Example - Monitoring Consumer Lag
Map<TopicPartition, Long> endOffsets = consumer.endOffsets(partitions);
Map<TopicPartition, Long> committedOffsets = getCommittedOffsets(consumer, partitions);

for (TopicPartition partition : partitions) {
    long lag = endOffsets.get(partition) - committedOffsets.get(partition);
    System.out.println("Lag for " + partition + ": " + lag);
}
```

### 3.5 Consumer Lag

**What is Consumer Lag?**

Difference between latest message offset and consumer's current offset. Critical metric for Kafka.

**Why is it Critical?**

- **High Lag**: Consumers falling behind
- **Growing Lag**: System can't keep up
- **Zero Lag**: Consumers keeping up

**Alerting Thresholds:**

- **Warning**: Lag > 10,000 messages
- **Critical**: Lag > 100,000 messages
- **Growing**: Lag increasing over time

**Code Example: Consumer Lag Monitoring**

```java
// Java Example - Consumer Lag Monitoring
public class ConsumerLagMonitor {
    public void monitorLag(KafkaConsumer<String, String> consumer) {
        Set<TopicPartition> partitions = consumer.assignment();
        
        // Get latest offsets
        Map<TopicPartition, Long> endOffsets = consumer.endOffsets(partitions);
        
        // Get committed offsets
        Map<TopicPartition, OffsetAndMetadata> committed = 
            consumer.committed(partitions);
        
        for (TopicPartition partition : partitions) {
            long endOffset = endOffsets.get(partition);
            long committedOffset = committed.get(partition).offset();
            long lag = endOffset - committedOffset;
            
            if (lag > 100000) {
                alert("High consumer lag: " + lag + " for " + partition);
            }
        }
    }
}
```

### 3.6 Broker Health

**What is Broker Health?**

Overall health of Kafka brokers (CPU, memory, disk, network).

**Key Metrics:**

1. **CPU Usage**: Should be < 80%
2. **Memory Usage**: Should be < 85%
3. **Disk Usage**: Should be < 90%
4. **Disk I/O**: Read/write throughput
5. **Network I/O**: Incoming/outgoing bytes

**Health Checks:**

```bash
# Check broker health
kafka-broker-api-versions --bootstrap-server localhost:9092

# Check disk usage
df -h /var/kafka-logs

# Check JVM memory
jstat -gc <kafka-pid>
```

### 3.7 Disk Usage

**What is Disk Usage Monitoring?**

Tracking disk space used by Kafka logs.

**Why Critical?**

- Kafka stores all messages on disk
- Running out of disk = broker failure
- Need to plan retention accordingly

**Monitoring:**

```bash
# Check disk usage per topic
du -sh /var/kafka-logs/*

# Check total disk usage
df -h /var/kafka-logs
```

**Alerting:**

- **Warning**: Disk usage > 80%
- **Critical**: Disk usage > 90%
- **Action**: Increase retention cleanup or add brokers

### 3.8 Network I/O

**What is Network I/O Monitoring?**

Tracking network bandwidth usage.

**Why Important?**

- Network can be bottleneck
- Need to plan capacity
- Detect network issues

**Metrics:**

- **Bytes In**: Data received by broker
- **Bytes Out**: Data sent by broker
- **Requests**: Number of requests
- **Errors**: Network errors

---

## 4. High Availability & Disaster Recovery

### 4.1 Multi-Zone Deployment

**What is Multi-Zone Deployment?**

Deploying Kafka brokers across multiple availability zones (data centers) for fault tolerance.

**Architecture:**

```
Zone A (US-East-1a):
  Broker 1, Broker 2

Zone B (US-East-1b):
  Broker 3, Broker 4

Zone C (US-East-1c):
  Broker 5, Broker 6
```

**Benefits:**

- **Fault Tolerance**: Survives zone failure
- **High Availability**: Always available
- **Load Distribution**: Spread across zones

**Configuration:**

```properties
# broker.properties
broker.id=1
listeners=PLAINTEXT://broker1:9092
advertised.listeners=PLAINTEXT://broker1:9092

# Rack awareness (zone awareness)
broker.rack=us-east-1a
```

### 4.2 Cross-Region Replication

**What is Cross-Region Replication?**

Replicating data across geographic regions for disaster recovery.

**Use Cases:**

- **Disaster Recovery**: Survive region failure
- **Global Distribution**: Low latency worldwide
- **Compliance**: Data residency requirements

**Tools:**

- **MirrorMaker 2**: Kafka's built-in replication tool
- **Confluent Replicator**: Commercial alternative
- **Custom Solutions**: Build your own

**Code Example: MirrorMaker 2 Configuration**

```properties
# mm2.properties
clusters = primary, secondary
primary.bootstrap.servers = primary-kafka:9092
secondary.bootstrap.servers = secondary-kafka:9092

primary->secondary.enabled = true
primary->secondary.topics = .*
primary->secondary.topics.blacklist = __.*
```

### 4.3 MirrorMaker 2

**What is MirrorMaker 2?**

Kafka's tool for replicating topics between clusters.

**Features:**

- **Topic Replication**: Replicate topics
- **Consumer Group Replication**: Replicate consumer offsets
- **Configuration Replication**: Replicate topic configs
- **Automatic Failover**: Switch to secondary cluster

**Usage:**

```bash
# Start MirrorMaker 2
connect-mirror-maker.sh mm2.properties
```

### 4.4 DR Drills

**What are DR Drills?**

Disaster Recovery drills - testing your disaster recovery procedures.

**Why Important?**

- **Validate Procedures**: Ensure DR plan works
- **Train Team**: Practice recovery
- **Find Issues**: Discover problems before real disaster

**DR Drill Checklist:**

1. **Backup Verification**: Ensure backups are valid
2. **Failover Testing**: Test failover to secondary region
3. **Data Validation**: Verify data integrity
4. **Performance Testing**: Ensure secondary can handle load
5. **Rollback Testing**: Test rolling back to primary

**Example DR Drill:**

```bash
# 1. Stop primary cluster
# 2. Failover to secondary
# 3. Verify consumers can read from secondary
# 4. Verify producers can write to secondary
# 5. Restore primary
# 6. Sync data back
# 7. Failback to primary
```

### 4.5 RPO/RTO Definition

**What are RPO and RTO?**

- **RPO (Recovery Point Objective)**: Maximum acceptable data loss (time)
- **RTO (Recovery Time Objective)**: Maximum acceptable downtime (time)

**Examples:**

- **RPO = 5 minutes**: Can lose up to 5 minutes of data
- **RTO = 1 hour**: Must recover within 1 hour

**How to Achieve:**

- **Low RPO**: Frequent replication (every minute)
- **Low RTO**: Automated failover, hot standby

**Kafka Configuration for Low RPO/RTO:**

```properties
# Low RPO: Replicate frequently
replication.factor=3
min.insync.replicas=2

# Low RTO: Fast failover
unclean.leader.election.enable=false
```

---

## 5. Security

### 5.1 SSL/TLS

**What is SSL/TLS?**

Encryption for data in transit. Essential for secure communication.

**Why Important?**

- **Data Protection**: Encrypts messages in transit
- **Authentication**: Verifies broker identity
- **Compliance**: Required for many regulations

**Kafka SSL Configuration:**

```properties
# server.properties
listeners=SSL://0.0.0.0:9093
ssl.keystore.location=/var/private/ssl/kafka.server.keystore.jks
ssl.keystore.password=test1234
ssl.key.password=test1234
ssl.truststore.location=/var/private/ssl/kafka.server.truststore.jks
ssl.truststore.password=test1234
```

**Client SSL Configuration:**

```java
// Java Example - SSL Configuration
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9093");
props.put("security.protocol", "SSL");
props.put("ssl.truststore.location", "/path/to/truststore.jks");
props.put("ssl.truststore.password", "password");
props.put("ssl.keystore.location", "/path/to/keystore.jks");
props.put("ssl.keystore.password", "password");
```

### 5.2 SASL

**What is SASL?**

Simple Authentication and Security Layer - authentication framework.

**SASL Mechanisms:**

1. **PLAIN**: Username/password (simple)
2. **SCRAM**: Secure password (recommended)
3. **GSSAPI**: Kerberos authentication

**Kafka SASL Configuration:**

```properties
# server.properties
listeners=SASL_SSL://0.0.0.0:9093
security.inter.broker.protocol=SASL_SSL
sasl.mechanism.inter.broker.protocol=SCRAM-SHA-256
sasl.enabled.mechanisms=SCRAM-SHA-256
```

**Client SASL Configuration:**

```java
// Java Example - SASL Configuration
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9093");
props.put("security.protocol", "SASL_SSL");
props.put("sasl.mechanism", "SCRAM-SHA-256");
props.put("sasl.jaas.config", 
    "org.apache.kafka.common.security.scram.ScramLoginModule required " +
    "username=\"alice\" password=\"alice-secret\";");
```

### 5.3 ACLs (Access Control Lists)

**What are ACLs?**

Rules that control who can access what resources in Kafka.

**ACL Format:**

```
Principal:User:alice
Resource:Topic:orders
Operation:Read
→ Alice can read from orders topic
```

**ACL Operations:**

- **Read**: Consume from topic
- **Write**: Produce to topic
- **Create**: Create topics
- **Delete**: Delete topics
- **Alter**: Modify topic config
- **Describe**: View topic metadata

**Code Example: Setting ACLs**

```bash
# Create ACL
kafka-acls.sh --bootstrap-server localhost:9092 \
  --add --allow-principal User:alice \
  --operation Read --topic orders

# List ACLs
kafka-acls.sh --bootstrap-server localhost:9092 \
  --list --topic orders
```

### 5.4 RBAC (Role-Based Access Control)

**What is RBAC?**

Access control based on roles rather than individual users.

**Benefits:**

- **Easier Management**: Assign roles, not individual permissions
- **Scalability**: Add users to roles
- **Consistency**: Standardized permissions

**Roles Example:**

- **Developer**: Read/write to dev topics
- **Operator**: Admin access to all topics
- **Analyst**: Read-only access to analytics topics

### 5.5 Encryption at Rest

**What is Encryption at Rest?**

Encrypting data stored on disk.

**Why Important?**

- **Data Protection**: Protects data if disk is stolen
- **Compliance**: Required by many regulations
- **Security**: Defense in depth

**Implementation:**

- **Filesystem Encryption**: Encrypt entire filesystem
- **Application-Level**: Encrypt messages before storing
- **Database Encryption**: If using database storage

**Kafka Considerations:**

- Kafka stores data as log files
- Use filesystem encryption (LUKS, BitLocker)
- Or encrypt messages before producing

### 5.6 Secrets Management

**What is Secrets Management?**

Secure storage and management of sensitive data (passwords, keys, certificates).

**Why Important?**

- **Security**: Don't hardcode secrets
- **Rotation**: Easy to rotate secrets
- **Audit**: Track secret access

**Tools:**

- **HashiCorp Vault**: Popular open-source solution
- **AWS Secrets Manager**: AWS managed service
- **Azure Key Vault**: Azure managed service
- **Kubernetes Secrets**: K8s native (basic)

**Code Example: Using Vault for Secrets**

```java
// Java Example - Vault Integration
import com.bettercloud.vault.Vault;
import com.bettercloud.vault.VaultConfig;

VaultConfig config = new VaultConfig()
    .address("http://127.0.0.1:8200")
    .token("my-token")
    .build();

Vault vault = new Vault(config);

// Get Kafka password
String password = vault.logical()
    .read("secret/kafka")
    .getData()
    .get("password");

Properties props = new Properties();
props.put("sasl.jaas.config", 
    "org.apache.kafka.common.security.scram.ScramLoginModule required " +
    "username=\"alice\" password=\"" + password + "\";");
```

---

## Summary

Phase 5 covers Platform Engineering:

✅ **Decision Framework**: When to use Kafka vs RabbitMQ  
✅ **Event Backbone**: Multi-tenancy, governance, capacity planning  
✅ **Observability**: Prometheus, Grafana, JMX, monitoring  
✅ **HA & DR**: Multi-zone, cross-region replication, DR drills, RPO/RTO  
✅ **Security**: SSL/TLS, SASL, ACLs, RBAC, encryption, secrets management

---

## Official Documentation & Resources

### Platform Engineering
- **Kafka Operations**: [kafka.apache.org/documentation/#operations](https://kafka.apache.org/documentation/#operations)
- **Confluent Platform**: [docs.confluent.io/platform/current](https://docs.confluent.io/platform/current/)
- **RabbitMQ Operations**: [rabbitmq.com/operations.html](https://www.rabbitmq.com/operations.html)

### Monitoring & Observability
- **Prometheus**: [prometheus.io/docs](https://prometheus.io/docs/)
- **Grafana**: [grafana.com/docs](https://grafana.com/docs/)
- **Kafka JMX Metrics**: [kafka.apache.org/documentation/#monitoring](https://kafka.apache.org/documentation/#monitoring)

### High Availability
- **Kafka HA**: [kafka.apache.org/documentation/#replication](https://kafka.apache.org/documentation/#replication)
- **MirrorMaker 2**: [kafka.apache.org/documentation/#georeplication](https://kafka.apache.org/documentation/#georeplication)
- **RabbitMQ HA**: [rabbitmq.com/ha.html](https://www.rabbitmq.com/ha.html)

### Security
- **Kafka Security**: [kafka.apache.org/documentation/#security](https://kafka.apache.org/documentation/#security)
- **RabbitMQ Security**: [rabbitmq.com/security.html](https://www.rabbitmq.com/security.html)
- **SSL/TLS Guide**: [kafka.apache.org/documentation/#security_ssl](https://kafka.apache.org/documentation/#security_ssl)

### Best Practices
- **Kafka Best Practices**: [confluent.io/blog](https://www.confluent.io/blog/)
- **RabbitMQ Best Practices**: [rabbitmq.com/best-practices.html](https://www.rabbitmq.com/best-practices.html)
- **System Design Patterns**: [martinfowler.com/articles](https://martinfowler.com/articles/)

---

**Congratulations!** You've completed all 5 phases of the Messaging Queue Mastery roadmap. You now have the knowledge to design, build, and operate messaging systems at enterprise scale! 🎉
