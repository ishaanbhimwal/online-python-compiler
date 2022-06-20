function outf(text) {
    var mypre = document.getElementById("output");
    mypre.value = mypre.value + text;
}
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function runit() {
    var t0 = (new Date()).getTime()
    var prog = editor.getValue();
    var mypre = document.getElementById("output");
    mypre.value = '';
    Sk.pre = "output";
    Sk.configure({
        inputfun: function (prompt) {
            return window.prompt(prompt);
        },
        inputfunTakesPrompt: true,
        output: outf,
        read: builtinRead,
        __future__: Sk.python3
    });
    var myPromise = Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    myPromise.then(function (mod) {
        console.log('success');
        var t1 = (new Date()).getTime()
        mypre.value = mypre.value + "\n" + "<completed in " + (t1 - t0) + " ms>";
    },
        function (err) {
            mypre.value = mypre.value + err.toString() + "\n";
            console.log(err.toString());
            var t1 = (new Date()).getTime()
            mypre.value = mypre.value + "\n" + "<completed in " + (t1 - t0) + " ms>";
        });
};

function main() {
    runit();
    var mypre = document.getElementById("output");
    mypre.style.display = 'block';
    editor.resize()
}

function toggleOutput() {
    var mypre = document.getElementById("output");
    if (mypre.style.display !== 'none') {
        mypre.style.display = 'none';
    }
    else {
        mypre.style.display = 'block';
    }
    editor.resize()
}

function copyToClipboard() {
    var link = window.location.href.split('?')[0] + "?code=" + encodeURIComponent(editor.getValue());
    window.prompt("Copy to clipboard: Ctrl+C, Enter", link);
}

function downloadCode() {
    var prog = editor.getValue();
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + encodeURI(prog);
    hiddenElement.download = 'download.py';
    if (confirm('Download Code?')) {
        hiddenElement.click();
    }
}

function kb() {
    window.alert("Run : Ctrl+Enter\nToggle Output : Ctrl+Shift+E\nShare : Ctrl+Shift+S\nDownload : Ctrl+Shift+D\nKeyboard Shortcuts : Ctrl+Shift+K\nEditor Settings : Ctrl+,")
}

function aceSettings() {
    editor.execCommand("showSettingsMenu")
}

function resPanel() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key == "Enter") {
        event.preventDefault();
        main();
    }

    if (event.ctrlKey && event.shiftKey && event.key == "E") {
        event.preventDefault();
        toggleOutput();

    }

    if (event.ctrlKey && event.shiftKey && event.key == "S") {
        event.preventDefault();
        copyToClipboard();
    }

    if (event.ctrlKey && event.shiftKey && event.key == "D") {
        event.preventDefault();
        downloadCode();
    }

    if (event.ctrlKey && event.shiftKey && event.key == "K") {
        event.preventDefault();
        kb();
    }

});

var editor = ace.edit("editor");
editor.setTheme("ace/theme/tomorrow_night");
editor.session.setMode("ace/mode/python");
editor.setShowPrintMargin(false);
editor.commands.removeCommand('findprevious');
editor.commands.removeCommand('duplicateSelection');
editor.commands.removeCommand('replaymacro');
ace.require("ace/ext/language_tools");
editor.setOptions({
    fontFamily: "Source Code Pro",
    fontSize: "15px",
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    autoScrollEditorIntoView: true,
});

var params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

if (params.code != null) {
    editor.setValue(params.code);
};

toggleOutput();