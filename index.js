const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');


// --------------------------------- FILE SYSTEM-------------------------------

// Blocking   and sync way 
// const txtIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(txtIn);
// const txtOut = `This is what we know  about avocado ${txtIn}\n Created on ${Date.now()} `;
// fs.writeFileSync('./txt/Output.txt', txtOut);
// console.log('file created and edited ');


// Non-blocking and async way..

// fs.readFile('./txt/start.txt', 'utf-8', (err, data)=>{
//     if(err) return console.log('Error');
//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data1 )=>{
//         console.log(data1);
//         fs.readFile(`./txt/append.txt`,  'utf-8', (err, data2)=>{
//             console.log(data2); // this is called callBack Hall.....
//             fs.writeFile('./txt/final.txt', `${data1}\n ${data2}`, 'utf-8', err=>{
//                 console.log('Your fie has been written');
//             })
//         })
//     })
// });
// console.log("File will read...");


// --------------------------------- Node Form-------------------------------

const temOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const temCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const temProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev_data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);

// --------------------------------- Use of 3rd Party plugins {SLUGIFY} -------------------------------
    const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));
    // console.log(slugs);

// --------------------------------- SERVER-------------------------------
const server =  http.createServer((req, res)=>{
    // --------------------------------- URL-------------------------------
    
    const {query ,pathname} = url.parse(req.url, true);

    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, { 'Content-type': 'text/html' });
        const cardHtml = dataObj.map(el => replaceTemplate(temCard, el)).join('');
        const output = temOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        res.end(output);
    } else if(pathname === '/product'){
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(temProduct, product)
        res.end(output);
    } else if(pathname === '/api'){
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data);
    } else{
        res.writeHead(404, {
            'Content-type': 'text/html'
        })
        res.end('<h1>Page Not Found!</h1>');
    }
})

server.listen('8000', '127.0.0.1', ()=>{
    console.log('Listening to requests on port 8000');
})

// --------------------------------- URL-------------------------------








