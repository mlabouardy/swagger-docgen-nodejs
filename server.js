var express = require('express'),
    app = express();


require('./swagger').static(global);

ApiInfo(title='API Hub', description='Rest API for Hub', version='1.0',
        host='192.168.1.50', basePath='/v1');

ApiOperation(value='/hello', method=HttpMethod.GET, description='say hello',
  consumes=MediaType.TEXT_PLAIN, produces=MediaType.TEXT_PLAIN,
  ApiParameters(ApiParameter(name='id', paramtype='path', description='id of person',
                             required=false, type='integer')),
  ApiResponses(ApiResponse(code=HttpStatus.OK, description='Success')));
app.get('/hello', function(req,res){
  res.send('hello');
});

ApiGenerate();

app.listen(3000, function(){
  console.log('Server running ...');
});
