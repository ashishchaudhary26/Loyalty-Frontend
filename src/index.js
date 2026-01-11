import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import App from './app/App'
import reportWebVitals from './reportWebVitals';
import store from '../src/redux/store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Provider store={store}>
<App />
</Provider>
);


reportWebVitals();
