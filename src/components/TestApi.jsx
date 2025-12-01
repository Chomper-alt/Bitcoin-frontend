import React, { useEffect } from 'react';
import axios from 'axios';

const TestApi = () => {
 useEffect(() => {
  fetch("http://localhost:5000")
    .then(res => res.text())
    .then(data => console.log(data))
    .catch(err => console.error("❌ API error:", err));
}, []);

  return <h2>Open your console to see the result!</h2>;
};

export default TestApi;
