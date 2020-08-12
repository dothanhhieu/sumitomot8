import url from './defEnvAPI'

var ObjectHeader = {
    "Content-Type": "application/json"
};

//---- Login ------
export function login(obj) {
    let urlLogin = `${url}/api/account/login`
    console.log(urlLogin)
    return fetch(urlLogin, {
        method: "POST",
        headers: ObjectHeader,
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .then(resjson => resjson);
};

export const postUploadImageAPI = (data) =>{
    console.log(data)
    let urlPostImage = `http://file.tengroup.com.vn/api/file/upload`
    return fetch(urlPostImage, {
        method: "POST",
        eaders:  {'Content-Type': 'multipart/form-data'},
        body: data
    })
        .then(res => res.json())
        .then(resjson => resjson);
}

//---- Get Event ID ------
export function getListEventDetail(userID, roleID) {
    console.log("http://wgs9api.tengroup.com.vn/api/province/listprovincedistrictward?eventID=1&code=" + id)

    return fetch("http://wgs9api.tengroup.com.vn/api/detailevent/listdetailevents?userID=+" + userID + "&roleID=" + roleID, {
        method: "GET",
        headers: ObjectHeader,
    })
        .then(res => res.json())
        .then(resjson => resjson);
};

//---- User Profile -----
export function getProfile(eventID, userID) {
    console.log("http://wgs9api.tengroup.com.vn/api/account/profile?eventID=" + eventID + "&userID=" + userID)
    return fetch("http://wgs9api.tengroup.com.vn/api/account/profile?eventID=" + eventID + "&userID=" + userID, {
        method: "GET",
        headers: ObjectHeader,
    })
        .then(res => res.json())
        .then(resjson => resjson);
};

//---- List Outlet -----
export function getListOutlet(eventId, userId, roleId, keyWord) {
    console.log("http://wgs9api.tengroup.com.vn/api/store/liststores?eventID=" + eventId + "&userID=" + userId + "&roleID=" + roleId + '&keyword=' + keyWord)
    return fetch("http://wgs9api.tengroup.com.vn/api/store/liststores?eventID=" + eventId + "&userID=" + userId + "&roleID=" + roleId + '&keyword=' + keyWord, {
        method: "GET",
        headers: ObjectHeader,
    })
        .then(res => res.json())
        .then(resjson => resjson);
};

//---- Create Store -----
export function createStore(obj) {
    console.log(obj)
    let urlCreateStore = `${url}/api/store/createstore`

    return fetch(urlCreateStore, {
        method: "POST",
        headers: ObjectHeader,
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .then(resjson => resjson);
};

//---- List Store -----
export function getListStore(eventId, userId, roleId, keyword) {
    console.log("http://apisumitomot82020.tengroup.com.vn/api/store/liststores?eventID=" + eventId + "&userID=" + userId + "&roleID=" + roleId + "&keyword=" + keyword)
    return fetch("http://apisumitomot82020.tengroup.com.vn/api/store/liststores?eventID=" + eventId + "&userID=" + userId + "&roleID=" + roleId + "&keyword=" + keyword, {
        method: "GET",
        headers: ObjectHeader,
    })
        .then(res => res.json())
        .then(resjson => resjson);
};

//---- Post Info -----
export function postInfo(obj) {
    let urlPostInfo = `${url}/api/event/postinfomation`
    console.log(urlPostInfo)
    return fetch(urlPostInfo, {
        method: "POST",
        headers: ObjectHeader,
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .then(resjson => resjson);
};

//---- Post Done Button -----
export function postSuccessPakage(obj) {
    let urlPostInfo = `${url}/api/event/successpakage`
    console.log(urlPostInfo)
    return fetch(urlPostInfo, {
        method: "POST",
        headers: ObjectHeader,
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .then(resjson => resjson);
};










//---- List District, Ward, Street -----
export function getDistrictWard(id) {
    return fetch("http://wgs9api.tengroup.com.vn/api/province/listprovincedistrictward?eventID=1&province=1&district=" + id, {
        method: "GET",
        headers: ObjectHeader,
    })
        .then(res => res.json())
        .then(resjson => resjson);
};

export function getStreet(id) {
    return fetch("http://wgs9api.tengroup.com.vn/api/province/liststreet?eventID=1&province=1&district=" + id, {
        method: "GET",
        headers: ObjectHeader,
    })
        .then(res => res.json())
        .then(resjson => resjson);
};



//---- Post Image -----
export function postImage(obj) {
    console.log(obj)
    console.log("http://wgs9api.tengroup.com.vn/api/event/postimagestring")
    return fetch("http://wgs9api.tengroup.com.vn/api/event/postimagestring", {
        method: "POST",
        headers: ObjectHeader,
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .then(resjson => resjson);
};