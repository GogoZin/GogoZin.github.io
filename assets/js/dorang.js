/*!
=========================================================
* Dorang Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

 // toggle 
$(document).ready(function(){
    // function switchGame(this) {
    //     const game = document.getElementById("game-container");
    //     const gamePath = "";
    //     switch (this.value) {
    //         case "maplestory":
    //             gamePath = "./gamelist/Maplestory/index.html";
    //             break;
    //         default:
    //             break;
    //     }
    //     const iframe = '<iframe src="' + gamePath + '" width="100%" height="768px" style="overflow-y: hidden;" class="border-0"></iframe>';
    //     game.innerHTML = iframe;
    // }

    $('.search-toggle').click(function(){
        $('.search-wrapper').toggleClass('show');
    });

    $('.modal-toggle').click(function(){
        $('.modalBox').toggleClass('show');
    })

    $('.modalBox').click(function(){
        $(this).removeClass('show');
    });

    $('.spinner').click(function(){
        $(".theme-selector").toggleClass('show');
    });
    $('.light').click(function(){
        $('body').addClass('light-theme');
        $('body').removeClass('dark-theme');
    });
    $('.dark').click(function(){
        $('body').toggleClass('dark-theme');
        $('body').removeClass('light-theme');
    });
});



// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });

    $(".game-btn").on('click', function() {
        const block = document.getElementById("game-container");
        const gameName = this.value;
        switch (gameName) {
            case "maplestory":
                gamePath = './gamelist/Maplestory/index.html';
                break;
            case "slot":
                gamePath = './gamelist/Slot/index.html';
                break;
            case "pokerfive":
                gamePath = './gamelist/5PK/index.html';
                break;
            case "chess":
                gamePath = './gamelist/Chess/index.html';
                break;
            case "reversi":
                gamePath = './gamelist/Reversi/index.html';
                break;
            default:
                break;
        };
        const frame = '<iframe src="' + gamePath + '" width="100%" height="768px" style="overflow-y: hidden;" class="border-0"></iframe>'
        block.innerHTML = frame;
    });

    $(".direct-btn").on('click', function() {
        const link = this.value;
        console.log(link);
        window.open(link, '_blank');
    });
}); 

