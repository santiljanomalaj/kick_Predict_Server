const { sanitizeEntity } = require('strapi-utils');
const fs = require('fs');

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    const query = Object.assign({}, ctx.query);

    // Add more stuff to the query
    query.live = true;
    // query.settlement_date_gt = new Date();
    if (ctx.query._q) {
      entities = await strapi.services.sneaker.search(query);
    } else {
      entities = await strapi.services.sneaker.find(query);
    }

    try{
      const configStr = fs.readFileSync(process.cwd()+'/config.json');
      const config = JSON.parse(configStr);

      entities.forEach(entity => {
        entity.config = {};
        entity.config.bet = config.bet;
        entity.config.percent = config.percent;

        // if hours_offset_to_disable_bidding
        if(entity.hours_offset_to_disable_bidding) {
          let disableBiddingTime = new Date(entity.settlement_date);
          console.log('disableBiddingTime = '+disableBiddingTime);
          disableBiddingTime.setHours(
            disableBiddingTime.getHours() - entity.hours_offset_to_disable_bidding
          );
          console.log('hours = '+disableBiddingTime.getHours());
          console.log('offset = '+entity.hours_offset_to_disable_bidding);
          console.log('disableBiddingTime = '+disableBiddingTime);
  
          const currentTime = new Date();
          
          if(currentTime > disableBiddingTime) {
            // Bidding is no longer allowed
            entity.allowBidding = false;
          }else {
            entity.allowBidding = true;
          }
        } else{
          entity.allowBidding = true;
        }
        

      });
    }catch(err){
      console.log(err);
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.sneaker }));
  },
};