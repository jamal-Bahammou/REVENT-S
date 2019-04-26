import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './app/layout/App';
import registerServiceWorker from './registerServiceWorker';
import { configueStore } from './app/store/confiugreStore';
import ScrollToTop from './app/common/util/ScrollToTop'

const store = configueStore();
const rootEl = document.getElementById('root');

let render = () => {
   ReactDOM.render(
      <Provider store={store}>
         <BrowserRouter>
            <ScrollToTop>
               <App />
            </ScrollToTop>
         </BrowserRouter>
      </Provider>,
      rootEl
   );
};

if (module.hot) {
   module.hot.accept('./app/layout/App', () => {
      setTimeout(render);
   });
}

render();
registerServiceWorker();
