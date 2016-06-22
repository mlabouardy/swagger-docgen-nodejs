var express = require('express'),
    app = express();

require('./swagger').static(global);

var products = [];

ApiInfo(title='API Products', description='Rest Service to manage products', version='1.0',
        host='localhost', basePath='/api');

ApiOperation(value='/products', method=HttpMethod.GET, description='get list of products',
  consumes=MediaType.APPLICATION_JSON, produces=MediaType.APPLICATION_JSON,
  parameters=null,
  responses=ApiResponses(ApiResponse(code=HttpStatus.OK, description='List of products')));
app.get('/products', function(req,res){
  res.status(200).send(products);
});

ApiOperation(value='/products/{id}', method=HttpMethod.GET, description='get a product with id',
  consumes=MediaType.APPLICATION_JSON, produces=MediaType.APPLICATION_JSON,
  parameters=ApiParameters(ApiParameter(name='id', paramtype=ParamType.PATH,
                                        description='id of product', required=true, type='integer')),
  responses=ApiResponses(ApiResponse(code=HttpStatus.OK, description='A product')));
app.get('/products/:id', function(req,res){
  res.status(200).send(products[req.param.id]);
});

ApiOperation(value='/products', method=HttpMethod.POST, description='create a product',
  consumes=MediaType.APPLICATION_JSON, produces=MediaType.APPLICATION_JSON,
  parameters=ApiParameters(ApiParameter(name='id', paramtype=ParamType.BODY,
                                        description='id of product', required=true, type='integer')),
  responses=ApiResponses(ApiResponse(code=HttpStatus.OK, description='Product has been created')));
app.post('/products', function(req,res){
  products.push(req.body);
  res.status(201).send();
});

ApiOperation(value='/products/{id}', method=HttpMethod.PUT, description='update a product',
  consumes=MediaType.APPLICATION_JSON, produces=MediaType.APPLICATION_JSON,
  parameters=ApiParameters(ApiParameter(name='id', paramtype=ParamType.PATH,
                                        description='id of product', required=true, type='integer')),
  responses=ApiResponses(ApiResponse(code=HttpStatus.OK, description='Updated product')));
app.put('/products/:id', function(req,res){
  products[req.param.id] = req.body;
  res.status(200).send(req.body);
});

ApiOperation(value='/products/{id}', method=HttpMethod.DELETE, description='delete a product',
  consumes=MediaType.APPLICATION_JSON, produces=MediaType.APPLICATION_JSON,
  parameters=ApiParameters(ApiParameter(name='id', paramtype=ParamType.PATH,
                                        description='id of product', required=true, type='integer')),
  responses=ApiResponses(ApiResponse(code=HttpStatus.OK, description='Deleted product')));
app.delete('/products/:id', function(req,res){
  var product = products[req.param.id];
  products.splice(req.param.id, 1);
  res.status(200).send(product);
});


ApiGenerate(Format.JSON);
ApiGenerate(Format.YAML);

app.listen(3000, function(){
  console.log('Server running ...');
});
