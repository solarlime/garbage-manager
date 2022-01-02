import App from './ts/app';
import './css/main.sass';

// It's necessary to recognise if the page is loaded locally or not to choose a server location
let serverHost;
const { hostname, protocol } = window.location;
if (hostname === 'localhost') {
  serverHost = `${protocol}//${hostname}:3002`;
} else {
  serverHost = `${protocol}//nginx.solarlime.dev`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = new App(serverHost);
console.log('Works!');
