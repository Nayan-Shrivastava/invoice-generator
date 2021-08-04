const processProductsArray = (products) => {
    products = products.map((product) => {
        product.tax = calculateTax(product.price);
        return product;
    });
    return products;
};

const processInvoice = (invoice) => {
    invoice = JSON.parse(JSON.stringify(invoice));
    invoice.products.map((product) => {
        product.total = product['price'] + product['tax'];
        //return product;
    });
    invoice['totalPrice'] = 0;
    invoice['totalTax'] = 0;

    //product.totalAmount = 0;
    invoice.products.forEach((product) => {
        invoice['totalPrice'] += product['price'];
        invoice['totalTax'] += product['tax'];
    });
    invoice['totalAmount'] = invoice['totalPrice'] + invoice['totalTax'];
    return invoice;
};

const taxPercent = 10;
const calculateTax = (price) => (taxPercent / 100) * price;

module.exports = {
    calculateTax,
    processProductsArray,
    taxPercent,
    processInvoice
};
