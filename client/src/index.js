import React from 'react';
import ReactDOM from 'react-dom';
import './css/main.css';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import rootReducer from './redux';

let socket = io();
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");


let store = applyMiddleware(socketIoMiddleware)(createStore)(rootReducer);
store.subscribe(()=>{
  // console.log('new client state', store.getState());
});
// store.dispatch({type:'server/hello', data:'Hello!'});


ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
