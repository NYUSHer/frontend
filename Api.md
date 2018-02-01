# Server API

## Current Version
 - v1

## Callback Standard

### Return Standard
```javascript
{
    state: true || false,
    ....,
    timestamp: ...,
}

// True State
{
    state: true,
    data: {
        ...
    },
    timestamp: ...,
}

// Dalse State
{
    state: false,
    error: {
        errorCode: ...,
        errorMsg: "...",
    },
    timestamp: ...,
}
```

### Transmission Standard

 - HTTP POST with SSL

## Non-Authorized Code

    不需要 Token 也可以调用, *代表可选内容, 斜体表示斜体选项之内任选一个.

### /user/login

#### params

- *email*
- *username*
- passwdtoken

#### data

- userid
- email
- username
- token

### /user/register

#### params

 - email
 - username
 - passwdtoken

#### data

- userid
- email
- username
- token

### /user/avatar

#### params

- *email*
- *username*
- *userid*

#### return

- imageuri

### /user/info

#### params

- *email*
- *username*
- *userid*

#### return
- email
- username
- token
- imageuri
- morto
...

## Authorized Code

    必须要登录之后才能执行, 否则拒绝 request

##### 必传参数

 - userid
 - token

### /post/list

#### params

 - *offset(=0)
 - *size(=10)


#### data

 - offset
 - size
 - count
 - postlist

```javascript
postlist.each => {
        pid: ,
        title: ,
        content: ,
        author: ,
        img: ,
    }
```

### /post/submit

#### params

 - title
 - category
 - tags
 - content
 - *pid

`如果 pid 被指定, 代表对 post 进行修改, 此时应检查 userid 是否为 authorid`

#### data

 - pid

### /post/get

#### params

 - pid

#### data
 - pid
 - title
 - category
 - tags
 - content

### /post/delete

#### params

 - pid

#### nodata

### /comment/get

#### params

 - pid
 - *offset(=0)
 - *size(=10)

#### data

 - offset
 - size
 - count
 - postlist

```javascript
postlist.each => {
        pid: ,
        uid: ,
        cid: ,
        content: ,
        user: [the /user/get object],
        floor: [0 represents comment, else represents replies],
    }
```

### /comment/add

#### params

 - pid
 - *cid(=-1) `[-1 means the post, else means cid]`
 - content

#### nodata
