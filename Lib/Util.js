import { AsyncStorage, Alert } from 'react-native';
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
    fetch(`${BASEURL}${route}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'token': Me.token,
            'uid'  : Me.uid,
        },
        body: JSON.stringify(data),
    }).then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.state) {
            callback(true, jsonData.data);
        } else {
            callback(false, jsonData.error);
        }
    }).catch((error)=> {
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
                'uid'  : Me.uid,
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
     * init user, if with uid, then fetch the userinfo from server.
     */
    constructor(uid="") {
        this.init();
        if (uid) {
            this.uid = uid;
            this.fetchInfo();
        }
    }

    /*
     * init current class.
     */
    init() {
        this.uid = "";
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
        if (!this.uid) {
            callback(false, "Unknown User.");
            return;
        }
        HttpPost("/user/info", {
            uid: this.uid,
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
        if (this.uid != Me.uid) {
            callback(false, "Illegal Operation.");
            return;
        }
        HttpPost("/user/set", {
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
 *      103: uid 对应的用户不存在
 */
export var getMe = (callback) => {
    if (!Me.uid || !Me.token) return;
    Me.fetchInfo((state, data) => {
        if (state) {
            CurrentState = 1;
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
    Me.passwdtoken = byMail ? "NYUSHer_by_email_login" : PasswdTokenfy(loginInfo.passwd);

    // Export Debugging Message
    console.log("Login with: " + `email=${Me.email}&` + `passwdtoken=${Me.passwdtoken}`);

    HttpPost("/user/" + param, {
        email: Me.email,
        passwdtoken: Me.passwdtoken,
    }, (state, data) => {
        if (state) {
            Me.uid = data.uid;
            Me.token = data.token;
            setMeInfoToStorage(Me.uid, Me.token);
            getMe(callback);
        } else {
            callback(false, data);
        }
    });
}

export var checkEmail = (email, callback) => {
    HttpPost("/user/check", {
        email: email,
    }, (state, data) => {
        callback(state, data);
    });
}

export var setMeInfoToStorage = (uid, token) => {
    AsyncStorage.setItem("me", JSON.stringify({
        uid: uid,
        token: token,
    }), (error) => {
        // Nothing
    });
}

export async function getMeInfoFromStorage (callback) {
    try {
        let myInfo = await AsyncStorage.getItem("me");
        let myInfoJson = JSON.parse(myInfo);
        Me.uid = myInfoJson.uid;
        Me.token = myInfoJson.token;
        if (Me.uid != "" && Me.token != "") {
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
