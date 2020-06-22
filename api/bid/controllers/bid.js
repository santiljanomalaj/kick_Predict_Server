const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    const params = ctx.request.body;

    if (!params.sneaker) {
        return ctx.badRequest('Must specify a sneaker');
    }

    // if(params.amount !== 5) {
    //     return ctx.badRequest('Only $5 is allowed as bid, right now.');
    // }

    if(!params.bid) {
        return ctx.badRequest('Must specify a bid');
    }

    params.user = ctx.state.user.id;

    // Ensure that the settlement date and price is sent correctly
    const sneaker = await strapi.query('sneaker').findOne({id: params.sneaker});

    if(!sneaker) {
        return ctx.badRequest('Invalid sneaker');
    }

    if(sneaker.settlement_price !== params.settlement_price) {
        return ctx.badRequest('settlement_price invalid');
    }

    if(sneaker.settlement_date !== params.settlement_date) {
        return ctx.badRequest('settlement_date is invalid');
    }

    params.status = 'unmatched';

    const entity = await strapi.services.bid.create(params);
    const match = await strapi.services.bid.matchBid(entity);
    return sanitizeEntity(entity, { model: strapi.models.bid });
  },


  async cancel(ctx) {
    const { id } = ctx.params;

    let bid = await strapi.query('bid').findOne({id});

    // Allow only 30 mins to cancel bid
    let timeThreshold = new Date();
    timeThreshold.setMinutes(timeThreshold.getMinutes() - 30);

    if(bid.created_at > timeThreshold) {
      return ctx.badRequest('Cannot cancel bet after 30 mins of placing it');
    }

    await strapi.query('bid').update({match: id}, {status: 'unmatched', match: null});
    bid = await strapi.query('bid').update({id}, {status: 'unmatched', match: null});

    return sanitizeEntity(bid, { model: strapi.models.bid });
  },

  async find(ctx) {
    let entities;
    const query = Object.assign({}, ctx.query);
    query.user = ctx.state.user.id;
    query._sort='created_at:desc';

    if (ctx.query._q) {
      entities = await strapi.services.bid.search(query);
    } else {
      entities = await strapi.services.bid.find(query);
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.bid }));
  },
};