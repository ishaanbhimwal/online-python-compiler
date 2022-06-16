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

    if (event.ctrlKey && event.shiftKey && event.key == "T") {
        event.preventDefault();
        var mypre = document.getElementById("output");
        if (mypre.style.display !== 'block') {
            mypre.style.display = 'block';
        }
        else {
            mypre.style.display = 'none';
        }

    }

    if (event.ctrlKey && event.shiftKey && event.key == "S") {
        event.preventDefault();
        function copyToClipboard(text) {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
        }
        var link = "https://ishaanbhimwal.github.io/online-python-compiler?code=" + encodeURIComponent(editor.getValue());
        copyToClipboard(link);
    }

    if (event.ctrlKey && event.shiftKey && event.key == "K") {
        event.preventDefault();
        var modal = document.getElementById("myModal");
        if (modal.style.display !== 'block') {
            modal.style.display = 'block';
        }
        else {
            modal.style.display = 'none';
        }
    }

    if (event.ctrlKey && event.shiftKey && event.key == "D") {
        event.preventDefault();
        var prog = editor.getValue();
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/text,' + encodeURI(prog);
        hiddenElement.download = 'download.py';
        if (confirm('Download file?')) {
            hiddenElement.click();
        }
    }

});


var editor = ace.edit("editor");
editor.setTheme("ace/theme/cobalt");
editor.session.setMode("ace/mode/python");
editor.setShowPrintMargin(false);
document.getElementById("editor").style.fontSize = "14px";
editor.commands.removeCommand('findprevious');
editor.commands.removeCommand('duplicateSelection');
ace.require("ace/ext/language_tools");
editor.setOptions({
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