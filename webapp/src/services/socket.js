import io from 'socket.io-client';

//connection a socket.io

let socket;

export function connectSocket(token) {
  if (socket) {
    socket.disconnect();
  }

  socket = io(`http://localhost:3007?token=${token}`);

  socket.on('MESSAGE', payload => {
    triggerEvent('MESSAGE', payload);
  });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
}

const subscribers = {
  // MESSAGE: [callback1, callback2]
};

export function subscribe(eventName, callback) {
  if (!subscribers[eventName]) subscribers[eventName] = [];

  subscribers[eventName].push(callback);

  // unsubscribe function
  return () => {
    subscribers[eventName] = subscribers[eventName].filter(
      cb => cb !== callback,
    );
  };
}

function triggerEvent(eventName, payload) {
  if (!subscribers[eventName]) return;

  subscribers[eventName].forEach(callback => {
    callback(payload);
  });
}
