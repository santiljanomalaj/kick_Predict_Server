/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import axios from 'axios';


class HomePage extends React.Component {

  state = {
    config: {},
    saveLabel: 'Save'
  };

  async getConfig() {
    const config = await axios.get(strapi.backendURL+'/config', {
      headers: {
        'Authorization': 'Bearer '+sessionStorage.getItem('jwtToken').split('"').join('')
      }
    });
  
    return config;
  }

  async saveConfig(data) {
    this.setState({...this.state, saveLabel: 'Saving'});
    const config = await axios.put(strapi.backendURL+'/config', data, {
      headers: {
        'Authorization': 'Bearer '+sessionStorage.getItem('jwtToken').split('"').join(''),
        'content-type': 'application/json'
      }
    });
    this.setState({...this.state, config});
    this.setState({...this.state, saveLabel: 'Save'});
  }

  async componentDidMount() {
    const response = await this.getConfig();
    let config = response.data.data;
    config = config || {};
    this.setState({...this.state, config});
  }

  onInputChange(event) {

    const config = this.state.config;
    config[event.target.id] = event.target.value;
    this.setState({...this.state, config});
  }

  render() {
    return (
      <div className="container pt-5">
        <div className="row">
         <div className="col-lg-4">
             <div className="card">
                 <div className="card-body">
                     <h3 className="card-title">Kick Predict</h3>
                     <label>Configure Bid Amount ($)</label>
                     <p className="card-text">
                         <input id="bet" type="number" onChange={(e)=>{this.onInputChange(e)}}
                          value={this.state.config.bet} className="form-control inputNumber rc-input-number-input">
                         </input>
                     </p>
                 </div>
                 <div className="card-body">
                     <label>Commission (%)</label>
                     <p className="card-text">
                         <input id="percent" type="number" onChange={(f)=>{this.onInputChange(f)}}
                          value={this.state.config.percent} className="form-control inputNumber rc-input-number-input">
                         </input>
                     </p>
                 </div>
             </div>
         </div>
         
     </div>
  
      {/* <div className="row mt-2">
          <div className="col-lg-4">
              <div className="card">
                  <div className="card-body">
                      <h5 className="card-title">Mail Chimp</h5>
                      <h6 className="card-subtitle mb-2 text-muted">Mailchimp configuration</h6>
                      <p className="card-text">
                          /* <label htmlFor="" style="font-size: 14px">API Key</label>
                          <input type="text" placeholder="API Key" className="form-control" style="width: 200px "/> 
                      </p>
                      <p className="card-text">
                          <label htmlFor="" style="font-size: 14px">List Name</label>
                          <input type="text" placeholder="List Name" className="form-control" style="width: 200px "/>
                      </p>
                  </div>
              </div>
          </div>
      </div> */}
      <div className="row pt-2">
          <div className="col-lg-12">
            <button onClick={() => {this.saveConfig(this.state.config)}} className="btn btn-primary btn-lg" style={{padding: '8px 16px'}} color="success" type="submit">{this.state.saveLabel}</button>
          </div>
      </div>
      </div>
    );
  }
};



export default memo(HomePage);
