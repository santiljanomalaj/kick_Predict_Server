'use strict';

const fs = require('fs');
/**
 * config.js controller
 *
 * @description: A set of functions called "actions" of the `config` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    let data;
    try{
      const config = fs.readFileSync(process.cwd()+'/config.json');
      data = JSON.parse(config);
    }catch(err) {
      console.error(err);
    }

    return ctx.send({
      data
    });
  },


  update: async (ctx) => {
    const data = ctx.request.body;

    fs.writeFileSync(process.cwd()+'/config.json', JSON.stringify(data, null, 2));

    return ctx.send({
      data
    });
  }
};
