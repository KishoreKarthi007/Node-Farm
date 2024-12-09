const fs=require('fs');
const http=require('http');
const url=require('url');
const replaceTemplate=require('./modules/replace.js');

const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');

const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);

const server=http.createServer((req,res)=>{
    const {pathname, query }=url.parse(req.url,true);

    // Overview
    if( pathname === '/' || pathname ==='/overview'){
        res.writeHead(200,{'Content-type':'text/html'});
        const cardsHtml=dataObj.map( value => replaceTemplate(tempCard,value)).join('');
        const output=tempOverview.replace("{%Product-cards%}",cardsHtml);
        res.end(output);
    // Product
    } else if( pathname === '/product'){
        res.writeHead(200,{'Content-type':'text/html'});
        const product=dataObj[query.id];
        const output=replaceTemplate(tempProduct,product);
        res.end(output);

    // API
    } else if( pathname === '/api'){
            res.writeHead(200,{'Content-type':'application/json'});
            res.end(data);   
    // Not Found Page
    }else{
        res.writeHead(404,
            {
                'Content-type':'text/html',
                'This-is-my-header':'header value 108'
            }
        );
        res.end('<h1>404 Page Not Found</h1>');
    }
});

const PORT=8000;
server.listen(PORT,()=>{
    console.log("Listening to PORT 8000");
});