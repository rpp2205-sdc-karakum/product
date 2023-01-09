Key-Value DBMS Data Model for Products Service

// ** IDEAL BASED ON LEGACY **//

products_collection = {
  id:             text,
  name:           text,
  category:       text,
  slogan:         text,
  description:    text,
  default_price:  text,
}

styles_collection = {
  product_id: text,
  results:    [
    {
      style_id: text,
      name: text,
      original_price:
      sale_price:
      default?:
      photos: [
        {
          thumbnail_url:
          url:
        }
      ],
      skus: {
        sku_id: {
          quantity:
          size:
        }
      }
    }
  ]
}

// ** SINGLE COLLECTION ** //

DB = {
  products: [
    {
      id:             int,
      name:           text,
      category:       text,
      slogan:         text,
      description:    text,
      default_price:  text,
      styles:         [
        {
          id:     int,
          photos: [
            {
              id:             int,
              url:            text,
              thumbnail_url:  text
            }
          ],
          skus:   {
            id: int // quantity
          }
        }
      ]
    }
  ]
}
