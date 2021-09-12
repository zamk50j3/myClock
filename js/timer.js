//@ts-check


// ----- element ----------------------------------------------------------
/** @type {SVGGeometryElement} トラッカーサークル */
const outline = document.querySelector(".moving-outline circle");

/** @type {HTMLElement} 時間 */
const time_display = document.querySelector(".timer");

/** @type {HTMLInputElement} 時間 */
const play_button  = document.querySelector(".play");

/** @type {HTMLInputElement} 時間 */
const pause_button = document.querySelector(".pause");

/** @type {HTMLInputElement} 時間 */
const duration_pulldown = document.querySelector("#duration");

/** @type {HTMLInputElement} 時間 */
const reset_button = document.querySelector("#reset");


// ----- valiavle ---------------------------------------------------------
const outlineLength = outline.getTotalLength();

/** @type {number} タイマーID */
let interval_id;

/** @type {number} 設定時間*/
let duration_sec    = Number(duration_pulldown.value) * 60;

/** @type {number} 経過時間 */
let elapsed_sec     = 0


// ----- method -----------------------------------------------------------
/** タイマー表示 */
const showTimer = () =>{
    duration_sec = Number(duration_pulldown.value) * 60;
    //サークル表示
    outline.style.strokeDasharray  = String(outlineLength);
    outline.style.strokeDashoffset = String(outlineLength - (elapsed_sec / duration_sec) * outlineLength);
    //時間表示
    const remaining_sec = duration_sec - elapsed_sec;
    const min_str = ('0'+Math.floor(remaining_sec / 60)).slice(-2);
    const sec_str = ('0'+Math.floor(remaining_sec % 60)).slice(-2);
    time_display.textContent = `${min_str}:${sec_str}`;
};

/** タイマー開始 */
const countStart = () =>{  
  // 画面要素制御
  play_button.setAttribute("display", "none");
  pause_button.removeAttribute("display");
  duration_pulldown.disabled = true;
  reset_button.disabled = true;
  // タイマー開始
  interval_id = setInterval(countDown, 1000);
};

/** タイマー停止 */
const countStop = () =>{
  // 画面要素制御
  pause_button.setAttribute("display", "none");
  play_button.removeAttribute("display");
  duration_pulldown.disabled = false;
  reset_button.disabled = false;
  // タイマー停止
  clearInterval(interval_id);
};

/** タイマーリセット */
const countReset = () =>{
  // タイマー停止
  clearInterval(interval_id);
  // 経過時間をリセットし、時間表示
  elapsed_sec = 0;
  showTimer();
};

/** カウントダウン処理 */
const countDown = () =>{
  // 経過時間更新
  elapsed_sec ++;
  showTimer();

  // タイムアップの場合タイマー停止
  if(duration_sec === elapsed_sec){
    countStop();
    countFinish();
    return;
  }
};

/** カウントダウン終了 */
const countFinish = () =>{
  // 終了音再生
  const audio = new Audio("../sound/poteto.mp3");
  audio.play();

  // OS毎に処理を変える
  const os_str = window.navigator.userAgent.toLocaleLowerCase();
  console.log(os_str);
  if(os_str.indexOf("android") !== -1) {
    navigator.vibrate([200, 200, 200, 200]);
  }
}

// ----- onLoad -----------------------------------------------------------
//再生ボタン押下時
play_button.addEventListener("click", countStart);

//停止ボタン押下時
pause_button.addEventListener("click", countStop);

//リセットボタン押下時
reset_button.addEventListener("click", countReset);

//設定時間変更時
duration_pulldown.addEventListener("change", countReset);

//タイマー表示
showTimer();