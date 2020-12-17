const http=require("http");
const fs=require("fs");
var requests = require("requests");

const homeFile=fs.readFileSync("home.html","utf-8")
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  
    return temperature;
  };
  
const server=http.createServer((req,res)=>{
    if (req.url == "/") {
        requests(
          `http://api.openweathermap.org/data/2.5/weather?q=Chandigarh&units=metric&appid=045db600e7c7e285f33ef71afaf1ad64`
        )
          .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);//covert to object
            const arrData = [objdata];//convert to array
            //console.log(arrData[0].main.temp);
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");      //data is in array to convert into string we use join
          res.write(realTimeData);

          })

            .on("end", (err) => {
                if (err) return console.log("connection closed due to errors", err);
            res.end();
              });
            }
});
server.listen(8000,"127.0.0.1");