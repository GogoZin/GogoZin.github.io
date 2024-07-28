var v_checksum = 0;
var count_times = 0;
var num_array_lst = [];
var windowCheck = 0;

const sleep = ms => new Promise(r => setTimeout(r, ms)); 
//promise同步確保timeout完成才進行下一步

async function showMe(ele) { //
    // console.log(ele.value);
    var r = new XMLHttpRequest(); //透過XML去發一個GET請求
    r.open('get', 'https://tw539.com/web/jackpot.txt', false); 
    //這邊第三個參數必須是false 保持同步 否則下方 responseText抓不到資料會是空值
    r.send(null); //只要是get讀取資料 不進行更改的話 這邊必須要是 null #唯讀
    var text = r.responseText; //把response的內容存進變數 這邊其實就是txt檔案裡面的內容
    var weekly_num = text.split("\n")[1]; //第二筆是包牌組合
    var daily_num = text.split("\n")[2]; //第三筆是不出組合
    var twoIone_num = text.split("\n")[3] //第三筆是二中一
    if (weekly_num.length < 15) {
        weekly_num = "近期包牌未更新";
    };
    if (daily_num.length < 10) {
        daily_num = "今日沒有不出牌";
    };
    if (twoIone_num.length < 8) {
        twoIone_num = "今日沒有二中一"
    }
    document.getElementById("daily_num").value = daily_num; //帶進input欄位
    document.getElementById("weekly_num").value = weekly_num; //同上
    if (windowCheck !=0) { //驗證用 如果這個參數不是0 說明視窗已經被打開
        document.getElementById("showWindow").style.display = "none";
        document.getElementById("showDaily").style.display = "none";
        document.getElementById("showWeekly").style.display = "none";
        document.getElementById("showInfo").style.display = "none";
        windowCheck -= 1; //把全部視窗的display設為none 並把這個數值-1回到0
        return 0; //結束這個涵式 實現點一下開啟 點第二下關閉
    } else { //如果windowCheck是0
        windowCheck += 1; //先把數值+1
        document.getElementById("showWindow").style.display = "block";
        //然後把視窗顯示出來
        switch (ele.value) { //然後按照button的值 去顯示不同的視窗欄
            case "daily":
                document.getElementById("showDaily").style.display = "block";
                break;
            case "weekly":
                document.getElementById("showWeekly").style.display = "block";
                break;
            case "page_info":
                break;
            case "twoIone":
                ocument.getElementById("showTwoIone").style.display = "block";
                break;
            default:
                break;
        }
    }
}

// async function btn_click() { //EEL
//     var result = await eel.versionNumber()();
//     document.getElementById('output').innerHTML = result;
// }

async function cleanNumber(lst) {
    for (var n = 0; n < lst.length; n++) {
        var idx = n + 1;
        var id_name = 'output_num_' + idx;
        document.getElementById(id_name).value = "";
    }
}

async function checkIfClick() {
    var num_1 = document.getElementById('num_1').value;
    var num_2 = document.getElementById('num_2').value;
    var num_3 = document.getElementById('num_3').value;
    var num_4 = document.getElementById('num_4').value;
    var num_5 = document.getElementById('num_5').value;
    if (num_1 == "" || num_2 == "" || num_3 == "" || num_4 == "" || num_5 == "") {
        window.alert("號碼不能為空");
        return 0;
    }
    if (v_checksum != 0) {
        window.alert("程式碼計算中 請勿多次點擊 !");
    } else {
        if (count_times != 0) {
            window.alert("本平台目前正處於推廣狀態\n本平台只有一位開發者\n本人目前有提供的服務項目如以下:\n1.前端架設\n2.私服架設\n3.壓力測試\n4.腳本開發\n5.印表機&監視器安裝\n6.系統安裝\n7.伺服器&電腦維護\n8.電子商務平台線上諮詢")
        };
        getNumber();
    }
    count_times += 1;
}

async function getNumber() {
    v_checksum = 1;
    var num_1 = document.getElementById('num_1').value;
    var num_2 = document.getElementById('num_2').value;
    var num_3 = document.getElementById('num_3').value;
    var num_4 = document.getElementById('num_4').value;
    var num_5 = document.getElementById('num_5').value;
    if (num_1 > 39 || num_2 > 39 || num_3 > 39 || num_4 > 39 || num_5 > 39) {
        for (var c = 0; c < 5; c++) {
            var ii = c + 1;
            var id = 'num_' + ii;
            document.getElementById(id).value = "";
        }
        window.alert("不支援的數字");
        v_checksum = 0;
        return 0;
    }
    // var num_list = [num_1, num_2, num_3, nu  m_4, num_5]; //EEL
    // var lst = await eel.enterLoop(num_list)(); //EEL 
    var lst = await lstHandler(); //JS
    cleanNumber(lst); //清除input欄位的值
    for (var n = 0; n < lst.length; n++) {
        var idx = n + 1;
        var id_name = 'output_num_' + idx;
        document.getElementById(id_name).style.animation = "ballanimation .1s ease-in infinite";
        await sleep(2000);
        document.getElementById(id_name).style.animation = "none";
        document.getElementById(id_name).value = lst[n];
    };
    v_checksum = 0;
}

async function lstHandler() { //Code By Zin
    var r = new XMLHttpRequest(); //透過XML去發一個GET請求
    r.open('get', 'https://tw539.com/web/jackpot.txt', false); 
    //這邊第三個參數必須是false 保持同步 否則下方 responseText抓不到資料會是空值
    r.send(null); //只要是get讀取資料 不進行更改的話 這邊必須要是 null #唯讀
    var text = r.responseText; //把response的內容存進變數 這邊其實就是txt檔案裡面的內容
    var items = text.split("\n")[0].split(" "); //用" "作為分隔
    items.pop(); //刪除最後一筆
    num_array_lst = items; 
    var output_num = [];//最後要顯示的號碼列表
    for (var i = 0; i < 5; i++) {
        output_num.push(num_array_lst[(Math.floor(Math.random() * num_array_lst.length))]);
        //需要五個號碼所以要新增五個號碼到陣列
    }
    return filterDup(output_num); //用下面的涵式過濾重複號碼後回傳給主涵式
}

// async function choose(ary) { //隨機選擇 #棄用
//     var index = Math.floor(Math.random() * ary.length);
//     return ary[index]; //回傳
// }

async function filterDup(ary) { //過濾重複
    var deduped = ary.filter((el, i, arr) => arr.indexOf(el) === i);
    //先過濾一次資料看有無重複
    while (deduped.length != 5) { //當陣列長度不等於5 代表有重複資料被刪除了
        deduped.push(num_array_lst[(Math.floor(Math.random() * num_array_lst.length))]); //新增一筆資料上去
        deduped = deduped.filter((el, i, arr) => arr.indexOf(el) === i);
        //然後再次過濾這個陣列
    }
    return deduped; //經過上面迴圈後 資料就會是五個不重複的號碼
}