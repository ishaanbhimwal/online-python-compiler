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
    if (mypre.style.display !== 'block') {
        mypre.style.display = 'block';
    }
    else {
        mypre.style.display = 'none';
    }
}

function copyToClipboard() {
    var copy_id = document.getElementById("copy_id");
    if (copy_id.style.display !== 'block') {
        copy_id.style.display = 'block';
    }
    else {
        copy_id.style.display = 'none';
    }
    var link = window.location.href.split('?')[0] + "?code=" + encodeURIComponent(editor.getValue());
    navigator.clipboard.writeText(link);
}

function kb() {
    var modal = document.getElementById("kb_id");
    if (modal.style.display !== 'block') {
        modal.style.display = 'block';
    }
    else {
        modal.style.display = 'none';
    }
}

function download_modal() {
    var download_id = document.getElementById("download_id");
    if (download_id.style.display !== 'block') {
        download_id.style.display = 'block';
    }
    else {
        download_id.style.display = 'none';
    }
}

function download () {
    var prog = editor.getValue();
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + encodeURI(prog);
    hiddenElement.download = 'download.py';
    if (confirm('Download Code?')) {
        hiddenElement.click();
        download_modal();
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
editor.setTheme("ace/theme/merbivore_soft");
editor.session.setMode("ace/mode/python");
editor.setShowPrintMargin(false);
document.getElementById("editor").style.fontSize = "14px";
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
});

var params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

if (params.code != null) {
    editor.setValue(params.code);
};

var mypre = document.getElementById("output");
mypre.style.display = 'none';