import '../styles/globals.css'
import Layout from './../components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from "next-auth/react"
function MyApp({ Component, pageProps }) {
  
  return(
  <>
      <ToastContainer
      position="top-left"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  <SessionProvider session={pageProps.session}>
  <Layout>
   <Component {...pageProps} />
   </Layout>
   </SessionProvider></>)


  
}

export default MyApp
