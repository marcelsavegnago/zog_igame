import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/ui/utest';  // 单元测试引入这个 到 App
import Game from './App/game/Game';  // 单元测试引入这个 到 App
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Game />, document.getElementById('root'));
registerServiceWorker();
