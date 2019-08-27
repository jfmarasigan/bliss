var itemsMainDiv = ('.multi-carousel');
var itemsDiv = ('.multi-carousel-inner');
var itemWidth = "";

function resCarouselSize() {
    var incno = 0;
    var dataItems = ("data-items");
    var dataPixels = ("data-pixels");
    var itemClass = ('.item');
    var id = 0;
    var btnParentSb = '';
    var btnParentSc = '';
    var itemsSplit = '';
    var pixelsSplit = '';
    var sampwidth = $(itemsMainDiv).width();
    var bodyWidth = $('body').width();

    $(itemsDiv).each(function () {
        id = id + 1;
        var itemNumbers = $(this).find(itemClass).length;
        btnParentSb = $(this).parent().attr(dataItems);
        btnParentSc = $(this).parent().attr(dataPixels);
        itemsSplit = btnParentSb.split(',');
        pixelsSplit = btnParentSc.split(',');
        $(this).parent().attr("id", "multi-carousel" + id);

        if (bodyWidth >= pixelsSplit[3]) {
            incno = itemsSplit[4];
            itemWidth = sampwidth / incno;
        } else if (bodyWidth >= pixelsSplit[2]) {
            incno = itemsSplit[3];
            itemWidth = sampwidth / incno;
        } else if (bodyWidth >= pixelsSplit[1]) {
            incno = itemsSplit[2];
            itemWidth = sampwidth / incno;
        } else if (bodyWidth >= pixelsSplit[0]) {
            incno = itemsSplit[1];
            itemWidth = sampwidth / incno;
        } else {
            incno = itemsSplit[0];
            itemWidth = sampwidth / incno;
        }

        if (itemNumbers <= incno) {
            $(this).css({ 'left': '50%', 'transform': 'translateX(-50%)', 'width': itemWidth * itemNumbers });
            $(".rightLst").addClass("over");
        } else {
            $(this).css({ 'left': '0', 'transform': 'translateX(0px)', 'width': itemWidth * itemNumbers });
            $(".rightLst").removeClass("over");
        }

        $(this).find(itemClass).each(function () {
            $(this).outerWidth(itemWidth);
        });

        $(".leftLst").addClass("over");
    });
}

// USED TO MOVE THE ITEMS
function resCarousel(e, el, s) {
    var leftBtn = ('.leftLst');
    var rightBtn = ('.rightLst');
    var translateXval = '';
    var divStyle = $(el + ' ' + itemsDiv).css('transform');
    var values = divStyle.match(/-?[\d\.]+/g);
    var xds = Math.abs(values[4]);

    if (e == 0) {
        translateXval = parseInt(xds) - parseInt(itemWidth * s);
        $(el + ' ' + rightBtn).removeClass("over");

        if (translateXval <= itemWidth / 2) {
            translateXval = 0;
            $(el + ' ' + leftBtn).addClass("over");
        }
    } else if (e == 1) {
        var itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
        translateXval = parseInt(xds) + parseInt(itemWidth * s);
        $(el + ' ' + leftBtn).removeClass("over");

        if (translateXval >= itemsCondition - itemWidth / 2) {
            translateXval = itemsCondition;
            $(el + ' ' + rightBtn).addClass("over");
        }
    }

    $(el + ' ' + itemsDiv).css('transform', 'translateX(' + -translateXval + 'px)');
}

// USED TO GET SOME ELEMENTS FROM BUTTON
function click(ell, ee) {
    var parent = "#" + $(ee).parent().attr("id");
    var slide = $(parent).attr("data-slide");
    resCarousel(ell, parent, slide);
}

$(document).ready(function () {
    $(window).resize(function () {
        resCarouselSize();
    });

    $('.leftLst, .rightLst').click(function () {
        if ($(this).hasClass("leftLst")) {
            click(0, this);
        } else {
            click(1, this)
        }
    });
});