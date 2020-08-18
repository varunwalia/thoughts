const db = require('../Connectors/mysql')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')
// const isAuth = require

let getPosts = (args) => {
    console.log(args)
    return new Promise((resolve, reject) => {
        let sql = `
        SELECT p.*,u.username as username, date_format(p.date,'%a %D %b %Y %H:%i') as postDate
        FROM following f join posts p 
        on (f.follow_who=p.user_id and f.followed_by=${args.user_id})  
        join users u on u.user_id=p.user_id
        UNION 
        SELECT p.* , u1.username as username, date_format(p.date,'%a %D %b %Y %H:%i') as postDate 
        from posts p  
        join users u1 on u1.user_id=p.user_id
        where p.user_id=${args.user_id}
        order by postDate desc;`;
        db.query(sql, (err, results) => {
            if (err) throw(err);
            console.log(results)
            resolve(results);
        });
    });
};

let createPost = (args) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO  posts set ?`;
        db.query(sql, args , (err, results) => {
            if (err) throw(err);
            resolve(results);
        });
    });
};

let createUser = (args) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO  users set ?`;
        db.query(sql, args , (err, results) => {
            if (err) throw(err);
            resolve(results);
        });
    });
};

let getUser = (email) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM users where email='${email}'`;
        db.query(sql, (err, results) => {
            if (err) throw(err);
            resolve(results);
        });
    });
};


let getFollowers = () => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT u1.username as followed_by, u2.username as follow_who 
        FROM following f 
        join users u1 on f.followed_by=u1.user_id 
        join users u2 on f.follow_who=u2.user_id`;
        db.query(sql, (err, results) => {
            if (err) throw(err);
            resolve(results);
        });
    });
};


let followUser = (args) => {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO  following set ?`;
        db.query(sql, args , (err, results) => {
            if (err) throw(err);
            resolve(results);
        });
    });
};


let unfollowUser = (args) => {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM following where followed_by=${args.followed_by} and follow_who=${args.follow_who}`;
        db.query(sql, args , (err, results) => {
            if (err) throw(err);
            resolve(results);
        });
    });
};


let getUsersToFollow = (userId) => {
    return new Promise((resolve , reject)=>{
        console.log(userId)
        let sql = `Select * from users where user_id!=${userId} and user_id 
         not in ( SELECT distinct f.follow_who 
            from users u 
            join
            following f on f.followed_by=${userId});
        `
        db.query(sql,(err,results)=>{
            if (err) throw err;
            resolve(results);
        })
    })
}

module.exports = {
    posts: (args,req )=>{
        if (!req.isAuth){
            throw new Error("Unauthenticated")
        }
        console.log(req.userId)
        return  getPosts(args).then((rows)=> rows).catch(err=>{throw err});
    },
    following: (args,req)=>{
        if (!req.isAuth){
            throw new Error("Unauthenticated")
        }
        return getFollowers().then((rows)=> rows).catch(err=>{throw err});
    },
    createPost :  async (args,req) =>{
        if (!req.isAuth){
            console.log("We are  here" , req  , req.isAuth)
            throw new Error("Unauthenticated")
        }
        const post ={
            user_id: args.postInput.user_id,
            title: args.postInput.title,
            description: args.postInput.description,
        } 
        return createPost(post).then(()=> post ).catch(err=> {throw err})
    },

    createUser:  async (args) =>{
        let user = await getUser(args.userInput.email)  // returns a raw data object
        const ll = JSON.stringify(user);
        user = JSON.parse(ll) 
        if (user[0]){
            throw new Error("User Already Exist")
        }
        return bcrypt
        .hash(args.userInput.password  , 12)
        .then(async (hashedPassword)=>{
            const user ={
                username: args.userInput.username,
                email: args.userInput.email,
                password: hashedPassword
                } 
            await createUser(user)
            return user;
        })
        .catch(err => {
            throw err
        })
    },

    login:  async ({email , password}) =>{
        let user = await getUser(email)  // returns a raw data object
        const ll = JSON.stringify(user);
        user = JSON.parse(ll) 
        if (!user[0]){
            throw new Error("User Doesn't Exist")
        }
        const isEqual = await bcrypt.compare(password , user[0].password)
        if (!isEqual){
            throw new Error("Password is wrong!")
        }
        const token = jwt.sign({userId: user[0].user_id ,  email: user[0].email} , 
            'somesupersecretkey' , 
            {expiresIn: '1h'});
        return {userId: user[0].user_id , token:token , tokenExpiration:1}
    },

    followUser: (args , req) =>{
        if (!req.isAuth){
            throw new Error("Unauthenticated")
        }
        const follow = {
            followed_by: args.followInput.followed_by,
            follow_who: args.followInput.follow_who
        }
        return followUser(follow).then(()=> follow ).catch(err=> {throw err})
    },
    unfollowUser: (args , req) =>{
        if (!req.isAuth){
            throw new Error("Unauthenticated")
        }
        const follow = {
            followed_by: args.followInput.followed_by,
            follow_who: args.followInput.follow_who
        }
        console.log(follow)
        return unfollowUser(follow).then(()=> {return } ).catch(err=> {throw err})
    },

    users: (args,req) => {
        if (!req.isAuth){
            throw new Error("Unauthenticated")
        }
        return getUsersToFollow(req.userId).then((rows)=>rows).catch(err=> {throw err})
    }
}



// SELECT p.*,u.username as username, date_format(p.date,'%a %D %b %Y %H:%i') as postDate
//         FROM following f join posts p 
//         on (f.follow_who=p.user_id and f.followed_by=7)  
//         join users u on u.user_id=p.user_id
//         UNION 
//         SELECT p.* , u1.username as username, date_format(p.date,'%a %D %b %Y %H:%i') as postDate 
//         from posts p  
//         join users u1 on u1.user_id=p.user_id
//         where p.user_id=7
//         order by postDate desc;