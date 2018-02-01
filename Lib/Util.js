import { AsyncStorage } from 'react-native';

export const BASEURL = "https://nyusher.nya.vc";
export var Me = null;

/*
 * -1: processing
 *  1: login success
 *  0: no login
 */
export var CurrentState = 0;

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
     * init user, if with id, then fetch the userinfo from server.
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
        if (this.id != Me.id) {
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
    if (!Me.id || !Me.token) return;
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

export var login = (loginInfo, callback, byMail = false) => {
    Me.init();
    Me.email = loginInfo.email;
    Me.passwdtoken = byMail ? "NYUSHer_by_email_login" : loginInfo.passwdtoken;

    HttpPost("/user/login", {
        email: loginInfo.email,
        passwdtoken: byMail ? "NYUSHer_by_email_login" : loginInfo.passwdtoken,
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

export var setMeInfoToStorage = (uid, token) => {
    AsyncStorage.setItem("me", JSON.stringify({
        uid: uid,
        token: token,
    }), (error) => {
        // Nothing
    });
}

export async function getMeInfoFromStorage (uid, token) {
    try {
        let myInfo = await AsyncStorage.getItem("me");
        let myInfoJson = JSON.parse(myInfo);
        Me.uid = myInfoJson.uid;
        Me.token = myInfoJson.token;
        CurrentState = -1;
    } catch (error) {
        Me.init();
    }
}

Me = new User();
getMeInfoFromStorage();
getMe();