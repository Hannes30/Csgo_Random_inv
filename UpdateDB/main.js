import fetch from "node-fetch";
import mysql from "mysql2";

var con = mysql.createConnection({
  host: "localhost",
  user: "hannes",
  password: "hannes",
  database: "csgoskins",
});
let x = new Date();
let counter = 0;
let conditions = [
  "Factory",
  "Minimal Wear",
  "Field-Tested",
  "Well-Worn",
  "Battle-Scarred",
];
let skins2;
let WeaponArrays = {};
con.connect(function (err) {
  if (err) throw err;
  con.query("SELECT * FROM skins", function (err, result, fields) {
    if (err) throw err;
    logus(result);
  });
});

function logus(array) {
  array.forEach((element) => {
    if (element.weapon in WeaponArrays) {
      WeaponArrays[element.weapon].push(element);
    } else {
      WeaponArrays[element.weapon] = [];
      WeaponArrays[element.weapon].push(element);
    }
  });
  updateus();
}

function updateus() {
  var e = 0;
  let chaos = [];
  let k = 0;
  for (let weapons in WeaponArrays) {
    for (let i = 0; i < WeaponArrays[weapons].length; i++) {
      e++;
      chaos[e] = WeaponArrays[weapons][i];
      if (WeaponArrays[weapons][i].price != 0) {
        k++;
      }
    }
  }
  clearDB(chaos);
  console.log((k * 100) / chaos.length + "%");
  e = 0;
  let i = k;

  var add = setInterval(function () {
    if (i + 1 > chaos.length) {
      clearInterval(add);
    }
    fetch(
      "http://steamcommunity.com/market/priceoverview/?country=DE&currency=3&appid=730&market_hash_name=" +
        chaos[i].weapon +
        "%20%7C%20" +
        chaos[i].skinname +
        "%20%28" +
        chaos[i].condi +
        "%29"
    )
      .then((res) => res.json())
      .then((res) => {
        //console.log(res.success);
        console.log(res);
        if (res == null) {
          console.log("Blocked:(");
        } else if (res.success == true) {
          con.connect(function (err) {
            if (err) throw err;
            var sql =
              'UPDATE skins SET price = "' +
              res.lowest_price +
              '" WHERE weapon = "' +
              chaos[i].weapon +
              '"AND skinname ="' +
              chaos[i].skinname +
              '"AND condi ="' +
              chaos[i].condi +
              '"';
            con.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Updated");
            });
          });
        } else if (res.success == false) {
          con.connect(function (err) {
            if (err) throw err;
            var sql =
              'UPDATE skins SET price = "' +
              -1 +
              '" WHERE weapon = "' +
              chaos[i].weapon +
              '"AND skinname ="' +
              chaos[i].skinname +
              '"AND condi ="' +
              chaos[i].condi +
              '"';
            con.query(sql, function (err, result) {
              if (err) throw err;
            });
          });
        }
      });
    i++;
    if (i >= chaos.length) {
      i = 0;
    }
  }, 10000);
}
function clearDB(chaos) {
  chaos.forEach((element) => {
    if (element.price == -1 || element.price == "undefined") {
      con.connect(function (err) {
        if (err) throw err;
        var sql =
          'Delete from skins  WHERE weapon = "' +
          element.weapon +
          '"AND skinname ="' +
          element.skinname +
          '"AND condi ="' +
          element.condi +
          '"';
        con.query(sql, function (err, result) {
          if (err) throw err;
        });
      });
    }
  });
}
