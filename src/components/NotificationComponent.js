import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationComponent = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create an EventSource instance and connect to the SSE endpoint
    const eventSource = new EventSource('http://localhost:5000/api/notifications');

    // Handle incoming messages
    eventSource.onmessage = (event) => {
      try {
        const todo = JSON.parse(event.data);
        toast.info(
          `Title: ${todo.title} - ${todo.description} (Due: ${todo.dueDate})`,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Duration in milliseconds
          }
        );
      } catch (err) {
        console.error('Error parsing event data:', err);
      }
    };

    // Handle errors
    eventSource.onerror = (event) => {
      console.error('EventSource error:', event);
      setError('Failed to connect to notifications endpoint.');
      eventSource.close(); // Close the connection on error
    };

    // Clean up the EventSource connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <ToastContainer />
    </div>
  );
};

export default NotificationComponent;
