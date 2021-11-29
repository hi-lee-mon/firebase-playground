const http = require("http");

/* httpを使ってサーバーを作成 */

const server = http.createServer((request, response) => {
  console.log(request.url);
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
  });
  // リクエストが/ならif内を返す
  if (request.url === "/") {
    response.end("Hello World");
  } else if (request.url === "/user") {
    response.end(JSON.stringify({ name: "Steve Nobs", age: 30 }));
  } else {
    response.statusCode = 404;
    response.end("Not Found");
  }
});

/* 作ったサーバーを8000番ポートで起動 */
server.listen(8000, () => {
  console.log("http://localhost:8000 で起動");
});
