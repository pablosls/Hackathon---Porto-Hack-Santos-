

const fs = require('fs');

var express = require('express');
var app = express();

const axios = require('axios');

app.use(express.static('public'))

app.get('/ImageClassification', function (req, res) {

    console.log("Classificando")
  
    var util = require('util');
    var exec = require('child_process').execSync;

    //var command = 'curl -sL -w "%{http_code} %{time_total}\\n" "http://query7.com" -o /dev/null'
    var command = 'curl --insecure  -i -F files=@imagem.jpeg https://177.67.49.218/powerai-vision-ingram/api/dlapis/2ce64c49-dfe2-4c3d-8bb3-9db90b601bf0 > result.txt'

    child = exec(command, function(error, stdout, stderr){

    if(error !== null)
    {
        console.log('exec error: ' + error);
    }

    });


    var text = fs.readFileSync('result.txt','utf8')
    var result;
    console.log(text)
    console.log(text.indexOf("fogo"));
    if (text.indexOf("fogo") > 0){
      console.log("Fogo Detectado no Porto")
      result = "Fogo Detectado no Porto"
    }
    else{
      result = "Operacao Normal"
      console.log("Operacao Normal")
    }

    res.send(result);

});



app.post('/uploadpic', function(req, result) {
   
      req.pipe(request.post({
        url: poweraiVisionWebApiUrl,
        agentOptions: {
          rejectUnauthorized: false,
        }}, function(err, resp, body) {
        if (err) {
          console.log(err);
        }
        console.log(body);
        result.send({data: body});
      }));
    
});
  
 
  app.get('/sendImageCamera', function(req, result) {

    console.log("enviando");
    var http = require('http'),                                                
    Stream = require('stream').Transform,                                  
    fs = require('fs');                                                    
                 

    http.request(req.query.imgUrl, function(response) {                                        
      var data = new Stream();                                                    

      response.on('data', function(chunk) {                                       
        data.push(chunk);                                                         
      });                                                                         

      response.on('end', function() {                                             
        fs.writeFileSync('imagem.jpeg', data.read());                               
      });                                                                         
    }).end();

    result.send("Image Captured!")
  }
);




app.post('/sendAlert', function(req, res) {
   
  axios.post('https://vport.herokuapp.com/api/vport/v1/evento', 

    {
      classificacaoEvento: 1,
      data: "2019-12-08 08:00:00",
      grauPericulosidadeEvento: 1,
      funcionarioUuid: "54544554"
    }
  )
  .then(function(response){
    console.log('Alerta Gerado com sucesso')
  }); 
  
  res.send("Alerta Enviado com sucesso")
});

app.get('/sendAlert', function(req, res) {
   
  axios.post('https://vport.herokuapp.com/api/vport/v1/evento', 

    {
      classificacaoEvento: 1,
      data: "2019-12-08 08:00:00",
      grauPericulosidadeEvento: 1,
      funcionarioUuid: "54544554", 
      localizacao: "Terminal 1"

    }
  )
  .then(function(response){
    console.log('Alerta Gerado com sucesso')
  }); 
  
  res.send("Alerta Enviado com sucesso")
});




app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});



