// Player.js
var Player = pc.createScript('player');
Player.attributes.add('skin', { type: 'number', default: 1 });

Player.attributes.add('speed', { type: 'number', default: 2 });
Player.attributes.add('cameraEntity', { type: 'entity', default: false });

Player.attributes.add('rightWall', { type: 'number', default: 2.2 });
Player.attributes.add('leftWall', { type: 'number', default: -2.2 });
Player.attributes.add('topWall', { type: 'number', default: 1.39 });
Player.attributes.add('bottomWall', { type: 'number', default: -1.01 });
Player.attributes.add('isGround', { type: 'boolean', default: false });
Player.attributes.add('isJump', { type: 'boolean', default: false });




// initialize code called once per entity
Player.prototype.initialize = function () {
    this.touchpos = new pc.Vec3();
    this.touchInit();
    this.addBtnListenWithOuterHtml();
    this.coords = new pc.Vec3();
    this.camera = this.app.root.findByName('Camera').camera;

    var touch = this.app.touch;
    if (touch) {
        touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
    }

    this.on('destroy', function () {
        touch.off(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        touch.off(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
    }, this);
};

Player.prototype.touchInit = function () {
    this.isTouch = false;
    this.isTouchJump = false;
    this.isLeftTouch=false;
    this.isRightTouch=false;
    this.isUpTouch=false;
    this.isZTouch=false;
    this.isXTouch=false;
    this.isCTouch=false;
    this.isVTouch=false;
    this.isATouch=false;
    this.isSTouch=false;
};

// update code called every frame
Player.prototype.update = function (dt) {
    this.move(dt);
    this.checkjumpGround(dt);
    this.checkBound(dt);
    if (this.isTouch) {
        this.touchMove(dt);
    }
};

Player.prototype.touchMove = function (dt) {

    if (this.touchpos.x < 0) {
        this.entity.translate(-this.speed * dt, 0, 0);
    }
    if (this.touchpos.x > 0) {
        this.entity.translate(this.speed * dt, 0, 0);
    }
    if (this.isTouchJump && this.isGround) {
        this.isJump = true;
        this.isGround = false;
    }

};

Player.prototype.onTouchStart = function (event) {
    this.isTouch = true;
    if (event.touches.length === 1) {
        this.cameraEntity.camera.screenToWorld(event.touches[0].x, event.touches[0].y, 4, this.touchpos);
        console.log(this.touchpos.x + "  " + this.touchpos.y);
    }
    if (event.touches.length === 2) {
        this.isTouchJump = true;
    }

    event.event.preventDefault();
};


Player.prototype.onTouchEnd = function (event) {
    this.isTouch = false;
    this.isTouchJump = false;
    event.event.preventDefault();
};


Player.prototype.move = function (dt) {
    var left = this.app.keyboard.isPressed(pc.KEY_LEFT);
    var right = this.app.keyboard.isPressed(pc.KEY_RIGHT);
    var up = this.app.keyboard.isPressed(pc.KEY_UP);
    var down = this.app.keyboard.isPressed(pc.KEY_DOWN);
    if (left || this.isLeftTouch) {
        this.entity.translate(-this.speed * dt, 0, 0);
    }
    if (right || this.isRightTouch) {
        this.entity.translate(this.speed * dt, 0, 0);
    }
    if ((up && this.isGround) || (this.isUpTouch && this.isGround)) {
        this.isJump = true;
        this.isGround = false;
    }
    if (down) {
        this.entity.translate(0, -this.speed * dt, 0);
    }
};

Player.prototype.checkjumpGround = function (dt) {
    let p = this.entity.getPosition();

    if (this.isJump) {
        this.entity.translate(0, this.speed * dt * (this.bottomWall - p.y + 2.2), 0);
        if (p.y > -0.4) {
            this.isJump = false;
        }

    }

    if (!this.isGround && !this.isJump) {
        this.entity.translate(0, -this.speed * dt, 0);
        if (p.y < this.bottomWall + 0.01) {
            this.entity.setPosition(p.x, (p.y - this.topWall + 2.2), p.z);
            this.isGround = true;
            this.entity.setPosition(p.x, this.bottomWall, p.z);
        }
    }
};

Player.prototype.checkBound = function (dt) {
    let p = this.entity.getPosition();

    if (p.x < this.leftWall) {
        this.entity.setPosition(this.leftWall + 0.001, p.y, p.z);
    }
    if (p.x > this.rightWall) {
        this.entity.setPosition(this.rightWall - 0.001, p.y, p.z);
    }
    if (p.y > this.topWall) {
        this.entity.setPosition(p.x, this.topWall - 0.001, p.z);
    }
    if (p.y < this.bottomWall) {
        this.entity.setPosition(p.x, this.bottomWall, p.z);
    }
};

class longBtn {
	constructor(id, arg,p) {
		this.event_listener(id);
		this.arg = arg;
        this.p = p;
	}

	mDown = () => {
        let code = `p.${this.arg} = true`;
        Function("p",code)(this.p);
	};

	mUp = () => {
        let code = `p.${this.arg} = false`;
        Function("p",code)(this.p);
	};

	event_listener = (id) => {
        let btn = document.getElementById(id);
        if(btn){
            btn.addEventListener("mousedown", this.mDown);
            btn.addEventListener("mouseup", this.mUp);
            btn.addEventListener("touchstart", this.mDown);
            btn.addEventListener("touchend", this.mUp);
        }
	};
}


Player.prototype.addBtnListenWithOuterHtml = function () {
    
	this.htmlRightBtn = new longBtn("Right", "isRightTouch",this);
    this.htmlLeftBtn = new longBtn("Left", "isLeftTouch",this);
    this.htmlLeftBtn = new longBtn("Up", "isUpTouch",this);
};

// Network.js
var Network = pc.createScript('network');
Network.attributes.add('skin', { type: 'number', default: 1 });
Network.attributes.add('player', { type: 'entity' });
Network.attributes.add('emoji', { type: 'entity' });
Network.attributes.add('other', { type: 'entity' });
Network.attributes.add('name', { type: 'string', default: "noName" });
// Network.attributes.add('players', { type:'object' });
Network.attributes.add('prePos', { type: 'vec3' });
// static variables
Network.id = null;
Network.socket = null;
Network.name = null;

class Character {
    constructor(id, name, x, y, entity) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = 0;
        this.entity = entity;
        this.skin = 1;
        this.skinTimeout = null;
    }
}

// initia   lize code called once per entity
Network.prototype.initialize = function () {
    this.timeout = null;
    const params = new URLSearchParams(window.location.search);
    if (params.has("name")) {
        this.name = params.get("name");
    }
    this.player.children[0].children[0].element.text = this.name;
    this.addBtnListenWithOuterHtml();
    if (params.has("skin")) {
        this.skin = parseInt(params.get("skin"), 10);
    }
    console.log(this.skin);
    this.player.sprite.play("Clip " + (this.skin % 12 + 1));
    const socket = new WebSocket("wss://pixel-art-gan-2-d4tkwrdpmq-uc.a.run.app/");
    Network.socket = socket;
    this.players = new Map();
    this.prePos = this.player.getPosition();
    
    this.emojiEnable = () => {
        this.emoji.enabled = true;
    };
    this.emojiDisable = () => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => { this.emoji.enabled = false; }, 1000);
    };
    var self = this;

    let event = {
        "type": "initialize",
        "name": this.name,
        "skin": this.skin
    };
    socket.addEventListener('open', function () {
        socket.send(JSON.stringify(event));
    });


    socket.addEventListener("message", ({ data }) => {
        const event = JSON.parse(data);

        switch (event.type) {
            case "playerMoved":
                self.movePlayer(event);
                break;
            case "playerJoined":
                console.log(`${event.player.name} is online!`);
                self.addPlayer(event);
                break;
            case "playerData":
                self.initializePlayers(event);
                break;
            case "killPlayer":
                self.removePlayer(event);
                break;
            case "emoji":
                self.emojiPlayer(event);
                break;
            default:
                throw new Error(`Unsupported event type: ${event.type}.`);
        }
    });
};


// update code called every frame
Network.prototype.update = function (dt) {
    if (this.app.keyboard.wasPressed(pc.KEY_Z) || this.isZTouch) {
        this.showEmoji("sleep");
    }
    if (this.app.keyboard.wasPressed(pc.KEY_X) || this.isXTouch) {
        this.showEmoji("suprise");
    }
    if (this.app.keyboard.wasPressed(pc.KEY_C) || this.isCTouch) {
        this.showEmoji("heart");
    }
    if (this.app.keyboard.wasPressed(pc.KEY_V) || this.isVTouch) {
        this.showEmoji("facepalm");
    }
    if (this.app.keyboard.wasPressed(pc.KEY_A) || this.isATouch) {
        this.showEmoji("angry");
    }
    if (this.app.keyboard.wasPressed(pc.KEY_S) || this.isSTouch) {
        this.showEmoji("777");
    }


    if (this.prePos.x !== this.player.getPosition().x || this.prePos.y !== this.player.getPosition().y) {
        this.prePos = this.player.getPosition();
        this.updatePosition();
    }

};
// FIXME : clearTimeout
Network.prototype.showEmoji = function (emo) {
    let event = {
        "type": "emoji",
        "emoji": emo,
    };
    Network.socket.send(JSON.stringify(event));
    
    this.emojiEnable();
    this.emoji.sprite.play(emo);
    this.emojiDisable();
};



Network.prototype.updatePosition = function () {
    if (Network.socket.readyState == WebSocket.OPEN) {
        let pos = this.player.getPosition();
        let event = {
            "type": "playerMoved",
            "name": this.name,
            "x": pos.x,
            "y": pos.y
        };
        Network.socket.send(JSON.stringify(event));
    }

};


Network.prototype.initializePlayers = function (data) {
    Network.id = data.id;

    for (let i in data.players) {
        p = new Character(data.players[i].id, data.players[i].name, data.players[i].x, data.players[i].y, this.createPlayerEntity(data.players[i]));
        this.players.set(data.players[i].id, p);
    }

};


Network.prototype.addPlayer = function (data) {
    p = new Character(data.player.id, data.player.name, data.player.x, data.player.y, this.createPlayerEntity(data.player));
    this.players.set(data.player.id, p);
};

Network.prototype.createPlayerEntity = function (data) {
    //console.log(data);
    if (data.id != Network.id) {
        this.other.children[0].children[0].element.text = data.name;
        let newPlayer = this.other.clone();
        this.app.root.addChild(newPlayer);
        newPlayer.enabled = true;
        newPlayer.setPosition(data.x, data.y, 0);
        newPlayer.sprite.play("Clip " + (data.skin % 12 + 1));

        return newPlayer;
    }
};


Network.prototype.movePlayer = function (data) {
    // console.log(data.name);
    if (data.id != Network.id && Network.socket.readyState == WebSocket.OPEN) {
        this.players.get(data.id).entity.setPosition(data.x, data.y, 0);
    }
};

Network.prototype.emojiPlayer = function (data) {
    if (data.id != Network.id && Network.socket.readyState == WebSocket.OPEN) {
        let playerEmoji =this.players.get(data.id).entity.findByName("emoji");
        
        playerEmoji.enabled = true;
        playerEmoji.sprite.play(data.emoji);
        clearTimeout(this.players.get(data.id).skinTimeout);
        this.players.get(data.id).skinTimeout = setTimeout(() => { playerEmoji.enabled = false; }, 1000);
    }
};

Network.prototype.removePlayer = function (data) {
    if (this.players.get(data.id).entity) {
        this.players.get(data.id).entity.destroy();
        this.players.delete(data.id);
    }
};

Network.prototype.touchInit = function () {
    this.isZTouch=false;
    this.isXTouch=false;
    this.isCTouch=false;
    this.isVTouch=false;
    this.isATouch=false;
    this.isSTouch=false;
};

// class longBtn {
// 	constructor(id, arg,p) {
// 		this.event_listener(id);
// 		this.arg = arg;
//         this.p = p;
// 	}

// 	mDown = () => {
//         let code = `p.${this.arg} = true`;
//         Function("p",code)(this.p);
// 	};

// 	mUp = () => {
//         let code = `p.${this.arg} = false`;
//         Function("p",code)(this.p);
// 	};

// 	event_listener = (id) => {
//         let btn = document.getElementById(id);
//         if(btn){
//             btn.addEventListener("mousedown", this.mDown);
//             btn.addEventListener("mouseup", this.mUp);
//         }
// 	};
// }


Network.prototype.addBtnListenWithOuterHtml = function () {
	this.htmlRightBtn = new longBtn("Z", "isZTouch",this);
    this.htmlRightBtn = new longBtn("X", "isXTouch",this);
    this.htmlRightBtn = new longBtn("C", "isCTouch",this);
    this.htmlRightBtn = new longBtn("V", "isVTouch",this);
    this.htmlRightBtn = new longBtn("A", "isATouch",this);
    this.htmlRightBtn = new longBtn("S", "isSTouch",this);
};

// loading.js
pc.script.createLoadingScreen(function (app) {
    var showSplash = function () {
        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'none';

        var logo = document.createElement('img');
        logo.src = 'https://res.cloudinary.com/startup-grind/image/upload/dpr_2.0,fl_sanitize/v1/gcs/platform-data-dsc/contentbuilder/logo_dark_horizontal_097s7oa.svg';
        splash.appendChild(logo);
        logo.onload = function () {
            splash.style.display = 'block';
        };

        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);

        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);

    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        splash.parentElement.removeChild(splash);
    };

    var setProgress = function (value) {
        var bar = document.getElementById('progress-bar');
        if(bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
        }
    };

    var createCss = function () {
        var css = [
            'body {',
            '    background-color: #283538;',
            '}',
            '',
            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '    background-color: #283538;',
            '}',
            '',
            '#application-splash {',
            '    position: absolute;',
            '    top: calc(50% - 28px);',
            '    width: 264px;',
            '    left: calc(50% - 132px);',
            '}',
            '',
            '#application-splash img {',
            '    width: 100%;',
            '}',
            '',
            '#progress-bar-container {',
            '    margin: 20px auto 0 auto;',
            '    height: 2px;',
            '    width: 100%;',
            '    background-color: #1d292c;',
            '}',
            '',
            '#progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    background-color: #f60;',
            '}',
            '',
            '@media (max-width: 480px) {',
            '    #application-splash {',
            '        width: 170px;',
            '        left: calc(50% - 85px);',
            '    }',
            '}'
        ].join('\n');

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    };

    createCss();
    showSplash();

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});

