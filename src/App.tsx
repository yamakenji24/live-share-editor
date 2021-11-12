import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Peer, { DataConnection } from 'skyway-js';

const peer = new Peer({
  key: process.env.REACT_APP_KEY ?? '',
  debug: 3,
});

export const App = (): JSX.Element => {
  const [remoteID, setRemoteID] = useState('');
  const [text, setText] = useState('');
  const [connection, setConnection] = useState<DataConnection | null>(null);

  useEffect(() => {
    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });

    peer.on('connection', (c: DataConnection) => {
      setConnection(c);
      c.on('data', (data: string) => setText(data));
    });

    peer.on('error', (err) => {
      console.error('Error: ' + err);
    });

    peer.on('close', () => {
      console.log('Connection closed');
    });
  }, []);

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    connection?.send(newText);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const connection = peer.connect(remoteID)
    setConnection(connection)
    connection.on('data', (data) => setText(data))
  };

  const handleRemoteIDChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRemoteID(e.target.value)
  }

  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <label>相手のpeerID: 
          <input type="text" value={remoteID} onChange={handleRemoteIDChange} />
        </label>
        <button type="submit">Connect</button>
      </form>
      <textarea value={text} onChange={handleOnChange} />
    </div>
  );
};
