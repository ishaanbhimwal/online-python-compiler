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
    },
        function (err) {
            mypre.value = mypre.value + err.toString();
            console.log(err.toString());
        });
};

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

function kb() {
    window.alert("Run Code : Ctrl+Enter\nToggle Output : Ctrl+Shift+E\nShare Code : Ctrl+Shift+S\nToggle Keyboard Shortcuts : Ctrl+Shift+K\nEditor Settings : Ctrl+,\nDownload Code : Ctrl+Shift+D\nBeautify Code : Ctrl+Shift+F")
}

function download() {
    var prog = editor.getValue();
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + encodeURI(prog);
    hiddenElement.download = 'download.py';
    if (confirm('Download Code?')) {
        hiddenElement.click();
    }
}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key == "Enter") {
        event.preventDefault();
        var t0 = (new Date()).getTime()
        runit();
        var t1 = (new Date()).getTime()
        var mypre = document.getElementById("output");
        mypre.style.display = 'block';
        mypre.value = mypre.value + "\n" + "<completed in " + (t1 - t0) + " ms>";
    }

    if (event.ctrlKey && event.shiftKey && event.key == "E") {
        event.preventDefault();
        toggleOutput();

    }

    if (event.ctrlKey && event.shiftKey && event.key == "S") {
        event.preventDefault();
        copyToClipboard();
    }

    if (event.ctrlKey && event.shiftKey && event.key == "K") {
        event.preventDefault();
        kb();
    }

    if (event.ctrlKey && event.shiftKey && event.key == "D") {
        event.preventDefault();
        download();
    }

    if (event.ctrlKey && event.shiftKey && event.key == "F") {
        event.preventDefault();
        beautify.beautify(editor.session);
    }

});


var editor = ace.edit("editor");
var beautify = ace.require("ace/ext/beautify");
editor.setTheme("ace/theme/cobalt");
editor.session.setMode("ace/mode/python");
editor.setShowPrintMargin(false);
editor.commands.removeCommand('findprevious');
editor.commands.removeCommand('duplicateSelection');
editor.commands.removeCommand('replaymacro');
ace.require("ace/ext/language_tools");
editor.setOptions({
    fontFamily: "Source Code Pro",
    fontSize: "14px",
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