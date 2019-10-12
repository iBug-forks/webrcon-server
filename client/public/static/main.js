Vue.component('shortcut-group', {
    props: ['shortcuts', 'name'],
    template: `
    <div class="card bg-light mb-3">
        <div class="card-header bg-middleblue">
            <h4 class="card-title my-auto">
                <span class="oi oi-puzzle-piece" title="puzzle-piece" aria-hidden="true"></span> {{ name }}
            </h4>
        </div>
        <ul class="list-group list-group-flush">
            <shortcut-panel
            v-for="shortcut in shortcuts"
            v-bind:key="shortcut.id"
            v-bind:shortcut="shortcut"
            v-on:send-cmd="emitExec">
            </shortcut-panel>
        </ul>
    </div>
    `,
    methods: {
        emitExec(cmd) {
            this.$emit('send-cmd', cmd)
        }
    }
})

Vue.component('shortcut-panel', {
    props: ['shortcut'],
    template: `
        <li class="list-group-item">
            <button type="button" class="btn btn-outline-info btn-block"
                v-if="!shortcut.args" v-on:click="emitExec"
            >{{ shortcut.name }}</button>
            <div class="input-group" v-if="shortcut.args">
                <div class="input-group-prepend">
                    <button class="btn btn-outline-info" type="button" id="button-submit"
                        v-on:click="emitExec">{{ shortcut.name }}</button>
                </div>
                <input type="text" class="form-control" placeholder="Command Args Here."
                    aria-label="Command Args to be passed." aria-describedby="button-submit"
                    v-model="args">
            </div>
        </li>
    `,
    data: function () {
        return {
            args: this.shortcut.default
        }
    },
    methods: {
        emitExec() {
            var cmd = this.shortcut.cmd;
            if (this.shortcut.args) {
                cmd += ` ${this.args}`;
            }
            this.$emit('send-cmd', cmd)
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        command: 'maps *',
        reply: '',
        shortcutGroups: {
            "Rounds": [
                { id: 1, args: true, default: "5", name: "Restart Game", cmd: "mp_restartgame" },
                { id: 2, args: true, default: "30", name: "Max Rounds", cmd: "mp_maxrounds" },
                { id: 3, args: true, default: "999", name: "Warmup Time", cmd: "mp_warmuptime" },
            ],
            "Maps": [
                { id: 1, args: true, default: "*", name: "List Maps", cmd: "maps" },
                { id: 2, args: true, default: "de_dust2", name: "Change Map", cmd: "map" },
            ],
            "Bots": [
                { id: 1, args: false, default: "", name: "Kick All Bot", cmd: "bot_kick" },
                { id: 2, args: false, default: "", name: "Kick CT", cmd: "bot_kick ct" },
                { id: 3, args: false, default: "", name: "Kick T", cmd: "bot_kick t" },
                { id: 4, args: false, default: "", name: "Add CT", cmd: "bot_add_ct" },
                { id: 5, args: false, default: "", name: "Add T", cmd: "bot_add_t" },
            ],
            "Cheats": [
                { id: 1, args: false, default: "", name: "Cheat On", cmd: "sv_cheats 1" },
                { id: 2, args: false, default: "", name: "Cheat Off", cmd: "sv_cheats 0" },
                { id: 3, args: true, default: "1.0", name: "Time Scale", cmd: "host_timescale" },
            ]
        },
    },
    methods: {
        sendExec: function (succ, fail, cmd) {
            fetch(`/api/exec?cmd=${cmd}`)
                .then(function (res) {
                    if (res.status !== 200) {
                        fail('Fail with Status Code: ' + res.status);
                    } else {
                        res.text().then(succ);
                    }
                })
                .catch(err => console.log('Fetch Error :-S', err));
        },
        sendExecPanel: function (cmd) {
            this.command = cmd;
            this.sendExec(
                this.updateReply,
                this.updateReply,
                cmd);
        },
        updateReply: function (msg) {
            this.reply = msg;
        }
    }
})
