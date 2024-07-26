const form = document.querySelector(".form");

function OutputAry() {
    var r = new XMLHttpRequest(); //透過XML去發一個GET請求
    r.open('get', 'https://tw539.com/web/539.txt', false);
    //這邊第三個參數必須是false 保持同步 否則下方 responseText抓不到資料會是空值
    r.send(null); //只要是get讀取資料 不進行更改的話 這邊必須要是 null #唯讀
    var text = r.responseText; //把response的內容存進變數 這邊其實就是txt檔案裡面的內容
    var num_ary = text.split("\n");
    var new_ary = [];
    for (var x = 0; x < num_ary.length; x ++) {
        if (num_ary[x].length >= 9 && num_ary[x] != undefined) {
            new_ary.push(num_ary[x]);
        }
    }
    return new_ary;
}

function toggleHold() {
    this.classList.toggle('held');
    // if (this.classList.contains('held')) {
    //     const area = document.getElementById("note");
    //     area.innerHTML += this.innerText + " ";
    // };
    // if (this.classList.contains('held')) {
    //     this.style.background.color = 'yellow'; // 選擇保留牌時設置邊框為黃色
    // } else {
    //     this.style.background.color = 'pink'; // 取消選擇時恢復原來的邊框顏色
    // }
}

function toggleNote() {
    const note = document.getElementById("note");
    const title = document.getElementById("noteTitle");
    note.classList.toggle('bignote');
    title.classList.toggle('hide');
    title.classList.add('onTop');
    // this.classList.toggle('bignote');
}

function deleteHold() {
    const sNum = document.querySelectorAll(".held");
    sNum.forEach(n => {
        n.classList.remove("held");
    });
}

const num_ary = OutputAry();
console.log(num_ary);
for (var i = num_ary.length - 1 ; i > 0; i--) {
    form.innerHTML += '<div class="row" id="num'+ i + '"></div>';
    const nID = "num"+i;
    const input = document.getElementById(nID);
    const num = num_ary[i].split(" ");
    for (var e = 0; e < num.length; e ++) {
        input.innerHTML += '<div class="nBLOCK">' + num[e] + '</div>'
    }
}

const nBLOCK = document.querySelectorAll(".nBLOCK");
nBLOCK.forEach(n => {
    n.addEventListener('click', toggleHold);
});

// const note = document.getElementById("note");
// note.addEventListener("click", toggleNote);