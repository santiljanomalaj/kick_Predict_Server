'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {

    async matchBid(bid) {

        // Try to find another bid which can be matched.
        let matched = await strapi.query('bid')
                                    .find({
                                        _limit: 1,
                                        _sort: 'created_at:asc',
                                        sneaker: bid.sneaker.id,
                                        amount: bid.amount,
                                        status: 'unmatched',
                                        bid_ne: bid.bid
                                    })
        if(!Array.isArray(matched) || matched.length == 0) {
            // See if we have limit to match the bids with system
            return;
            // const count = await strapi.query('bid').count({sneaker: bid.sneaker.id, systemGenerated: true});
            // if ( count < 50 ) {
            //     const newBid = await strapi.query('bid').create({
            //         sneaker: bid.sneaker.id,
            //         settlement_price: bid.settlement_price,
            //         settlement_date: bid.settlement_date,
            //         bid: bid.bid == 'under'? 'under' : 'over',
            //         amount: bid.amount,
            //         status: 'unmatched',
            //         systemGenerated: true
            //     });

            //     matched = [newBid];
            // }else {
            //     // Nothing can be done, homie!
            //     return;
            // }
        }

        matched = matched[0];

        // Match the two bids together
        await strapi.query('bid').update({id: bid.id}, {match: matched.id, status: 'matched'});
        await strapi.query('bid').update({id: matched.id}, {match: bid.id, status: 'matched'});
        return matched;
    }
};
