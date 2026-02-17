import React, { useEffect, useRef } from 'react';
import { useAppSelector, RootState } from '@/redux/store';
import toast from 'react-hot-toast';

/**
 * Light wrapper that retries the EventSource after `delay` ms.
 */
function createReconnectingEventSource(
  url: string,
  { onMessage, onError, delay = 3000 }: {
    onMessage: (e: MessageEvent<string>) => void;
    onError?: (e: Event) => void;
    delay?: number;
  }
) {
  let es: EventSource;

  const connect = () => {
    es = new EventSource(url);

    es.onmessage = onMessage;

    es.onerror = (evt) => {
      es.close();                     // always close the broken stream
      onError?.(evt);
      setTimeout(connect, delay);     // schedule a new one
    };
  };

  connect();

  return () => es.close();            // close‑handler for React cleanup
}

const NotificationListener: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.authStates);
  const cleanupRef = useRef<() => void>();   // holds the current close fn

  useEffect(() => {
    // Tear down the previous stream (if any) before creating a new one
    cleanupRef.current?.();
    cleanupRef.current = undefined;

    if (!user?.userId) return;        // nothing to listen to yet

    const url = `/admin/api/sse-notifications?userId=${user.userId}`;

    cleanupRef.current = createReconnectingEventSource(url, {
      onMessage: (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received notification:', data);
          toast.success(
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 16 }}>{data.Title}</div>
              <div style={{ fontSize: 14 }}>{data.Message}</div>
            </div>
          );
        } catch (err) {
          console.error('Error parsing notification:', err);
        }
      },
      onError: () => console.error('EventSource error – retrying…'),
      delay: 3000,
    });

    console.log('EventSource connection (with auto‑retry) established');

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      console.log('EventSource connection closed');
    };
  }, [user?.userId]);  // only re‑run when the ID actually changes

  return null; // purely side‑effect component
};

export default NotificationListener;