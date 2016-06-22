var YAML = require('yamljs'),
    FS = require('fs');

var HttpMethod = {
  GET : {value:'get'},
  POST : {value:'post'},
  PUT : {value: 'put'},
  DELETE : {value: 'delete'}
};

var ParamType = {
  BODY : {value: 'body'},
  PATH : {value: 'path'},
  QUERY : {value: 'query'}
};

var MediaType = {
  APPLICATION_JSON : {value:'application/json'},
  APPLICATION_ATOM_XML : {value : 'application/atom+xml'},
  APPLICATION_FORM_URLENCODED : {value : 'application/x-www-form-urlencoded'},
  APPLICATION_JSON_UTF8 : {value : 'application/json;charset=UTF-8'},
  APPLICATION_OCTET_STREAM : {value : 'application/octet-stream'},
  APPLICATION_XHTML_XML: {value : 'application/xhtml+xml'},
  APPLICATION_XML : {value : 'application/xml'},
  IMAGE_GIF : {value : 'image/gif'},
  IMAGE_JPEG : {value : 'image/jpeg'},
  IMAGE_PNG : {value : 'image/png'},
  MULTIPART_FORM_DATA : {value : 'multipart/form-data'},
  TEXT_HTML : {value : 'text/html'},
  TEXT_PLAIN : {value : 'text/plain'},
  TEXT_XML : {value: 'text/xml'}
};

var HttpStatus = {
  CONTINUE : {value :100},
  SWITCHING_PROTOCOLS : {value :101},
  PROCESSING : {value :102},
  CHECKPOINT : {value :103},
  OK : {value :200},
  CREATED : {value :201},
  ACCEPTED : {value :202},
  NON_AUTHORITATIVE_INFORMATION : {value :203},
  NO_CONTENT : {value :204},
  RESET_CONTENT : {value :205},
  PARTIAL_CONTENT : {value :206},
  MULTI_STATUS : {value :207},
  ALREADY_REPORTED : {value :208},
  IM_USED : {value :226},
  MULTIPLE_CHOICES : {value :300},
  MOVED_PERMANENTLY : {value :301},
  FOUND : {value :302},
  MOVED_TEMPORARILY : {value :302},
  SEE_OTHER : {value :303},
  NOT_MODIFIED : {value :304},
  USE_PROXY : {value :305},
  TEMPORARY_REDIRECT : {value :307},
  PERMANENT_REDIRECT : {value :308},
  BAD_REQUEST : {value :400},
  UNAUTHORIZED : {value :401},
  PAYMENT_REQUIRED : {value :402},
  FORBIDDEN : {value :403},
  NOT_FOUND : {value :404},
  METHOD_NOT_ALLOWED : {value :405},
  NOT_ACCEPTABLE : {value :406},
  PROXY_AUTHENTICATION_REQUIRED : {value :407},
  REQUEST_TIMEOUT : {value :408},
  CONFLICT : {value :409},
  GONE : {value :410},
  LENGTH_REQUIRED : {value :411},
  PRECONDITION_FAILED : {value :412},
  PAYLOAD_TOO_LARGE : {value :413},
  REQUEST_ENTITY_TOO_LARGE : {value :413},
  URI_TOO_LONG : {value :414},
  REQUEST_URI_TOO_LONG : {value :414},
  UNSUPPORTED_MEDIA_TYPE : {value :415},
  REQUESTED_RANGE_NOT_SATISFIABLE : {value :416},
  EXPECTATION_FAILED : {value :417},
  I_AM_A_TEAPOT : {value :418},
  INSUFFICIENT_SPACE_ON_RESOURCE : {value :419},
  METHOD_FAILURE : {value :420},
  DESTINATION_LOCKED : {value :421},
  UNPROCESSABLE_ENTITY : {value :422},
  LOCKED : {value :423},
  FAILED_DEPENDENCY : {value :424},
  UPGRADE_REQUIRED : {value :426},
  PRECONDITION_REQUIRED : {value :428},
  TOO_MANY_REQUESTS : {value :429},
  REQUEST_HEADER_FIELDS_TOO_LARGE : {value :431},
  INTERNAL_SERVER_ERROR : {value :500},
  NOT_IMPLEMENTED : {value :501},
  BAD_GATEWAY : {value :502},
  SERVICE_UNAVAILABLE : {value :503},
  GATEWAY_TIMEOUT : {value :504},
  HTTP_VERSION_NOT_SUPPORTED : {value :505},
  VARIANT_ALSO_NEGOTIATES : {value :506},
  INSUFFICIENT_STORAGE : {value :507},
  LOOP_DETECTED : {value :508},
  BANDWIDTH_LIMIT_EXCEEDED : {value :509},
  NOT_EXTENDED : {value :510},
  NETWORK_AUTHENTICATION_REQUIRED : {value :511}
};

var Format = {
  JSON : {value : 'json'},
  YAML : {value : 'yaml'}
};

var data = {};

function ApiInfo(title, description, version, host, basePath){
  data.swagger = '2.0';
  data.info = {
    title : title,
    description : description,
    version : version
  };
  data.host = host;
  data.basePath = basePath;
};


function ApiParameter(name, paramtype, description, required, type){
    return {
      name : name,
      in : paramtype.value,
      description : description,
      required: required,
      type: type
    };
};

function ApiResponse(code, description){
  return {
    code : code,
    description : description
  };
}

function ApiOperation(value, method, description, produces, consumes, parameters, responses){
  var route = {};
  route[value]=method.value;
  var tmp = {};
  tmp[method.value] = {};
  if(description){
    tmp[method.value].description = description;
  }
  if(produces){
    tmp[method.value].produces = [produces.value];
  }
  if(consumes){
    tmp[method.value].consumes = [consumes.value];
  }
  if(parameters){
    tmp[method.value].parameters = parameters;
  }
  if(responses){
    tmp[method.value].responses = responses;
  }
  route[value] = tmp;
  if(!data.paths){
    data.paths = {};
  }
  if(data.paths[value])
    data.paths[value][method.value] = tmp[method.value];
  else
    data.paths[value] = tmp;
}

function ApiResponses(){
  var responses = {};
  for(var i=0;i<arguments.length;i++){
    responses[arguments[i].code.value] = {
      description : arguments[i].description
    };
  }
  return responses;
};

function ApiParameters(){
  var parameters = [];
  for(var i=0;i<arguments.length;i++){
    if(arguments[i].in == ParamType.BODY.value){
      data.definitions = {};
      data.definitions['Test'] = {
        required: ['id'],
        properties: {
          id:{
            description : 'id of patient',
            type : 'string'
          }
        }
      };
      parameters.push({
        name: 'Test',
        in: 'body',
        schema : {
          '$ref': '#/definitions/Test'
        }
      });
    }else{
      parameters.push(arguments[i]);
    }
  }
  return parameters;
};

function ApiGenerate(format){
  if(format == Format.JSON){
    FS.writeFile('api.json', JSON.stringify(data, null, 4), function(err) {
      console.log('File saved');
    });
  }else{
    FS.writeFile('api.yaml', YAML.stringify(data, 4), function(err) {
      console.log('File saved');
    });
  }
};

exports.static = function(scope){
  scope.ApiGenerate = ApiGenerate
  scope.ApiInfo = ApiInfo,
  scope.ApiParameter = ApiParameter,
  scope.ApiOperation = ApiOperation,
  scope.ApiParameters = ApiParameters,
  scope.ApiResponses = ApiResponses,
  scope.ApiResponse = ApiResponse,
  scope.HttpMethod = HttpMethod,
  scope.HttpStatus = HttpStatus,
  scope.MediaType = MediaType,
  scope.ParamType = ParamType
  scope.Format = Format
};
