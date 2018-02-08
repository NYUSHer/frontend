import { AsyncStorage, Alert } from 'react-native';
import { GlobalFuncs } from './SubComponents.js';
import Forge from 'node-forge';

export const BASEURL = "http://nyusher.nya.vc:8080";
export var Me = null;

/*
 * -1: processing
 *  1: login success
 *  0: no login
 */
export var CurrentState = 0;

/*
 * turn passwd into token
 */
export var PasswdTokenfy = (passwd) => {
    var md = Forge.md.md5.create();
    md.update(passwd);
    return md.digest().toHex();
}

/*
 * email check
 * Return whether the email address is valid
 */
export var EmailOfflineValidationCheck = (email) => {
    var reg = /^\w+([-_.]?\w+)*@\w+([\\.-]?\\w+)*(\.\w{2,6})+$/;
    return (email.match(reg) != null);
}

/*
 * password check
 * Return whether the password is valid
 */
export var PasswdOfflineValidationCheck = (passwd) => {
    var reg = /^[\w]{6,20}$/;
    if (passwd.length <= 0) return true;
    else return (passwd.match(reg) != null);
}

/*
 * Global Token-With Http Post Func
 */
export var HttpPost = (route, data, callback) => {
    let formData = new FormData();
    for (var k in data) {
        formData.append(k, data[k]);
    }
    fetch(`${BASEURL}${route}`, {
        method: 'POST',
        headers: {
            'token': Me.token,
            'userid'  : Me.userid,
        },
        body: formData,
    }).then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.state) {
            callback(true, jsonData.data);
        } else {
            callback(false, jsonData.error);
        }
    }).catch((error)=> {
        console.log("get Error:");
        console.log(error);
        callback(false, {errorCode: -1, errorMsg: "Network Error."});
    });
}

export async function AsyncHttpPost(route, data) {
    try {
        let response = await fetch(`${BASEURL}${route}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'token': Me.token,
                'userid'  : Me.userid,
            },
            body: JSON.stringify(data),
        });
        let jsonData = await response.json(); 
        return jsonData;
    } catch (error) {
        return {
            state: false,
            error: {
                errorCode: -1,
                errorMsg: "Network Error.",
            }
        }
    }
};

export class User {
    
    /*
     * init user, if with userid, then fetch the userinfo from server.
     */
    constructor(userid="") {
        this.init();
        if (userid) {
            this.userid = userid;
            this.fetchInfo();
        }
    }

    /*
     * init current class.
     */
    init() {
        this.userid = "";
        this.username = "";
        this.email = "";
        this.avatar = "";
        this.motto = "";
        this.passwdtoken = "";
        this.token = "";
    }

    /*
     * fetch the userinfo from server.
     */
    fetchInfo(callback) {
        if (!this.userid) {
            callback(false, "Unknown User.");
            return;
        }
        HttpPost("/auth/info", {
            userid: this.userid,
        }, (state, data) => {
            if (state) {
                this.username = data.username;
                this.email = data.email;
                this.avatar = data.avatar;
                this.motto = data.motto;
                callback(true, this);
            } else {
                callback(false, data);
            }
        });
    }

    /*
     * update userinfo to server.
     */
    setInfo(callback) {
        if (this.userid != Me.userid) {
            callback(false, "Illegal Operation.");
            return;
        }
        HttpPost("/auth/set", {
            username: this.username,
            avatar: this.avatar,
            motto: this.motto,
            passwdtoken: this.passwdtoken,
        }, (state, data) => {
            if (state) {
                this.username = data.username;
                this.email = data.email;
                this.avatar = data.avatar;
                this.motto = data.motto;
                if (data.hasOwnProperty('token')) this.token = data.token;
                callback(true, this);
            } else {
                callback(false, data);
            }
            
        });
    }
}

/*
 * Error Code:
 *      101: Token 无效
 *      102: E-mail 登录未验证
 *      103: userid 对应的用户不存在
 */
export var getMe = (callback) => {
    if (!Me.userid || !Me.token) return;
    Me.fetchInfo((state, data) => {
        if (state) {
            CurrentState = 1;
            if (GlobalFuncs.globalDashboardUF != null) {
                GlobalFuncs.globalDashboardUF();
            }
            callback(true, data);
        } else {
            CurrentState = -1;
            if (data.errorCode != 102) {
                setMeInfoToStorage("", "");
                Me.init();
                CurrentState = 0;
            }
            callback(false, data);
        }
    })
}

/*
 * 51: empty email
 * 52: invalid email
 * 53: non-nyu email
 */
export var login = (loginInfo, callback, byMail = false, param="login") => {
    Me.init();
    if (!loginInfo.email) {
        callback(false, {errorCode: 51, errorMsg: "Please input your email."});
        return;
    }
    Me.email = loginInfo.email;
    Me.passwdtoken = byMail ? "byMailLogin" : PasswdTokenfy(loginInfo.passwd);

    // Export Debugging Message
    //console.log("Login with: " + `email=${Me.email}&` + `passwdtoken=${Me.passwdtoken}`);

    HttpPost("/auth/" + param, {
        email: Me.email,
        passwdtoken: Me.passwdtoken,
    }, (state, data) => {
        if (state) {
            console.log(data);
            Me.userid = data.userid;
            Me.token = data.token;
            setMeInfoToStorage(Me.userid, Me.token);
            getMe(callback);
        } else {
            callback(false, data);
        }
    });
}

export var checkEmail = (email, callback) => {
    HttpPost("/auth/check", {
        email: email,
    }, (state, data) => {
        callback(state, data);
    });
}

export var setMeInfoToStorage = (userid, token) => {
    AsyncStorage.setItem("me", JSON.stringify({
        userid: userid,
        token: token,
    }), (error) => {
        // Nothing
    });
}

export async function getMeInfoFromStorage (callback) {
    try {
        let myInfo = await AsyncStorage.getItem("me");
        let myInfoJson = JSON.parse(myInfo);
        Me.userid = myInfoJson.userid;
        Me.token = myInfoJson.token;
        if (Me.userid != "" && Me.token != "") {
            CurrentState = -1;
            console.log("Load User From Storage.");
            console.log(Me);
        } else {
            console.log("No Local User Found.");
            Me.init();
        }
    } catch (error) {
        // Export Debugging Message
        console.log("No Local User Found.");
        Me.init();
    }
    callback();
}

Me = new User();
