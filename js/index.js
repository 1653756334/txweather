createPage();
buildHistory();

// 搜索界面
let position = document.querySelector(".position");
let search_page = document.querySelector(".search_page");
let cancel = document.querySelector(".cancel");
position.addEventListener("click", function () {
    search_page.style.display = "block";
    search_page.style.animationName = "pullDown";
    search_page.style.animationDuration = "0.5s";
})
cancel.addEventListener("click", function () {
    search_page.style.animationName = "pullUp";
    search_page.style.animationDuration = "0.5s";
    search_page.style.animationFillMode = "forwards";
})
// 点击搜索
search_page.addEventListener("click", function (event) {
    if((event.target.classList[1]) === "opt") {
        searchHistory(event.target.innerText);
        cancel.click();
        createPage(event.target.innerText);
    }
})
// 输入搜索
let search = document.querySelector("#search");
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && document.activeElement === search && search.value !== "") {
        searchHistory(search.value);
        cancel.click();
        createPage(search.value);
    }
})

// 底部页面滑动
let rec_container = document.querySelector(".rec_container");
let p_item = document.querySelectorAll(".p_item");
let stX = 0, preX = 0;
rec_container.addEventListener('touchstart', function (e) {
    stX = e.changedTouches[0].clientX;
})
rec_container.addEventListener('touchmove', function (e) {
    // 获取差值
    let dx = e.changedTouches[0].clientX - stX;
    // 设置 ul 在 X 轴上的偏移
    rec_container.style.transform = 'translateX(' + (dx+preX)/2 + 'px)';
    // console.log(dx+preX)
})

let EleWidth = getComputedStyle(rec_container).width;
EleWidth = parseInt(EleWidth.slice(0,EleWidth.length-2))/2;
rec_container.addEventListener('touchend', function (e) {
    // 获取差值
    let dx = e.changedTouches[0].clientX - stX;
    // 记录移动的距离
    if (dx < -(60)) {
        rec_container.style.transform = "translateX("+(-EleWidth)+"px)";
        p_item[1].style.borderColor = "#cecece";
        p_item[0].style.borderColor = "#e3e3e3";
        preX = -EleWidth*2;
    } else if (dx > (60)) {
        rec_container.style.transform = "translateX(0)"
        p_item[0].style.borderColor = "#cecece";
        p_item[1].style.borderColor = "#e3e3e3";
        preX = 0;
    } else {
        if (p_item[0].style.borderColor === "#cecece") {
            rec_container.style.transform = "translateX(0)"
        } else {
            rec_container.style.transform = "translateX("+(-EleWidth)+"px)";
        }
    }
})

