import React from "react";
import 'react-circular-progressbar/dist/styles.css';
import '../pages/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../page_components/components/progressButton.css';
import Head from 'next/head';

const config = require('../next.config')

function MyApp({ Component, pageProps }) {
  // You can include global layout components here (e.g., headers, footers)

  return (
    <>
      <Head>
        <title>Incremental Relic</title>
        <link rel="icon" href={config.basePath+"/favicon.ico"} />
      </Head>
      {/* Any global layout components */}
      <Component {...pageProps} />
      {/* Any global layout components */}
    </>
  );
}

export default MyApp;
