import { createApp } from 'vue';
import './app.css';

// eslint-disable-next-line @typescript-eslint/naming-convention -- ignore
const App = createApp({
  onShow() {
    console.log('App onShow.');
  },
});

export default App;
