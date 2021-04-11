// What I have to do:
// Make the actual limiter, include in the "checkkey function"  // done passed tests
// Also make an endpoint that lets people see their api key's stats //done, passed tests
// Update the docs
// maybe deploy to github/heroku if everything passes the tests and stuff 
// Stap using // and start using /* */
var tf = require("@tensorflow/tfjs-node");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var cors = require("cors");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const fileUpload = require("express-fileupload");
const fs = require("fs");
const fs_1 = require('fs')
const request = require('request');
const rateLimit = require("express-rate-limit");
const { createHmac } = require("crypto")
const {MongoClient} = require('mongodb')
const uri = "mongodb+srv://pogchamp:helloworld@cluster0.4rlu4.mongodb.net";
const mongoclient = new MongoClient(uri, {poolSize: 10, bufferMaxEntries: 0, useNewUrlParser: true,useUnifiedTopology: true});
mongoclient.connect(async function(err, mongoclient){

app.use(bodyParser.json({ extended: true }));
app.use(fileUpload());
app.use(cors());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//const hostname = "0.0.0.0";
const hostname = "localhost";
//const port = 80;
const port = process.env.PORT || 3000;

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const limiter = rateLimit({
  windowMs: 10000, // 1 second
  max: 2, // limit each IP to 10 requests per windowMs
  message: "Spam's not cool",
      handler: function(req, res /*, next*/) {
        res.status(429).send({status: "failed", type: "Too many requests per second! (Max is 2 request per second), or 30 requests per minute. (Whichever comes first)"})
      },
});
app.use(limiter);
const checkkey = async (req, res, next) => {
    if (!req.headers) return res.status(401).send({status: "failed", type: "No authorization headers present! To get one, go to https://www.openskin.ml/"})
if (!req.headers.authorization) return res.status(401).send({status: "failed", type: "No authorization headers present! To get one, go to https://www.openskin.ml/"})
let key = req.headers.authorization.slice(8);
let prefix = req.headers.authorization.slice(0, 8)
// kek hash this now
const hmac = createHmac('sha512', key);
  hmac.update(JSON.stringify(prefix));
  const signature = hmac.digest('hex');
  let allhashes = await checkStuff(mongoclient, "list");
  if (!allhashes[signature]){
    return res.status(401).send({status: "failed", type: "Invalid API key! To get a new one, go to https://www.openskin.ml/"})
  }else{
      let userid = allhashes[signature];
      await mongoclient.db("openskin").collection("userData")
              .updateOne({ name: userid}, {$inc: {uses: 1}});
      let user = await mongoclient.db("openskin").collection("userData")
              .findOne({ name: userid});
      if (user.uses > 1800){
        var d = new Date();
        var m = d.getMinutes();
        m = 70-m;
          return res.status(smth).send({"status":"failed", "type":"You have exceeded the maximum number of requests per hour (1800). Please wait for another "+m+"minutes before requesting again. If you need more requests, go to our website and fill out the form."})
      }else 
      return next();
  }
}
var download = function(uri, filename, res1, req1, callback){
  var status;
    request.head(uri, function(err, res, body){
      if (!res){
        res1.status(400).send({status: "failed", type: "Couldn't find that image on the web! Make sure it's not private"})
        status = "Couldn't find that image on the web! Make sure it's not private"
        return "Couldn't find that image on the web! Make sure it's not private";
      }
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
      if (Number(res.headers['content-length']) > 5000000){
        //good number is 5000000
        res1.status(400).send({status: "failed", type: "File too large! Max is 5mb"})
        status = "File too large. Max is 5mb"
        return "File too large. Max is 5mb"
      }
      if (!res.headers['content-type'].toLowerCase().includes("image")){
        res1.status(400).send({status: "failed", type: "File type is not supported"})
        status = "file type is not supported"
        return "file type is not supported"
      }
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
    return status;
  }; 
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
  }

app.get("/", function (req, res) {
  res.status(200).send("do you really want to be here? If not, here are some helpful places to be. Our website: https://www.openskin.ml or our docs: https://docs.openskin.ml");
});

app.post("/url", checkkey, urlencodedParser, async function (req, res) {
  let sampleFile;
  let uploadPath;
  let imageName = makeid(10);
  if (!req.body){
    return res.status(400).send({status: "ok", type: "no-body-found-in-your-request"});
  }
  if (!req.body.url){
    return res.status(400).send({status: "failed", type: "no-url-posted"});
  }
  var isImageUrl = require("is-image-url")
  let kek = await isImageUrl(req.body.url)
  if (kek === false){
    return res.status(400).send({status: "failed", type: "Could not find image! Make sure it's not private"})
  }

   download(req.body.url, './images/'+imageName+".png", res, req, function(){
  fs.access(__dirname + "/images/" + imageName + ".png", async function(error) {
  if (error) {
    return res.status(400).send({status: "failed", type: "File-type-is-not-supported-or-too-large"});
  } else {
    //do stuff here.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ImageModel = /** @class */ (function () {
    function ImageModel(signaturePath) {
        var _a;
        this.outputKey = "Confidences";
        var signatureData = fs_1.readFileSync(signaturePath, "utf8");
        this.signature = JSON.parse(signatureData);
        this.modelPath = "file://../" + this.signature.filename;
        _a = this.signature.inputs.Image.shape.slice(1, 3), this.width = _a[0], this.height = _a[1];
        this.outputName = this.signature.outputs[this.outputKey].name;
        this.classes = this.signature.classes.Label;
    }
    ImageModel.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, tf.loadGraphModel(this.modelPath)];
                    case 1:
                        _a.model = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ImageModel.prototype.dispose = function () {
        if (this.model) {
            this.model.dispose();
        }
    };
    ImageModel.prototype.predict = function (image) {
        var _a, _b;
        /*
        Given an input image decoded by tensorflow as a tensor,
        preprocess the image into pixel values of [0,1], center crop to a square
        and resize to the image input size, then run the prediction!
         */
        if (!!this.model) {
            var _c = image.shape.slice(0, 2), imgHeight = _c[0], imgWidth = _c[1];
            // convert image to 0-1
            var normalizedImage = tf.div(image, tf.scalar(255));
            // make into a batch of 1 so it is shaped [1, height, width, 3]
            var reshapedImage = normalizedImage.reshape(__spreadArrays([1], normalizedImage.shape));
            // center crop and resize
            var top = 0;
            var left = 0;
            var bottom = 1;
            var right = 1;
            if (imgHeight != imgWidth) {
                // the crops are normalized 0-1 percentage of the image dimension
                var size = Math.min(imgHeight, imgWidth);
                left = (imgWidth - size) / 2 / imgWidth;
                top = (imgHeight - size) / 2 / imgHeight;
                right = (imgWidth + size) / 2 / imgWidth;
                bottom = (imgHeight + size) / 2 / imgHeight;
            }
            var croppedImage = tf.image.cropAndResize(reshapedImage, [[top, left, bottom, right]], [0], [this.height, this.width]);
            var results = this.model.execute((_a = {}, _a[this.signature.inputs.Image.name] = croppedImage, _a), this.outputName);
            var resultsArray_1 = results.dataSync();
            return _b = {},
                _b[this.outputKey] = this.classes.reduce(function (acc, class_, idx) {
                    var _a;
                    return __assign((_a = {}, _a[class_] = resultsArray_1[idx], _a), acc);
                }, {}),
                _b;
        }
        else {
            console.error("Model not loaded, please await this.load() first.");
        }
    };
    return ImageModel;
}());
function main(imgPath) {
    return __awaiter(this, void 0, void 0, function () {
        var image, decodedImage, model, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile(imgPath)];
                case 1:
                    image = _a.sent();
                    decodedImage = tf.node.decodeImage(image, 3);
                    model = new ImageModel('../signature.json');
                    return [4 /*yield*/, model.load()];
                case 2:
                    _a.sent();
                    results = model.predict(decodedImage);
                    console.log(results.Confidences);
                    //let arrResult = Object.values(results);
                    const getMax = object => {
                      return Object.keys(object).filter(x => {
                      return object[x] == Math.max.apply(null, 
                      Object.values(object));
                      });
                    };
                    console.log(getMax(results.Confidences))
                   let largest = getMax(results.Confidences)
                   if (largest[0].toLowerCase().includes("actinic")){
                     res.status(200).send({status: "ok", type: "actinic-keratosis", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("acne")){
                      res.status(200).send({status: "ok", type: "acne", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("basal")){
                      res.status(200).send({status: "ok", type: "basal-cell-cancer", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("blister")){
                      res.status(200).send({status: "ok", type: "blister", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("cellulitis")){
                      res.status(200).send({status: "ok", type: "cellulitis", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("chicken")){
                      res.status(200).send({status: "ok", type: "chickenpox", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("cold")){
                      res.status(200).send({status: "ok", type: "cold-sore", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("keratosis")){
                      res.status(200).send({status: "ok", type: "keratosis-pilaris", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("lupus")){
                      res.status(200).send({status: "ok", type: "lupus", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("measle")){
                      res.status(200).send({status: "ok", type: "measles", confidence: lresults.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("ringworm")){
                      res.status(200).send({status: "ok", type: "ringworm", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("melanoma")){
                      res.status(200).send({status: "ok", type: "melanoma", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("melesma")){
                     res.status(200).send({status: "ok", type: "melasma", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("psoriasis")){
                     res.status(200).send({status: "ok", type: "psoriasis", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("rosacea")){
                      res.status(200).send({status: "ok", type: "rosacea", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("vitiligo")){
                     res.status(200).send({status: "ok", type: "vitiligo", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("normal")){
                      res.status(200).send({status: "ok", type: "no-conditions", confidence: results.Confidences[largest[0]]});
                   }else{
                      res.status(200).send({status: "ok", type: "no-conditions", confidence: results.Confidences[largest[0]]});
                   }
                    // cleanup
                    model.dispose();
                    return [2 /*return*/];
            }
        });
    });
}
//defining functions to run stuff
main(__dirname + "/images/" + imageName + ".png")
    await sleep(5000)

   fs.unlinkSync(__dirname + "/images/" + imageName + ".png");
  }
})
});






});
app.post("/v1/raw", checkkey, urlencodedParser, async function (req, res) {
    let sampleFile;
    let uploadPath;
    let imageName = makeid(10);
    if (!req.body){
      return res.status(400).send({status: "ok", type: "no-body-found-in-your-request"});
    }
    if (!req.body.url){
      return res.status(400).send({status: "failed", type: "no-url-posted"});
    }
    var isImageUrl = require("is-image-url")
    let kek = await isImageUrl(req.body.url)
    if (kek === false){
      return res.status(400).send({status: "failed", type: "Could not find image! Make sure it's not private"})
    }
  
     download(req.body.url, './images/'+imageName+".png", res, req, function(){
    console.log('done');
    fs.access(__dirname + "/images/" + imageName + ".png", async function(error) {
    if (error) {
      return res.status(400).send({status: "failed", type: "File-type-is-not-supported-or-too-large"});
    } else {
      //do stuff here.
  var __assign = (this && this.__assign) || function () {
      __assign = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                  t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };
  var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator = (this && this.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var __spreadArrays = (this && this.__spreadArrays) || function () {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var ImageModel = /** @class */ (function () {
      function ImageModel(signaturePath) {
          var _a;
          this.outputKey = "Confidences";
          var signatureData = fs_1.readFileSync(signaturePath, "utf8");
          this.signature = JSON.parse(signatureData);
          this.modelPath = "file://../" + this.signature.filename;
          _a = this.signature.inputs.Image.shape.slice(1, 3), this.width = _a[0], this.height = _a[1];
          this.outputName = this.signature.outputs[this.outputKey].name;
          this.classes = this.signature.classes.Label;
      }
      ImageModel.prototype.load = function () {
          return __awaiter(this, void 0, void 0, function () {
              var _a;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _a = this;
                          return [4 /*yield*/, tf.loadGraphModel(this.modelPath)];
                      case 1:
                          _a.model = _b.sent();
                          return [2 /*return*/];
                  }
              });
          });
      };
      ImageModel.prototype.dispose = function () {
          if (this.model) {
              this.model.dispose();
          }
      };
      ImageModel.prototype.predict = function (image) {
          var _a, _b;
          /*
          Given an input image decoded by tensorflow as a tensor,
          preprocess the image into pixel values of [0,1], center crop to a square
          and resize to the image input size, then run the prediction!
           */
          if (!!this.model) {
              var _c = image.shape.slice(0, 2), imgHeight = _c[0], imgWidth = _c[1];
              // convert image to 0-1
              var normalizedImage = tf.div(image, tf.scalar(255));
              // make into a batch of 1 so it is shaped [1, height, width, 3]
              var reshapedImage = normalizedImage.reshape(__spreadArrays([1], normalizedImage.shape));
              // center crop and resize
              var top = 0;
              var left = 0;
              var bottom = 1;
              var right = 1;
              if (imgHeight != imgWidth) {
                  // the crops are normalized 0-1 percentage of the image dimension
                  var size = Math.min(imgHeight, imgWidth);
                  left = (imgWidth - size) / 2 / imgWidth;
                  top = (imgHeight - size) / 2 / imgHeight;
                  right = (imgWidth + size) / 2 / imgWidth;
                  bottom = (imgHeight + size) / 2 / imgHeight;
              }
              var croppedImage = tf.image.cropAndResize(reshapedImage, [[top, left, bottom, right]], [0], [this.height, this.width]);
              var results = this.model.execute((_a = {}, _a[this.signature.inputs.Image.name] = croppedImage, _a), this.outputName);
              var resultsArray_1 = results.dataSync();
              return _b = {},
                  _b[this.outputKey] = this.classes.reduce(function (acc, class_, idx) {
                      var _a;
                      return __assign((_a = {}, _a[class_] = resultsArray_1[idx], _a), acc);
                  }, {}),
                  _b;
          }
          else {
              console.error("Model not loaded, please await this.load() first.");
          }
      };
      return ImageModel;
  }());
  function main(imgPath) {
      return __awaiter(this, void 0, void 0, function () {
          var image, decodedImage, model, results;
          return __generator(this, function (_a) {
              switch (_a.label) {
                  case 0: return [4 /*yield*/, fs_1.promises.readFile(imgPath)];
                  case 1:
                      image = _a.sent();
                      decodedImage = tf.node.decodeImage(image, 3);
                      model = new ImageModel('../signature.json');
                      return [4 /*yield*/, model.load()];
                  case 2:
                      _a.sent();
                      results = model.predict(decodedImage);
                      console.log(results.Confidences);
                      //let arrResult = Object.values(results);
                      const getMax = object => {
                        return Object.keys(object).filter(x => {
                        return object[x] == Math.max.apply(null, 
                        Object.values(object));
                        });
                      };
                      console.log(getMax(results.Confidences))
                      res.status(200).send({status: "ok", raw: results.Confidences});

                      // cleanup
                      model.dispose();
                      return [2 /*return*/];
              }
          });
      });
  }
  //defining functions to run stuff
  main(__dirname + "/images/" + imageName + ".png")
      await sleep(5000)
  
     fs.unlinkSync(__dirname + "/images/" + imageName + ".png");
    }
  })
  });
  
  
  
  
  
  
  });

app.post("/v1/file/raw", checkkey, function (req, res) {
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({status: "failed", type: "No file found in your request."});
    }
  if (!req.files.images) return res.status(400).send({status: "failed", type: "Image must be in the 'images' key"});
    sampleFile = req.files.images;
    console.log(req.files)
    uploadPath = __dirname + "/images/" + sampleFile.name;
    if (!sampleFile.name.includes(".png")&&!sampleFile.name.includes(".jpg")&&!sampleFile.name.includes(".jpeg")) return res.status(400).send({status: "failed", type: "File type is not supported"})
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
    fs.access(__dirname + "/images/" + sampleFile.name, async function(error) {
        if (error) {
          return res.status(400).send({status: "failed", type: "File-type-is-not-supported-or-too-large"});
        } else {
          //do stuff here.
      var __assign = (this && this.__assign) || function () {
          __assign = Object.assign || function(t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                  s = arguments[i];
                  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                      t[p] = s[p];
              }
              return t;
          };
          return __assign.apply(this, arguments);
      };
      var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
          function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
          return new (P || (P = Promise))(function (resolve, reject) {
              function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
              function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
              function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
              step((generator = generator.apply(thisArg, _arguments || [])).next());
          });
      };
      var __generator = (this && this.__generator) || function (thisArg, body) {
          var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
          return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
          function verb(n) { return function (v) { return step([n, v]); }; }
          function step(op) {
              if (f) throw new TypeError("Generator is already executing.");
              while (_) try {
                  if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                  if (y = 0, t) op = [op[0] & 2, t.value];
                  switch (op[0]) {
                      case 0: case 1: t = op; break;
                      case 4: _.label++; return { value: op[1], done: false };
                      case 5: _.label++; y = op[1]; op = [0]; continue;
                      case 7: op = _.ops.pop(); _.trys.pop(); continue;
                      default:
                          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                          if (t[2]) _.ops.pop();
                          _.trys.pop(); continue;
                  }
                  op = body.call(thisArg, _);
              } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
              if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
          }
      };
      var __spreadArrays = (this && this.__spreadArrays) || function () {
          for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
          for (var r = Array(s), k = 0, i = 0; i < il; i++)
              for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                  r[k] = a[j];
          return r;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var ImageModel = /** @class */ (function () {
          function ImageModel(signaturePath) {
              var _a;
              this.outputKey = "Confidences";
              var signatureData = fs_1.readFileSync(signaturePath, "utf8");
              this.signature = JSON.parse(signatureData);
              this.modelPath = "file://../" + this.signature.filename;
              _a = this.signature.inputs.Image.shape.slice(1, 3), this.width = _a[0], this.height = _a[1];
              this.outputName = this.signature.outputs[this.outputKey].name;
              this.classes = this.signature.classes.Label;
          }
          ImageModel.prototype.load = function () {
              return __awaiter(this, void 0, void 0, function () {
                  var _a;
                  return __generator(this, function (_b) {
                      switch (_b.label) {
                          case 0:
                              _a = this;
                              return [4 /*yield*/, tf.loadGraphModel(this.modelPath)];
                          case 1:
                              _a.model = _b.sent();
                              return [2 /*return*/];
                      }
                  });
              });
          };
          ImageModel.prototype.dispose = function () {
              if (this.model) {
                  this.model.dispose();
              }
          };
          ImageModel.prototype.predict = function (image) {
              var _a, _b;
              /*
              Given an input image decoded by tensorflow as a tensor,
              preprocess the image into pixel values of [0,1], center crop to a square
              and resize to the image input size, then run the prediction!
               */
              if (!!this.model) {
                  var _c = image.shape.slice(0, 2), imgHeight = _c[0], imgWidth = _c[1];
                  // convert image to 0-1
                  var normalizedImage = tf.div(image, tf.scalar(255));
                  // make into a batch of 1 so it is shaped [1, height, width, 3]
                  var reshapedImage = normalizedImage.reshape(__spreadArrays([1], normalizedImage.shape));
                  // center crop and resize
                  var top = 0;
                  var left = 0;
                  var bottom = 1;
                  var right = 1;
                  if (imgHeight != imgWidth) {
                      // the crops are normalized 0-1 percentage of the image dimension
                      var size = Math.min(imgHeight, imgWidth);
                      left = (imgWidth - size) / 2 / imgWidth;
                      top = (imgHeight - size) / 2 / imgHeight;
                      right = (imgWidth + size) / 2 / imgWidth;
                      bottom = (imgHeight + size) / 2 / imgHeight;
                  }
                  var croppedImage = tf.image.cropAndResize(reshapedImage, [[top, left, bottom, right]], [0], [this.height, this.width]);
                  var results = this.model.execute((_a = {}, _a[this.signature.inputs.Image.name] = croppedImage, _a), this.outputName);
                  var resultsArray_1 = results.dataSync();
                  return _b = {},
                      _b[this.outputKey] = this.classes.reduce(function (acc, class_, idx) {
                          var _a;
                          return __assign((_a = {}, _a[class_] = resultsArray_1[idx], _a), acc);
                      }, {}),
                      _b;
              }
              else {
                  console.error("Model not loaded, please await this.load() first.");
              }
          };
          return ImageModel;
      }());
      function main(imgPath) {
          return __awaiter(this, void 0, void 0, function () {
              var image, decodedImage, model, results;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0: return [4 /*yield*/, fs_1.promises.readFile(imgPath)];
                      case 1:
                          image = _a.sent();
                          decodedImage = tf.node.decodeImage(image, 3);
                          model = new ImageModel('../signature.json');
                          return [4 /*yield*/, model.load()];
                      case 2:
                          _a.sent();
                          results = model.predict(decodedImage);
                          console.log(results.Confidences);
                          //let arrResult = Object.values(results);
                          const getMax = object => {
                            return Object.keys(object).filter(x => {
                            return object[x] == Math.max.apply(null, 
                            Object.values(object));
                            });
                          };
                          console.log(getMax(results.Confidences))
                          res.status(200).send({status: "ok", raw: results.Confidences});
    
                          // cleanup
                          model.dispose();
                          return [2 /*return*/];
                  }
              });
          });
      }
      //defining functions to run stuff
      main(__dirname + "/images/" + sampleFile.name)
          await sleep(5000)
      
         fs.unlinkSync(__dirname + "/images/" + sampleFile.name);
        }
      })
    });
  });
app.post("/v1/file/basic", checkkey, function (req, res) {
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({status: "failed", type: "No file found in your request."});
    }
  if (!req.files.images) return res.status(400).send({status: "failed", type: "Image must be in the 'images' key"});
    sampleFile = req.files.images;
    console.log(req.files)
    uploadPath = __dirname + "/images/" + sampleFile.name;
    if (!sampleFile.name.includes(".png")&&!sampleFile.name.includes(".jpg")&&!sampleFile.name.includes(".jpeg")) return res.status(400).send({status: "failed", type: "File type is not supported"})
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
    fs.access(__dirname + "/images/" + sampleFile.name, async function(error) {
        if (error) {
          return res.status(400).send({status: "failed", type: "File-type-is-not-supported-or-too-large"});
        } else {
          //do stuff here.
      var __assign = (this && this.__assign) || function () {
          __assign = Object.assign || function(t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                  s = arguments[i];
                  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                      t[p] = s[p];
              }
              return t;
          };
          return __assign.apply(this, arguments);
      };
      var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
          function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
          return new (P || (P = Promise))(function (resolve, reject) {
              function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
              function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
              function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
              step((generator = generator.apply(thisArg, _arguments || [])).next());
          });
      };
      var __generator = (this && this.__generator) || function (thisArg, body) {
          var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
          return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
          function verb(n) { return function (v) { return step([n, v]); }; }
          function step(op) {
              if (f) throw new TypeError("Generator is already executing.");
              while (_) try {
                  if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                  if (y = 0, t) op = [op[0] & 2, t.value];
                  switch (op[0]) {
                      case 0: case 1: t = op; break;
                      case 4: _.label++; return { value: op[1], done: false };
                      case 5: _.label++; y = op[1]; op = [0]; continue;
                      case 7: op = _.ops.pop(); _.trys.pop(); continue;
                      default:
                          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                          if (t[2]) _.ops.pop();
                          _.trys.pop(); continue;
                  }
                  op = body.call(thisArg, _);
              } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
              if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
          }
      };
      var __spreadArrays = (this && this.__spreadArrays) || function () {
          for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
          for (var r = Array(s), k = 0, i = 0; i < il; i++)
              for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                  r[k] = a[j];
          return r;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var ImageModel = /** @class */ (function () {
          function ImageModel(signaturePath) {
              var _a;
              this.outputKey = "Confidences";
              var signatureData = fs_1.readFileSync(signaturePath, "utf8");
              this.signature = JSON.parse(signatureData);
              this.modelPath = "file://../" + this.signature.filename;
              _a = this.signature.inputs.Image.shape.slice(1, 3), this.width = _a[0], this.height = _a[1];
              this.outputName = this.signature.outputs[this.outputKey].name;
              this.classes = this.signature.classes.Label;
          }
          ImageModel.prototype.load = function () {
              return __awaiter(this, void 0, void 0, function () {
                  var _a;
                  return __generator(this, function (_b) {
                      switch (_b.label) {
                          case 0:
                              _a = this;
                              return [4 /*yield*/, tf.loadGraphModel(this.modelPath)];
                          case 1:
                              _a.model = _b.sent();
                              return [2 /*return*/];
                      }
                  });
              });
          };
          ImageModel.prototype.dispose = function () {
              if (this.model) {
                  this.model.dispose();
              }
          };
          ImageModel.prototype.predict = function (image) {
              var _a, _b;
              /*
              Given an input image decoded by tensorflow as a tensor,
              preprocess the image into pixel values of [0,1], center crop to a square
              and resize to the image input size, then run the prediction!
               */
              if (!!this.model) {
                  var _c = image.shape.slice(0, 2), imgHeight = _c[0], imgWidth = _c[1];
                  // convert image to 0-1
                  var normalizedImage = tf.div(image, tf.scalar(255));
                  // make into a batch of 1 so it is shaped [1, height, width, 3]
                  var reshapedImage = normalizedImage.reshape(__spreadArrays([1], normalizedImage.shape));
                  // center crop and resize
                  var top = 0;
                  var left = 0;
                  var bottom = 1;
                  var right = 1;
                  if (imgHeight != imgWidth) {
                      // the crops are normalized 0-1 percentage of the image dimension
                      var size = Math.min(imgHeight, imgWidth);
                      left = (imgWidth - size) / 2 / imgWidth;
                      top = (imgHeight - size) / 2 / imgHeight;
                      right = (imgWidth + size) / 2 / imgWidth;
                      bottom = (imgHeight + size) / 2 / imgHeight;
                  }
                  var croppedImage = tf.image.cropAndResize(reshapedImage, [[top, left, bottom, right]], [0], [this.height, this.width]);
                  var results = this.model.execute((_a = {}, _a[this.signature.inputs.Image.name] = croppedImage, _a), this.outputName);
                  var resultsArray_1 = results.dataSync();
                  return _b = {},
                      _b[this.outputKey] = this.classes.reduce(function (acc, class_, idx) {
                          var _a;
                          return __assign((_a = {}, _a[class_] = resultsArray_1[idx], _a), acc);
                      }, {}),
                      _b;
              }
              else {
                  console.error("Model not loaded, please await this.load() first.");
              }
          };
          return ImageModel;
      }());
      function main(imgPath) {
          return __awaiter(this, void 0, void 0, function () {
              var image, decodedImage, model, results;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0: return [4 /*yield*/, fs_1.promises.readFile(imgPath)];
                      case 1:
                          image = _a.sent();
                          decodedImage = tf.node.decodeImage(image, 3);
                          model = new ImageModel('../signature.json');
                          return [4 /*yield*/, model.load()];
                      case 2:
                          _a.sent();
                          results = model.predict(decodedImage);
                          console.log(results.Confidences);
                          //let arrResult = Object.values(results);
                          const getMax = object => {
                            return Object.keys(object).filter(x => {
                            return object[x] == Math.max.apply(null, 
                            Object.values(object));
                            });
                          };
                          console.log(getMax(results.Confidences))
                   let largest = getMax(results.Confidences)
                   if (largest[0].toLowerCase().includes("actinic")){
                     res.status(200).send({status: "ok", type: "actinic-keratosis", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("acne")){
                      res.status(200).send({status: "ok", type: "acne", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("basal")){
                      res.status(200).send({status: "ok", type: "basal-cell-cancer", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("blister")){
                      res.status(200).send({status: "ok", type: "blister", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("cellulitis")){
                      res.status(200).send({status: "ok", type: "cellulitis", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("chicken")){
                      res.status(200).send({status: "ok", type: "chickenpox", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("cold")){
                      res.status(200).send({status: "ok", type: "cold-sore", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("keratosis")){
                      res.status(200).send({status: "ok", type: "keratosis-pilaris", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("lupus")){
                      res.status(200).send({status: "ok", type: "lupus", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("measle")){
                      res.status(200).send({status: "ok", type: "measles", confidence: lresults.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("ringworm")){
                      res.status(200).send({status: "ok", type: "ringworm", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("melanoma")){
                      res.status(200).send({status: "ok", type: "melanoma", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("melesma")){
                     res.status(200).send({status: "ok", type: "melasma", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("psoriasis")){
                     res.status(200).send({status: "ok", type: "psoriasis", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("rosacea")){
                      res.status(200).send({status: "ok", type: "rosacea", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("vitiligo")){
                     res.status(200).send({status: "ok", type: "vitiligo", confidence: results.Confidences[largest[0]]});
                   }else if (largest[0].toLowerCase().includes("normal")){
                      res.status(200).send({status: "ok", type: "no-conditions", confidence: results.Confidences[largest[0]]});
                   }else{
                      res.status(200).send({status: "ok", type: "no-conditions", confidence: results.Confidences[largest[0]]});
                   }
    
                          // cleanup
                          model.dispose();
                          return [2 /*return*/];
                  }
              });
          });
      }
      //defining functions to run stuff
      main(__dirname + "/images/" + sampleFile.name)
          await sleep(5000)
      
         fs.unlinkSync(__dirname + "/images/" + sampleFile.name);
        }
      })
    });
  });

app.post("/v1/base64/basic", checkkey, urlencodedParser, async function (req, res) {
    let sampleFile;
    let uploadPath;
    let imageName = makeid(10);
    if (!req.body){
      return res.status(400).send({status: "ok", type: "no-body-found-in-your-request"});
    }
    if (!req.body.base64){
      return res.status(400).send({status: "failed", type: "no base64 url posted"});
    }
    let base64String = req.body.base64

    // Remove header
    let base64Image = base64String.split(';base64,').pop();
if (!base64Image.includes("iVBORw0KGg")){
    return res.status(400).send({status: "failed", type: "The base64 string doesn't seem to be a valid image"}); 
}
    fs.writeFile(__dirname + "/images/" + imageName + ".png", base64Image, {encoding: 'base64'}, function(err) {
    if (err){
        console.log("uh oh there was an error");
        console.log(err)
        return res.status(400).send({status: "failed", type: "The base64 string doesn't seem to be a valid image"}); 
    }
    console.log('done');
    fs.access(__dirname + "/images/" + imageName + ".png", async function(error) {
    if (error) {
      return res.status(400).send({status: "failed", type: "File-type-is-not-supported-or-too-large"});
    } else {
      //do stuff here.
  var __assign = (this && this.__assign) || function () {
      __assign = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                  t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };
  var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator = (this && this.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var __spreadArrays = (this && this.__spreadArrays) || function () {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var ImageModel = /** @class */ (function () {
      function ImageModel(signaturePath) {
          var _a;
          this.outputKey = "Confidences";
          var signatureData = fs_1.readFileSync(signaturePath, "utf8");
          this.signature = JSON.parse(signatureData);
          this.modelPath = "file://../" + this.signature.filename;
          _a = this.signature.inputs.Image.shape.slice(1, 3), this.width = _a[0], this.height = _a[1];
          this.outputName = this.signature.outputs[this.outputKey].name;
          this.classes = this.signature.classes.Label;
      }
      ImageModel.prototype.load = function () {
          return __awaiter(this, void 0, void 0, function () {
              var _a;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _a = this;
                          return [4 /*yield*/, tf.loadGraphModel(this.modelPath)];
                      case 1:
                          _a.model = _b.sent();
                          return [2 /*return*/];
                  }
              });
          });
      };
      ImageModel.prototype.dispose = function () {
          if (this.model) {
              this.model.dispose();
          }
      };
      ImageModel.prototype.predict = function (image) {
          var _a, _b;
          /*
          Given an input image decoded by tensorflow as a tensor,
          preprocess the image into pixel values of [0,1], center crop to a square
          and resize to the image input size, then run the prediction!
           */
          if (!!this.model) {
              var _c = image.shape.slice(0, 2), imgHeight = _c[0], imgWidth = _c[1];
              // convert image to 0-1
              var normalizedImage = tf.div(image, tf.scalar(255));
              // make into a batch of 1 so it is shaped [1, height, width, 3]
              var reshapedImage = normalizedImage.reshape(__spreadArrays([1], normalizedImage.shape));
              // center crop and resize
              var top = 0;
              var left = 0;
              var bottom = 1;
              var right = 1;
              if (imgHeight != imgWidth) {
                  // the crops are normalized 0-1 percentage of the image dimension
                  var size = Math.min(imgHeight, imgWidth);
                  left = (imgWidth - size) / 2 / imgWidth;
                  top = (imgHeight - size) / 2 / imgHeight;
                  right = (imgWidth + size) / 2 / imgWidth;
                  bottom = (imgHeight + size) / 2 / imgHeight;
              }
              var croppedImage = tf.image.cropAndResize(reshapedImage, [[top, left, bottom, right]], [0], [this.height, this.width]);
              var results = this.model.execute((_a = {}, _a[this.signature.inputs.Image.name] = croppedImage, _a), this.outputName);
              var resultsArray_1 = results.dataSync();
              return _b = {},
                  _b[this.outputKey] = this.classes.reduce(function (acc, class_, idx) {
                      var _a;
                      return __assign((_a = {}, _a[class_] = resultsArray_1[idx], _a), acc);
                  }, {}),
                  _b;
          }
          else {
              console.error("Model not loaded, please await this.load() first.");
          }
      };
      return ImageModel;
  }());

  function main(imgPath) {
      return __awaiter(this, void 0, void 0, function () {
          var image, decodedImage, model, results;
          return __generator(this, function (_a) {
              switch (_a.label) {
                  case 0: return [4 /*yield*/, fs_1.promises.readFile(imgPath)];
                  case 1:
                      image = _a.sent();
                      decodedImage = tf.node.decodeImage(image, 3);
                      model = new ImageModel('../signature.json');
                      return [4 /*yield*/, model.load()];
                  case 2:
                      _a.sent();
                      results = model.predict(decodedImage);
                      console.log(results.Confidences);
                      //let arrResult = Object.values(results);
                      const getMax = object => {
                        return Object.keys(object).filter(x => {
                        return object[x] == Math.max.apply(null, 
                        Object.values(object));
                        });
                      };
                      console.log(getMax(results.Confidences))
                     let largest = getMax(results.Confidences)
                     if (largest[0].toLowerCase().includes("actinic")){
                       res.status(200).send({status: "ok", type: "actinic-keratosis", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("acne")){
                        res.status(200).send({status: "ok", type: "acne", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("basal")){
                        res.status(200).send({status: "ok", type: "basal-cell-cancer", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("blister")){
                        res.status(200).send({status: "ok", type: "blister", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("cellulitis")){
                        res.status(200).send({status: "ok", type: "cellulitis", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("chicken")){
                        res.status(200).send({status: "ok", type: "chickenpox", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("cold")){
                        res.status(200).send({status: "ok", type: "cold-sore", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("keratosis")){
                        res.status(200).send({status: "ok", type: "keratosis-pilaris", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("lupus")){
                        res.status(200).send({status: "ok", type: "lupus", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("measle")){
                        res.status(200).send({status: "ok", type: "measles", confidence: lresults.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("ringworm")){
                        res.status(200).send({status: "ok", type: "ringworm", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("melanoma")){
                        res.status(200).send({status: "ok", type: "melanoma", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("melesma")){
                       res.status(200).send({status: "ok", type: "melasma", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("psoriasis")){
                       res.status(200).send({status: "ok", type: "psoriasis", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("rosacea")){
                        res.status(200).send({status: "ok", type: "rosacea", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("vitiligo")){
                       res.status(200).send({status: "ok", type: "vitiligo", confidence: results.Confidences[largest[0]]});
                     }else if (largest[0].toLowerCase().includes("normal")){
                        res.status(200).send({status: "ok", type: "no-conditions", confidence: results.Confidences[largest[0]]});
                     }else{
                        res.status(200).send({status: "ok", type: "no-conditions", confidence: results.Confidences[largest[0]]});
                     }
                      // cleanup
                      model.dispose();
                      return [2 /*return*/];
              }
          });
      });
  }
  //defining functions to run stuff
  main(__dirname + "/images/" + imageName + ".png").catch(err => {
      return res.status(400).send({status: "failed", type: "The base64 string doesn't seem to be a valid image", fullError: err.toString()}); 
  })
      await sleep(5000)
  
     fs.unlinkSync(__dirname + "/images/" + imageName + ".png");
    }
  })
  });
  
  
  
  
  
  
});
app.post("/v1/base64/raw", checkkey,urlencodedParser, async function (req, res) {
    let sampleFile;
    let uploadPath;
    let imageName = makeid(10);
    if (!req.body){
      return res.status(400).send({status: "ok", type: "no-body-found-in-your-request"});
    }
    if (!req.body.base64){
      return res.status(400).send({status: "failed", type: "no base64 url posted"});
    }
    let base64String = req.body.base64

    // Remove header
    let base64Image = base64String.split(';base64,').pop();
if (!base64Image.includes("iVBORw0KGg")){
    return res.status(400).send({status: "failed", type: "The base64 string doesn't seem to be a valid image"}); 
}
    fs.writeFile(__dirname + "/images/" + imageName + ".png", base64Image, {encoding: 'base64'}, function(err) {
    if (err){
        console.log("uh oh there was an error");
        console.log(err)
        return res.status(400).send({status: "failed", type: "The base64 string doesn't seem to be a valid image"}); 
    }
    console.log('done');
    fs.access(__dirname + "/images/" + imageName + ".png", async function(error) {
    if (error) {
      return res.status(400).send({status: "failed", type: "File-type-is-not-supported-or-too-large"});
    } else {
      //do stuff here.
  var __assign = (this && this.__assign) || function () {
      __assign = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                  t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };
  var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator = (this && this.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var __spreadArrays = (this && this.__spreadArrays) || function () {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var ImageModel = /** @class */ (function () {
      function ImageModel(signaturePath) {
          var _a;
          this.outputKey = "Confidences";
          var signatureData = fs_1.readFileSync(signaturePath, "utf8");
          this.signature = JSON.parse(signatureData);
          this.modelPath = "file://../" + this.signature.filename;
          _a = this.signature.inputs.Image.shape.slice(1, 3), this.width = _a[0], this.height = _a[1];
          this.outputName = this.signature.outputs[this.outputKey].name;
          this.classes = this.signature.classes.Label;
      }
      ImageModel.prototype.load = function () {
          return __awaiter(this, void 0, void 0, function () {
              var _a;
              return __generator(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          _a = this;
                          return [4 /*yield*/, tf.loadGraphModel(this.modelPath)];
                      case 1:
                          _a.model = _b.sent();
                          return [2 /*return*/];
                  }
              });
          });
      };
      ImageModel.prototype.dispose = function () {
          if (this.model) {
              this.model.dispose();
          }
      };
      ImageModel.prototype.predict = function (image) {
          var _a, _b;
          /*
          Given an input image decoded by tensorflow as a tensor,
          preprocess the image into pixel values of [0,1], center crop to a square
          and resize to the image input size, then run the prediction!
           */
          if (!!this.model) {
              var _c = image.shape.slice(0, 2), imgHeight = _c[0], imgWidth = _c[1];
              // convert image to 0-1
              var normalizedImage = tf.div(image, tf.scalar(255));
              // make into a batch of 1 so it is shaped [1, height, width, 3]
              var reshapedImage = normalizedImage.reshape(__spreadArrays([1], normalizedImage.shape));
              // center crop and resize
              var top = 0;
              var left = 0;
              var bottom = 1;
              var right = 1;
              if (imgHeight != imgWidth) {
                  // the crops are normalized 0-1 percentage of the image dimension
                  var size = Math.min(imgHeight, imgWidth);
                  left = (imgWidth - size) / 2 / imgWidth;
                  top = (imgHeight - size) / 2 / imgHeight;
                  right = (imgWidth + size) / 2 / imgWidth;
                  bottom = (imgHeight + size) / 2 / imgHeight;
              }
              var croppedImage = tf.image.cropAndResize(reshapedImage, [[top, left, bottom, right]], [0], [this.height, this.width]);
              var results = this.model.execute((_a = {}, _a[this.signature.inputs.Image.name] = croppedImage, _a), this.outputName);
              var resultsArray_1 = results.dataSync();
              return _b = {},
                  _b[this.outputKey] = this.classes.reduce(function (acc, class_, idx) {
                      var _a;
                      return __assign((_a = {}, _a[class_] = resultsArray_1[idx], _a), acc);
                  }, {}),
                  _b;
          }
          else {
              console.error("Model not loaded, please await this.load() first.");
          }
      };
      return ImageModel;
  }());

  function main(imgPath) {
      return __awaiter(this, void 0, void 0, function () {
          var image, decodedImage, model, results;
          return __generator(this, function (_a) {
              switch (_a.label) {
                  case 0: return [4 /*yield*/, fs_1.promises.readFile(imgPath)];
                  case 1:
                      image = _a.sent();
                      decodedImage = tf.node.decodeImage(image, 3);
                      model = new ImageModel('../signature.json');
                      return [4 /*yield*/, model.load()];
                  case 2:
                      _a.sent();
                      results = model.predict(decodedImage);
                      console.log(results.Confidences);
                      //let arrResult = Object.values(results);
                      res.status(200).send({status: "ok", raw: results.Confidences});
                      // cleanup
                      model.dispose();
                      return [2 /*return*/];
              }
          });
      });
  }
  //defining functions to run stuff
  main(__dirname + "/images/" + imageName + ".png").catch(err => {
      return res.status(400).send({status: "failed", type: "The base64 string doesn't seem to be a valid image", fullError: err.toString()}); 
  })
      await sleep(5000)
  
     fs.unlinkSync(__dirname + "/images/" + imageName + ".png");
    }
  })
  });
  
  
  
  
  
  
});
app.get("/v1/info/:key", async (req, res) => {
    let all = req.params.key;
    if (!all) return res.status(400).send({"status":"failed", "type":"No requested key found in your query"});
    let key = all.slice(8);
    let prefix = all.slice(0, 8)
    const hmac = createHmac('sha512', key);
  hmac.update(JSON.stringify(prefix));
  const signature = hmac.digest('hex');

    let info = await checkStuff(mongoclient, "list");
    if (!info[signature]) return res.status(400).send({"status":"failed", "type":"Requested key does not exist"});
    let userId = info[signature];
    let user = await mongoclient.db("openskin").collection("userData").findOne({ name: userId});
    if (!user) return res.status(501).send({"status":"internal server error", "type":"Could not access the database, or database was too slow to respond"});
    return res.status(200).send({"status":"ok", "info":{
        "ownerId":user.id,
        "ownerName":user.displayName,
        "api_key_uses":user.uses,
        "api_key_prefix":user.prefix,
        "expiration":"never"
    }})
})
app.listen(port, hostname, function () {
  console.log(`Listening at http://${hostname}:${port}/...`);
});

 
async function checkStuff(mongoclient, name){
    let result = await mongoclient.db("openskin").collection("hashedKeys")
    .findOne({name: name});
    if (result){
      return result;
    }else{
    }
  }
hourlyClear();
async function hourlyClear(){
while(true){
    await sleep(1000)
    var d = new Date();
    var m = d.getMinutes();
    if (m === 10){
        mongoclient.db("openskin").collection("userData").updateMany( {}, {$set:{uses: 0}});

        await sleep(61000)
    }
}
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
})
