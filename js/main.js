"use strict";

let gameController = new GameController();
gameController.start();

function GameController() {
  this.MOGURAS = document.querySelectorAll(".mogura");
  for (let i = 0; i < this.MOGURAS.length; i++) {
    // オブジェクトの参照を渡している
    new MoguraObj(this.MOGURAS[i], this);
  }

  // ゲーム開始
  this.start = function () {
    // モグラを一定間隔で生成する
    this.moguraGenerate = setInterval(() => {
      let rand = Math.floor(Math.random() * this.MOGURAS.length);
      this.MOGURAS[rand].deru();
    }, 500);
  }

  // ゲーム終了
  this.finish = function () {
    clearInterval(this.moguraGenerate);

    for (let i = 0; i < this.MOGURAS.length; i++) {
      // オブジェクトの参照を渡している
      this.MOGURAS[i].src = "";
    }
  }

  this.countMogura = function () {
    let cnt = 0;
    for (let i = 0; i < this.MOGURAS.length; i++) {
      if (this.MOGURAS[i].status == 1) {
        cnt++;
      }
    }
    return cnt;
  }

  setInterval((gameController) => {
    gameController.finish();
  }, 60000, this);
}

function MoguraObj(image, gameController) {
  this.image = image;
  image.status = 0; // 0:hide, 1:show, 2:press
  image.autoHide = "";
  image.MOGURA_TYPES = ["mogura", "gurasan", "gobu"];
  image.MOGURA_IMAGES = {
    mogura: ["", "./images/モグ2.png", "./images/モグ1.png"],
    gurasan: ["", "./images/モグ3.png", "./images/モグ4.png"],
    gobu: ["", "./images/ゴブ1.png", "./images/ゴブ2.png"]
  }

  image.onclick = function () {
    if (image.status == 1) {
      image.status = 2;
      image.update();

      clearTimeout(image.autoHide);
      setTimeout(image.kakureru, 400, image);
    }
  }

  // モグラが出現する
  image.deru = function () {
    if (image.status != 0) return false;
    if (Math.random() < 0.7) return false;
    if (gameController.countMogura() >= 2) return false;

    image.moguraType = image.setImageType();

    image.status = 1;
    image.update();
    image.autoHide = setTimeout(image.kakureru, (3000 * Math.random()) + 2000);
  }

  // モグラが隠れる
  image.kakureru = function () {
    image.status = 0;
    image.update();
  }

  image.update = function () {
    image.src = image.MOGURA_IMAGES[image.moguraType][image.status];
  }

  // モグラの種類を決定する
  image.setImageType = function () {
    let rand = Math.random();
    if (rand > 0.95) {
      return image.MOGURA_TYPES[2]; // 0:もぐら 1:グラサン 2:ゴブリン
    } else if (rand > 0.8) {
      return image.MOGURA_TYPES[1]; // 0:もぐら 1:グラサン 2:ゴブリン
    } else {
      return image.MOGURA_TYPES[0]; // 0:もぐら 1:グラサン 2:ゴブリン
    }
  }
}