$(function(){
    bg.init();
});

var bg = {};

bg.init = function(){
    this.$canvas = $('<canvas>');

    this.$splash = $('.box-splash');
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

bg.resetElements = function(){
    this.$splash.css({ width: 'auto', height: 'auto', position: 'relative', background: this.origBackground });
    this.$canvas.css({ width: 'auto', height: 'auto' });
};

bg.styleElements = function(){
    this.W = this.$splash.width();
    this.H = this.$splash.height();

    this.w = this.$splash.outerWidth();
    this.h = this.$splash.outerHeight();

    this.$splash.css({ width: this.W + 'px', height: this.H + 'px', position: 'absolute', background: 'none' });
    this.$canvas.css({ width: this.w + 'px', height: this.h + 'px', background: this.origBackground, marginBottom: this.origMarginBottom });
    this.$canvas.attr({ width: this.w, height: this.h });
};

bg.stretchCanvas = function(){
    this.resetElements();
    this.styleElements();
};

bg.paintCanvas = function(){
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
