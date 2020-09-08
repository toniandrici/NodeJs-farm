const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const slugify = require('slugify');
//SERVER    


const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));


const server = http.createServer((req, res) => {
console.log(req.url);
console.log(url.parse(req.url, true));
    const {
        query,
        pathname
    } = url.parse(req.url, true);
    // const path = req.url;
    //OVERVIEW PAGGE
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);


        //PRODUCT PAGE
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        console.log(query);
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

        //API
    } else if (pathname === '/api') {

        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);


        //NOT FOUND
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>This page can not be found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('SERVER HAS BEEN STARTED');
});