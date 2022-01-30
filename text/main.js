    let jatekMezo, mezoSzelesseg, mezoMagassag, ufo;
    let ufoTomb = [];
    let start_ufoX = 100;
    let start_ufoY = 100;
    let end_ufoY = 700;
    let ufoNum =10;
    let x = (end_ufoY-start_ufoY)/ufoNum;
    let pont =0;
    let eletek =0;
    let vedo;
    let vedoSzelesseg = x, vedoMagassag;
    let vedoElmozdulas = vedoSzelesseg/2;
    let time=600;
    let init;
    let betolt=true;
    var zene;
    var enemyBoom;
    var lovesAudi;
    let sebesseg=0;


$(document).ready(function (){
    //pont es eletero ki íratása
    $("#pontSzam").text("Pont szám: "+pont);
    $("#elet").text("Életek száma: "+eletek);
    //ranglista megjelenitése
    listaKirajzol();
    $(".games").append("<div class='indito'>Inditáshoz nyomd meg az entert<div>");
    $(window).on('keydown',jatekIndit);

    setInterval(lovesTalalat, 1);
});

function jatekIndit(ev){
    let press_Key = ev.key;
    if (press_Key === 'Enter' && betolt){

        $(".indito").remove("");
        eletek = 3;
        pont = 0;
        $("#pontSzam").text("Pont szám: "+pont);

        $("#elet").text("Életek száma: "+eletek);
        gameStart();
        betolt=false
    }
}


function gameStart() {
    //hatter zene lejatszasa
    zene = new Audio('sound/mus.mp3');
    zene.loop=true;
    zene.volume = 0.1;
    zene.play();

//jatek ter meghatarozas
    jatekMezo = $('.games');
    mezoSzelesseg = parseInt(jatekMezo.css("width"));
    mezoMagassag = parseInt(jatekMezo.css("height"));




//vedo betoltese és kirajzolasa
    vedo = $('<img src="./imgs/def.png" class="defender"/>');
    jatekMezo.append(vedo);
    vedo.on("load", function (){
        initVedo();
    });
//mozgatas meghivasa
    $(window).on('keydown',mozgatVedo);

//ufok megjelenitese
    ufo = $('<img src="./imgs/ufo.png" id="ufo">');
    ufo.on("load", function (){
        initUfo();
    });

    init = setInterval(mozgatUfoOda,time)
}

function initUfo(){
    for (let i = 0; i < ufoNum; i++) {
        ufoTomb.push({
            ufoX: start_ufoX + i * x,
            ufoY: start_ufoY,
            pontUfo: 10,
            kep: ufo.clone()
        });
    }
    rejzolUfo();
}
function rejzolUfo(){
    for ( let i in ufoTomb) {
        let a = ufoTomb[i];
        let kepK = a.kep;
        jatekMezo.append(kepK)
        kepK.css({
            left: a.ufoX,
            top: a.ufoY,
            width: x,
        });

        kepK.addClass('ufo');
    }

}


function initVedo(){
    vedo.css({
        width: vedoSzelesseg,
    });
    vedoMagassag = parseInt(vedo.css("height"));

    vedo.css({
       top: mezoMagassag-vedoMagassag,
        left: (mezoSzelesseg-vedoSzelesseg)/2,
    });

}
function mozgatVedo(ev){
    let cselekves = ev.key;
    if (cselekves === 'ArrowRight'){
        if (parseInt(vedo.css('left'))+vedoSzelesseg<mezoSzelesseg){
            vedo.animate({
                left: '+=' +vedoElmozdulas
            }, 1)
        }else{
            vedo.animate({
                left: mezoSzelesseg-vedoSzelesseg
            },10)
        }
    }
    else if (cselekves === 'ArrowLeft'){
        if (parseInt(vedo.css('left'))-vedoElmozdulas>0){
            vedo.animate({
                left: '-=' +vedoElmozdulas
            },1)
        }else{
            vedo.animate({
                left: 0
            },1)
        }
    }else if (cselekves === ' '){
        loves();
    }
}

function loves(){
    if ($('.loves').length===0) {
        let vedoX = vedo.position().left - (vedoSzelesseg / 2);
        let vodoY = vedo.position().top - vedoMagassag;
        let lovedek = $('<img src="imgs/bomb.jpg">');

        lovedek.css({
            left: vedoX,
            top: vodoY,
            position: 'relative'
        });

        lovesAudi = new Audio('sound/pew.wav');
        lovesAudi.play();
        lovedek.animate({
            top: -100
        }, 2000, function () {
            lovedek.remove();
        });
        lovedek.addClass('loves');
        jatekMezo.append(lovedek);
    }

}
function lovesTalalat(){
    $('.loves').each(function (){
        let lovesACC = $(this);
        let x = lovesACC.position().left;
        let y = lovesACC.position().top;

        $('.ufo').each(function (){
          let ufoX = $(this).position().left+vedoElmozdulas;
          let ufoY = $(this).position().top+parseInt(ufo.css('height'))/2;

            if (osszehasonlit({x: x, y: y}, {x: ufoX, y: ufoY}) <= parseInt($(this).css('height')) / 2) {
                $(this).remove();
                lovesACC.remove();
                pont += 10;
                $("#pontSzam").text("Pont szám: "+pont);
                enemyBoom =new Audio('sound/boom.wav');
                enemyBoom.play();
                if ($('.ufo').length===0){
                    setTimeout(function(){ nyeres(); }, 100);
                }
            }

        })


    });
    function osszehasonlit(a, b) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;

        return Math.sqrt(dx * dx + dy * dy)
    }
}

function mozgatUfoOda(){
    console.log($(".ufo"));
        if ($(".ufo").last().position().left < mezoSzelesseg-x){
            $(".ufo").css({
                left: '+=20'
            });
        }else {
            if ($(".ufo").position().top < mezoMagassag-x-vedoMagassag){
                clearInterval(init);
                mozgatUfoLe();
                init = setInterval(mozgatUfoVissza, time);
            }else {
                clearInterval(init);
            }
        }
}
function mozgatUfoVissza(){
    if ($(".ufo").position().left > 0){
        $(".ufo").css({
            left: '-=20'
        });
    }else {
        if ($(".ufo").position().top < mezoMagassag-x-vedoMagassag) {
            clearInterval(init)
            mozgatUfoLe();
            init = setInterval(mozgatUfoOda, time);
        }
        else {
            clearInterval(init)
            vereseg();
        }
    }
}
function mozgatUfoLe(){
    sebesseg++;
    console.log(sebesseg);
    time = Math.max(200,time - sebesseg*10);
    if ($(".ufo").position().top < mezoMagassag-x-vedoMagassag){
        $(".ufo").css({
            top: '+=20'
        });
    }else {
        clearInterval(init)
    }
}
function nyeres(){
    zene.pause();
    $(".ufo").remove();
    $(".defender").remove();
    $('.loves').remove();

    $(".games").append("<div class='indito'><br><br><h1>Nyertél ember woow</h1> újra játszhatod ha megnyomod az F5-t<div>");
    eredmenyMent();
    clearInterval(init);
    pont=0;
}

function vereseg(){
    zene.pause();
    eletek = 0;
    $("#elet").text("Életek száma: "+eletek);
    $(".ufo").remove();
    $(".defender").remove();
    clearInterval(init);
    $(".games").append("<div class='indito'><br><br><h1>Kikaptál</h1> újra játszhatod ha megnyomod az F5-t<div>");
    eredmenyMent();
}
function eredmenyMent(){
    var jatekos = prompt("Adja meg a nevét:", "Defender01");
    localStorage.setItem(jatekos, Number(pont));

    listaKirajzol();
}

function listaKirajzol(){
    $(".toplist").remove();
    $('body').append('<div class="toplist">');
    var adat = [];
    for (var i = 0; i < localStorage.length; i++) {
        adat[i] = [localStorage.key(i), parseInt(localStorage.getItem(localStorage.key(i)))];
    }
     adat.sort(function (elso, masodik) {
        return masodik[1] - elso[1];
    });
    var helyezes =1;
    for (let acc of adat.keys()) {
        if (acc <= 5) {
            $('.toplist').append(helyezes+'. '+adat[acc][0] + ' - ' + adat[acc][1] + '<br><hr>');
            helyezes++;
        }
    }
}
