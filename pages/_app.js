import "@/styles/globals.css";
import '@/styles/responsive.css';
import '@/styles/shortcodes.css';
import '@/styles/skin.css';
import '@/styles/tpl-essential-grids.css';
import '@/styles/core.animation.css';
import '@/styles/plugin.revslider.css';
import '@/styles/custom.slider.css';
import '@/styles/fontello/css/fontello.css';
import "@/styles/forms.css"; // Import CSS
import '@fullcalendar/common/main.css'; // Import from common
import '@/styles/buttons.css'
import '@/styles/nav.css'
import '@/styles/members.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Remove list import since it has no CSS

import { Provider } from 'react-redux';
import { store } from '@/redux/store';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Provider>
  );
}
