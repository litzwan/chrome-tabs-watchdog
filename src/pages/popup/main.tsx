import React from 'react';
import ReactDOM from 'react-dom/client';
import { Popup } from '../../components/Popup';
import './styles.css';

// window.onload = function() {
//   chrome.runtime.sendMessage({greeting: 'popup_loaded'}, function(response) {
//     console.log(response.data); // logs: 'Message received from popup script'
//   });

//   chrome.runtime.onMessage.addListener(
//     function(request) {
//       console.log(request);
//       if (request.greeting == 'hello')
//         console.log('Message received from background script');
//     });
// };    

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
