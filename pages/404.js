import React from 'react';

const config = require('../next.config')

const NotFound = () => {
  var path = config.basePath + "/"
  return (
    <div className="not-found" style={{color:"white"}}>
      <h1>404 - Page Not Found</h1>
      <p>The page you requested could not be found.</p>
      <p>Return to <a href={path}>Home</a></p>
    </div>
  );
};

export default NotFound;