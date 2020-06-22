'use strict';

const { parse } = require('json2csv');
const Readable = require('stream').Readable;
const stream  = new Readable();

/**
 * winners.js controller
 *
 * @description: A set of functions called "actions" of the `winners` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {


    const bids = await strapi.query('bid').find({_limit: 10000});

    const data = bids.map(bid => {
      const result = {};
      result.id = bid.id;
      result.settlement_price = bid.settlement_price;
      result.settlement_date = bid.settlement_date;
      result.bid = bid.bid;
      result.amount = bid.amount;
      result.status = bid.status;
      result.manuallyMatched = bid.manuallyMatched;

      if(bid.user) {
        result.username = bid.user.username;
        result.email = bid.user.email;
        result.paypal = bid.user.paypal;
      }

      if(bid.sneaker) {
        result.sneaker_id = bid.sneaker.id;
        result.sneaker_name = bid.sneaker.name;
        result.sneaker_settlement_price = bid.sneaker.settlement_price;
        result.sneaker_settlement_date = bid.sneaker.settlement_date;
      }

      if(bid.match) {
        result.match = bid.match.id;
      }

      return result;
    });

    const fields = [
              'id', 'settlement_price', 'settlement_date', 
              'bid', 'amount', 'status', 'manuallyMatched',
              'username', 'email', 'paypal', 'sneaker_id',
              'sneaker_name', 'sneaker_settlement_price', 'sneaker_settlement_date'
            ];
    const opts = { fields };
     
    try {
      const csv = parse(data, opts);
      // ctx.set('Content-disposition', `attachment; filename=result.csv`);
      ctx.attachment('result.csv');
      ctx.set('Content-Type', 'text/csv');
      // stream.push(csv);
      // stream.push(null);
      ctx.body = csv;
      
      // return ctx.send(csv);
    } catch (err) {
      console.error(err);
      return ctx.serverError('Could not generate CSV');
    }
    
  }
};
