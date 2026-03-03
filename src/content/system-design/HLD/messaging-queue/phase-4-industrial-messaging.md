# Phase 4: Industrial Messaging

**Duration:** 2-3 weeks  
**Level:** Industrial/Manufacturing Systems

This phase covers messaging systems used in industrial and manufacturing environments, including IoT devices, PLCs (Programmable Logic Controllers), and edge computing scenarios.

## Table of Contents

1. [MQTT](#1-mqtt)
2. [OPC-UA](#2-opc-ua)
3. [Edge Gateway Architecture](#3-edge-gateway-architecture)

---

## 1. MQTT

### What is MQTT?

MQTT (Message Queuing Telemetry Transport) is a lightweight messaging protocol designed for IoT devices and low-bandwidth networks.

**Key Characteristics:**

- **Lightweight**: Small message overhead (2 bytes minimum)
- **Pub/Sub Model**: Publish-Subscribe messaging pattern
- **Low Bandwidth**: Designed for unreliable networks
- **QoS Levels**: Different quality of service guarantees

**Real-World Use Cases:**

- IoT sensors (temperature, humidity, pressure)
- Smart home devices
- Vehicle telemetry
- Industrial monitoring

### 1.1 MQTT Architecture

**Components:**

1. **Broker**: Central message server (like RabbitMQ broker)
2. **Publisher**: Device that sends messages
3. **Subscriber**: Device that receives messages
4. **Topic**: Subject/category of messages

**Architecture:**

```
Publisher → Topic → Broker → Topic → Subscriber
```

**Real-World Example:**

```
Temperature Sensor (Publisher)
  → Publishes to topic: "sensors/temperature/room1"
  → MQTT Broker receives message
  → HVAC Controller (Subscriber) subscribes to "sensors/temperature/room1"
  → Receives temperature updates
```

### 1.2 QoS Levels

**What are QoS Levels?**

Quality of Service levels determine message delivery guarantees.

**QoS 0: At Most Once (Fire and Forget)**

- Message sent once, no acknowledgment
- Fastest, but may lose messages
- Use case: Non-critical sensor data

**QoS 1: At Least Once**

- Message guaranteed to arrive at least once
- May receive duplicates
- Use case: Important sensor data

**QoS 2: Exactly Once**

- Message guaranteed exactly once
- Slowest, but most reliable
- Use case: Critical control commands

**Code Example: MQTT with Different QoS Levels**

```java
// Java Example (using Eclipse Paho)
import org.eclipse.paho.client.mqttv3.*;

public class MQTTExample {
    public void publish() throws MqttException {
        MqttClient client = new MqttClient("tcp://localhost:1883", "publisher");
        client.connect();
        
        // QoS 0 - At most once
        MqttMessage msg0 = new MqttMessage("QoS 0 message".getBytes());
        msg0.setQos(0);
        client.publish("sensors/temperature", msg0);
        
        // QoS 1 - At least once
        MqttMessage msg1 = new MqttMessage("QoS 1 message".getBytes());
        msg1.setQos(1);
        client.publish("sensors/temperature", msg1);
        
        // QoS 2 - Exactly once
        MqttMessage msg2 = new MqttMessage("QoS 2 message".getBytes());
        msg2.setQos(2);
        client.publish("sensors/temperature", msg2);
        
        client.disconnect();
    }
    
    public void subscribe() throws MqttException {
        MqttClient client = new MqttClient("tcp://localhost:1883", "subscriber");
        client.setCallback(new MqttCallback() {
            @Override
            public void messageArrived(String topic, MqttMessage message) {
                System.out.println("Received: " + new String(message.getPayload()));
            }
            
            @Override
            public void connectionLost(Throwable cause) {
                System.out.println("Connection lost");
            }
            
            @Override
            public void deliveryComplete(IMqttDeliveryToken token) {
                // QoS 1 and 2 only
            }
        });
        
        client.connect();
        client.subscribe("sensors/temperature", 1); // QoS 1
    }
}
```

```javascript
// Node.js Example (using mqtt.js)
const mqtt = require('mqtt');

// Publisher
const publisher = mqtt.connect('mqtt://localhost:1883');

publisher.on('connect', () => {
    // QoS 0 - At most once
    publisher.publish('sensors/temperature', 'QoS 0 message', { qos: 0 });
    
    // QoS 1 - At least once
    publisher.publish('sensors/temperature', 'QoS 1 message', { qos: 1 });
    
    // QoS 2 - Exactly once
    publisher.publish('sensors/temperature', 'QoS 2 message', { qos: 2 });
});

// Subscriber
const subscriber = mqtt.connect('mqtt://localhost:1883');

subscriber.on('connect', () => {
    subscriber.subscribe('sensors/temperature', { qos: 1 }, (err) => {
        if (!err) {
            console.log('Subscribed to sensors/temperature');
        }
    });
});

subscriber.on('message', (topic, message) => {
    console.log(`Received on ${topic}: ${message.toString()}`);
});
```

```python
# Python Example (using paho-mqtt)
import paho.mqtt.client as mqtt

# Publisher
def publish_example():
    client = mqtt.Client("publisher")
    client.connect("localhost", 1883)
    
    # QoS 0 - At most once
    client.publish("sensors/temperature", "QoS 0 message", qos=0)
    
    # QoS 1 - At least once
    client.publish("sensors/temperature", "QoS 1 message", qos=1)
    
    # QoS 2 - Exactly once
    client.publish("sensors/temperature", "QoS 2 message", qos=2)
    
    client.disconnect()

# Subscriber
def on_message(client, userdata, message):
    print(f"Received: {message.payload.decode()}")

def subscribe_example():
    client = mqtt.Client("subscriber")
    client.on_message = on_message
    client.connect("localhost", 1883)
    client.subscribe("sensors/temperature", qos=1)
    client.loop_forever()
```

### 1.3 Retained Messages

**What are Retained Messages?**

A message that the broker stores and delivers to new subscribers immediately when they subscribe.

**Use Case:**

- Last known state of a sensor
- Configuration data
- Current status

**Real-World Example:**

```
Temperature sensor publishes: "25°C" (retained)
New subscriber connects and subscribes to topic
→ Immediately receives "25°C" (last known value)
→ Then receives new updates as they arrive
```

**Code Example: Retained Messages**

```java
// Java Example
MqttMessage message = new MqttMessage("25°C".getBytes());
message.setQos(1);
message.setRetained(true); // Retain message
client.publish("sensors/temperature", message);
```

```javascript
// Node.js Example
publisher.publish('sensors/temperature', '25°C', {
    qos: 1,
    retain: true  // Retain message
});
```

```python
# Python Example
client.publish("sensors/temperature", "25°C", qos=1, retain=True)
```

### 1.4 Session Persistence

**What is Session Persistence?**

MQTT can maintain session state (subscriptions, QoS 1/2 messages) even when client disconnects.

**Clean Session Flag:**

- **clean=true**: No session persistence (stateless)
- **clean=false**: Session persisted (stateful)

**Use Case:**

- **clean=true**: IoT sensors that don't need to recover messages
- **clean=false**: Important clients that need to receive missed messages

**Code Example: Session Persistence**

```java
// Java Example
MqttConnectOptions options = new MqttConnectOptions();
options.setCleanSession(false); // Persist session
options.setClientId("persistent-client");

MqttClient client = new MqttClient("tcp://localhost:1883", "persistent-client");
client.connect(options);
```

```javascript
// Node.js Example
const client = mqtt.connect('mqtt://localhost:1883', {
    clientId: 'persistent-client',
    clean: false  // Persist session
});
```

```python
# Python Example
client = mqtt.Client("persistent-client", clean_session=False)
client.connect("localhost", 1883)
```

### 1.5 Clean Session Flag

**What is Clean Session?**

Determines if the broker should maintain session state when client disconnects.

**clean=true (Clean Session):**

- No session state maintained
- Subscriptions lost on disconnect
- QoS 1/2 messages not stored
- Use: Temporary clients, sensors

**clean=false (Persistent Session):**

- Session state maintained
- Subscriptions preserved
- QoS 1/2 messages stored and delivered on reconnect
- Use: Important clients, control systems

**Code Example: Clean Session**

```java
// Java Example
MqttConnectOptions options = new MqttConnectOptions();
options.setCleanSession(true); // Clean session (no persistence)

// Or
options.setCleanSession(false); // Persistent session
```

```javascript
// Node.js Example
const client = mqtt.connect('mqtt://localhost:1883', {
    clean: true  // Clean session
    // or
    // clean: false  // Persistent session
});
```

```python
# Python Example
# Clean session
client = mqtt.Client("client-id", clean_session=True)

# Persistent session
client = mqtt.Client("client-id", clean_session=False)
```

---

## 2. OPC-UA

### What is OPC-UA?

OPC-UA (OPC Unified Architecture) is a machine-to-machine communication protocol for industrial automation. It's the successor to OPC Classic.

**Key Characteristics:**

- **Platform Independent**: Works on any OS
- **Secure**: Built-in security features
- **Rich Data Model**: Hierarchical node structure
- **Real-time**: Low latency communication

**Real-World Use Cases:**

- PLC (Programmable Logic Controller) communication
- SCADA systems
- Industrial automation
- Manufacturing data collection

### 2.1 OPC-UA Architecture

**Components:**

1. **OPC-UA Server**: Exposes data (e.g., PLC)
2. **OPC-UA Client**: Reads/writes data (e.g., Gateway)
3. **Node**: Data point in the server (like a variable)
4. **Address Space**: Hierarchical structure of nodes

**Architecture:**

```
PLC (OPC-UA Server) ←→ OPC-UA Client (Gateway) ←→ Kafka/RabbitMQ
```

**Real-World Example:**

```
PLC exposes:
  - Temperature sensor value
  - Pressure sensor value
  - Machine status

Gateway (OPC-UA Client) reads these values
  → Normalizes data
  → Publishes to Kafka topic: "factory.sensors"
```

### 2.2 Polling Strategy

**What is Polling?**

Periodically reading values from OPC-UA server.

**When to Use:**

- Simple use cases
- When real-time updates not critical
- Lower complexity

**Code Example: Polling Strategy (Java - Eclipse Milo)**

```java
// Java Example - Polling OPC-UA Server
import org.eclipse.milo.opcua.sdk.client.OpcUaClient;
import org.eclipse.milo.opcua.stack.core.types.builtin.NodeId;
import org.eclipse.milo.opcua.stack.core.types.builtin.DataValue;

public class OPCUAPolling {
    public void pollValues(OpcUaClient client) throws Exception {
        // Node IDs to read
        NodeId temperatureNode = NodeId.parse("ns=2;s=Temperature");
        NodeId pressureNode = NodeId.parse("ns=2;s=Pressure");
        
        while (true) {
            // Read values
            DataValue temperature = client.readValue(0.0, temperatureNode).get();
            DataValue pressure = client.readValue(0.0, pressureNode).get();
            
            // Process values
            processSensorData(temperature, pressure);
            
            // Wait before next poll
            Thread.sleep(1000); // Poll every second
        }
    }
    
    private void processSensorData(DataValue temp, DataValue pressure) {
        System.out.println("Temperature: " + temp.getValue().getValue());
        System.out.println("Pressure: " + pressure.getValue().getValue());
    }
}
```

```python
# Python Example - Polling OPC-UA Server (using opcua)
from opcua import Client
import time

def polling_example():
    client = Client("opc.tcp://localhost:4840")
    client.connect()
    
    # Get nodes
    temperature_node = client.get_node("ns=2;s=Temperature")
    pressure_node = client.get_node("ns=2;s=Pressure")
    
    while True:
        # Read values
        temperature = temperature_node.get_value()
        pressure = pressure_node.get_value()
        
        # Process values
        print(f"Temperature: {temperature}, Pressure: {pressure}")
        
        # Wait before next poll
        time.sleep(1)  # Poll every second
```

### 2.3 Subscription Model

**What is Subscription Model?**

OPC-UA clients can subscribe to data changes. Server notifies client when values change (more efficient than polling).

**When to Use:**

- Real-time requirements
- Efficient (only updates on change)
- Lower network usage

**Code Example: Subscription Model (Java - Eclipse Milo)**

```java
// Java Example - Subscription Model
import org.eclipse.milo.opcua.sdk.client.subscriptions.ManagedSubscription;
import org.eclipse.milo.opcua.stack.core.types.builtin.NodeId;

public class OPCUASubscription {
    public void subscribe(OpcUaClient client) throws Exception {
        // Create subscription
        ManagedSubscription subscription = ManagedSubscription.create(client);
        
        // Node IDs to monitor
        NodeId temperatureNode = NodeId.parse("ns=2;s=Temperature");
        NodeId pressureNode = NodeId.parse("ns=2;s=Pressure");
        
        // Subscribe to data changes
        subscription.addDataChangeListener(temperatureNode, (item, value) -> {
            System.out.println("Temperature changed: " + value.getValue().getValue());
            publishToKafka("temperature", value.getValue().getValue());
        });
        
        subscription.addDataChangeListener(pressureNode, (item, value) -> {
            System.out.println("Pressure changed: " + value.getValue().getValue());
            publishToKafka("pressure", value.getValue().getValue());
        });
        
        // Keep subscription alive
        Thread.sleep(Long.MAX_VALUE);
    }
    
    private void publishToKafka(String sensor, Object value) {
        // Publish to Kafka
    }
}
```

```python
# Python Example - Subscription Model
from opcua import Client, ua

class SubscriptionHandler:
    def datachange_notification(self, node, val, data):
        print(f"Data change: {node} = {val}")
        publish_to_kafka(node.get_browse_name().Name, val)

def subscription_example():
    client = Client("opc.tcp://localhost:4840")
    client.connect()
    
    # Get nodes
    temperature_node = client.get_node("ns=2;s=Temperature")
    pressure_node = client.get_node("ns=2;s=Pressure")
    
    # Create subscription
    handler = SubscriptionHandler()
    sub = client.create_subscription(100, handler)
    
    # Subscribe to data changes
    handle1 = sub.subscribe_data_change(temperature_node)
    handle2 = sub.subscribe_data_change(pressure_node)
    
    # Keep running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        pass
```

### 2.4 Node Browsing

**What is Node Browsing?**

Exploring the OPC-UA server's address space to discover available nodes.

**Why is it Important?**

- Discover available data points
- Understand server structure
- Dynamic configuration

**Code Example: Node Browsing (Java - Eclipse Milo)**

```java
// Java Example - Browsing Nodes
import org.eclipse.milo.opcua.sdk.client.nodes.UaNode;
import org.eclipse.milo.opcua.stack.core.types.builtin.NodeId;

public class OPCUABrowsing {
    public void browseNodes(OpcUaClient client) throws Exception {
        // Start from root
        NodeId rootNode = NodeId.parse("ns=0;i=85"); // Objects folder
        
        // Browse children
        browseNode(client, rootNode, 0);
    }
    
    private void browseNode(OpcUaClient client, NodeId nodeId, int depth) throws Exception {
        // Get node
        UaNode node = client.getAddressSpace().getNode(nodeId);
        
        // Print node info
        String indent = "  ".repeat(depth);
        System.out.println(indent + node.getBrowseName().getName());
        
        // Browse children (limit depth to avoid infinite recursion)
        if (depth < 5) {
            for (NodeId childId : node.getChildNodes()) {
                browseNode(client, childId, depth + 1);
            }
        }
    }
}
```

```python
# Python Example - Browsing Nodes
def browse_nodes(client, node, depth=0):
    indent = "  " * depth
    print(f"{indent}{node.get_browse_name().Name}")
    
    # Browse children (limit depth)
    if depth < 5:
        for child in node.get_children():
            browse_nodes(client, child, depth + 1)

def browsing_example():
    client = Client("opc.tcp://localhost:4840")
    client.connect()
    
    # Start from root
    root = client.get_objects_node()
    browse_nodes(client, root)
```

### 2.5 Secure Communication

**What is Secure Communication in OPC-UA?**

OPC-UA supports multiple security modes and policies for secure communication.

**Security Modes:**

1. **None**: No security (development only)
2. **Sign**: Messages signed (integrity)
3. **SignAndEncrypt**: Messages signed and encrypted (confidentiality + integrity)

**Security Policies:**

- **Basic128Rsa15**: Basic encryption
- **Basic256**: Stronger encryption
- **Basic256Sha256**: Strongest (recommended)

**Code Example: Secure Connection (Java - Eclipse Milo)**

```java
// Java Example - Secure Connection
import org.eclipse.milo.opcua.sdk.client.OpcUaClient;
import org.eclipse.milo.opcua.stack.core.security.SecurityPolicy;
import org.eclipse.milo.opcua.stack.core.types.structured.EndpointDescription;

public class OPCUASecure {
    public OpcUaClient createSecureClient(String endpointUrl) {
        return OpcUaClient.create(endpointUrl, endpoints -> {
            // Find endpoint with security
            return endpoints.stream()
                .filter(e -> e.getSecurityPolicyUri().equals(
                    SecurityPolicy.Basic256Sha256.getUri()))
                .filter(e -> e.getSecurityMode().equals(
                    MessageSecurityMode.SignAndEncrypt))
                .findFirst();
        });
    }
}
```

---

## 3. Edge Gateway Architecture

### What is an Edge Gateway?

An edge gateway is a device that sits between industrial equipment (PLCs, sensors) and cloud/enterprise systems. It acts as a bridge and data processor.

**Responsibilities:**

- **Protocol Translation**: OPC-UA → MQTT/Kafka
- **Data Normalization**: Standardize data formats
- **Retry Logic**: Handle network failures
- **Offline Buffering**: Store data when offline
- **Rate Limiting**: Control data flow

### 3.1 Architecture Design

**Complete Architecture:**

```
PLC → OPC-UA → Java Gateway → Kafka/RabbitMQ → Cloud Services
       (read)    (process)      (publish)         (consume)
```

**Components:**

1. **OPC-UA Client**: Reads data from PLCs
2. **Data Processor**: Normalizes and transforms data
3. **Message Queue Client**: Publishes to Kafka/RabbitMQ
4. **Buffer/Retry Logic**: Handles failures
5. **Configuration**: Dynamic configuration management

**Real-World Example:**

```
Factory Floor:
  PLC 1 (Temperature) → OPC-UA Server
  PLC 2 (Pressure) → OPC-UA Server
  PLC 3 (Status) → OPC-UA Server
         ↓
  Edge Gateway (Java)
    - Reads from OPC-UA
    - Normalizes data
    - Publishes to Kafka: "factory.sensors"
         ↓
  Kafka Cluster
         ↓
  Cloud Services (Analytics, Storage, etc.)
```

### 3.2 Data Normalization

**What is Data Normalization?**

Converting different data formats into a standard format.

**Why is it Important?**

- Different PLCs use different formats
- Standardize for downstream processing
- Easier integration

**Code Example: Data Normalization**

```java
// Java Example - Data Normalization
public class DataNormalizer {
    public SensorData normalize(OPCUAValue rawValue, String source) {
        SensorData normalized = new SensorData();
        
        // Normalize timestamp
        normalized.setTimestamp(Instant.now());
        
        // Normalize value
        normalized.setValue(convertToDouble(rawValue));
        
        // Normalize unit
        normalized.setUnit(normalizeUnit(rawValue.getUnit()));
        
        // Add metadata
        normalized.setSource(source);
        normalized.setSensorId(extractSensorId(source));
        
        return normalized;
    }
    
    private String normalizeUnit(String unit) {
        // Convert "C" → "celsius", "F" → "fahrenheit"
        return unitMap.getOrDefault(unit.toLowerCase(), unit);
    }
}

class SensorData {
    private Instant timestamp;
    private Double value;
    private String unit;
    private String source;
    private String sensorId;
    // getters/setters
}
```

```javascript
// Node.js Example - Data Normalization
class DataNormalizer {
    normalize(rawValue, source) {
        return {
            timestamp: new Date().toISOString(),
            value: this.convertToNumber(rawValue.value),
            unit: this.normalizeUnit(rawValue.unit),
            source: source,
            sensorId: this.extractSensorId(source)
        };
    }
    
    normalizeUnit(unit) {
        const unitMap = {
            'c': 'celsius',
            'f': 'fahrenheit',
            'psi': 'pounds_per_square_inch'
        };
        return unitMap[unit.toLowerCase()] || unit;
    }
}
```

```python
# Python Example - Data Normalization
class DataNormalizer:
    def normalize(self, raw_value, source):
        return {
            'timestamp': datetime.now().isoformat(),
            'value': float(raw_value.value),
            'unit': self.normalize_unit(raw_value.unit),
            'source': source,
            'sensor_id': self.extract_sensor_id(source)
        }
    
    def normalize_unit(self, unit):
        unit_map = {
            'c': 'celsius',
            'f': 'fahrenheit',
            'psi': 'pounds_per_square_inch'
        }
        return unit_map.get(unit.lower(), unit)
```

### 3.3 Retry Logic

**What is Retry Logic?**

Automatically retrying failed operations (network failures, broker unavailable, etc.).

**Strategies:**

- **Exponential Backoff**: Wait time increases exponentially
- **Max Retries**: Limit number of retries
- **Dead Letter Queue**: Send to DLQ after max retries

**Code Example: Retry Logic**

```java
// Java Example - Retry Logic with Exponential Backoff
public class RetryHandler {
    private static final int MAX_RETRIES = 5;
    private static final long INITIAL_DELAY = 1000; // 1 second
    
    public void publishWithRetry(KafkaProducer producer, String topic, String message) {
        int attempt = 0;
        long delay = INITIAL_DELAY;
        
        while (attempt < MAX_RETRIES) {
            try {
                producer.send(new ProducerRecord<>(topic, message)).get();
                return; // Success
            } catch (Exception e) {
                attempt++;
                if (attempt >= MAX_RETRIES) {
                    sendToDLQ(topic, message); // Send to dead letter queue
                    return;
                }
                
                // Exponential backoff
                try {
                    Thread.sleep(delay);
                    delay *= 2; // Double the delay
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }
    }
}
```

```javascript
// Node.js Example - Retry Logic
class RetryHandler {
    constructor(maxRetries = 5, initialDelay = 1000) {
        this.maxRetries = maxRetries;
        this.initialDelay = initialDelay;
    }
    
    async publishWithRetry(producer, topic, message) {
        let attempt = 0;
        let delay = this.initialDelay;
        
        while (attempt < this.maxRetries) {
            try {
                await producer.send({
                    topic,
                    messages: [{ value: message }]
                });
                return; // Success
            } catch (error) {
                attempt++;
                if (attempt >= this.maxRetries) {
                    await this.sendToDLQ(topic, message);
                    return;
                }
                
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
    }
}
```

```python
# Python Example - Retry Logic
import time
from kafka import KafkaProducer
from kafka.errors import KafkaError

class RetryHandler:
    def __init__(self, max_retries=5, initial_delay=1):
        self.max_retries = max_retries
        self.initial_delay = initial_delay
    
    def publish_with_retry(self, producer, topic, message):
        attempt = 0
        delay = self.initial_delay
        
        while attempt < self.max_retries:
            try:
                future = producer.send(topic, value=message)
                future.get(timeout=10)  # Wait for send
                return  # Success
            except KafkaError as e:
                attempt += 1
                if attempt >= self.max_retries:
                    self.send_to_dlq(topic, message)
                    return
                
                # Exponential backoff
                time.sleep(delay)
                delay *= 2
```

### 3.4 Offline Buffering

**What is Offline Buffering?**

Storing messages locally when the connection to the message broker is unavailable.

**Why is it Important?**

- Industrial systems can't lose data
- Network outages are common
- Ensures data delivery when connection restored

**Code Example: Offline Buffering**

```java
// Java Example - Offline Buffering
public class OfflineBuffer {
    private Queue<Message> buffer = new ConcurrentLinkedQueue<>();
    private String bufferPath = "/tmp/gateway-buffer";
    private final int MAX_BUFFER_SIZE = 10000;
    
    public void bufferMessage(Message message) {
        if (buffer.size() >= MAX_BUFFER_SIZE) {
            // Buffer full - write to disk
            writeToDisk(message);
        } else {
            buffer.offer(message);
        }
    }
    
    public void flushBuffer(KafkaProducer producer) {
        while (!buffer.isEmpty()) {
            Message message = buffer.poll();
            try {
                producer.send(new ProducerRecord<>(message.getTopic(), message.getData())).get();
            } catch (Exception e) {
                // Still failed - put back in buffer
                buffer.offer(message);
                break;
            }
        }
        
        // Also flush from disk
        flushFromDisk(producer);
    }
    
    private void writeToDisk(Message message) {
        // Write to persistent storage
        try (FileWriter writer = new FileWriter(bufferPath, true)) {
            writer.write(message.toJson() + "\n");
        } catch (IOException e) {
            // Handle error
        }
    }
}
```

```javascript
// Node.js Example - Offline Buffering
const fs = require('fs').promises;
const path = require('path');

class OfflineBuffer {
    constructor(bufferPath = '/tmp/gateway-buffer', maxSize = 10000) {
        this.buffer = [];
        this.bufferPath = bufferPath;
        this.maxSize = maxSize;
    }
    
    async bufferMessage(message) {
        if (this.buffer.length >= this.maxSize) {
            // Buffer full - write to disk
            await this.writeToDisk(message);
        } else {
            this.buffer.push(message);
        }
    }
    
    async flushBuffer(producer) {
        while (this.buffer.length > 0) {
            const message = this.buffer.shift();
            try {
                await producer.send({
                    topic: message.topic,
                    messages: [{ value: message.data }]
                });
            } catch (error) {
                // Still failed - put back
                this.buffer.unshift(message);
                break;
            }
        }
        
        // Flush from disk
        await this.flushFromDisk(producer);
    }
    
    async writeToDisk(message) {
        const line = JSON.stringify(message) + '\n';
        await fs.appendFile(this.bufferPath, line);
    }
}
```

```python
# Python Example - Offline Buffering
import json
import os
from queue import Queue
from threading import Lock

class OfflineBuffer:
    def __init__(self, buffer_path='/tmp/gateway-buffer', max_size=10000):
        self.buffer = Queue()
        self.buffer_path = buffer_path
        self.max_size = max_size
        self.lock = Lock()
    
    def buffer_message(self, message):
        if self.buffer.qsize() >= self.max_size:
            # Buffer full - write to disk
            self.write_to_disk(message)
        else:
            self.buffer.put(message)
    
    def flush_buffer(self, producer):
        while not self.buffer.empty():
            message = self.buffer.get()
            try:
                future = producer.send(message['topic'], value=message['data'])
                future.get(timeout=10)
            except Exception:
                # Still failed - put back
                self.buffer.put(message)
                break
        
        # Flush from disk
        self.flush_from_disk(producer)
    
    def write_to_disk(self, message):
        with open(self.buffer_path, 'a') as f:
            f.write(json.dumps(message) + '\n')
```

### 3.5 Rate Limiting

**What is Rate Limiting?**

Controlling the rate at which messages are published to prevent overwhelming the system.

**Why is it Important?**

- Prevent broker overload
- Control bandwidth usage
- Meet SLA requirements

**Code Example: Rate Limiting**

```java
// Java Example - Rate Limiting (Token Bucket)
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

public class RateLimiter {
    private Semaphore tokens;
    private int maxTokens;
    private long refillPeriodMs;
    
    public RateLimiter(int maxTokens, long refillPeriodMs) {
        this.maxTokens = maxTokens;
        this.refillPeriodMs = refillPeriodMs;
        this.tokens = new Semaphore(maxTokens);
        
        // Start refill thread
        startRefillThread();
    }
    
    public boolean tryAcquire() {
        return tokens.tryAcquire();
    }
    
    private void startRefillThread() {
        new Thread(() -> {
            while (true) {
                try {
                    Thread.sleep(refillPeriodMs);
                    int current = maxTokens - tokens.availablePermits();
                    if (current > 0) {
                        tokens.release(Math.min(current, maxTokens));
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }).start();
    }
}

// Usage
RateLimiter limiter = new RateLimiter(100, 1000); // 100 messages per second
if (limiter.tryAcquire()) {
    producer.send(record);
}
```

```javascript
// Node.js Example - Rate Limiting
class RateLimiter {
    constructor(maxTokens, refillPeriodMs) {
        this.maxTokens = maxTokens;
        this.tokens = maxTokens;
        this.refillPeriodMs = refillPeriodMs;
        this.startRefill();
    }
    
    tryAcquire() {
        if (this.tokens > 0) {
            this.tokens--;
            return true;
        }
        return false;
    }
    
    startRefill() {
        setInterval(() => {
            if (this.tokens < this.maxTokens) {
                this.tokens = Math.min(this.maxTokens, this.tokens + 1);
            }
        }, this.refillPeriodMs / this.maxTokens);
    }
}

// Usage
const limiter = new RateLimiter(100, 1000); // 100 messages per second
if (limiter.tryAcquire()) {
    await producer.send({ topic, messages: [{ value: message }] });
}
```

```python
# Python Example - Rate Limiting
import time
from threading import Lock

class RateLimiter:
    def __init__(self, max_tokens, refill_period_ms):
        self.max_tokens = max_tokens
        self.tokens = max_tokens
        self.refill_period_ms = refill_period_ms
        self.lock = Lock()
        self.last_refill = time.time()
    
    def try_acquire(self):
        with self.lock:
            self._refill()
            if self.tokens > 0:
                self.tokens -= 1
                return True
            return False
    
    def _refill(self):
        now = time.time()
        elapsed = (now - self.last_refill) * 1000  # Convert to ms
        if elapsed >= self.refill_period_ms:
            tokens_to_add = int((elapsed / self.refill_period_ms) * self.max_tokens)
            self.tokens = min(self.max_tokens, self.tokens + tokens_to_add)
            self.last_refill = now

# Usage
limiter = RateLimiter(100, 1000)  # 100 messages per second
if limiter.try_acquire():
    producer.send(topic, value=message)
```

### 3.6 Complete Gateway Implementation

**Code Example: Complete Edge Gateway (Java)**

```java
// Java Example - Complete Edge Gateway
public class EdgeGateway {
    private OPCUAClient opcuaClient;
    private KafkaProducer<String, String> kafkaProducer;
    private DataNormalizer normalizer;
    private RetryHandler retryHandler;
    private OfflineBuffer buffer;
    private RateLimiter rateLimiter;
    
    public void start() {
        // Initialize components
        opcuaClient = new OPCUAClient("opc.tcp://plc:4840");
        kafkaProducer = createKafkaProducer();
        normalizer = new DataNormalizer();
        retryHandler = new RetryHandler();
        buffer = new OfflineBuffer();
        rateLimiter = new RateLimiter(100, 1000); // 100 msg/sec
        
        // Subscribe to OPC-UA data changes
        opcuaClient.subscribe((node, value) -> {
            // Normalize data
            SensorData normalized = normalizer.normalize(value, node);
            
            // Rate limit
            if (!rateLimiter.tryAcquire()) {
                buffer.bufferMessage(normalized);
                return;
            }
            
            // Publish to Kafka with retry
            retryHandler.publishWithRetry(
                kafkaProducer,
                "factory.sensors",
                normalized.toJson()
            );
        });
        
        // Periodically flush buffer
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(() -> {
            buffer.flushBuffer(kafkaProducer);
        }, 0, 5, TimeUnit.SECONDS);
    }
}
```

---

## Summary

Phase 4 covers Industrial Messaging:

✅ **MQTT**: Lightweight IoT protocol, QoS levels, Retained messages, Session persistence  
✅ **OPC-UA**: Industrial protocol, Polling vs Subscription, Node browsing, Security  
✅ **Edge Gateway**: Architecture, Data normalization, Retry logic, Offline buffering, Rate limiting

---

## Official Documentation & Resources

### MQTT
- **MQTT.org**: [mqtt.org](https://mqtt.org/)
- **Eclipse Paho (Java)**: [eclipse.org/paho](https://www.eclipse.org/paho/)
- **MQTT.js (Node.js)**: [github.com/mqttjs/MQTT.js](https://github.com/mqttjs/MQTT.js)
- **paho-mqtt (Python)**: [eclipse.org/paho/clients/python](https://www.eclipse.org/paho/clients/python/)

### OPC-UA
- **OPC Foundation**: [opcfoundation.org](https://opcfoundation.org/)
- **Eclipse Milo (Java)**: [eclipse.org/milo](https://www.eclipse.org/milo/)
- **python-opcua**: [github.com/FreeOpcUa/python-opcua](https://github.com/FreeOpcUa/python-opcua)
- **OPC-UA Specification**: [reference.opcfoundation.org](https://reference.opcfoundation.org/)

### Edge Computing
- **AWS IoT Greengrass**: [aws.amazon.com/greengrass](https://aws.amazon.com/greengrass/)
- **Azure IoT Edge**: [azure.microsoft.com/services/iot-edge](https://azure.microsoft.com/services/iot-edge/)
- **Edge Computing Patterns**: [martinfowler.com/articles/edge-computing-patterns.html](https://martinfowler.com/articles/edge-computing-patterns.html)

### Industrial IoT
- **Industrial IoT Best Practices**: [iiot-world.com](https://www.iiot-world.com/)
- **Industry 4.0**: [en.wikipedia.org/wiki/Industry_4.0](https://en.wikipedia.org/wiki/Industry_4.0)

---

**Next Steps**: Once you've mastered Industrial Messaging, proceed to [Phase 5: Platform Engineering](./phase-5-platform-engineering.md)
