import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import Shopify = require('shopify-api-node');
import { ShopifyService } from 'src/services/shopify.service';
config();

const shopifyProvider = {
  provide: 'SHOPIFY',
  useFactory: () => {
    const shopify = new Shopify({
      shopName: process.env.SHOP,
      apiKey: process.env.API_KEY,
      password: process.env.ADMIN_PASSWORD,
    });
    return shopify;
  },
};

@Module({
  providers: [shopifyProvider, ShopifyService],
  exports: ['SHOPIFY', ShopifyService],
})
export class ShopifyModule {}
