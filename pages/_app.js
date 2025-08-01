import "@/styles/globals.css";
import '@/styles/responsive.css';
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
import '@/styles/account.css'
import '@/styles/modals.css'
import '@/styles/prayerandpost.css'
import "@/styles/pages.css"
import "@/styles/videos.css"
import "@/styles/gallery-enhanced.css"
import "@/styles/weekly-events.css"
import "@/styles/enhanced-ui.css"
// Remove list import since it has no CSS

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Component {...pageProps} />
        <ToastContainer />
      </Provider>
    </ErrorBoundary>
  );
}
