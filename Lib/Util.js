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
    // console.log("------ New Post ------");
    // console.log({
    //     'token': Me.token,
    //     'userid'  : Me.userid,
    // });
    // console.log(formData);
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
     * clear detailed info of current class.
     * Email is kept
     */
    clear() {
        var isMe = this.userid == Me.userid;
        this.userid = "";
        this.username = "";
        this.avatar = "";
        this.motto = "";
        this.passwdtoken = "";
        this.token = "";
        if (isMe) {
            setMeInfoToStorage("", "", this.email);
        }
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
            // console.log("Get User Info:");
            // console.log(data);
            if (state) {
                this.username = data.username;
                this.email = data.email;
                this.avatar = data.imageuri;
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
        let postData = {
            username: this.username,
            // passwdtoken: this.passwdtoken,
        }
        if (this.avatar) {
            postData.imageuri = this.avatar;
        }
        if (this.motto) {
            postData.motto = this.motto;
        }
        HttpPost("/auth/set", postData, (state, data) => {
            if (state) {
                console.log("Set User Info:");
                console.log(data);
                this.username = data.username;
                this.email = data.email;
                this.avatar = data.imageuri;
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
                setMeInfoToStorage("", "", Me.email);
                Me.clear();
                CurrentState = 0;
            }
            console.log(CurrentState);
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
    Me.clear();
    if (!loginInfo.email) {
        callback(false, {errorCode: 51, errorMsg: "Please input your email."});
        return;
    }
    Me.email = loginInfo.email;
    Me.passwdtoken = byMail ? "NYUSHer_by_email_login" : PasswdTokenfy(loginInfo.passwd);

    postData = {
        email: Me.email,
        passwdtoken: Me.passwdtoken,
    };

    if (param == "register") {
        if (byMail) {
            callback(false, {errorCode: 51, errorMsg: "You cannot leave the password empty while registering."});
            return;
        }
        postData.username = postData.email.split("@")[0];
    }

    // Export Debugging Message
    //console.log("Login with: " + `email=${Me.email}&` + `passwdtoken=${Me.passwdtoken}`);

    HttpPost("/auth/" + param, postData, (state, data) => {
        if (state) {
            // console.log(data);
            Me.userid = data.userid;
            Me.token = data.token;
            setMeInfoToStorage(Me.userid, Me.token, Me.email);
            getMe(callback);
        } else {
            CurrentState = 0;
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

export var setMeInfoToStorage = (userid, token, email) => {
    AsyncStorage.setItem("me", JSON.stringify({
        userid: userid,
        token: token,
        email: email
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
        Me.email = myInfoJson.email;
        if (Me.email != "") {
            CurrentState = -1;
            console.log("Load User From Storage.");
            console.log(Me);
        } else {
            CurrentState = 0;
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
