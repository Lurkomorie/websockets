import { useState } from 'react';
import useHookWithWebsocket from './useHookWithWebsocket';
import './styles.css';

function App() {
    const [ value, setValue ] = useHookWithWebsocket( useState, false, 'ws://127.0.0.1:3002' );

    return (
        <div className="main">
            <input className="l" type="checkbox" checked={value} onClick={() => setValue(!value)}/>
        </div>
    )
}

export default App;
