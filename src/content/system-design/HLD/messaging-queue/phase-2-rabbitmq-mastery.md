# Phase 2: RabbitMQ Mastery

**Duration:** 3-4 weeks  
**Level:** Queue-Based Messaging Expert

RabbitMQ is extremely important for enterprise systems. It's a message broker that implements the AMQP protocol and is perfect for task queues, request routing, and pub/sub messaging.

## Table of Contents

1. [RabbitMQ Architecture](#1-rabbitmq-architecture)
2. [Exchange Types](#2-exchange-types)
3. [Message Flow in RabbitMQ](#3-message-flow-in-rabbitmq)
4. [RabbitMQ Reliability](#4-rabbitmq-reliability)
5. [Performance Tuning](#5-performance-tuning)
6. [RabbitMQ Clustering & HA](#6-rabbitmq-clustering--ha)

---

## 1. RabbitMQ Architecture

### What is RabbitMQ?

RabbitMQ is an open-source message broker that implements the AMQP (Advanced Message Queuing Protocol). Think of it as a post office - producers send messages, and RabbitMQ routes them to the right consumers.

### Core Components

#### 1.1 Broker

**What is a Broker?**

The broker is the RabbitMQ server itself - the central message handling system. It receives, routes, and delivers messages.

**Real-World Analogy:**

Like a central post office that receives mail, sorts it, and delivers it to the right addresses.

#### 1.2 Exchange

**What is an Exchange?**

An exchange receives messages from producers and routes them to queues based on routing rules. It's like a mail sorting machine.

**Types of Exchanges:**
- Direct
- Topic
- Fanout
- Headers

(We'll cover these in detail in Section 2)

#### 1.3 Queue

**What is a Queue?**

A queue stores messages until they are consumed. Like a mailbox that holds letters until you check it.

**Queue Properties:**
- **Durable**: Survives broker restarts
- **Exclusive**: Only one connection can use it
- **Auto-delete**: Deleted when no longer used

#### 1.4 Binding

**What is a Binding?**

A binding connects an exchange to a queue. It's like a rule that says "send messages matching this pattern to this queue."

**Binding Key:**
- Pattern used to match messages
- Different for each exchange type

#### 1.5 Routing Key

**What is a Routing Key?**

A routing key is a message attribute that the exchange uses to decide which queue(s) to route the message to. Like an address on an envelope.

**Example:**
```
Routing Key: "order.created"
Exchange uses this to find matching bindings
```

#### 1.6 Virtual Hosts

**What is a Virtual Host?**

A virtual host (vhost) is like a separate "mini-broker" within RabbitMQ. It provides logical separation and isolation.

**Real-World Example:**

Like separate departments in a company:
- `/production` - Production environment
- `/staging` - Staging environment
- `/development` - Development environment

**Code Example: Connecting to Virtual Host**

```java
// Java Example
ConnectionFactory factory = new ConnectionFactory();
factory.setHost("localhost");
factory.setVirtualHost("/production");
factory.setUsername("admin");
factory.setPassword("password");

Connection connection = factory.newConnection();
```

```javascript
// Node.js Example
const amqp = require('amqplib');

async function connect() {
    const connection = await amqp.connect({
        hostname: 'localhost',
        vhost: '/production',
        username: 'admin',
        password: 'password'
    });
    return connection;
}
```

```python
# Python Example
import pika

connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host='localhost',
        virtual_host='/production',
        credentials=pika.PlainCredentials('admin', 'password')
    )
)
```

### Complete Architecture Diagram

```
Producer → Exchange → Binding → Queue → Consumer
           (routes)   (rule)   (stores) (processes)
```

**Flow:**
1. Producer sends message to Exchange with routing key
2. Exchange uses bindings to find matching queues
3. Message is routed to queue(s)
4. Consumer receives message from queue
5. Consumer acknowledges (ACK) when done

---

## 2. Exchange Types

Understanding exchange types is crucial for RabbitMQ. Each type has different routing behavior.

### 2.1 Direct Exchange

**What is a Direct Exchange?**

Routes messages to queues based on an exact match of the routing key. Like a direct phone call - you dial the exact number.

**Use Case:**
- Task queues
- Point-to-point messaging
- When you know exactly which queue should receive the message

**Example:**
```
Exchange: "orders"
Binding: Queue "order-processing" bound with key "order.created"
Message: routing_key = "order.created" → Goes to "order-processing"
Message: routing_key = "order.cancelled" → No match, message discarded
```

**Code Example: Direct Exchange**

```java
// Java Example
public class DirectExchangeExample {
    public void setup() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        
        // Declare direct exchange
        channel.exchangeDeclare("orders", "direct", true);
        
        // Declare queue
        channel.queueDeclare("order-processing", true, false, false, null);
        
        // Bind queue to exchange with routing key
        channel.queueBind("order-processing", "orders", "order.created");
        
        // Publish message
        channel.basicPublish("orders", "order.created", null, 
            "Order #123 created".getBytes());
    }
}
```

```javascript
// Node.js Example
const amqp = require('amqplib');

async function directExchangeExample() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Declare direct exchange
    await channel.assertExchange('orders', 'direct', { durable: true });
    
    // Declare queue
    await channel.assertQueue('order-processing', { durable: true });
    
    // Bind queue to exchange with routing key
    await channel.bindQueue('order-processing', 'orders', 'order.created');
    
    // Publish message
    channel.publish('orders', 'order.created', Buffer.from('Order #123 created'));
}
```

```python
# Python Example
import pika

def direct_exchange_example():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost')
    )
    channel = connection.channel()
    
    # Declare direct exchange
    channel.exchange_declare(exchange='orders', exchange_type='direct', durable=True)
    
    # Declare queue
    channel.queue_declare(queue='order-processing', durable=True)
    
    # Bind queue to exchange with routing key
    channel.queue_bind(
        exchange='orders',
        queue='order-processing',
        routing_key='order.created'
    )
    
    # Publish message
    channel.basic_publish(
        exchange='orders',
        routing_key='order.created',
        body='Order #123 created'
    )
```

### 2.2 Topic Exchange

**What is a Topic Exchange?**

Routes messages based on pattern matching of routing keys. Uses wildcards:
- `*` (star) - matches exactly one word
- `#` (hash) - matches zero or more words

**Use Case:**
- Categorizing messages
- Multiple consumers interested in different message types
- When routing key has multiple parts (e.g., "order.created.priority")

**Example:**
```
Exchange: "events"
Binding 1: Queue "high-priority" bound with key "order.*.priority"
Binding 2: Queue "all-orders" bound with key "order.#"

Message: routing_key = "order.created.priority" 
→ Matches both bindings! Goes to both queues

Message: routing_key = "order.created"
→ Only matches binding 2, goes to "all-orders"
```

**Code Example: Topic Exchange**

```java
// Java Example
public class TopicExchangeExample {
    public void setup() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        
        // Declare topic exchange
        channel.exchangeDeclare("events", "topic", true);
        
        // Queue for high priority orders
        channel.queueDeclare("high-priority", true, false, false, null);
        channel.queueBind("high-priority", "events", "order.*.priority");
        
        // Queue for all orders
        channel.queueDeclare("all-orders", true, false, false, null);
        channel.queueBind("all-orders", "events", "order.#");
        
        // Publish high priority order
        channel.basicPublish("events", "order.created.priority", null,
            "High priority order".getBytes());
    }
}
```

```javascript
// Node.js Example
async function topicExchangeExample() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Declare topic exchange
    await channel.assertExchange('events', 'topic', { durable: true });
    
    // Queue for high priority orders
    await channel.assertQueue('high-priority', { durable: true });
    await channel.bindQueue('high-priority', 'events', 'order.*.priority');
    
    // Queue for all orders
    await channel.assertQueue('all-orders', { durable: true });
    await channel.bindQueue('all-orders', 'events', 'order.#');
    
    // Publish high priority order
    channel.publish('events', 'order.created.priority', 
        Buffer.from('High priority order'));
}
```

```python
# Python Example
def topic_exchange_example():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost')
    )
    channel = connection.channel()
    
    # Declare topic exchange
    channel.exchange_declare(exchange='events', exchange_type='topic', durable=True)
    
    # Queue for high priority orders
    channel.queue_declare(queue='high-priority', durable=True)
    channel.queue_bind(
        exchange='events',
        queue='high-priority',
        routing_key='order.*.priority'
    )
    
    # Queue for all orders
    channel.queue_declare(queue='all-orders', durable=True)
    channel.queue_bind(
        exchange='events',
        queue='all-orders',
        routing_key='order.#'
    )
    
    # Publish high priority order
    channel.basic_publish(
        exchange='events',
        routing_key='order.created.priority',
        body='High priority order'
    )
```

### 2.3 Fanout Exchange

**What is a Fanout Exchange?**

Routes messages to ALL bound queues, ignoring routing keys. Like a broadcast - everyone who's listening gets the message.

**Use Case:**
- Broadcasting events
- Pub/Sub scenarios
- When all subscribers need the same message

**Example:**
```
Exchange: "notifications"
Binding: Queue "email-service" bound (no routing key needed)
Binding: Queue "sms-service" bound
Binding: Queue "push-service" bound

Message: routing_key = "anything" (ignored)
→ Goes to ALL three queues!
```

**Code Example: Fanout Exchange**

```java
// Java Example
public class FanoutExchangeExample {
    public void setup() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        
        // Declare fanout exchange
        channel.exchangeDeclare("notifications", "fanout", true);
        
        // Multiple queues
        channel.queueDeclare("email-service", true, false, false, null);
        channel.queueDeclare("sms-service", true, false, false, null);
        channel.queueDeclare("push-service", true, false, false, null);
        
        // Bind all queues (routing key ignored for fanout)
        channel.queueBind("email-service", "notifications", "");
        channel.queueBind("sms-service", "notifications", "");
        channel.queueBind("push-service", "notifications", "");
        
        // Publish - goes to all queues
        channel.basicPublish("notifications", "", null,
            "User registered".getBytes());
    }
}
```

```javascript
// Node.js Example
async function fanoutExchangeExample() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Declare fanout exchange
    await channel.assertExchange('notifications', 'fanout', { durable: true });
    
    // Multiple queues
    await channel.assertQueue('email-service', { durable: true });
    await channel.assertQueue('sms-service', { durable: true });
    await channel.assertQueue('push-service', { durable: true });
    
    // Bind all queues (routing key ignored)
    await channel.bindQueue('email-service', 'notifications', '');
    await channel.bindQueue('sms-service', 'notifications', '');
    await channel.bindQueue('push-service', 'notifications', '');
    
    // Publish - goes to all queues
    channel.publish('notifications', '', Buffer.from('User registered'));
}
```

```python
# Python Example
def fanout_exchange_example():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost')
    )
    channel = connection.channel()
    
    # Declare fanout exchange
    channel.exchange_declare(exchange='notifications', exchange_type='fanout', durable=True)
    
    # Multiple queues
    channel.queue_declare(queue='email-service', durable=True)
    channel.queue_declare(queue='sms-service', durable=True)
    channel.queue_declare(queue='push-service', durable=True)
    
    # Bind all queues (routing key ignored)
    channel.queue_bind(exchange='notifications', queue='email-service', routing_key='')
    channel.queue_bind(exchange='notifications', queue='sms-service', routing_key='')
    channel.queue_bind(exchange='notifications', queue='push-service', routing_key='')
    
    # Publish - goes to all queues
    channel.basic_publish(
        exchange='notifications',
        routing_key='',  # Ignored for fanout
        body='User registered'
    )
```

### 2.4 Headers Exchange

**What is a Headers Exchange?**

Routes messages based on header attributes instead of routing keys. More flexible but less performant.

**Use Case:**
- Complex routing logic
- When routing depends on multiple message attributes
- Less common, but useful for specific scenarios

**Code Example: Headers Exchange**

```java
// Java Example
public class HeadersExchangeExample {
    public void setup() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        
        // Declare headers exchange
        channel.exchangeDeclare("routing", "headers", true);
        
        // Queue for premium users
        channel.queueDeclare("premium-queue", true, false, false, null);
        Map<String, Object> premiumArgs = new HashMap<>();
        premiumArgs.put("x-match", "all"); // All headers must match
        premiumArgs.put("user-type", "premium");
        premiumArgs.put("region", "US");
        channel.queueBind("premium-queue", "routing", "", premiumArgs);
        
        // Publish with headers
        AMQP.BasicProperties props = new AMQP.BasicProperties.Builder()
            .headers(premiumArgs)
            .build();
        channel.basicPublish("routing", "", props, "Premium message".getBytes());
    }
}
```

```javascript
// Node.js Example
async function headersExchangeExample() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Declare headers exchange
    await channel.assertExchange('routing', 'headers', { durable: true });
    
    // Queue for premium users
    await channel.assertQueue('premium-queue', { durable: true });
    await channel.bindQueue('premium-queue', 'routing', '', {
        'x-match': 'all', // All headers must match
        'user-type': 'premium',
        'region': 'US'
    });
    
    // Publish with headers
    channel.publish('routing', '', Buffer.from('Premium message'), {
        headers: {
            'user-type': 'premium',
            'region': 'US'
        }
    });
}
```

```python
# Python Example
def headers_exchange_example():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost')
    )
    channel = connection.channel()
    
    # Declare headers exchange
    channel.exchange_declare(exchange='routing', exchange_type='headers', durable=True)
    
    # Queue for premium users
    channel.queue_declare(queue='premium-queue', durable=True)
    channel.queue_bind(
        exchange='routing',
        queue='premium-queue',
        routing_key='',
        arguments={
            'x-match': 'all',  # All headers must match
            'user-type': 'premium',
            'region': 'US'
        }
    )
    
    # Publish with headers
    channel.basic_publish(
        exchange='routing',
        routing_key='',
        body='Premium message',
        properties=pika.BasicProperties(
            headers={
                'user-type': 'premium',
                'region': 'US'
            }
        )
    )
```

### Exchange Type Comparison

| Exchange Type | Routing Method | Use Case | Performance |
|--------------|----------------|----------|-------------|
| **Direct** | Exact routing key match | Task queues, point-to-point | Fastest |
| **Topic** | Pattern matching with wildcards | Categorized messages | Fast |
| **Fanout** | Broadcast to all queues | Pub/Sub, notifications | Fast |
| **Headers** | Header attribute matching | Complex routing logic | Slower |

**Interview Question:** When would you use topic exchange instead of direct?

**Answer:** Use topic exchange when:
- You need pattern matching (e.g., "order.*.priority")
- Multiple queues need different subsets of messages
- Routing key has multiple parts and you want flexibility
- You want to add new consumers without changing producers

Use direct exchange when:
- Simple point-to-point messaging
- Exact routing key matching is sufficient
- Maximum performance is needed

---

## 3. Message Flow in RabbitMQ

### Complete Message Flow

```
Producer → Exchange → Binding → Queue → Consumer
   |         |          |        |        |
   |         |          |        |        └─ ACK/NACK
   |         |          |        └─ Stores message
   |         |          └─ Routing rule
   |         └─ Routes based on type
   └─ Publishes with routing key
```

### Step-by-Step Flow

1. **Producer publishes message**
   - Sends message to exchange
   - Includes routing key
   - Optionally includes headers, properties

2. **Exchange receives message**
   - Determines routing based on exchange type
   - Finds matching bindings
   - Routes to one or more queues

3. **Queue stores message**
   - Message waits in queue
   - Multiple consumers can compete for messages (round-robin)

4. **Consumer receives message**
   - Gets message from queue
   - Processes message
   - Sends ACK (acknowledgment) when done

5. **Message removed**
   - After ACK, message is removed from queue
   - If NACK or timeout, message can be requeued or sent to DLQ

**Code Example: Complete Flow**

```java
// Java Example - Producer
public class Producer {
    public void sendMessage() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        
        // Declare exchange and queue
        channel.exchangeDeclare("orders", "direct", true);
        channel.queueDeclare("order-queue", true, false, false, null);
        channel.queueBind("order-queue", "orders", "order.created");
        
        // Publish message
        String message = "Order #123 created";
        channel.basicPublish("orders", "order.created", 
            MessageProperties.PERSISTENT_TEXT_PLAIN,
            message.getBytes());
        
        System.out.println("Sent: " + message);
    }
}

// Java Example - Consumer
public class Consumer {
    public void receiveMessage() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        
        // Declare queue (idempotent)
        channel.queueDeclare("order-queue", true, false, false, null);
        
        // Consume messages
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            System.out.println("Received: " + message);
            
            // Process message
            processOrder(message);
            
            // Acknowledge
            channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
        };
        
        channel.basicConsume("order-queue", false, deliverCallback, 
            consumerTag -> {});
    }
    
    private void processOrder(String message) {
        // Business logic here
    }
}
```

```javascript
// Node.js Example - Producer
const amqp = require('amqplib');

async function producer() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Declare exchange and queue
    await channel.assertExchange('orders', 'direct', { durable: true });
    await channel.assertQueue('order-queue', { durable: true });
    await channel.bindQueue('order-queue', 'orders', 'order.created');
    
    // Publish message
    const message = 'Order #123 created';
    channel.publish('orders', 'order.created', Buffer.from(message), {
        persistent: true
    });
    
    console.log('Sent:', message);
}

// Node.js Example - Consumer
async function consumer() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Declare queue
    await channel.assertQueue('order-queue', { durable: true });
    
    // Consume messages
    await channel.consume('order-queue', (msg) => {
        if (msg) {
            const message = msg.content.toString();
            console.log('Received:', message);
            
            // Process message
            processOrder(message);
            
            // Acknowledge
            channel.ack(msg);
        }
    }, { noAck: false });
}

function processOrder(message) {
    // Business logic here
}
```

```python
# Python Example - Producer
import pika

def producer():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost')
    )
    channel = connection.channel()
    
    # Declare exchange and queue
    channel.exchange_declare(exchange='orders', exchange_type='direct', durable=True)
    channel.queue_declare(queue='order-queue', durable=True)
    channel.queue_bind(exchange='orders', queue='order-queue', routing_key='order.created')
    
    # Publish message
    message = 'Order #123 created'
    channel.basic_publish(
        exchange='orders',
        routing_key='order.created',
        body=message,
        properties=pika.BasicProperties(delivery_mode=2)  # Make message persistent
    )
    
    print(f'Sent: {message}')

# Python Example - Consumer
def consumer():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost')
    )
    channel = connection.channel()
    
    # Declare queue
    channel.queue_declare(queue='order-queue', durable=True)
    
    def callback(ch, method, properties, body):
        message = body.decode()
        print(f'Received: {message}')
        
        # Process message
        process_order(message)
        
        # Acknowledge
        ch.basic_ack(delivery_tag=method.delivery_tag)
    
    # Consume messages
    channel.basic_consume(queue='order-queue', on_message_callback=callback, auto_ack=False)
    channel.start_consuming()

def process_order(message):
    # Business logic here
    pass
```

---

## 4. RabbitMQ Reliability

Reliability ensures messages are not lost and are processed correctly. This is critical for production systems.

### 4.1 Publisher Confirms

**What are Publisher Confirms?**

A mechanism to ensure messages are successfully received by the broker. Like a delivery receipt.

**Why is it Important?**

Without confirms, you don't know if the broker received your message. Network failures can cause silent message loss.

**Code Example: Publisher Confirms**

```java
// Java Example
public class PublisherConfirms {
    public void sendWithConfirms() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        
        // Enable publisher confirms
        channel.confirmSelect();
        
        // Add confirm listener
        channel.addConfirmListener((sequenceNumber, multiple) -> {
            System.out.println("Message confirmed: " + sequenceNumber);
        }, (sequenceNumber, multiple) -> {
            System.err.println("Message nacked: " + sequenceNumber);
        });
        
        // Publish message
        channel.basicPublish("exchange", "routing.key", null, 
            "Message".getBytes());
        
        // Wait for confirm (or use async listener above)
        channel.waitForConfirmsOrDie(5000);
    }
}
```

```javascript
// Node.js Example
async function publisherConfirms() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Enable publisher confirms
    await channel.assertQueue('test-queue', { durable: true });
    
    // Publish with confirm
    const sent = channel.publish('', 'test-queue', Buffer.from('Message'), {
        persistent: true
    });
    
    if (sent) {
        console.log('Message sent, waiting for confirm...');
        await channel.waitForConfirms();
        console.log('Message confirmed!');
    } else {
        console.error('Message not sent (backpressure)');
    }
}
```

```python
# Python Example
import pika

def publisher_confirms():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost')
    )
    channel = connection.channel()
    
    # Enable publisher confirms
    channel.confirm_delivery()
    
    # Publish message
    if channel.basic_publish(
        exchange='',
        routing_key='test-queue',
        body='Message',
        properties=pika.BasicProperties(delivery_mode=2)
    ):
        print('Message confirmed!')
    else:
        print('Message not confirmed')
```

### 4.2 Consumer Acknowledgments

**What are Consumer Acknowledgments?**

Consumers send ACK (acknowledge) or NACK (negative acknowledge) to tell the broker if message processing succeeded.

**Manual ACK vs Auto ACK:**

- **Auto ACK**: Message removed immediately when delivered (risky - message lost if consumer crashes)
- **Manual ACK**: Consumer explicitly ACKs after processing (safe - message requeued if consumer crashes)

**Code Example: Manual ACK**

```java
// Java Example
public class ManualAck {
    public void consumeWithAck() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        
        channel.queueDeclare("task-queue", true, false, false, null);
        
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            
            try {
                // Process message
                processMessage(message);
                
                // ACK on success
                channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
            } catch (Exception e) {
                // NACK on failure (requeue)
                channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, true);
            }
        };
        
        // Manual ACK (autoAck = false)
        channel.basicConsume("task-queue", false, deliverCallback, 
            consumerTag -> {});
    }
}
```

```javascript
// Node.js Example
async function manualAck() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    await channel.assertQueue('task-queue', { durable: true });
    
    await channel.consume('task-queue', async (msg) => {
        if (msg) {
            try {
                const message = msg.content.toString();
                
                // Process message
                await processMessage(message);
                
                // ACK on success
                channel.ack(msg);
            } catch (error) {
                // NACK on failure (requeue)
                channel.nack(msg, false, true);
            }
        }
    }, { noAck: false }); // Manual ACK
}
```

```python
# Python Example
def manual_ack():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost')
    )
    channel = connection.channel()
    
    channel.queue_declare(queue='task-queue', durable=True)
    
    def callback(ch, method, properties, body):
        try:
            message = body.decode()
            
            # Process message
            process_message(message)
            
            # ACK on success
            ch.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as e:
            # NACK on failure (requeue)
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
    
    # Manual ACK (auto_ack=False)
    channel.basic_consume(queue='task-queue', on_message_callback=callback, auto_ack=False)
    channel.start_consuming()
```

### 4.3 Prefetch Count

**What is Prefetch Count?**

Limits how many unacknowledged messages a consumer can have at once. Prevents one slow consumer from hogging all messages.

**Real-World Example:**

Like limiting how many plates a waiter can carry - ensures fair distribution among waiters.

**Code Example: Prefetch Count**

```java
// Java Example
public class PrefetchExample {
    public void setupConsumer() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        
        // Set prefetch to 1 (fair dispatch)
        channel.basicQos(1);
        
        channel.queueDeclare("task-queue", true, false, false, null);
        
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            processMessage(message);
            channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
        };
        
        channel.basicConsume("task-queue", false, deliverCallback, 
            consumerTag -> {});
    }
}
```

```javascript
// Node.js Example
async function prefetchExample() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Set prefetch to 1 (fair dispatch)
    await channel.prefetch(1);
    
    await channel.assertQueue('task-queue', { durable: true });
    
    await channel.consume('task-queue', (msg) => {
        if (msg) {
            const message = msg.content.toString();
            processMessage(message);
            channel.ack(msg);
        }
    }, { noAck: false });
}
```

```python
# Python Example
def prefetch_example():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost')
    )
    channel = connection.channel()
    
    # Set prefetch to 1 (fair dispatch)
    channel.basic_qos(prefetch_count=1)
    
    channel.queue_declare(queue='task-queue', durable=True)
    
    def callback(ch, method, properties, body):
        message = body.decode()
        process_message(message)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    
    channel.basic_consume(queue='task-queue', on_message_callback=callback, auto_ack=False)
    channel.start_consuming()
```

### 4.4 Dead Letter Exchange (DLX)

**What is DLX?**

A special exchange where messages are sent when they:
- Are rejected (NACK) without requeue
- Expire (TTL)
- Exceed queue length limit

**Why is it Important?**

Allows you to handle failed messages separately instead of losing them.

**Code Example: Dead Letter Exchange**

```java
// Java Example
public class DeadLetterExchange {
    public void setup() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        
        // Create DLX
        channel.exchangeDeclare("dlx", "direct", true);
        channel.queueDeclare("dlq", true, false, false, null);
        channel.queueBind("dlq", "dlx", "failed");
        
        // Main queue with DLX
        Map<String, Object> args = new HashMap<>();
        args.put("x-dead-letter-exchange", "dlx");
        args.put("x-dead-letter-routing-key", "failed");
        
        channel.queueDeclare("main-queue", true, false, false, args);
        
        // Consumer that rejects messages
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            try {
                processMessage(delivery);
                channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
            } catch (Exception e) {
                // Reject without requeue -> goes to DLX
                channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
            }
        };
        
        channel.basicConsume("main-queue", false, deliverCallback, 
            consumerTag -> {});
    }
}
```

```javascript
// Node.js Example
async function deadLetterExchange() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Create DLX
    await channel.assertExchange('dlx', 'direct', { durable: true });
    await channel.assertQueue('dlq', { durable: true });
    await channel.bindQueue('dlq', 'dlx', 'failed');
    
    // Main queue with DLX
    await channel.assertQueue('main-queue', {
        durable: true,
        arguments: {
            'x-dead-letter-exchange': 'dlx',
            'x-dead-letter-routing-key': 'failed'
        }
    });
    
    // Consumer that rejects messages
    await channel.consume('main-queue', async (msg) => {
        if (msg) {
            try {
                await processMessage(msg);
                channel.ack(msg);
            } catch (error) {
                // Reject without requeue -> goes to DLX
                channel.nack(msg, false, false);
            }
        }
    }, { noAck: false });
}
```

```python
# Python Example
def dead_letter_exchange():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost')
    )
    channel = connection.channel()
    
    # Create DLX
    channel.exchange_declare(exchange='dlx', exchange_type='direct', durable=True)
    channel.queue_declare(queue='dlq', durable=True)
    channel.queue_bind(exchange='dlx', queue='dlq', routing_key='failed')
    
    # Main queue with DLX
    channel.queue_declare(
        queue='main-queue',
        durable=True,
        arguments={
            'x-dead-letter-exchange': 'dlx',
            'x-dead-letter-routing-key': 'failed'
        }
    )
    
    # Consumer that rejects messages
    def callback(ch, method, properties, body):
        try:
            process_message(body)
            ch.basic_ack(delivery_tag=method.delivery_tag)
        except Exception:
            # Reject without requeue -> goes to DLX
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
    
    channel.basic_consume(queue='main-queue', on_message_callback=callback, auto_ack=False)
    channel.start_consuming()
```

### 4.5 Retry Queues

**What are Retry Queues?**

Queues that hold messages for retry after a delay. More sophisticated than immediate requeue.

**Pattern:**
1. Message fails processing
2. Send to retry queue with TTL
3. After TTL expires, message goes back to main queue
4. Repeat until max retries, then send to DLQ

**Code Example: Retry Queue Pattern**

```java
// Java Example
public class RetryQueue {
    public void setup() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        
        // Main queue
        channel.queueDeclare("main-queue", true, false, false, null);
        
        // Retry queue with DLX pointing back to main queue
        Map<String, Object> retryArgs = new HashMap<>();
        retryArgs.put("x-dead-letter-exchange", "");
        retryArgs.put("x-dead-letter-routing-key", "main-queue");
        retryArgs.put("x-message-ttl", 60000); // 60 seconds
        
        channel.queueDeclare("retry-queue", true, false, false, retryArgs);
        
        // Consumer with retry logic
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            try {
                processMessage(delivery);
                channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
            } catch (Exception e) {
                // Send to retry queue
                channel.basicPublish("", "retry-queue", null, 
                    delivery.getBody());
                channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
            }
        };
        
        channel.basicConsume("main-queue", false, deliverCallback, 
            consumerTag -> {});
    }
}
```

### 4.6 Message Persistence

**What is Message Persistence?**

Storing messages on disk so they survive broker restarts.

**How to Enable:**

1. **Durable Queue**: Queue survives broker restart
2. **Persistent Messages**: Messages survive broker restart

**Code Example: Message Persistence**

```java
// Java Example
public class MessagePersistence {
    public void setup() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        
        // Durable queue
        boolean durable = true;
        channel.queueDeclare("persistent-queue", durable, false, false, null);
        
        // Persistent message
        channel.basicPublish("", "persistent-queue", 
            MessageProperties.PERSISTENT_TEXT_PLAIN,
            "Persistent message".getBytes());
    }
}
```

```javascript
// Node.js Example
async function messagePersistence() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Durable queue
    await channel.assertQueue('persistent-queue', { durable: true });
    
    // Persistent message
    channel.publish('', 'persistent-queue', Buffer.from('Persistent message'), {
        persistent: true
    });
}
```

```python
# Python Example
def message_persistence():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('localhost')
    )
    channel = connection.channel()
    
    # Durable queue
    channel.queue_declare(queue='persistent-queue', durable=True)
    
    # Persistent message
    channel.basic_publish(
        exchange='',
        routing_key='persistent-queue',
        body='Persistent message',
        properties=pika.BasicProperties(delivery_mode=2)  # Makes message persistent
    )
```

---

## 5. Performance Tuning

### 5.1 Prefetch Configuration

**Best Practices:**

- **Prefetch = 1**: Fair distribution, good for long-running tasks
- **Prefetch > 1**: Better throughput, but can starve slow consumers
- **Prefetch = 0**: Unlimited (not recommended)

**When to Use What:**

- **Prefetch = 1**: Task queues, long processing times
- **Prefetch = 10-100**: Short processing, high throughput needed

### 5.2 Lazy Queues

**What are Lazy Queues?**

Queues that store messages on disk immediately instead of memory. Better for large message backlogs.

**When to Use:**

- Large message volumes
- Messages consumed slower than produced
- Memory constraints

**Code Example: Lazy Queue**

```java
// Java Example
Map<String, Object> args = new HashMap<>();
args.put("x-queue-mode", "lazy");
channel.queueDeclare("lazy-queue", true, false, false, args);
```

### 5.3 Memory High Watermark

**What is Memory High Watermark?**

Threshold that triggers flow control when broker memory usage is high.

**Configuration:**

```
vm_memory_high_watermark.relative = 0.4  # 40% of RAM
```

When exceeded, broker stops accepting new messages (backpressure).

### 5.4 Flow Control

**What is Flow Control?**

Broker mechanism to prevent memory exhaustion by pausing connections.

**How it Works:**

1. Memory usage exceeds watermark
2. Broker pauses connections
3. Producers slow down (backpressure)
4. When memory frees up, connections resume

---

## 6. RabbitMQ Clustering & HA

### 6.1 Node Clustering

**What is Clustering?**

Multiple RabbitMQ nodes working together as a single logical broker.

**Benefits:**
- High availability
- Load distribution
- Fault tolerance

**Architecture:**

```
Node 1 (Disk) ←→ Node 2 (RAM) ←→ Node 3 (RAM)
     ↓              ↓              ↓
  Queue A        Queue B        Queue C
```

### 6.2 Queue Mirroring (HA Queues)

**What is Queue Mirroring?**

Replicating queues across multiple nodes for high availability.

**Types:**

1. **Classic Mirrored Queues**: Legacy, being phased out
2. **Quorum Queues**: Modern, recommended

**Code Example: Quorum Queue**

```java
// Java Example
Map<String, Object> args = new HashMap<>();
args.put("x-queue-type", "quorum");
channel.queueDeclare("ha-queue", true, false, false, args);
```

### 6.3 Quorum Queues

**What are Quorum Queues?**

Modern queue type with built-in replication and consensus.

**Features:**
- Automatic replication
- Leader election
- Better performance than classic mirrored queues

**When to Use:**
- High availability requirements
- Modern RabbitMQ (3.8+)
- Better than classic mirrored queues

### 6.4 Network Partition Handling

**What is a Network Partition?**

When cluster nodes can't communicate with each other.

**Handling Strategies:**

1. **Ignore**: Continue operating (risky)
2. **Pause Minority**: Pause nodes that lost majority
3. **Pause If All Down**: Pause if all nodes are unreachable

**Configuration:**

```
cluster_partition_handling = pause_minority
```

---

## Summary

Phase 2 covers RabbitMQ mastery:

✅ **Architecture**: Broker, Exchange, Queue, Binding, Routing Key, Virtual Hosts  
✅ **Exchange Types**: Direct, Topic, Fanout, Headers  
✅ **Message Flow**: Producer → Exchange → Queue → Consumer  
✅ **Reliability**: Publisher Confirms, Consumer ACK, Prefetch, DLX, Retry, Persistence  
✅ **Performance**: Prefetch, Lazy Queues, Memory Management, Flow Control  
✅ **Clustering & HA**: Node Clustering, Queue Mirroring, Quorum Queues, Network Partitions

---

## Official Documentation & Resources

### RabbitMQ Official Docs
- **RabbitMQ Documentation**: [rabbitmq.com/documentation.html](https://www.rabbitmq.com/documentation.html)
- **AMQP 0-9-1 Model**: [rabbitmq.com/tutorials/amqp-concepts.html](https://www.rabbitmq.com/tutorials/amqp-concepts.html)
- **Clustering Guide**: [rabbitmq.com/clustering.html](https://www.rabbitmq.com/clustering.html)
- **Quorum Queues**: [rabbitmq.com/quorum-queues.html](https://www.rabbitmq.com/quorum-queues.html)

### Tutorials & Learning
- **RabbitMQ Tutorials**: [rabbitmq.com/getstarted.html](https://www.rabbitmq.com/getstarted.html)
- **RabbitMQ Best Practices**: [rabbitmq.com/best-practices.html](https://www.rabbitmq.com/best-practices.html)
- **RabbitMQ Patterns**: [rabbitmq.com/patterns.html](https://www.rabbitmq.com/patterns.html)

### Client Libraries
- **Java Client**: [github.com/rabbitmq/rabbitmq-java-client](https://github.com/rabbitmq/rabbitmq-java-client)
- **Node.js Client (amqplib)**: [github.com/amqp-node/amqplib](https://github.com/amqp-node/amqplib)
- **Python Client (pika)**: [github.com/pika/pika](https://github.com/pika/pika)

### Additional Resources
- **RabbitMQ Blog**: [blog.rabbitmq.com](https://blog.rabbitmq.com/)
- **RabbitMQ YouTube Channel**: [youtube.com/c/RabbitMQ](https://www.youtube.com/c/RabbitMQ)
- **RabbitMQ Community**: [groups.google.com/forum/#!forum/rabbitmq-users](https://groups.google.com/forum/#!forum/rabbitmq-users)

---

**Next Steps**: Once you've mastered RabbitMQ, proceed to [Phase 3: Kafka Mastery](./phase-3-kafka-mastery.md)
