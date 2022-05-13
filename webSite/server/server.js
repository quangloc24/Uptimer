const Discord = require("discord.js");
const https = require("https");
const path = require("path");
const express = require("express")
const validator = require("validator");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const UrlsConfig = require("./../../database/models/UrlsConfig");
const cookieParser = require("cookie-parser");
const fetch = require("node-fetch");
const csrf = require("csurf");
const ejs = require("ejs");
const passport = require("passport");
const Strategy = require("passport-discord").Strategy;
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const rate_limit = require("express-rate-limit");
const helmet = require("helmet");
const { Permissions } = require("discord.js");
const config = require("../config/config");
const config_json = require("./config.json");
const app = express();
const url = require("url");
const db = require(`quick.db`);
const uptimedata = require("../database/models/Links.js");
module.exports = (client) => {

  const bot = client;
  
  const port = process.env.PORT || client.config.api.SitePORT;
  process.env.SESSION_SECRET = "bfksfysa7e32kdhayu292sz";
  for (let i = 0; i <= 15; i++) {
    process.env.SESSION_SECRET += Math.random().toString(16).slice(2, 8).toUpperCase().slice(-6) + i;
  }
  app.set("view engine", "html");
  app.engine("html", ejs.renderFile);
  app.set("views", path.join(process.cwd(), "src", "views"));
  app.use("/css", express.static(path.join(__dirname, "../public/css")));
  app.use("/vendor", express.static(path.join(__dirname, "../public/vendor")));
  app.use("/js", express.static(path.join(__dirname, "../public/js")));
  app.use("/img", express.static(path.join(__dirname, "../public/images")));
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));
  passport.use(
    new Strategy(
      {
        clientID: process.env.ID || client.config.api.botID,
        clientSecret: process.env.SECRET || client.config.api.botSECRET,
        callbackURL: process.env.CALLBACKURL || client.config.api.CallbackLink,
        scope: ["identify", "guilds", "guilds.join"],
      },
      (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile));
      }
    )
  );
  const limiter = rate_limit({
    windowMs: 60 * 1000, // 1 minute
    max: 30,
  });
  // app.use(limiter);
  app.use((req, res, next) => {
    res.setHeader("Permissions-Policy", "	accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()");
    res.removeHeader("replit-cluster");
    res.removeHeader("x-powered-by");
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  /* app.use(
   session({
    cookie: {
     expires: expire_date,
     secure: true,
     maxAge: expire_date,
    },
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
   })
  ); */

  /*app.use(
   session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
   })
  );*/
  const expire_date = 1000 * 60 * 60 * 24; // 1 day
  const sessionStore = new MemoryStore({
    checkPeriod: expire_date,
  });
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  const csrfProtection = csrf({ cookie: true });
  function current_time() {
    let current = new Date();
    let cDate = current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + " " + cTime;
    return dateTime;
  }
  app.use(express.static(path.join(__dirname, "/public")));

  app.get(
    "/login",
    async (req, res, next) => {
      if (req.session.backURL) {
        req.session.backURL = req.session.backURL;
      } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.path;
        }
      } else {
        req.session.backURL = "/";
      }
      next();
    },
    passport.authenticate("discord", { prompt: "none" })
  );

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
  };

  app.get(
    "/callback",
    passport.authenticate("discord", {
      failureRedirect: "/",
    }),
    async (req, res) => {
      let maintanance = false;
      if (maintanance) {
        req.session.destroy();
        res.json({ login: false, message: "Website is currently on maintanance", logout: true });
        req.logout();
      } else {
         res.redirect(req.session.backURL || '/')
        
        
      }
    }
  );


  app.get("/", async (req, res) => {
    res.render(""+process.cwd()+"/webSite/views/index.ejs", {
      team: config.teams,
      botClient: client,
      user: req.user,
    });
  });

  app.get("/logout", function (req, res) {
    req.session.destroy(() => {
        
        
      req.logout();
      res.redirect("/");
      
    });
  });


   app.get("/team", (req, res) => {
    res.render(""+process.cwd()+"/webSite/views/team.ejs", {
      team: config.teams,
      bot: client,
      botClient: client,
      user: req.user,
    });
  });

   app.get("/profile", checkAuth, async (req, res) => {
     let uptimes = await uptimedata.find({ userID: req.user.id });
     client.users.fetch(req.user.id).then(async a => {
    res.render(""+process.cwd()+"/webSite/views/profile.ejs", {
      bot: client,
      uptimes,
      botClient: client,
      user: req.user,
      member: a,
    });
     })
  });

  app.get("/error", async (req, res) => {
    res.render(""+process.cwd()+"/webSite/views/error.ejs", {
      errormsg: req.query.message ? req.query.message : "Unexpected error!",
      errorcode: req.query.code ? req.query.code : 404,
      errordetail: req.query.detail ? req.query.detail : "An error occurred while viewing this page!",
    });
  });

  app.get("/monitor", checkAuth, async (req, res) => {
      let uptimes = await uptimedata.find({ userID: req.user.id });
      bot.users.fetch(req.user.id).then(async a => {
        res.render(""+process.cwd()+"/webSite/views/addmonitor.ejs", {
          bot,
          user: req.user,
          config,
      botClient: client,
          title: "Monitor",
          member: a
        });
      })
    });

    app.get(
      "/monitor/:code/delete",
      checkAuth,
      async (req, res) => {
        const dde = await uptimedata.findOne({ code: req.params.code });
        if (!dde)
          return res.redirect(
            "/profile?error=true&message=There is no such site in the system."
          );
        uptimedata.findOne({ code: req.params.code }, async function(err, docs) {
          if (docs.userID != req.user.id)
            return res.redirect(
              "/profile?error=true&message=The link you tried to delete does not belong to you."
            );
          res.redirect(
            "/profile?success=true&message=The link has been successfully deleted from the system."
          );

          await uptimedata.deleteOne({ code: req.params.code });
          await UrlsConfig.findOneAndDelete(
            { projectURL: req.params.code }
          );
        });
      }
    );



  app.post("/monitor", checkAuth, async (req, res) => {
      
      const rBody = req.body;
      if (!rBody["link"]) {
        res.redirect("?error=true&message=Write a any link.");
      } else {
        if (!rBody["link"].match("https"))
          return res.redirect("?error=true&message=You must enter a valid link.");
        const updcode = makeidd(5);
        const dde = await uptimedata.findOne({ link: rBody["link"] });
        const dd = await uptimedata.find({ userID: req.user.id });
        if (dd.length > 80)
          res.redirect("?error=true&message=Your uptime limit on the website has reached.");

        if (dde)
          return res.redirect(
            "?error=true&message=This link already exists in the system."
          );
        bot.users.fetch(req.user.id).then(async (a) => {
          new uptimedata({
            userName: a.username,
            userID: req.user.id,
            link: rBody["link"],
            code: updcode
          }).save();
          
          await UrlsConfig.create({
        authorID: req.user.id,
        projectURL: rBody["link"],
        pinged: 0,
      }).then(async () => {
        
        client.projects.push(rBody["link"]);
          });
        });
        res.redirect(
          "?success=true&message=Your link has been successfully added to the uptime system."
        );
      }
      })

  app.get("*", function (req, res) {
    res.status(404).render(""+process.cwd()+"/webSite/views/404.ejs");
  });

  app.listen(port, () => {
    
  });
  function makeidd(length) {
      var result = "";
      var characters =
        "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
};
/* ============================================== */
/* ⭐ Azury Manager • Private • Server Manager ⭐ */
/* Coded by discord.gg/azury Copyrighted @ Azury  */
/* ============================================== */