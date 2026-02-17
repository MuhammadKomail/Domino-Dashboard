import {
    connect,
    NatsConnection,
    JetStreamClient,
    ConsumerConfig,
    AckPolicy,
    DeliverPolicy,
    ReplayPolicy
} from 'nats.ws';

class NatsService {
    private static instance: NatsService;
    private nc: NatsConnection | null = null;
    private js: JetStreamClient | null = null;

    private constructor() { }

    public static getInstance(): NatsService {
        if (!NatsService.instance) {
            NatsService.instance = new NatsService();
        }
        return NatsService.instance;
    }

    public async connect(serverUrl: string, username?: string, password?: string): Promise<void> {
        try {
            console.log('Attempting to connect to NATS server:', serverUrl);

            this.nc = await connect({
                servers: serverUrl,
                timeout: 5000,
                reconnect: true,
                maxReconnectAttempts: -1,
                reconnectTimeWait: 2000,
                waitOnFirstConnect: true,
                user: username,
                pass: password,
            });

            if (!this.nc) {
                throw new Error('Failed to establish NATS connection');
            }

            // Initialize JetStream
            this.js = this.nc.jetstream();
            console.log('JetStream client initialized');

            // Monitor connection state
            const monitorStatus = () => {
                if (this.nc?.isClosed()) {
                    console.log('NATS connection is closed');
                } else {
                    console.log('NATS connection is active');
                }
            };

            monitorStatus();
            const statusInterval = setInterval(monitorStatus, 5000);
            this.nc.closed().finally(() => clearInterval(statusInterval));

            console.log('Successfully connected to NATS with JetStream');
        } catch (error) {
            console.error('Failed to connect to NATS:', error);
            throw error;
        }
    }

    public async subscribe(subject: string, callback: (data: any) => void): Promise<void> {
        if (!this.nc || !this.js) {
            throw new Error('NATS/JetStream not initialized');
        }

        try {
            // Generate a unique durable name similar to C#
            const guid = Math.random().toString(36).substring(2, 10); // Simple random string
            const durableName = `durable-${subject.replace(/[.*>]/g, '_')}-${guid}`;
            // Generate a unique deliver_subject for this subscription
            const deliverSubject = `_deliver.${subject.replace(/[.*>]/g, '_')}.${guid}`;

            console.log(`Attempting to subscribe to ${subject} with durable name ${durableName} and deliver_subject ${deliverSubject}`);

            // Subscribe using JetStream with durable push consumer
            const subscription = await this.js.subscribe(subject, {
                stream: 'NotificationStream', // Replace with your actual stream name
                config: {
                    durable_name: durableName,
                    ack_policy: AckPolicy.Explicit, // Require explicit acknowledgment
                    deliver_policy: DeliverPolicy.New, // Retrieve unacknowledged messages
                    deliver_subject: deliverSubject,
                    filter_subject: subject, // Ensure we only get messages for this specific subject
                    replay_policy: ReplayPolicy.Instant, // Process messages immediately
                    max_deliver: 3, // Optional: limit number of delivery attempts
                },
            });

            console.log(`Successfully subscribed to ${subject}`);

            // Process messages asynchronously
            (async () => {
                for await (const msg of subscription) {
                    try {
                        const message = new TextDecoder().decode(msg.data);
                        console.log(`Received message on ${msg.subject}: ${message}`);
                        callback(message);

                        // More robust acknowledgment with error handling
                        try {
                            await msg.ack();
                            console.log(`Successfully acknowledged message on ${msg.subject}`);
                        } catch (ackError) {
                            console.error(`Failed to acknowledge message on ${msg.subject}:`, ackError);
                            // Optionally, you could implement a retry mechanism or additional error handling
                        }
                    } catch (error) {
                        console.error(`Error processing message on ${subject}:`, error);
                        // Optionally, you might want to nack the message in some error scenarios
                        // msg.nack(); // Uncomment if you want to negatively acknowledge problematic messages
                    }
                }
            })().catch((error: Error) => {
                console.error(`Subscription processing error for ${subject}:`, error);
            });
        } catch (error) {
            console.error(`Failed to subscribe to ${subject}:`, error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            if (this.nc) {
                await this.nc.drain();
                this.nc = null;
                this.js = null;
            }
            console.log('Disconnected from NATS');
        } catch (error) {
            console.error('Error disconnecting from NATS:', error);
            throw error;
        }
    }
}

export default NatsService;