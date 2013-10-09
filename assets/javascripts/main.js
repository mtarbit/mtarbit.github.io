$(function(){
    pageFooter.init();
    pageSplash.init();
});


var pageFooter = {};

pageFooter.init = function(){
    this.$footer = $('.page-footer');
    if (!this.$footer.length) return;

    var self = this;

    $(window).on('resize', function(){
        self.resetElements();
        self.styleElements();
    }).resize();
};

pageFooter.resetElements = function(){
    this.$footer.css({ position: 'static', bottom: 'auto' });
    this.footerWidth = this.$footer.width();
};

pageFooter.styleElements = function(){
    var y1 = $(window).height();
    var y2 = this.$footer.offset().top + this.$footer.outerHeight();
    if (y1 > y2) {
        this.$footer.css({ position: 'absolute', bottom: 0, width: this.footerWidth });
    }
};


var pageSplash = {};

pageSplash.init = function(){
    this.$splash = $('.page-splash');
    if (!this.$splash.length) return;

    this.$canvas = $('<canvas class="page-splash-canvas">');
    this.$splash.after(this.$canvas);

    this.canvas = this.$canvas.get(0);

    this.origBackground = this.$splash.css('background');
    this.origMarginBottom = this.$splash.css('marginBottom');

    if (this.canvas.getContext) {
        this.ctx = this.canvas.getContext('2d');

        var self = this;

        $(window).on('resize', function(){
            self.stretchCanvas();
            self.paintCanvas();
        }).resize();

    } else {
        this.resetElements();
        this.$canvas.remove();
    }
};

pageSplash.resetElements = function(){
    this.$splash.css({ width: 'auto', height: 'auto', position: 'relative', background: this.origBackground });
    this.$canvas.css({ width: 'auto', height: 'auto' });
};

pageSplash.styleElements = function(){
    this.W = this.$splash.width();
    this.H = this.$splash.height();

    this.w = this.$splash.outerWidth();
    this.h = this.$splash.outerHeight();

    this.$splash.css({ width: this.W + 'px', height: this.H + 'px', position: 'absolute', background: 'none' });
    this.$canvas.css({ width: this.w + 'px', height: this.h + 'px', display: 'block', background: this.origBackground, marginBottom: this.origMarginBottom });
    this.$canvas.attr({ width: this.w, height: this.h });
};

pageSplash.stretchCanvas = function(){
    this.resetElements();
    this.styleElements();
};

pageSplash.paintCanvas = function(){
    var fh = 10;

    this.ctx.clearRect(0, 0, this.w, this.h);

    this.ctx.font = fh + "px 'Courier'";
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = 'rgba(255,255,255, 0.2)';

    var fw = this.ctx.measureText('\u2571').width;

    var rows = Math.ceil(this.h / fh);
    var cols = Math.ceil(this.w / fw);

    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            var x = c * fw;
            var y = r * fh;

            // if (Math.random() < (r / rows)) {
            //   var s = String.fromCharCode(33 + Math.round(Math.random() * 93));
            // } else {
                var s = (Math.random() > 0.5) ? '\u2571' : '\u2572';
            // }

            this.ctx.fillText(s, x, y);
        }
    }
};
