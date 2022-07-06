const http = require("http");
const fs = require("fs");
const requests = require("requests");
const homeFile = fs.readFileSync("getweather.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%pressure%}", orgVal.main.pressure);
    temperature = temperature.replace("{%humidity%}", orgVal.main.humidity);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?lat=33.738&lon=73.084&appid=ab1f25bcc5216e7c6ba1ea37ca26d093")
            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                //console.log(arrData[0].main.temp);
                //const realTimeData = arrData.map(val) //by val we are passing complete API
                //val.main-- -- -- -- -- - > here we will get all the properties of main in JSON
                //because of val we need not to do this ---->[index thing]
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join(""); //join because we were getting data in array form and we need to convert it to string to display it on client side 
                res.write(realTimeData);
                // console.log(realTimeData);
            })


        .on("end", (err) => {
            if (err) return console.log("connection closed due to error", err);
            //console.log("end");
            res.end();
        })
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening on port 8000")
});