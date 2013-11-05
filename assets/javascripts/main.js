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

    this.origBackground = this.$splash.css('backgroundColor');
    this.origMarginBottom = this.$splash.css('marginBottom');

    if (this.canvas.getContext) {
        this.renderer = pageSplashTris;

        var self = this;

        $(window).on('resize', function(){
            self.resetElements();
            self.styleElements();

            self.renderer.init(self, self.canvas.getContext('2d'));
            self.renderer.paint();

            // self.animate();
        }).resize();

    } else {
        this.resetElements();
        this.$canvas.remove();
    }
};

pageSplash.resetElements = function(){
    this.$splash.css({ width: 'auto', height: 'auto', position: 'relative', background: this.origBackground });
    this.$canvas.css({ width: 'auto', height: 'auto', display: 'none' });
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

pageSplash.animate = function() {
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }

    this.renderer.paintFrame();

    this.timeoutId = setTimeout(function(){
        this.animate();
    }.bind(this), 30);
};


var pageSplashTris = {};

pageSplashTris.init = function(splash, canvasContext){
    this.splash = splash;
    this.ctx = canvasContext;

    var triSide = 24;

    this.paintW = triSide / 2;
    this.paintH = Math.sqrt(Math.pow(triSide, 2) - Math.pow(this.paintW, 2));

    this.rows = Math.ceil(this.splash.h / this.paintH);
    this.cols = Math.ceil((this.splash.w / this.paintW) + 1);
};

pageSplashTris.paint = function(){
    this.ctx.clearRect(0, 0, this.splash.w, this.splash.h);

    for (var r = 0; r < this.rows; r++) {
        for (var c = 0; c < this.cols; c++) {
            this.paintTriangle(r, c);
        }
    }
};

pageSplashTris.paintFrame = function() {
    var r = Math.round(Math.random() * this.rows);
    var c = Math.round(Math.random() * this.cols);
    this.paintTriangle(r, c, true);
};

pageSplashTris.paintTriangle = function(r, c, clear) {
    var x = c * this.paintW;
    var y = r * this.paintH;
    var n = Math.random();

    var oddCol = c % 2;
    var oddRow = r % 2;

    this.ctx.save();
    this.ctx.translate(x, y);

    this.ctx.beginPath();
    if ((!oddRow && oddCol) || (oddRow && !oddCol)) {
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo( this.paintW, this.paintH);
        this.ctx.lineTo(-this.paintW, this.paintH);
    } else {
        this.ctx.moveTo(-this.paintW, 0);
        this.ctx.lineTo( this.paintW, 0);
        this.ctx.lineTo(0, this.paintH);
    }
    this.ctx.closePath();

    if (clear) {
        this.ctx.fillStyle = this.splash.origBackground;
        this.ctx.fill();
    }

    if (Math.random() > 0.5) {
        this.ctx.fillStyle = 'rgba(51,51,51, ' + (n * 0.05) + ')';
        this.ctx.fill();
    } else {
        this.ctx.fillStyle = 'rgba(255,255,255, ' + (n * 0.05) + ')';
        this.ctx.fill();
    }

    this.ctx.restore();
};


var pageSplashMaze = {};

pageSplashMaze.init = function(splash, canvasContext){
    this.splash = splash;
    this.ctx = canvasContext;

    this.paintH = 10;

    this.ctx.font = this.paintH + "px 'Courier'";
    this.ctx.textBaseline = 'top';

    this.paintW = this.ctx.measureText('\u2571').width;

    this.rows = Math.ceil(this.splash.h / this.paintH);
    this.cols = Math.ceil(this.splash.w / this.paintW);
};

pageSplashMaze.paint = function(){
    this.ctx.clearRect(0, 0, this.splash.w, this.splash.h);
    this.ctx.fillStyle = 'rgba(255,255,255, 0.125)';

    for (var r = 0; r < this.rows; r++) {
        for (var c = 0; c < this.cols; c++) {
            this.paintText(r, c);
        }
    }
};

pageSplashMaze.paintFrame = function() {
    var c = Math.floor(Math.random() * this.cols);
    var r = Math.floor(Math.random() * this.rows);
    this.paintText(r, c, true);
};

pageSplashMaze.paintText = function(r, c, clear) {
    var w = this.paintW;
    var h = this.paintH;

    var x = c * w;
    var y = r * h;
    var s = (Math.random() > 0.5) ? '\u2571' : '\u2572';

    if (clear) {
        this.ctx.clearRect(x + 1, y + 1, w, h);
    }

    this.ctx.fillText(s, x, y);
};


var pageSplashRect = {};

pageSplashRect.init = function(splash, canvasContext){
    this.splash = splash;
    this.ctx = canvasContext;

    this.paintH = 18;
    this.paintW = this.paintH;

    this.rows = Math.ceil(this.splash.h / this.paintH);
    this.cols = Math.ceil(this.splash.w / this.paintW);
};

pageSplashRect.paint = function(){
    this.ctx.clearRect(0, 0, this.splash.w, this.splash.h);

    for (var i = 0; i < 1000; i++) {
        this.paintFrame();
    }
};

pageSplashRect.paintFrame = function() {
    var r = Math.floor(Math.random() * this.rows);
    var c = Math.floor(Math.random() * this.cols);
    this.paintSquare(r, c, true);
};

pageSplashRect.paintSquare = function(r, c, clear) {
    var w = this.paintW;
    var h = this.paintH;

    var x = c * w;
    var y = r * h;

    var n = 0.05 * Math.random();
    var p = clear ? Math.pow(2, Math.floor(3 * Math.random())) : 1;

    w *= p;
    h *= p;
    x -= (w * 0.5);
    y -= (h * 0.5);

    if (clear) {
        this.ctx.clearRect(x, y, w, h);
    }

    if (Math.random() > 0.5) {
        this.ctx.fillStyle = 'rgba(51,51,51, ' + n + ')';
    } else {
        this.ctx.fillStyle = 'rgba(255,255,255, ' + n + ')';
    }

    this.ctx.fillRect(x, y, w, h);
};

