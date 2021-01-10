import { useState, useEffect, useRef } from 'react';

export default function useHookWithWebsocket(useHook, initial = false, channel ) {
  const [ value, setValue ] = useHook( initial );
  const [ reconnecting, setReconnecting ] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = new WebSocket(channel);

    socket.current.onopen = () => {
      onConnected(socket.current, initial);
    };

    socket.current.onclose = () => {
      if (socket.current) {
        if (reconnecting) return;
        setReconnecting(true);
        setTimeout(() => setReconnecting(false), 2000);
      }
    };

    socket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setValue(data.value);
    };

    return () => {
      socket.current.close();
      socket.current = null;
    };
  }, [reconnecting]);

  useEffect(() => {
    if (socket.current.readyState === 1) {
      toggle()
    }
  }, [value])

  const toggle = () => {
    socket.current.send(
        JSON.stringify({
          type: 'toggle',
          value,
        }),
    );
  }

  return [ value, setValue ];
}


function onConnected(socket, value) {
  socket.send(
      JSON.stringify({
        type: 'connect',
        value
      }),
  );
}
