class My_ajax {
    xhr = new XMLHttpRequest();

    constructor(url) {
        this.url = url;
    }

    get() {
        return new Promise((resolve, reject) => {
            this.xhr.open("get", this.url, true);
            this.xhr.onreadystatechange = () => {
                if (this.xhr.readyState === 4) {
                    if ((this.xhr.status >= 200 && this.xhr.status < 300) || this.xhr.status === 304) {
                        const res = JSON.parse(this.xhr.responseText);
                        resolve(res);
                    } else {
                        reject(this.xhr.response)
                    }
                }
            }
            this.xhr.send();
        })
    }
}

let createPage = (position = "") => {
    if (position === "") {
        navigator.geolocation.getCurrentPosition(function (position) {

        })
        position = "重庆";
        let match = document.querySelector(".match");
        match.innerHTML = position
    }
    let myChart;
    let my_ajax = new My_ajax(`https://geoapi.qweather.com/v2/city/lookup?location=${position}&key=7c4856271d864a2c9ccfcfce9c5aafa4`);
    my_ajax.get().then(value => {
        let loc = value.location[0].id;
        // 顶部城市、天气渲染
        let city = document.querySelector(".position .city");
        let temperature = document.querySelector(".temperature span");
        let weather_desc = document.querySelector(".weather_desc");
        let more_detail = document.querySelector(".more_detail");
        let quality_num = document.querySelector(".quality_num");
        let quality_std = document.querySelector(".quality_std");
        let weather_box = document.querySelector(".weather_box");
        my_ajax = new My_ajax(`https://tianqiapi.com/free/day?appid=42613675&appsecret=HUBOpdL8&cityid=${loc}`)
        // 改变实时天气
        my_ajax.get().then(value => {
            city.innerHTML = value.city;
            temperature.innerHTML = value.tem;
            weather_desc.innerHTML = value.wea;
            if (value.wea === "阴") {
                weather_box.style.backgroundImage = "-webkit-linear-gradient(\n" +
                    "                    -90deg\n" +
                    "                    ,#86c3ca,#b5e9e8)";
            } else if (value.wea === "晴") {
                weather_box.style.backgroundImage = "-webkit-linear-gradient(90deg, #3bbcff, #4af4ff)";
            }
            more_detail.innerHTML = value.win;
            quality_num.innerHTML = value.air;
            if (value.air <= 50) {
                quality_std.innerHTML = "优";
                quality_std.parentElement.style.backgroundColor = "#a8d75e";
            } else if (value.air <= 100) {
                quality_std.innerHTML = "良";
                quality_std.parentElement.style.backgroundColor = "#e8ca00";
            } else if (value.air <= 150) {
                quality_std.innerHTML = "轻度污染";
                quality_std.parentElement.style.backgroundColor = "#f67d00";
            } else if (value.air <= 200) {
                quality_std.innerHTML = "中度污染";
                quality_std.parentElement.style.backgroundColor = "#f40000";
            }
        })

        // 今天和明天天气  七日天气
        let date_tem = document.querySelectorAll(".date_tem");
        let w_desc = document.querySelectorAll(".w_desc");
        let w_img = document.querySelectorAll(".w_img");
        let day_weather = document.querySelector(".day_weather");
        my_ajax = new My_ajax(`https://www.tianqiapi.com/free/week?appid=42613675&appsecret=HUBOpdL8&cityid=${loc}`)
        my_ajax.get().then(value => {
            while (day_weather.hasChildNodes()) day_weather.removeChild(day_weather.firstChild);
            let data = value.data
            let weekDay = ["周天", "周一", "周二", "周三", "周四", "周五", "周六"];
            let day_tem = [];
            let night_tem = [];
            for (let i = 0; i < 2; i++) {
                date_tem[i].innerHTML = data[i].tem_day + "/" + data[i].tem_night + "°";
                w_desc[i].innerHTML = data[i].wea;
                w_img[i].src = `images/day/${data[i].wea_img}.png`;
            }
            data.forEach((ele, index) => {
                day_tem.push(ele.tem_day);
                night_tem.push(ele.tem_night);
                let date = new Date(ele.date);
                day_weather.insertAdjacentHTML("beforeend", `<li class="d_item">
            <p class="day">${weekDay[date.getDay()]}</p>
            <p class="date">${ele.date.slice(5)}</p>
            <div class="daytime">
                <p class="d_weather">${ele.wea}</p>
                <img src="images/day/${ele.wea_img}.png" alt="">
            </div>
            <div class="nighttime">
                <p class="d_weather">${ele.wea}</p>
                <img src="images/night/${ele.wea_img}.png" alt="">
            </div>
            <div class="wind">
                <p class="w_dic">${ele.win}</p>
                <p class="w_num">${ele.win_speed}</p>
            </div>
        </li>`)
            })

            let max_tem = Math.max(...day_tem, ...night_tem);
            let min_tem = Math.min(...day_tem, ...night_tem);
            myChart = echarts.init(document.querySelector(".line_chart"));
            let option = {
                xAxis: {
                    boundaryGap: false,
                    type: 'category',
                    show: false
                },
                splitLine: { show: false },
                yAxis: {
                    boundaryGap: true,
                    type: 'value',
                    show: false,
                    interval: 1,
                    min: min_tem - 5,
                    max: max_tem + 5
                },
                grid: {
                    left: '2%',
                    right: '2%',
                    bottom: "0%",
                    containLabel: false
                },
                series: [{
                    data: day_tem,
                    type: 'line',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true
                            },
                            lineStyle: {
                                width: 3//设置线条粗细
                            },
                            color: "#f9b642"
                        }
                    },
                }, {
                    data: night_tem,
                    type: 'line',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true
                            },
                            lineStyle: {
                                width: 3//设置线条粗细
                            },
                            color: '#64c4f9'
                        }
                    }
                }]
            };
            myChart.setOption(option);
        })

        // 逐小时
        /**/
        let weather_container = document.querySelector(".weather_container");
        my_ajax = new My_ajax(`https://v0.yiketianqi.com/api/worldchina?appid=42613675&appsecret=HUBOpdL8&cityid=${loc}`);
        my_ajax.get().then(value => {
            while (weather_container.hasChildNodes()) weather_container.removeChild(weather_container.firstChild);
            let data = value.hours;
            data.forEach((ele, index) => {
                let img;
                if (ele.time.slice(0, 2) >= "20" || ele.time.slice(0, 2) < "07") {
                    img = "night/" + ele.wea_img;
                } else {
                    img = "day/" + ele.wea_img;
                }
                weather_container.insertAdjacentHTML("beforeend", `<li class="h_item">
            <span class="h_time">${ele.time}</span>
            <img src="images/${img}.png" alt="" class="h_img">
            <span class="h_tem">${ele.tem}°</span>
        </li>`)
            })
        })

        // 生活指数
        let rec_box = document.querySelectorAll(".rec_box");
        let description = document.querySelector(".description");
        loc = value.location[0].id;
        my_ajax = new My_ajax(`https://devapi.qweather.com/v7/indices/1d?type=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16&location=${loc}&key=7c4856271d864a2c9ccfcfce9c5aafa4`);
        my_ajax.get().then(value => {
            rec_box.forEach((ele, index) => {
                while (ele.hasChildNodes()) ele.removeChild(ele.firstChild)
            })
            value.daily.forEach((ele, index) => {
                if (index < 8) {
                    rec_box[0].insertAdjacentHTML("beforeend", `<li class="r_item">
                    <img src="images/${ele.name.slice(0, 2)}.png" class="r_icon" alt="">
                    <p class="r_des">${ele.category}</p>
                    <p class="r_det">${ele.name}</p>
                </li>`)
                } else {
                    rec_box[1].insertAdjacentHTML("beforeend", `<li class="r_item">
                    <img src="images/${ele.name.slice(0, 2)}.png" class="r_icon" alt="">
                    <p class="r_des">${ele.category}</p>
                    <p class="r_det">${ele.name}</p>
                </li>`)
                }
            })
            description.innerHTML = value.daily[8].text;
        })
    })
    window.addEventListener("resize", function () {
        myChart.resize();
    })
}

let history_box = document.querySelector(".his_box");
let buildHistory = () => {
    for (let i = 0; i < localStorage.length; i++) {
        let str = `<li class="city opt">${localStorage.getItem(localStorage.length - 1 - i)}</li>`;
        history_box.insertAdjacentHTML("beforeend", str);
    }
}

// 判断是否搜索记录在元素中
let judgeRepeat = (value) => {
    let flag = false;
    for (let key in localStorage) {
        if (value === localStorage[key]) {
            flag = true;
        }
    }
    return flag;
}

let insertToHistoryList = (value, len) => {
    let str = `<li class="city opt">${value}</li>`;
    if (history_box.childNodes.length <= len) {
        history_box.insertAdjacentHTML("afterbegin", str);
    } else { // 删除最后一个
        history_box.removeChild(history_box.lastChild);
        history_box.insertAdjacentHTML("afterbegin", str);
    }
}

let searchHistory = (value) => {
    let len = 8; // 设置历史记录最大储存
    if (!judgeRepeat(value))
        insertToHistoryList(value, len);
    if (localStorage.length < len) {
        localStorage.setItem(localStorage.length, value);
    } else {
        for (let i = 0; i < len; ++i) {
            if (i === len - 1) {
                localStorage.setItem(i, value);
                return;
            }
            let next_value = localStorage.getItem(i + 1);
            localStorage.setItem(i, next_value);
        }
    }
}

// 清除搜索记录
document.querySelector(".clear").addEventListener("click", () => {
    localStorage.clear()
    while (history_box.hasChildNodes()) history_box.removeChild(history_box.firstChild)
})
