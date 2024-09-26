import "@/styles/globals.css";
import '@/styles/responsive.css'
import '@/styles/shortcodes.css'
import '@/styles/responsive.css'
import '@/styles/skin.css'
import '@/styles/tpl-essential-grids.css'
import '@/styles/core.animation.css'
import '@/styles/plugin.revslider.css'
import '@/styles/custom.slider.css'
import '@/styles/fontello/css/fontello.css'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>

  );
}
