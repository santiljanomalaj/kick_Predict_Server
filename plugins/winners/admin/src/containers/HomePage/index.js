/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
import axios from 'axios'
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

const handleClick = async () => {
  console.log(strapi);
  const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
  const csv = await axios.get(strapi.backendURL+'/winners', {
    headers: {
      'Authorization': 'Bearer '+token.split('"').join('')
    }
  });

  // console.log(csv.data);
  download(csv.data)
}

const download = (csv) => {
  var a = document.createElement('a');
  a.style.visibility = 'invisible';
  var blob = new Blob([csv]);
  a.href = window.URL.createObjectURL(blob);
  a.download = 'result.csv';
  a.click();
}

const HomePage = () => {
  return (
    <div className="text-center pt-5">
      <button className='button btn-primary btn-lg' onClick={handleClick}>
          Download CSV
        </button>
    </div>
  );
};

export default memo(HomePage);
