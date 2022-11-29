
Key-Value DBMS Data Model for Products Service


products_db = {
  id: {
    id:             text,
    name:           text,
    category:       text,
    slogan:         text,
    description:    text,
    default_price:  text,
    styles:         {
      id: {
        id:         text,
        name:       text,
        sale_price: text,
        photos:     {
          id: {
            id:             text,
            url:            text,
            thumbnail_url:  text
          }
        },
        skus:       {
          id: int // quantity
        }
      }
    }
  }
}


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
