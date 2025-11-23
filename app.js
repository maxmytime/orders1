import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import fetch from 'node-fetch';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import settings from './frontend/public/js/config.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(settings.protocol, settings.host, settings.port);

const port = settings.port;      // порт тестового контура 8001, порт продакшена 80
const host = settings.host;      // адрес сервера 213.189.201.10
const testMode = settings.test;  // значение для продакшена '', значение для тестового контура test=test
const pass = settings.pass;      // значение для продакшена '', значение для тестового контура test=test

// создаем объект приложения
const app = express();
const httpServer = createServer(app);
const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "credentials": true
  };

const io = new Server(httpServer, {
    cors: {
        origin: true,
        credentials: true
      }
});



app.use(cors(corsOptions));
// app.use(cors());
app.use(express.static(`${__dirname}/frontend/public`));

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({
    extended: false,
});
const jsonParser = express.json();

const getPass = (settings, request) => {
    if (settings.pass) {
        return settings.pass;
    } else {
        console.log(request.session.lp);
        return request.session.lp;
    }
}

// Получаем данные с сервера 1С
async function getData(lp, url, response) {
    const res = await fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        },
    });

    // const data = await res.text();
    // return text;
    response.end(await res.text());
}

app.use(cookieParser('123456'));
app.use(session({
        secret: 'yousecretkey',
        resave: true,
        saveUninitialized: true,
    })
);

const time = 60000 * 60 * 12;

// определяем обработчик для маршрута "/"
app.get("/", function(request, response){
    // response.cookie('token', '12345ABCDE');
    console.log('Cookie: ', request.cookies);
    response.sendFile(__dirname + "/index.html");
});

// Заказ
app.get("/order", function(request, response){
    //request.session.lp
    // console.log('Страница заказ', request.cookies.token)
    if (request.cookies.token) {
        response.cookie('token', request.cookies.token, {
            maxAge: time
        });
        response.sendFile(__dirname + "/frontend/public/order.html");
    } else {
        response.redirect('/');
    }
});

// Приход
app.get("/ordergoods", function(request, response){
    //request.session.lp
    // console.log('Страница заказ', request.cookies.token)
    if (request.cookies.token) {
        response.cookie('token', request.cookies.token, {
            maxAge: time
        });
        response.sendFile(__dirname + "/frontend/public/ordergoods.html");
    } else {
        response.redirect('/');
    }
});

// Архив
app.get("/archive", function(request, response){
    if (request.cookies.token) {
        response.cookie('token', request.cookies.token, {
            maxAge: time
        });
        response.sendFile(__dirname + "/frontend/public/archive.html");
    } else {
        response.redirect('/');
    }
});

// Выход
app.get("/exit", function(request, response){
    console.log(request.url);
    request.session.lp = '';
    response.clearCookie('token');
    response.end('OK');
});

// Канбан
app.get("/orders", function(request, response){
    // console.log('Cookie: ', request.cookies.token);
    //  request.session.lp
    if (request.cookies.token) {
        response.cookie('token', request.cookies.token, {
            maxAge: time
        });
        // response.setHeader('Access-Control-Allow-Origin', '*')
        // response.setHeader('Access-Control-Allow-Methods', '*')
        // response.setHeader('Access-Control-Allow-Headers', '*')
        // response.setHeader('Access-Control-Allow-Credentials', true)
        response.sendFile(__dirname + "/frontend/public/orders.html");
        // response.redirect(301, __dirname + "/frontend/public/orders.html");
    } else {
        response.redirect('/');
    }
});

// Логин
app.post('/login', jsonParser, function (request, response) {
    const lp = request.body.lp;
    const name = request.body.name;
    console.log(name);
    let url;

    if (name === 'site') {
        url = 'http://vpn.glados.ru/base/hs/siteapi/Login' + '?' + `${testMode}`;
    } else {
        url = 'http://vpn.glados.ru/base/hs/siteapi/Login';
    }

    let res1C;
    console.log(url);
    getOrdersList(url, lp);

    async function getOrdersList(url, lp) {
        let res = await fetch(url, {
            headers: {
                'Authorization': `Basic ${lp}`
            }
        });

        if (res.ok) {
            res.text().then(author => {
                // console.log(JSON.parse(author).Data);
                request.session.lp = lp;
                response.cookie('token', lp, {
                    maxAge: 30000
                });
                console.log(author);
                response.send(`orders,oilbase,${JSON.parse(author).Data},${JSON.parse(author).NB_sec_lvl}`);
            });

        } else {
            res1C = String(res.status);
            return response.status(401).end(res1C);
        }
    }

});

// Получаем список заказов для канбана
app.get("/orderlist", function(request, response) {
    const lp = testMode ? settings.pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetOrdersList' + '?' + `${testMode}` + `&archieved=${request.query.archieved}`;
    console.log(url);
    getData(lp, url, response);

    // result.then(orderList => {
    //     console.log(orderList);
    //     response.end(orderList);
    // });

});

// Получаем список заказов для архива
app.get("/orderlistarchieved", function(request, response){
    const startDate = (date) => {
        return date ? `&StartDate=${date}` : '';
    }

    const lp = testMode ? pass : request.cookies.token;
    let url = '';
    if (request.query.StartDate && request.query.EndDate) {
        url = 'http://vpn.glados.ru/base/hs/siteapi/GetOrdersList' + '?' +
        `archieved=${request.query.archieved}` +
        `&StartDate=${request.query.StartDate}` +
        `&EndDate=${request.query.EndDate}`;
    } else if (request.query.StartDate) {
        url = 'http://vpn.glados.ru/base/hs/siteapi/GetOrdersList' + '?' +
        `archieved=${request.query.archieved}` +
        `&StartDate=${request.query.StartDate}`;
    } else if (request.query.EndDate) {
        url = 'http://vpn.glados.ru/base/hs/siteapi/GetOrdersList' + '?' +
        `archieved=${request.query.archieved}` +
        `&EndDate=${request.query.EndDate}`;
    }

    console.log(url);
    getData(lp, url, response);
});

// Получаем заказ для страницы заказ
app.get("/GetOrderDetails", function(request, response){
    // const lp = getPass(settings, request);
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetOrderDetails?OrderID=' + request.query.OrderID + '&' + `${testMode}`;
    getData(lp, url, response);

});

// Получаем список базисов
app.get("/getbasiseslist", function(request, response){
    // const lp = getPass(settings, request);
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetCatalog?Name=Basises';
    let result;

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;

        //   console.log(result);
          response.end(result);
      });

});

// Получаем список партнеров
app.get("/getpartnerslist", function(request, response){
    // const lp = getPass(settings, request);
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetCatalog?Name=Partners';
    let result;

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;

        //   console.log(result);
          response.end(result);
      });

});

// Получаем список баз
app.get("/getsupplybases", function(request, response){
    // const lp = getPass(settings, request);
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetCatalog?Name=Supply_bases';
    let result;

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;

          console.log(result);
          response.end(result);
      });

});

// Получаем список продуктов
app.get("/getproductslist", function(request, response){
    // const lp = getPass(settings, request);
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetCatalog?Name=Products';
    let result;

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;

        //   console.log(result);
          response.end(result);
      });

});

// Получаем список авторов
app.get("/getAuthorList", function(request, response){
    // const lp = getPass(settings, request);
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetCatalog?Name=Authors';
    let result;

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;

        //   console.log(result);
          response.end(result);
      });

});

// Получаем список номенклатуры
app.get("/getnomenclaturelist", function(request, response){
    // const lp = getPass(settings, request);
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetCatalog?Name=Nomenclature';
    let result;

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;

        //   console.log(result);
          response.end(result);
      });

});

// Получаем список юридических лиц
app.get("/GetCatalog", function(request, response){
    // const lp = getPass(settings, request);
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetCatalog?Name=Counteragents&ParentCode=' + request.query.ParentCode;
    let result;

    console.log(url);

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;
          response.end(result);
      });

});

// Получаем список юридических лиц
app.get("/GetCatalogAddress", function(request, response){
    // const lp = getPass(settings, request);
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetCatalog?Name=Addresses&ParentCode=' + request.query.ParentCode;
    let result;

    console.log(url);

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;

        //   console.log(result);
          response.end(result);
      });

});



// Создание/обновление заказа http://vpn.glados.ru/base/hs/siteapi/PostUpdateOrder
app.post('/postupdateorder', jsonParser, function (request, response) {
    // const lp = getPass(settings, request);
    const lp = testMode ? pass : request.cookies.token;
    const order = request.body;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/PostUpdateOrder' + '?' + `${testMode}`;
    let result;

    // console.log(order);

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${lp}`,
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(order)
    }).then(res => res.text())
      .then(commits => {
        // console.log(commits);
        response.end(commits);
    });


});

// новый адрес
app.post('/newaddress', jsonParser, function (request, response) {
    // const lp = getPass(settings, request);
    const lp = testMode ? pass : request.cookies.token;
    const adress = request.body;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/PostAddressInfo' + '?' + `${testMode}`;
    let result;

    console.log(adress);

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${lp}`,
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(adress)
    }).then(res => res.text())
      .then(commits => {
        // console.log(commits);
        response.end(commits);
    });


});

io.on('connection', (socket) => {
    console.log('Коннект');
    socket.on('save', () => {
        // console.log('message: ' + msg);
        io.emit('refreshKanban');
        // socket.broadcast.emit('hi');
        // socket.broadcast.emit('save', msg);
    });

    socket.on('delete', () => {
        io.emit('refreshArchive');
    });
});


// ================= API Учет нефтебаз ====================
// Запрос страницы
app.get("/oilbase", function(request, response){
    if (request.cookies.token) {
        response.cookie('token', request.cookies.token, {
            maxAge: time
        });
        response.sendFile(__dirname + "/frontend/public/оilbase.html");
    } else {
        response.redirect('/');
    }
});
// Запрос базисов
app.get("/getbasises", function(request, response) {
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetCatalog?Name=All_bases';
    let result;

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;
          response.end(result);
      });

});
// Получаем список партнеров для спецификации
app.get("/getpartnerslistspec", function(request, response){
    // const lp = getPass(settings, request);
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetCatalog?Name=Partners&supplier=true';
    let result;

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;

        //   console.log(result);
          response.end(result);
      });

});
// Запрос емкостей
app.get("/gettanklist", function(request, response) {
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetTankList';
    let result;

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;
          response.end(result);
      });

});
// Создание или обновление емкости
app.post('/postupdatetank', jsonParser, function (request, response) {
    const lp = testMode ? pass : request.cookies.token;
    const tank = request.body;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/PostUpdateTank' + '?' + `${testMode}`;
    let result;

    // console.log(order);

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${lp}`,
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(tank)
    }).then(res => res.text())
      .then(commits => {
        response.end(commits);
    });
});
// Запрос спиская распределенных частей заявок
app.get("/getdispatchlist", function(request, response) {
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetDispatchList';
    let result;

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;
          response.end(result);
      });
});
// Распределение или обновление распределенной части заявки
app.post('/postupdatedispatch', jsonParser, function (request, response) {
    const lp = testMode ? pass : request.cookies.token;
    const part = request.body;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/PostUpdateDispatch' + '?' + `${testMode}`;
    let result;

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${lp}`,
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(part)
    }).then(res => res.text())
      .then(commits => {
        response.end(commits);
    });
});
// Порядок сортировки распределенных заявок
app.post('/postdispatchsort', jsonParser, function (request, response) {

    const lp = testMode ? pass : request.cookies.token;
    const part = request.body;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/PostDispatchSort' + '?' + `${testMode}`;
    let result;

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${lp}`,
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(part)
    }).then(res => res.text())
      .then(commits => {
        console.log(commits);
        response.end(commits);
    });
});
// Запрос истории емкости
app.get("/gettankhistory", function(request, response) {
    const lp = testMode ? pass : request.cookies.token;
    const url = 'http://vpn.glados.ru/base/hs/siteapi/GetTankHistory?CodeTank=' + `${request.query.CodeTank}`;
    console.log(url);
    let result;

    fetch(url, {
        headers: {
            'Authorization': `Basic ${lp}`
        }
    }).then(response => response.text())
      .then(commits => {
          result = commits;
          response.end(result);
      });

});
// ================= API Учет нефтебаз ====================

httpServer.listen(port, host);
// app.listen(port, host);
