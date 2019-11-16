"use strict";

// ゲーム全体を制御するクラス
class GameController {
  constructor() {
    this.moguraObjects = [];
    let moguras = document.querySelectorAll(".mogura");
    for (let i = 0; i < moguras.length; i++) {
      // オブジェクトの参照を渡している
      this.moguraObjects.push(new MoguraObject(moguras[i], this))
    }
  }

  // ゲーム開始
  start () {
    // モグラを一定間隔で生成する
    this.moguraGenerate = setInterval(() => {
      let rand = Math.floor(Math.random() * this.moguraObjects.length);
      this.moguraObjects[rand].deru();
    }, 500);

    // 残り秒数をカウントダウンする
    this.gemeCountdown = setInterval((gameController) => {
      gameController.finish();
    }, 15000, this);
  }

  // ゲーム終了
  finish () {
    console.log("ゲーム終了")
    clearInterval(this.moguraGenerate);
    clearInterval(this.gemeCountdown)
    for (let i = 0; i < this.moguraObjects.length; i++) {
      // オブジェクトの参照を渡している
      this.moguraObjects[i].image.src = "";
    }
  }

  // 出現しているモグラの数を数える
  countMogura () {
    let cnt = 0;
    for (let i = 0; i < this.moguraObjects.length; i++) {
      if (this.moguraObjects[i].status == 1) {
        cnt++;
      }
    }
    return cnt;
  }
}

// モグラ１匹を制御するクラス
class MoguraObject {

  // 初期化処理
  constructor(image, gameController) {
    this.image = image;
    this.image.data = this; // ポイント1
    this.image.onclick = this.onclick;
    this.gameController = gameController;
    this.status = 0; // 0:hide, 1:show, 2:press
    this.autoHide = "";
    this.MOGURA_TYPES = ["mogura", "gurasan", "gobu"];
    this.MOGURA_IMAGES = {
      mogura: ["", "./images/モグ2.png", "./images/モグ1.png"],
      gurasan: ["", "./images/モグ3.png", "./images/モグ4.png"],
      gobu: ["", "./images/ゴブ1.png", "./images/ゴブ2.png"]
    }
  }

  onclick(){
    this.data.press(); // ポイント2
  }

  press() {
    if (this.status != 1) return;
    
    this.setStatus(2);

    clearTimeout(this.autoHide);
    setTimeout(() => { this.setStatus(0) }, 400);
  }

  // モグラが出現する
  deru() {
    if (this.status != 0) return false;
    if (Math.random() < 0.7) return false;
    if (this.overMoguraDisplayLimit()) return false; // 同時に２匹までしか出ないようにする

    // どの種類のモグラかを決定する
    this.moguraType = this.setImageType();

    this.setStatus(1);

    let hideIntervalTime = (3000 * Math.random()) + 2000;
    this.autoHide = setTimeout(() => { this.setStatus(0) }, hideIntervalTime);
  }

  // モグラの同時出現が上限に達していないかをチェックする
  overMoguraDisplayLimit() {
    return (this.gameController.countMogura() >= 2);
  }

  // ステータスを更新する
  setStatus (statusNumber) {
    this.status = statusNumber; // 0:hide, 1:show, 2:press
    this.update();
  }

  // モグラのタイプとステータスに応じて、画像を切り替える
  update () {
    this.image.src = this.MOGURA_IMAGES[this.moguraType][this.status];
  }

  // モグラの種類をランダムに決定する
  setImageType () {
    let rand = Math.random();
    if (rand > 0.95) {
      return this.MOGURA_TYPES[2]; // 0:もぐら 1:グラサン 2:ゴブリン
    } else if (rand > 0.8) {
      return this.MOGURA_TYPES[1]; // 0:もぐら 1:グラサン 2:ゴブリン
    } else {
      return this.MOGURA_TYPES[0]; // 0:もぐら 1:グラサン 2:ゴブリン
    }
  }
}

let gameController = new GameController();
gameController.start();