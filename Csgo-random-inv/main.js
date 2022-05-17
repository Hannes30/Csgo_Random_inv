let CurWeapons = [];
const skinsdiv = $("#skins")[0];
function send() {
  fetch("http://localhost:8080/")
    .then((res) => res.json())
    .then((res) => callback(res));
}

function callback(Object) {
  CurWeapons.forEach((element) => element.div.remove());

  let Weapons = Object;
  Weapons.forEach((element) => {
    CurWeapons.push(
      new Dom(
        element.condi,
        element.grade,
        element.price,
        element.skinname,
        element.weapon
      )
    );
  });
}

class Dom {
  constructor(condi, grade, price, skinname, weapon) {
    this.condi = condi;
    this.grade = grade;
    this.price = price;
    this.skinname = skinname;
    this.weapon = weapon;
    this.bild =
      "https://api.steamapis.com/image/item/730/" +
      weapon +
      " | " +
      skinname +
      " (Minimal Wear)";
    this.creatediv();
  }
  creatediv() {
    this.div = document.createElement("div");
    this.add("h1", "Waffe: " + this.weapon);
    this.add("h3", "Name: " + this.skinname);
    let img = document.createElement("img");
    img.src = this.bild;
    img.classList.add("pic1");
    this.div.appendChild(img);
    this.add("p", "condition: " + this.condi);
    this.add("p", "Grade: " + this.grade);
    this.add("h2", "Price: " + this.price);

    this.div.classList.add("skindiv");
    skinsdiv.appendChild(this.div);
  }
  add(type, content) {
    let elem = document.createElement(type);
    elem.textContent = content;
    this.div.appendChild(elem);
  }
}
