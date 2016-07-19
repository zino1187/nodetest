/*
http 내장모듈로만은 완전한 웹서버를 구축하기엔 너무나 부족하다
따라서 express 모듈을 사용해보자!!!
express 모듈이란? 웹서버 구축에 필요한 기능들을 위해 http 모듈에 
추가시켜놓은 외부모듈.. (http의 업그레이드 모듈  but  2모듈은 같이 사용한다..)
*/
var http=require("http");
var express=require("express");
var fs=require("fs");
var mysql=require("mysql");
var ejs=require("ejs");
var bodyParser=require("body-parser");

var app=express();

var client=mysql.createConnection({
	url:"localhost", 
	user:"root", 
	password:""
});

client.query("use iot");



app.route("/list").get(function(request, response){
	response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});

	var page=fs.readFileSync("./list.html", "utf8");
	//조회
	client.query("select * from student", function(error, results){
		response.end(ejs.render(page,{ data:results}));	
	});
	
});


app.route("/regist_form").get(function(request, response){
	var data=fs.readFileSync("./regist_form.html", "utf8");
	response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
	response.end(data);
});


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.route("/regist").post(function(request, response){

	var params=request.body;
	

	client.query("insert into student(id,pwd,name) values(?,?,?)",[params.id,"1234","브루스"], 
			function(error, results, fields){
				if(!error){
					console.log("데이터 등록 성공");
					response.redirect("/list");
				}
			});
});

//상세보기 
app.route("/detail/:id").get(function(request, response){
	response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
	
	console.log(request.params.id);

	client.query("select * from student where id=?",["batman"], function(error, results,fields){
		var page=fs.readFileSync("./detail.html", "utf8");
		response.end(ejs.render(page,{data:results}));	
	});
});


//서버 구동시작!!
var server=http.createServer(app);
server.listen(8383, function(){
	console.log("Server is runing at 8383...");
});