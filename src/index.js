// ==UserScript==
// @name           HV Auto Play Reload
// @namespace      HV
// @include        https://hentaiverse.org/*
// @require        https://code.jquery.com/jquery-3.2.1.min.js
// ==/UserScript==

var HV = {};

function session(key, value) {
    if (value === undefined) {
        var tmp = JSON.parse(sessionStorage.getItem(key));
        return tmp;
    } else {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    return true;
}

function local(key, value) {
    if (value === undefined) {
        var tmp = JSON.parse(localStorage.getItem(key));
        return tmp;
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
    return true;
}

function location(_location) {
    var output = {
        href: _location,
        is: function () {
            return (window.location.href.indexOf(this.href) === 0);
        },
        go: function () {
            window.location.href = this.href;
        }
    };
    return output;
}

function getMessages() {
    var output = Array();
    var pnt = $('#textlog tr');
    var cnt = pnt.length;

    var separator_pos = cnt;
    pnt.each(function(pos){
        if ($(this).find('.tls').length) {
            separator_pos = pos;
            separator_pos -= 1; // separator is actually the next line, so -1
        }
    });

    for (var i = 0; i < cnt; i++) {
        output.push(pnt.eq(i).find('td').html());
    }

    return output;
}

function round() {
    var txt = $('#textlog tbody tr:last-child td.tl').text();
    txt = $.trim(txt);
    var _round = txt.match(/Round (\d+)/);
    var output = NaN;

    if (_round.length === 2) {
        output = _round[1];
        // This code use a 0-based system, HV use 1-based system
        output -= 1;
    }

    return output;
}

function _togglePause(state) {
    HV.Settings.AutoStart = !state;
    HV.SaveSettings();
    alert(HV.Settings.AutoStart ? "Un-pause" : "Pause");
//    if (!HV.Settings.AutoStart){
//        alert("Paused");
//    }
    window.location.href = window.location.href;
}

function pause() {
//    console.log("pause");
    _togglePause(true);
}

function unpause() {
//    console.log("unpause");
    _togglePause(false);
}

function togglePasue() {
    _togglePause(HV.Settings.AutoStart);
}

//Location related
HV.Location = {
    Character: location("https://hentaiverse.org/?s=Character&ss=ch"),
    Equipment: location("https://hentaiverse.org/?s=Character&ss=eq"),
    Abilities: location("https://hentaiverse.org/?s=Character&ss=ab"),
    Trainer: location("https://hentaiverse.org/?s=Character&ss=tr"),
    BattleItems: location("https://hentaiverse.org/?s=Character&ss=it"),
    Inventory: location("https://hentaiverse.org/?s=Character&ss=in"),
    Settings: location("https://hentaiverse.org/?s=Character&ss=se"),
    //
    EquipShop: location("https://hentaiverse.org/?s=Bazaar&ss=es"),
    ItemShop: location("https://hentaiverse.org/?s=Bazaar&ss=is"),
    ItemShopBot: location("https://hentaiverse.org/?s=Bazaar&ss=ib"),
    MonsterLab: location("https://hentaiverse.org/?s=Bazaar&ss=ml"),
    Shrine: location("https://hentaiverse.org/?s=Bazaar&ss=ss"),
    MoogleMail: location("https://hentaiverse.org/?s=Bazaar&ss=mm"),
    WeaponLotry: location("https://hentaiverse.org/?s=Bazaar&ss=lt"),
    ArmorLotry: location("https://hentaiverse.org/?s=Bazaar&ss=la"),
    //
    Battle: location("https://hentaiverse.org/?s=Battle&ss=ba"),
    Arena: location("https://hentaiverse.org/?s=Battle&ss=ar"),
    RingOfBlood: location("https://hentaiverse.org/?s=Battle&ss=rb"),
    GrindFest: location("https://hentaiverse.org/?s=Battle&ss=gr"),
    ItemWorld: location("https://hentaiverse.org/?s=Battle&ss=iw"),
    //
    Repair: location("https://hentaiverse.org/?s=Forge&ss=re"),
    Upgrade: location("https://hentaiverse.org/?s=Forge&ss=up"),
    Enchant: location("https://hentaiverse.org/?s=Forge&ss=en"),
    Salvage: location("https://hentaiverse.org/?s=Forge&ss=sa"),
    Reforge: location("https://hentaiverse.org/?s=Forge&ss=fo"),
    SoulFuse: location("https://hentaiverse.org/?s=Forge&ss=fu")
};

// Settings related
HV.Settings = null;
HV.DefaultSettings = {
// this is just to show what settings are available
// please set properly in the init function
    AutoStart: false,
    KillTilDie: false,
    RoundInterval: 10,
    FightingStyle: 'Empty Hand'
};
HV.SaveSettings = function () {
    local("settings", HV.Settings);
};
HV.LoadSettings = function () {
    var tmp = local("settings");
    if (tmp === null) {
        HV.Settings = HV.DefaultSettings;
    } else {
        HV.Settings = tmp;
    }
};
HV.SettingsInit = function () {
    HV.LoadSettings();
    $.each(HV.DefaultSettings, function (i, n) {
        if (typeof HV.Settings[i] != undefined)
            return;
        HV.Settings[i] = HV.DefaultSettings[i];
    });
    // The real place to set the values (below)
    // this will overwrite what's stored in the localStorage
    HV.Settings.KillTilDie = false;
    if (HV.Location.Character.is() || HV.Location.Equipment.is()) {
        _style = $('html body div.stuffbox div#mainpane div#mainpane.eqm div#rightpane div div div div#stats_pane.cspp div div.spn div.fd2 div').text();

        if (_style.match(/(Unarmed)/gi)) {
            HV.Settings.FightingStyle = RegExp.$1;
        }
        if (_style.match(/(One-Handed)/gi)) {
            HV.Settings.FightingStyle = RegExp.$1;
        }
        if (_style.match(/(Two-handed)/gi)) {
            HV.Settings.FightingStyle = RegExp.$1;
        }
        if (_style.match(/(Staff)/gi)) {
            HV.Settings.FightingStyle = RegExp.$1;
        }
        if (_style.match(/(Dualwield)/gi)) {
            HV.Settings.FightingStyle = RegExp.$1;
        }
        if (_style.match(/(Niten Ichiryu)/gi)) {
            HV.Settings.FightingStyle = RegExp.$1;
        }
    }
    // The real place to set the values (above)
    HV.SaveSettings();
};


HV.IsBattle = function () {
    return ($("#battle_main").length > 0);
};

// Battle related
HV.Battle = {
    Round: -1,
    Monsters: [],
    Gem: null
};

HV.SaveBattle = function () {
    session("battle", HV.Battle);
};
HV.LoadBattle = function () {
    var tmp = session("battle");
    if (tmp === null) {
        return;
    }
    HV.Battle = tmp;
};
HV.ResetBattle = function () {
    HV.Battle.Round = -1;
    HV.Battle.Monsters = [];
    HV.SaveBattle();
};

HV.Player = {
    HP: 0,
    HPMax: 0,
    HPPercent: function () {
        return this.HP / this.HPMax * 100;
    },
    MP: 0,
    MPMax: 0,
    MPPercent: function () {
        return this.MP / this.MPMax * 100;
    },
    SP: 0,
    SPMax: 0,
    SPPercent: function () {
        return this.SP / this.SPMax * 100;
    },
    OC: 0,
    OCMax: 0,
    OCPercent: function () {
        return this.OC / this.OCMax * 100;
    },
    Status: [],
    StatusLife: [],
    Damage: 0,
    Items: {
        Draught: {},
        Potion: {},
        Elixir: {},
        Scroll: {},
        Infusion: {},
        Gem: {} // at the moment not used yet
    }
};

HV.Actions = {// declaration only, definition below
    Token: 1,
    Target: 0,
    Attack: function () {
    },
    Magic: {
        Cure: function () {
        },
        Regen: function () {
        },
        Protection: function () {
        },
        Heartseeker: function () {
        },
        ShadowVeil: function () {
        },
        Haste: function () {
        },
        SparkOfLife: function () {
        }
    },
    Spirit: function () {
    },
    Skills: {},
    Items: {
        Draught: function () {
        },
        Potion: function () {
        }
    },
    Defend: function () {
    },
    Focus: function () {
    },
    Continue: function () {
    },
    MonsterSelect: function () {
    },
    Noop: function () {
    }
};

HV.Round0Init = function () {
    if (!(HV.IsBattle() && (round() === 0))) {
        return;
    }

    // reset to make sure everything calibrated
    // load the old battle first in order to keep what should be inherited
    // from last battle
    HV.LoadBattle();
    HV.ResetBattle();

    // get monster info
    var _msg = getMessages();
    var _count = _msg.length;

    for (var i = 0; i < _count; i++) {
        var _mon = _msg[i].match(/MID=(\d+)[\s]*\(([\w\s-]+)\)[\s]*LV=(\d+)[\s]*HP=(\d+)/);
        if (_mon != null) {
            HV.Battle.Monsters.push({
                mid: _mon[1],
                name: _mon[2],
                level: _mon[3],
                hp: _mon[4],
                order: i
            });
            // console.log(_mon);
        }
    }

    for (i = 0; i < HV.Battle.Monsters.length; i++) {
        HV.Battle.Monsters[i].order = HV.Battle.Monsters.length - HV.Battle.Monsters[i].order;
    }

    // experiment: when a game start there shouldn't be any gem
    HV.Battle.Gem = null;

    HV.SaveBattle();
   // console.log(HV.Battle.Monsters);
};

HV.RoundXInit = function () {
    HV.LoadBattle();
    if (HV.Battle.Round < round()) {
        HV.Battle.Round = round();
//        console.log("Round "+ round());
    } else {
//        console.log("Round "+ round() + ": Came in before")
        return;
    }
    var _msg = getMessages();
    var _count = _msg.length;

    // work out current player status (immediate)
    var _ps = $("div.stuffbox .clb .cwbdv .cwbt .cwbt1 .fd2 div");
    var hps = _ps.eq(0).text().match(/(\d+)\s*\/\s*(\d+)/);
    var mps = _ps.eq(1).text().match(/(\d+)\s*\/\s*(\d+)/);
    var sps = _ps.eq(2).text().match(/(\d+)\s*\/\s*(\d+)/);
    if (_ps.length === 4) {
        mps = _ps.eq(2).text().match(/(\d+)\s*\/\s*(\d+)/);
        sps = _ps.eq(3).text().match(/(\d+)\s*\/\s*(\d+)/);
    }
    HV.Player.HP = hps[1];
    HV.Player.HPMax = hps[2];
    HV.Player.MP = mps[1];
    HV.Player.MPMax = mps[2];
    HV.Player.SP = sps[1];
    HV.Player.SPMax = sps[2];
    HV.Player.OC = parseInt($("div.stuffbox .clb .cwbdv .cwbt .cwbt2 .fd2 div").text().match(/(\d+)/)[1]);
    HV.Player.OCMax = Math.round($('div.stuffbox .clb .cwbdv img.cwb2[alt=overcharge]').width() / HV.Player.OC * 120);

    $("div.stuffbox div#mainpane div.btt div.bte img").each(function () {
        var _status = $(this).attr("onmouseover");
        HV.Player.Status.push(_status.match(/\('([\w\s\(\)]+)\'/)[1]);
        var _life = _status.match(/(\d+)\)/); // remain turns
        HV.Player.StatusLife.push((_life == undefined) ? 1 : _life[1]);
    });

    for (var i = 0; i < _count; i++) {
        var _dam = _msg[i].match(/hits you for (\d+)/);
        if (_dam != null) {
            HV.Player.Damage += parseInt(_dam[1]);
        }
    }

    // work out all the current items
    $("#ckey_items").click();
    $('#togpane_item div.c div div.c div.bti1 div.bti3 div').each(function () {
        if ($(this).css('cursor') === 'pointer') {
            var id_name = $(this).attr('id');
            var item = $(this).find('.fd2 div').text();
            if (item) {
                var draught = item.match(/([\w]+) Draught/);
                if (draught) {
                    HV.Player.Items.Draught[draught[1]] = id_name;
                }
                var potion = item.match(/([\w]+) Potion/);
                if (potion) {
                    HV.Player.Items.Potion[potion[1]] = id_name;
                }
                var elixir = item.match(/([\w]+) Elixir/);
                if (elixir) {
                    HV.Player.Items.Elixir[elixir[1]] = id_name;
                }
                var scroll = item.match(/Scoll of ([\w]+)/);
                if (scroll) {
                    HV.Player.Items.Scroll[scroll[1]] = id_name;
                }
                var infusion = item.match(/Infusion of ([\w]+)/);
                if (infusion) {
                    HV.Player.Items.Infusion[infusion[1]] = id_name;
                }
            }
        }
        ;
    });

    $("#ckey_attack").click();

    if (!(HV.IsBattle() && (round() > 0)))
        return;

    // work out current monster status
    for (var i = 0; i < _count; i++) {
        var _dam = _msg[i].match(/(hit|hits|crit|crits|counter|blasts) ([\w\s-]+) for (\d+)/);
        var _eff = _msg[i].match(/([\w\s-]+) gains the effect ([\w\s-]+)\./);
        var _nff = _msg[i].match(/([\w\s-]+) on ([\w\s-]+) has expired/);

        // add effect
        for (var j = 0; j < HV.Battle.Monsters.length; j++) {
            if (_eff != null) {
                if (HV.Battle.Monsters[j].name == _eff[1]) {
                    if (HV.Battle.Monsters[j].effects === undefined) {
                        HV.Battle.Monsters[j].effects = [];
                    }
                    HV.Battle.Monsters[j].effects.push(_eff[2]);
                }
            }
        }
        // remove effect
        for (var j = 0; j < HV.Battle.Monsters.length; j++) {
            if (_nff != null) {
                if (HV.Battle.Monsters[j].name == _nff[2]) {
                    _tid = HV.Battle.Monsters[j].effects.indexOf(_nff[1])
                    HV.Battle.Monsters[j].effects.splice(_tid, 1);
                }
            }
        }

        if (_dam != null) {
            for (j = 0; j < HV.Battle.Monsters.length; j++) {
                if (HV.Battle.Monsters[j].name == _dam[2]) {
                    HV.Battle.Monsters[j].hp -= Number(_dam[3])
                    if (HV.Battle.Monsters[j].hp <= 0) {
                        HV.Battle.Monsters.splice(j, 1);
                    }
                }
            }
        }
    }
//    console.log(HV.Battle.Monsters);

    // work out current player status (continues)
    for (var i = 0; i < _count; i++) {
        var _gem = _msg[i].match(/You use (\w+) Gem/);
        if (_gem != null) {
            HV.Battle.Gem = null;
        }
    }

    if ($('#ikey_p').length) {
        var gem_name = ($('#ikey_p .fd2 div').text()).match(/(\w+) Gem/);
        if (gem_name != null) {
            HV.Battle.Gem = gem_name[1];
        }
    }

    // work out other current status
    HV.SaveBattle();
//    console.log(HV.Battle.Monsters);
};

HV.Init = function () {
    HV.SettingsInit();
    $(document).keypress(function (e) {
        switch (e.which) {
            case 93: // [
                unpause();
                break;
            case 91: // ]
                pause();
                break;
            case 43: // +
                HV.Settings.RoundInterval += 100;
                console.log('RoundInterval: ' + HV.Settings.RoundInterval + 'ms');
                HV.SaveSettings();
                break;
            case 45: // -
                if (HV.Settings.RoundInterval >= 110) {
                    HV.Settings.RoundInterval -= 100;
                }
                console.log('RoundInterval: ' + HV.Settings.RoundInterval + 'ms');
                HV.SaveSettings();
                break;
            case 46: // .
                HV.Run();
                break;
        }
    });

    HV.Round0Init();
    HV.RoundXInit();
};

HV.Executer = {
    actions: new Array(),
    addAction: function (callback, criteria, arg) {
        var count = this.actions.length;
        var exist = false;
        for (var i = 0; i < count; i++) {
            if (this.actions[i].func === callback) {
                if (typeof arg !== 'undefined') {
                    if (this.actions[i].arg.toString() !== arg.toString()) {
                        continue;
                    }
                }
                exist = true;
                this.actions[i].count++;

                if (typeof criteria === 'function') {
                    this.actions[i].pass += Number(criteria.apply());
                } else {
                    this.actions[i].pass += Number(criteria);
                }
            }
        }
        if (!exist) {
            var num_criteria = 0;
            if (typeof criteria === 'function') {
                num_criteria = Number(criteria.apply());
            } else {
                num_criteria = Number(criteria);
            }

            this.actions.push({
                count: 1,
                pass: num_criteria,
                func: callback,
                arg: arg
            });
        }
    },
    execute: function () {

        this.actions.sort(function (a, b) {
            var aa = a.pass / a.count;
            var bb = b.pass / b.count;

            if (aa < bb) {
                return 1;
            } else if (aa === bb) {
                return 0;
            } else {
                return -1;
            }
        });

        if ((typeof this.actions[0].arg) === 'object') {
            this.actions[0].func.apply(null, this.actions[0].arg);
        } else {
            this.actions[0].func();
        }

        delete(HV);
    }
};

HV.Run = function () {

    HV.Executer.addAction(HV.Actions.Continue, $("#ckey_continue").length > 0); // Continue

    var idx_channeling = $.inArray("Channeling", HV.Player.Status);
    var idx_regen = $.inArray("Regen", HV.Player.Status);
    var idx_protect = $.inArray("Protection", HV.Player.Status);
    var idx_heartseeker = $.inArray("Heartseeker", HV.Player.Status);
    var idx_shadowveil = $.inArray("Shadow Veil", HV.Player.Status);
    var idx_haste = $.inArray("Hastened", HV.Player.Status);
    var idx_sparkoflife = $.inArray("Spark of Life", HV.Player.Status);
    var idx_spiritdraught = $.inArray("Refreshment", HV.Player.Status);
    var idx_manadraught = $.inArray("Replenishment", HV.Player.Status);
    var idx_healthdraught = $.inArray("Regeneration", HV.Player.Status);

//    HV.Executer.addAction(HV.Actions.Items.Potion, HV.Player.MPPercent() < 10, ['Mana']); // Magic Potion

    /*    console.log(HV.Items.Count('Health') > 0);
     console.log(HV.Player.MPPercent() < 25);
     console.log(HV.Player.HPPercent() < 45);
     $("#311").css('opacity').toString()=='0.5'
     */

    HV.Executer.addAction(HV.Actions.Magic.Cure, HV.Player.HPPercent() < 50); // Cure
    HV.Executer.addAction(HV.Actions.Magic.Cure, HV.Player.MPPercent() > 10); // Cure
    HV.Executer.addAction(HV.Actions.Magic.Cure, parseInt($("#311").css('opacity')) === 1); // Cure

    HV.Executer.addAction(HV.Actions.Items.Potion, HV.Player.HPPercent() < 50, ['Health']); // Health Potion
    HV.Executer.addAction(HV.Actions.Items.Potion, HV.Player.MPPercent() < 20, ['Health']); // Health Potion

    HV.Executer.addAction(HV.Actions.Items.Potion, HV.Player.MPPercent() < 10, ['Mana']); // Mana Potion
    HV.Executer.addAction(HV.Actions.Items.Potion, HV.Player.SPPercent() > 50, ['Mana']); // Mana Potion

    HV.Executer.addAction(HV.Actions.Items.Potion, HV.Player.SPPercent() < 20, ['Spirit']); // Spirit Potion

    HV.Executer.addAction(HV.Actions.Magic.Regen, (idx_regen < 0) || (!(idx_regen > -1) && (HV.Player.StatusLife[idx_regen] > 0))); // Regen
    HV.Executer.addAction(HV.Actions.Magic.Regen, HV.Player.HPPercent() <= 80); // Regen

    HV.Executer.addAction(HV.Actions.Items.Draught, idx_healthdraught === -1, ['Health']); // Health Draught
    HV.Executer.addAction(HV.Actions.Items.Draught, HV.Player.HPPercent() > 50, ['Health']); // Health Draught
    HV.Executer.addAction(HV.Actions.Items.Draught, HV.Player.HPPercent() < 65, ['Health']); // Health Draught

    HV.Executer.addAction(HV.Actions.Items.Draught, idx_manadraught === -1, ['Mana']); // Mana Draught
    HV.Executer.addAction(HV.Actions.Items.Draught, HV.Player.MPPercent() < 30, ['Mana']); // Mana Draught

    HV.Executer.addAction(HV.Actions.Items.Draught, idx_spiritdraught === -1, ['Spirit']); // Spirit Draught
    HV.Executer.addAction(HV.Actions.Items.Draught, HV.Player.SPPercent() < 40, ['Spirit']); // Spirit Draught

    HV.Executer.addAction(HV.Actions.Spirit, function () {
        if ($("#ckey_spirit").length === 0) {
            return false;
        }
        return ($("#ckey_spirit").attr("src").indexOf('battle/spirit_n.png') > 0);
    }); // Spirit
    HV.Executer.addAction(HV.Actions.Spirit, HV.Player.SPPercent() > 50); // Spirit
    HV.Executer.addAction(HV.Actions.Spirit, HV.Player.MPPercent() < 80); // Spirit
    HV.Executer.addAction(HV.Actions.Spirit, HV.Player.OC > 75); // Spirit

    HV.Executer.addAction(HV.Actions.Magic.SparkOfLife, idx_channeling >= 0); // Spark of Life
    HV.Executer.addAction(HV.Actions.Magic.SparkOfLife, idx_sparkoflife === -1); // Spark of Life

    HV.Executer.addAction(HV.Actions.Magic.Haste, idx_channeling >= 0); // Haste
    HV.Executer.addAction(HV.Actions.Magic.Haste, idx_haste === -1); // Haste

    HV.Executer.addAction(HV.Actions.Magic.ShadowVeil, idx_channeling >= 0); // Shadow Veil
    HV.Executer.addAction(HV.Actions.Magic.ShadowVeil, idx_shadowveil === -1); // Shadow Veil

    HV.Executer.addAction(HV.Actions.Magic.Protection, idx_channeling >= 0); // Protection
    HV.Executer.addAction(HV.Actions.Magic.Protection, idx_protect === -1); // Protection

    HV.Executer.addAction(HV.Actions.Magic.Heartseeker, idx_channeling >= 0); // Heartseeker
    HV.Executer.addAction(HV.Actions.Magic.Heartseeker, idx_heartseeker === -1); // Heartseeker

    HV.Executer.addAction(HV.Actions.Items.Gem, HV.Battle.Gem != null);

    HV.Executer.addAction(HV.Actions.Attack, true); // Attack or Arcane Blow
    HV.Executer.addAction(HV.Actions.Noop, true); // Noop

    setTimeout(function () {
        HV.Executer.execute();
    }, HV.Settings.RoundInterval);
};

//=================================

HV.Actions.MonsterSelect = function () {
    var _id = -1;

    switch (HV.Settings.FightingStyle) {
        case 'Staff':

            for (i = 0; i < count; i++) {
                if (HV.Battle.Monsters[i].hp < _minhp) {
                    _minhp = HV.Battle.Monsters[i].hp;
                    _id = HV.Battle.Monsters[i].order;
                }
            }

            break;
        default:
            _minhp = 9999999999;
            count = HV.Battle.Monsters.length;
            for (i = 0; i < count; i++) {
                if (HV.Battle.Monsters[i].hp < _minhp) {
                    _minhp = HV.Battle.Monsters[i].hp;
                    _id = HV.Battle.Monsters[i].order;
                }
            }
            break;
    }
    return _id;
};
//
HV.Actions.Attack = function () {
    $("#ckey_attack").click();
    var _id = HV.Actions.MonsterSelect();
    $("#mkey_" + _id).click();
};
HV.Actions.Noop = function () {
//    console.log('Noop', Math.random());
};
HV.Actions.Magic.Regen = function () {
    var mp = $("#312").attr("onmouseover").match(/,\s*(\d+)/)[1];
    var diff = HV.Player.MP - mp;
    if (diff > 0) {
        $("#ckey_magic").click();
        $("#312").click();
        $("#312").click();
    } else {
        console.log("Not enough MP to cast Regen");
    }
};
HV.Actions.Magic.Cure = function () {
    var mp = $("#311").attr("onmouseover").match(/,\s*(\d+)/)[1];
    var diff = HV.Player.MP - mp;
    if (diff > 0) {
        $("#ckey_magic").click();
        $("#311").click();
        $("#311").click();
    } else {
        console.log("Not enough MP to cast Cure");
    }
};
HV.Actions.Magic.Protection = function () {
    var mp = $("#411").attr("onmouseover").match(/,\s*(\d+)/)[1];
    var diff = HV.Player.MP - mp;
    if (diff > 0) {
        $("#ckey_magic").click();
        $("#411").click();
        $("#411").click();
    } else {
        console.log("Not enough MP to cast Protection");
    }
};
HV.Actions.Magic.Heartseeker = function () {
    var mp = $("#431").attr("onmouseover").match(/,\s*(\d+)/)[1];
    var diff = HV.Player.MP - mp;
    if (diff > 0) {
        $("#ckey_magic").click();
        $("#431").click();
        $("#431").click();
    } else {
        console.log("Not enough MP to cast Heartseeker");
    }
};
HV.Actions.Magic.SparkOfLife = function () {
    var mp = $("#422").attr("onmouseover").match(/,\s*(\d+)/)[1];
    var diff = HV.Player.MP - mp;
    if (diff > 0) {
        $("#ckey_magic").click();
        $("#422").click();
        $("#422").click();
    } else {
        console.log("Not enough MP to cast Spark of life");
    }
};
HV.Actions.Magic.ShadowVeil = function () {
    var mp = $("#413").attr("onmouseover").match(/,\s*(\d+)/)[1];
    var diff = HV.Player.MP - mp;
    if (diff > 0) {
        $("#ckey_magic").click();
        $("#413").click();
        $("#413").click();
    } else {
        console.log("Not enough MP to cast Shadow Veil");
    }
};
HV.Actions.Magic.Haste = function () {
    var mp = $("#412").attr("onmouseover").match(/,\s*(\d+)/)[1];
    var diff = HV.Player.MP - mp;
    if (diff > 0) {
        $("#ckey_magic").click();
        $("#412").click();
        $("#412").click();
    } else {
        console.log("Not enough MP to cast Haste");
    }
};
HV.Actions.Continue = function () {
    $("#ckey_continue").click();
};
HV.Actions.Spirit = function () {
    $("#ckey_spirit").click();
};
HV.Actions.Items.Gem = function () {
    $("#ckey_items").click();
    $("#ikey_p").click();
    $("#ikey_p").click();
};
HV.Actions.Items.Potion = function (type) {
    if (HV.Player.Items.Potion.hasOwnProperty(type)) {
        $("#ckey_items").click();
        $("#" + HV.Player.Items.Potion[type]).click();
    } else {
        console.log('Cannot use', type, 'potion for now');
    }
};
HV.Actions.Items.Draught = function (type) {
    if (HV.Player.Items.Draught.hasOwnProperty(type)) {
        $("#ckey_items").click();
        $("#" + HV.Player.Items.Draught[type]).click();
    } else {
        console.log('Cannot use', type, 'draught for now');
    }
};


$('document').ready(function () {

    // Init the basics like load up settings and bind keyboard handlers
    HV.Init();

    // Manual or Auto base on the settings
    if (!HV.Settings.AutoStart)
        return;

    // Game related logics get executed
    HV.Run();
});

