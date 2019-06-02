var wordTag = "w";
var foreachTag = "foreach";
var separatorTag = "sep";


function trimAndUnquote(str) {
    return str.trim().replace(/"([^"]+(?="))"/g, '$1')
}

// for a given main string and array of words, every <w{n}> pattern in main is replaced with n-th word from array
function replaceWords(main,arr) {
    console.log(main);
    console.log(arr);
    var res = main.match(/\<w\d+\>/g);
    res.forEach(function(w) {
        var index = w.substring(2,w.length-1);
        if (arr[index-1]) {
            main = main.replace(w,trimAndUnquote(arr[index-1]));
        }
        else {
            main = main.replace(w,"");
        }

    })
    return main;
}

// get word separators from text
function getSeparators(main,arr) {
    var res = main.match(/\<sep\=.+\/\>/g);
    return res.map(function(x) { return x.substring(5,x.length-2) })
}

function hideSeparators(main) {
    return main.replace(/\<sep\=.+\>/gm,"")
}

// returns 
// obj.matches - array of all the foreach sections, stripped without tags
// obj.text - base text replaced with $x$ for each "foreach" section 
function getForeachObject(main) {
    console.log(main)
    var ret = {}

    var tmp = main.match(/\<foreach\>([\s\S]+?)\<\/foreach\>/gm);

    var i = 0;
    ret.text = main.replace(/\<foreach\>([\s\S]+?)\<\/foreach\>/gm, function() { return "$"+(i++)+"$"; } );
    
    ret.matches = []
    tmp.forEach(function(w) {
        var str = w.substring(9,w.length-10)
        ret.matches.push(str);
    })
    return ret;
}




function process(data, template) {
    var separators = getSeparators(template);
    template = hideSeparators(template);
    
    var rows = data.split("\n");
    var i = 0;
    var foreaches = getForeachObject(template);
    var finalText = foreaches.text;
    foreaches.matches.forEach(m => {
        var txt = ""
        rows.forEach(r => {
            var cols = r.split(new RegExp(separators.join("|"),"g"));
            txt += replaceWords(m,cols);
        });
        console.log(txt);
        finalText = finalText.replace("$"+(i++)+"$",txt);
    });
    return finalText;
}


/*  
console.log(hideSeparator(` <sep=A> 
wrgwrgwr
<sep="> aergerg`))

var obj = execForeach(` awfwfwef <foreach>POCETAK aerer

eberberb erbKRAJ</foreach>   avwerwerf <foreach>1 aergegeg 2</foreach>`);

console.log(obj.Matches[0])

console.log(obj.Text)
*/
