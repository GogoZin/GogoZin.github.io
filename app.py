import eel, random, requests


random_lst = []
final_list = []
solo_list = []
after_check_list = []
number_history = []
four_hit = []
three_hit = []
dup_lst = []
r = requests.get("https://raw.githubusercontent.com/GogoZin/result/main/539.txt")
with open("539.txt", "wb") as fp:
    fp.write(r.content)
    fp.close()
open_list = open("539.txt").readlines()
eel.init('web')

@eel.expose
def enterLoop(js_num):
    getListNumber()
    for nm in list(js_num): #開始運算
        nm = int(nm)
        getSoloNumber(nm)
        final_list.clear() #每運算完一個數字則清空所有列表
        solo_list.clear() 
        after_check_list.clear()
    follow_lst = [four_hit, three_hit, dup_lst]
    for lst in list(follow_lst): #遍歷這個串列裡面的3個串列
        for ran_num in list(lst): #把每個數字取出來 儲存到新列表
            random_lst.append(ran_num)
    return outputData()

@eel.expose
def getSoloNumber(custom_number): #將單個號碼放進函式並計算下一期號碼的重複率
    custom_number = str(custom_number) #先將號碼轉為字元
    for _ in range(len(number_history)): #遍歷歷史號碼的list
        for n in range(5): #每組會有五個號碼 所以每組取出來之後 還需遍歷5次
            if custom_number == number_history[_].split(" ")[n]: #如果有號碼命中其中一組
                if _ != len(number_history) - 1: #且不是命中最後一組的時候
                    after_check_list.append(number_history[_+1]) #把下一組的五個號碼放進第二個list
                else:
                    pass #因為如果命中的是最後一組 下一組則是我們要預測的 並無這個資料可以儲存 所以PASS
            else:
                pass
    for line in list(after_check_list): #遍歷儲存到新列表的所有組
        line = line.split(" ") #依照空格分開五個號碼
        for n in range(5): #遍歷每組的五個號碼 並儲存到新列表
            solo_list.append(int(line[n]))
    solo_list.sort() #排序這個數字新列表
    for l in range(len(solo_list)): #遍歷這個數字列表 找出重複的
        lst_data = "" #這個變數等等用於儲存遍歷後的資料
        for ln in range(4): #指定最高重複次數 這個數字可以自訂 但以100組而言 最高重複次數就是4 
            times = 0 #這個式重複次數 每次遍歷就初始化
            if l+ln >= len(solo_list): #ln用於比對後面3組資料 若l+ln大於或是等於列表最後位 則代表已比對到最後數字
                if solo_list[l] == solo_list[l-ln]: #比對到最後數字就要用減法判斷 往前比對前幾個數字
                    times = ln + 1 #比對成功這個times就以最大的ln+1 代表重複幾次
            else: #如果l+ln不大於或是等於列表最後位 則代表還未到最後一筆判斷
                if solo_list[l] == solo_list[l+ln]: #所以這邊就會用加法處理 往後比對後幾個數字
                    times = ln + 1
            if times >= 2: #這邊只取重複大於2次的數字儲存到新列表
                lst_data = "號碼: [" + str(solo_list[l]) + "] 出現了" + str(times) + "次"
        if lst_data != "": #如果這個data不為0 代表上面有資料 所以就儲存到新的列表
            final_list.append(lst_data)
    for nn in range(10): #下面這個遍歷用於刪除列表裡面的重複資料
        for f in range(len(final_list)):
            if f < len(final_list) - 1:
                data_1 = final_list[f].split("]")[0]
                data_2 = final_list[f+1].split("]")[0]
                if data_1 == data_2:
                    del final_list[f+1]
                else:
                    pass
            else:
                pass
    if int(custom_number) < 10: #顯示的格式處理
        mes = "號碼[0%s] | 預測號:\n"%(custom_number)
    else:
        mes = "號碼[%s] | 預測號:\n"%(custom_number)
    four_dup = ""
    three_dup = "" #三個空字串用來儲存重複的數字 再最後輸出結果顯示
    two_dup = ""
    for data in list(final_list): #因為上面寫的懶得改 所以直接用迴圈加上split的方式過濾字串 把數字跟重複次數提取出來
        num = str(data.split("[")[1].split("]")[0]) #過濾數字
        dup = str(data.split("了")[1].split("次")[0]) #過濾重複次數
        txt = num + "*" + dup + " " #顯示格式 數字*幾次
        if int(dup) == 4:
            four_dup += txt
            four_hit.append(int(num)) #這邊的判斷就是看重複幾次 分別塞到不同list裡面
        elif int(dup) == 3:
            three_dup += txt
            three_hit.append(int(num))
        elif int(dup) == 2:
            two_dup += txt
            dup_lst.append(int(num))
        else:
            pass
    mes += four_dup + three_dup + two_dup #最後的output 也可以直接return
    return mes
@eel.expose
def outputData():
    choosen =  sorted(set(random.choices(random_lst, k=5))) #抓取5個數字並刪除重複+排序
    while len(choosen) != 5: #當choosen不是5個數字的時候
        try:#嘗試重新抓取 直至抓到5個不重複數字
            choosen.append(random.choice(random_lst))
            choosen = sorted(set(choosen))
        except:#是5個數字就跳出迴圈
            break
    return choosen
@eel.expose
def getListNumber(): #將txt列表中的資料儲存於串列
    for string in list(open_list):
        string = string.strip()
        if len(string) < 9: 
            pass #如果字串長度小於9 不管那行是啥 都是不可用的, 因為最短的例子是 ['1 2 3 4 5'] 長度是9
        else:
            number_history.append(string) #不小於9就抓進去列表
print(" ~ 後臺視窗請勿關閉 ! ~ ")

eel.start('index.html', mode="chrome")
