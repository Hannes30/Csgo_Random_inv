import fetch from 'node-fetch'
import express, { json, response } from 'express'; //npm install express
import mysql from 'mysql2'; //npm install mysql2

const app = express()
const port = 8080;

var con = mysql.createConnection({
  host: "localhost",
  user: "hannes",
  password: "hannes",
  database:"csgoskins" //Datenbank muss angelegt sein und ein schema haben wie im bild nach dem befüllen können die Preise mit updateDb aktuallisiert werden(ca alle 6 Stunden wird ein Skin geändert)
});
let x = new Date();
let counter =0;


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET', 'PUT', 'POST', 'DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

let conditions =["Factory","Minimal Wear","Field-Tested","Well-Worn","Battle-Scarred"]
let skins2;
let WeaponArrays = {
}
con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM skins", function (err, result, fields) {
    if (err) throw err;
    inserttoarray(result);  
  });
});

function inserttoarray(array)
{
  array.forEach(element=> 
    {
      if(element.weapon in WeaponArrays)
      {
        WeaponArrays[element.weapon].push(element);
      }
      else{
        WeaponArrays[element.weapon]=[];
        WeaponArrays[element.weapon].push(element);
      }
    })
}
app.get('', (req, res) => {
  let responseArray = [];
    for(let element in WeaponArrays)
    {
      responseArray.push(WeaponArrays[element][Math.floor(Math.random() * WeaponArrays[element].length)])
    }

    res.send(responseArray);
})
app.listen(port,console.log("listening on "+port));

