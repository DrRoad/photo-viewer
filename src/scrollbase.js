// Borrowed from gmail's iphone mobile website.
// Not used in code, just for reference.

function Rka(a) {
    return vb(arguments, function (a, c) {
        return a + c
    }, 0)
}
function p7(a) {
    return Rka.apply(m, arguments) / arguments.length
}
function q7(a) {
    a %= 360;
    return 0 > 360 * a ? a + 360 : a
}
function r7(a, b, c) {
    a.style.left = b + "px";
    a.style.top = c + "px"
}
function s7(a) {
    a = $d(a).webkitTransform;
    return "undefined" != typeof WebKitCSSMatrix ? new WebKitCSSMatrix(a) : "undefined" != typeof MSCSSMatrix ? new MSCSSMatrix(a) : "undefined" != typeof CSSMatrix ? new CSSMatrix(a) : {}
}

function t7(a, b) {
    var c = q7(b) - q7(a);
    180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
    return c
}
function u7(a, b, c) {
    return Math.min(Math.max(a, b), c)
}
function v7(a, b, c, d) {
    if (Ec(b, 0)) return Ska;
    Ec(a, b) ? a = [0, 0] : (b = (d - c * b) / (a - b), a = [b, b * a]);
    a = [a[0] / c, a[1] / d];
    c = a[0] * w7;
    d = a[1] * w7;
    return [c, d, c + x7, d + x7]
}
function y7() {
    this.A = []
}
function z7(a) {
    var b = a.A,
        c = b.shift(),
        d = b.shift(),
        e = b.shift(),
        b = b.shift();
    a.P.C6(c, d, e, b)
}
function A7(a) {
    this.B = a;
    this.A = [];
    this.F = B(this.D6, this)
}

function gu(a, b, c, d, e, g, h, l) {
    this.Q = a;
    this.L = a.parentNode;
    this.Q.addEventListener($p, B(this.kk, this), p);
    this.ia = new we(this);
    this.ia.enable(g);
    this.F = xe(this.ia, 0, this);
    a = new y7;
    a.P = this;
    this.G = a;
    this.Y = !! b;
    this.Lb = !! c;
    this.cc = d;
    this.Z = e || 1;
    this.B = B7.xb();
    this.R = B7.xb();
    this.Ca = B7.xb();
    this.A = B7.xb();
    this.Na = 1 == this.Z ? Ce : r7;
    C7(this, x(h) ? h : this.B.x, x(l) ? l : this.B.y);
    this.Qa = []
}
function D7(a, b, c) {
    a.Bb = b;
    a.yb = c;
    E7(a)
}

function E7(a) {
    a.V = new Gc(a.L.offsetWidth, a.L.offsetHeight);
    a.va = new Gc(a.Bb || a.Q.scrollWidth, a.yb || a.Q.scrollHeight);
    var b = new Gc(Math.max(a.V.width, a.va.width), Math.max(a.V.height, a.va.height)),
        c = sv(document.body),
        d;
    c ? (d = b.width - a.V.width, d = a.R.x ? Math.min(d, a.R.x) : d) : d = B7.x - a.R.x;
    a.B = new Fc(d, B7.y - a.R.y);
    a.D = new Fc(c ? a.Ca.x : Math.min(a.V.width - b.width + a.Ca.x, a.B.x), Math.min(a.V.height - b.height + a.Ca.y, a.B.y))
}

function F7(a) {
    var b = u7(a.A.x, a.D.x, a.B.x),
        c = u7(a.A.y, a.D.y, a.B.y);
    (a.A.x != b || a.A.y != c) && C7(a, b, c)
}
function C7(a, b, c) {
    a.A.x = b;
    a.A.y = c;
    a.Na(a.Q, b, c);
    Ad(a.Q, "f", a)
}
function G7(a, b, c, d) {
    if (!a.W) {
        var e = a.K;
        b = e.x + b;
        d || (b = H7(a) ? I7(b, a.D.x, a.B.x) : 0);
        c = e.y + c;
        d || (c = a.Y ? I7(c, a.D.y, a.B.y) : 0);
        a.Ua || (a.Ua = k, Ad(a.Q, "c", a));
        C7(a, b, c)
    }
}
function H7(a) {
    return a.Lb && a.V.width < a.va.width
}
function I7(a, b, c) {
    a < b ? a -= (a - b) / 2 : a > c && (a -= (a - c) / 2);
    return a
}

function J7(a, b) {
    Ad(a.Q, "e", a);
    if (b && a.cc && !a.I) {
        var c;
        H7(a) || (b.x = 0);
        a.Y || (b.y = 0);
        c = a.G.start(b, a.D, a.B, a.A)
    }
    c ? Ad(a.Q, "g", a) : (F7(a), Ad(a.Q, "d", a), a.Ua = p)
}
function K7(a) {
    var b = a.Q;
    a.I = p;
    Ae(b, 0, j, j);
    Ad(a.Q, "d", a);
    a.Ua = p
}
function L7(a, b) {
    this.A = a;
    var c = this.A.ia;
    this.B = xe(c, 1, b);
    this.D = c.A[0]
}

function M7(a, b, c, d, e) {
    this.Q = a;
    this.K = a.parentNode.parentNode;
    a = b || new gu(a.parentNode, k, k, k, j, c);
    this.A = new L7(a, this);
    this.cc = this.V = d || 1;
    this.W = e || 4;
    this.I = N7.xb();
    this.L = N7.xb();
    this.Y = N7.xb();
    this.Z = N7.xb();
    this.F = N7.xb();
    this.Ua = []
}
function O7(a) {
    var b = a.A.A;
    b.K = b.A.xb();
    var b = a.Ox(),
        c = gd(b);
    a.R && (c.x = dd().offsetWidth - b.offsetWidth + c.x);
    a.yv(c.x, c.y + b.offsetHeight / 2, 0, 0)
}
function P7(a, b) {
    b < a.V ? b -= 0.5 * (b - a.V) : b > a.W && (b -= 0.8 * (b - a.W));
    return b
}
function Q7(a, b, c) {
    M7.call(this, a, j, j, b, c)
}

function JS(a, b, c) {
    this.Q = a.O();
    this.B = b;
    this.L = c;
    this.K = a;
    this.G = []
}
function R7(a, b) {
    a.D.style.visibility = !b ? "" : "hidden";
    a.B[a.A].style.visibility = b ? "" : "hidden";
    a.F = b
}
function S7(a, b, c) {
    var d = b < a.I;
    a.I = b;
    var e = a.A + 1,
        g = a.G[e],
        h = a.G[a.A],
        l = a.R,
        n = a.K.B.y;
    b >= n && !a.F ? R7(a, k) : b < n && a.F && R7(a, p);
    d && a.A < a.B.length ? g <= -b ? T7(a, e, 0) : !c && g < l - b && Ce(a.D, 0, g + b - l) : !d && 0 < a.A && h > -b ? T7(a, a.A - 1, Math.min(0, c ? 0 : h + b - l)) : !c && (!d && 0 < g + b) && (b = Math.min(0, -l + g + b), Ce(a.D, 0, b))
}

function T7(a, b, c) {
    if (x(a.A) && a.A == b) Ce(a.D, 0, c);
    else {
        var d = a.B[a.A],
            e = a.B[b];
        e.style.visibility = "hidden";
        a.D.innerHTML = e.innerHTML;
        Ce(a.D, 0, c);
        d && (d.style.visibility = "");
        a.A = b;
        a.F = p
    }
}
function U7(a) {
    a.G = [];
    for (var b = 0, c; c = a.B[b]; b++) Ce(c, 0, 0), a.G.push(c.offsetTop)
}
function HQ(a) {
    this.D = a
}
function wQ(a, b, c) {
    Q7.call(this, a, b, c)
}
function V7(a) {
    a.D || (a.O().parentNode.parentNode.style.height = Math.round(4 * a.G.height * a.W) + "px", a.D = k)
}

function W7(a) {
    if (!a.Ca) {
        for (var b = a.O(); b && "scroll" != ($d(b) || []).overflowY;) b = b.parentNode;
        b || (b = document.body);
        a.Ca = b
    }
    return a.Ca
}
function z_(a, b) {
    this.A = a;
    this.F = b
}
function LP(a, b) {
    this.D = a;
    this.F = b
}
function IP(a, b, c) {
    this.Je = a;
    this.B = b;
    this.A = c;
    this.L = new we(this);
    this.K = []
}
function X7(a) {
    var b = a.B.length;
    a.Je.style.width = 100 * b + "%";
    for (var b = 100 / b + "%", c = 0, d; d = a.B[c]; c++) d.style.width = b
}
function Y7(a) {
    Ad(a.Je, "i", a, {
        zqa: a.I,
        Qja: a.D
    })
}

function Z7(a) {
    var b = ue(a.F);
    (!a.A && 0 < b * a.G || a.A == a.B.length - 1 && 0 > b * a.G) && (b *= a.FI);
    a.D = a.I + b
}
function $7(a, b, c, d, e) {
    a.ho && a.ho(p);
    var g = a.A;
    a.A = b;
    a8(a, e);
    var h = {
        S5: g,
        N5: b,
        g$: !! c,
        xi: !! d,
        Cqa: e || 0
    };
    Ad(a.Je, "j", a, h);
    if (d) {
        var l = function (a) {
            l == this.ho && (this.ho = j, Ad(this.Je, "k", this, {
                eja: h,
                r0: a
            }))
        };
        a.ho = l;
        window.setTimeout(B(l, a, k), e)
    }
}
function a8(a, b) {
    b ? Ae(a.Je, b, "-webkit-transform", "ease-out") : Be(a.Je);
    a.Je.style.webkitTransform = x(a.D) ? b8(a.D, p) : b8(-100 * a.A * a.G / a.B.length, k)
}

function b8(a, b) {
    return Zp ? "translate3d(" + a + (b ? "%" : "px") + ",0,0)" : "translate(" + a + (b ? "%" : "px") + ",0)"
}
function JP(a, b) {
    this.A = a;
    this.B = b
}
function KP(a) {
    this.G = a
}
T.B("scrollbase");
var x7 = 1 / 3,
    w7 = 2 / 3,
    Ska = [x7, w7, w7, 1];
y7.prototype.F = -5E-4;
y7.prototype.start = function (a, b, c, d) {
    var e = Math.abs(a.y) >= Math.abs(a.x),
        g = e ? a.y : a.x;
    a = e ? b.y : b.x;
    var h = e ? c.y : c.x,
        l = e ? d.y : d.x;
    b = u7(e ? d.x : d.y, e ? b.x : b.y, e ? c.x : c.y);
    if (l < a || l > h) a = l < a ? a : h, this.A.push(e ? b : a, e ? a : b, 500, "ease-out");
    else if (0.25 <= Math.abs(g)) {
        d = (c = 0 > g) ? -this.F : this.F;
        var n = c ? a - l : h - l,
            s = g;
        if (n) {
            var s = g * g,
                v = 2 * d,
                w = -s / v;
            Math.abs(w) < Math.abs(n) ? (n = w, s = 0) : (s = Math.sqrt(s + v * n), s *= 0 > g ? -1 : 1);
            this.I = s;
            this.D = (s - g) / d;
            this.G = n;
            g = "cubic-bezier(" + v7(g, this.I, this.D, this.G).join(",") + ")";
            l = l + this.G;
            this.A.push(e ? b : l, e ? l : b, this.D, g);
            s = this.I
        }
        0 != s && (a = c ? a : h, l = 50 * s, h = a + l, this.D = 2 * l / (s + 0), g = "cubic-bezier(" + v7(s, 0, this.D, l).join(",") + ")", this.A.push(e ? b : h, e ? h : b, this.D, g), this.A.push(e ? b : a, e ? a : b, 500, "ease-out"))
    }
    if (this.A.length) return this.B = k, z7(this), k
};
y7.prototype.kk = function () {
    this.B && (this.A.length ? z7(this) : (this.B = p, K7(this.P)))
};
y7.prototype.stop = function () {
    this.B = p;
    this.A = [];
    K7(this.P)
};
t = A7.prototype;
t.ub = function () {
    var a = this.B.O();
    this.G = a;
    zd(a, "f", B(this.uV, this));
    zd(a, "g", B(this.E6, this));
    zd(a, "d", B(this.Lca, this))
};
t.addListener = function (a) {
    this.A.push(a)
};
t.E6 = function () {
    window.clearInterval(this.D);
    this.D = window.setInterval(this.F, 30)
};
t.uV = function () {
    if (!this.B.G.B) for (var a = this.B.A.y, b = 0; b < this.A.length; b++) S7(this.A[b], a, j)
};
t.Lca = function () {
    window.clearInterval(this.D);
    this.uV()
};
t.D6 = function () {
    for (var a = s7(this.G).m42, b = 0; b < this.A.length; b++) S7(this.A[b], a, k)
};
var B7 = new Fc(0, 0);
t = gu.prototype;
t.WY = k;
t.Xaa = function (a) {
    this.Z = a;
    this.Na = 1 == a ? Ce : r7;
    1 != a && (Be(this.Q), this.Q.style.webkitTransform = "");
    2 != a && r7(this.Q, 0, 0);
    this.Na(this.Q, this.A.x, this.A.y)
};
t.reset = function () {
    this.stop();
    this.F.reset();
    var a = this.Q;
    this.I = p;
    Ae(a, 0, j, j);
    this.uk();
    C7(this, sv(document.body) ? this.D.x : this.B.x, this.B.y)
};
t.uk = function () {
    E7(this);
    F7(this)
};
t.vV = da("Y");
t.$aa = function (a) {
    C7(this, this.A.x, a)
};
t.Nx = function () {
    return (this.A.y - this.D.y) / (this.B.y - this.D.y)
};
t.bx = function (a) {
    this.R.x = 0;
    this.R.y = a;
    E7(this)
};
t.nt = function (a, b, c, d) {
    if (c && 1 == this.Z) {
        var e = this.Q;
        this.I = 0 < c;
        Ae(e, c, "-webkit-transform", d)
    }
    C7(this, a, b)
};
t.kk = function (a) {
    a.target == this.Q && (this.I = p, this.G.kk())
};
t.stop = function () {
    if (this.G.B) if (2 == this.Z) this.G.stop();
    else {
        var a = s7(this.Q);
        if (this.I) {
            this.A.x = a.m41;
            this.A.y = a.m42;
            this.W = k;
            var b = this;
            window.setTimeout(function () {
                var c = s7(b.Q),
                    d = b.Q;
                b.I = p;
                Ae(d, 0, j, j);
                window.setTimeout(function () {
                    b.W = p
                }, 0);
                d = c.m41 + 2 * (c.m41 - a.m41);
                c = c.m42 + 2 * (c.m42 - a.m42);
                d = u7(d, b.D.x, b.B.x);
                c = u7(c, b.D.y, b.B.y);
                b.G.stop();
                C7(b, d, c)
            }, 0)
        } else {
            var c = a.m41,
                d = a.m42;
            this.G.stop();
            C7(this, c, d)
        }
    }
};
t.Qw = function (a) {
    if (this.F.G) return k;
    this.uk();
    this.G.B ? (a.preventDefault(), this.Hb || a.stopPropagation(), this.stop()) : (a = this.Q, this.I = p, Ae(a, 0, j, j));
    this.K = this.A.xb();
    F7(this);
    return k
};
t.Wr = ca();
t.iw = function (a) {
    var b = Math.abs(te(this.F)) > Math.abs(ue(this.F));
    if (this.dc && !b || !this.Y && (!H7(this) || b)) return p;
    for (var b = 0, c; c = this.Qa[b]; ++b) if (!c.B(this, a)) return p;
    for (b = 0; c = this.Qa[b]; ++b) c.A(this, a);
    return k
};
t.hw = function (a) {
    this.WY || a.stopPropagation();
    G7(this, ue(this.F), te(this.F))
};
t.gw = function () {
    J7(this, this.F.Ia)
};
t.O = q("Q");
t.C6 = gu.prototype.nt;
t.VF = function () {
    this.Hb = k
};
t.Mx = function (a) {
    this.Qa.push(a)
};
L7.prototype.reset = function () {
    this.A.reset()
};
var N7 = new Fc(0, 0);
t = M7.prototype;
t.ub = function () {
    this.R = sv(this.K);
    this.G = new Gc(this.Q.scrollWidth, this.Q.scrollHeight);
    this.Q.style.width = this.G.width + "px";
    this.Q.style.webkitTransformOriginX = this.R ? this.G.width + "px" : "0";
    this.Q.style.webkitTransformOriginY = "0";
    this.Vs();
    this.V = this.cc * this.B;
    this.A.A.VF();
    this.Na = this.K.offsetWidth
};
t.Ed = function () {
    this.Na != this.K.offsetWidth && (this.oo(), this.Na = this.K.offsetWidth)
};
t.oo = function () {
    O7(this);
    this.jp(k)
};
t.jp = function (a) {
    var b = this.K.offsetWidth / this.Na;
    this.V *= b;
    var c = this.L.x,
        d = this.L.y;
    this.B = P7(this, this.ia * b);
    this.Y.x = c;
    this.Y.y = d;
    this.Sx(a, k)
};
t.Tp = function (a) {
    var b = this.B / this.ia,
        c = this.I.x * (1 - b) * (this.R ? -1 : 1),
        b = this.I.y * (1 - b),
        d = this.Z.x,
        e = this.Z.y,
        d = d + (this.Y.x - this.L.x);
    this.R && (d *= -1);
    e += this.Y.y - this.L.y;
    this.Dy(c + d, b + e);
    this.Am(a);
    a = Math.round(this.F.x);
    c = Math.round(this.F.y);
    G7(this.A.A, a, c, k);
    this.pt()
};
t.Dy = function (a, b) {
    this.F.x = a;
    this.F.y = b
};
t.Am = function (a) {
    a ? (Ae(this.Q, 500, "-webkit-transform", "ease-out"), Ae(this.A.A.O(), 500, "-webkit-transform", "ease-out")) : (Be(this.Q), Be(this.A.A.O()))
};
t.pt = function () {
    Ce(this.Q, 0, 0, j, j, this.B)
};
t.$E = function (a, b) {
    var c = this.B;
    this.B = u7(this.B, this.V, this.W);
    this.Js();
    var d = (this.A.A.A.x - this.A.A.D.x) / (this.A.A.B.x - this.A.A.D.x),
        e = this.yV();
    (b || this.B != c || 0 > d || 1 < d || 0 > e || 1 < e) && this.Tp(a)
};
t.Vs = function () {
    this.B = this.RL();
    this.Js();
    this.pt();
    this.A.reset()
};
t.RL = function () {
    return Math.min(this.K.offsetWidth / this.Q.scrollWidth, this.K.offsetHeight / this.Q.scrollHeight)
};
t.Js = function () {
    var a = Math.round(this.B * this.G.width),
        b = Math.round(this.B * this.G.height);
    D7(this.A.A, a, b)
};
t.O = q("Q");
t.yv = function (a, b, c, d) {
    this.ia = this.B;
    var e = gd(this.Q);
    this.R && (e.x = dd().offsetWidth - this.G.width * this.B - e.x);
    this.L.x = a;
    this.L.y = b;
    this.I.x = this.L.x - e.x;
    this.I.y = this.L.y - e.y;
    rv() >= wd(5) && (this.I.y += this.hB());
    this.Z.x = c;
    this.Z.y = d
};
t.km = function (a) {
    var b = this.A.B,
        c = b.B[0] - b.B[1],
        b = b.D[0] - b.D[1];
    this.yb = Math.sqrt(c * c + b * b);
    if (0 == this.yb) return p;
    for (c = 0; b = this.Ua[c]; ++c) if (b.G.F.G) return p;
    for (c = 0; this.Ua[c]; ++c) a._zitsggehp = k;
    a = p7(this.A.B.B[0], this.A.B.B[1]);
    this.R && (a = dd().offsetWidth - a);
    c = p7(this.A.B.D[0], this.A.B.D[1]);
    this.yv(a, c, this.A.A.A.x - this.A.A.K.x, this.xV() - this.cL());
    return this.A.D.L = k
};
t.hB = function () {
    return window.pageYOffset
};
t.Z8 = function () {
    var a = this.A.B,
        b = qe(a, 0) - qe(a, 1),
        a = re(a, 0) - re(a, 1),
        b = Math.sqrt(b * b + a * a) / this.yb,
        a = p7(qe(this.A.B, 0), qe(this.A.B, 1));
    this.R && (a = dd().offsetWidth - a);
    var c = p7(re(this.A.B, 0), re(this.A.B, 1));
    this.B = P7(this, this.ia * b);
    this.Y.x = a;
    this.Y.y = c;
    this.Tp()
};
t.Sx = function (a, b) {
    this.$E(a, b);
    this.Js();
    J7(this.A.A)
};
t.sr = function () {
    this.Sx(k);
    this.A.D.reset()
};
t.Ox = q("K");
t.yV = function () {
    return this.A.A.Nx()
};
t.cL = function () {
    return this.A.A.K.y
};
t.xV = function () {
    return this.A.A.A.y
};
t.Mca = function (a) {
    this.Ua.push(a)
};
E(Q7, M7);
t = Q7.prototype;
t.oo = function () {
    O7(this);
    this.jp()
};
t.jp = function (a) {
    0 > this.I.y && (this.I.y = 0);
    var b = this.G.height * this.B;
    this.I.y > b && (this.I.y = b);
    Q7.M.jp.call(this, a)
};
t.ub = function () {
    Q7.M.ub.call(this);
    this.A.A.vV(p)
};
t.Vs = function () {
    Q7.M.Vs.call(this);
    this.vm()
};
t.vm = function () {
    var a = Math.round(this.G.height * this.B) + "px";
    this.O().parentNode.parentNode.style.height = a
};
t.RL = function () {
    return this.K.offsetWidth / this.Q.scrollWidth
};
t.Tp = function (a) {
    Q7.M.Tp.call(this, a);
    this.mE()
};
t.Am = function (a) {
    Q7.M.Am.call(this, a);
    a && (this.O().style.webkitTransition = "-webkit-transform 500ms ease-out, " + ("height 0ms ease-out " + (this.B < this.dc ? 500 : 0) + "ms"))
};
t.pt = function () {
    Q7.M.pt.call(this);
    this.dc = this.B
};
t.sr = function (a) {
    this.Tp(p);
    Q7.M.sr.call(this, a)
};
JS.prototype.ub = function () {
    this.R = this.B[0].offsetHeight;
    var a = this.L,
        b = document.createElement("div");
    b.className = a;
    Ce(b, 0, 0);
    this.D = b;
    this.Q.parentNode.appendChild(this.D);
    U7(this);
    T7(this, 0, 0);
    a = this.K;
    a.Ia || (a.Ia = new A7(a), a.Ia.ub());
    a.Ia.addListener(this)
};
JS.prototype.I = 0;
JS.prototype.V = function (a) {
    this.B = a;
    U7(this);
    if (a = this.B[this.A]) a.style.visibility = this.F ? "" : "hidden"
};
HQ.prototype.B = function (a, b) {
    return b._nsgghp ? p : this.D ? 0 > te(a.F) ? a.Y && a.A.y > a.D.y : a.Y && a.A.y < a.B.y : k
};
HQ.prototype.A = function (a, b) {
    b._nsgghp = k
};
E(wQ, Q7);
t = wQ.prototype;
t.km = function (a) {
    this.Ia = W7(this).scrollTop;
    return wQ.M.km.call(this, a)
};
t.hB = function () {
    var a = wQ.M.hB.call(this);
    W7(this) != document.body && (a += W7(this).scrollTop);
    return a
};
t.mE = function () {
    var a = Math.round(this.Ia - this.va + this.F.y);
    W7(this).scrollTop = a
};
t.$E = function (a, b) {
    wQ.M.$E.call(this, a, b);
    this.vm();
    this.mE()
};
t.vm = function () {
    wQ.M.vm.call(this);
    this.D = p;
    this.F.y = 0
};
t.Dy = function (a, b) {
    if (rv() < wd(5)) {
        V7(this);
        var c = parseInt(this.O().parentNode.parentNode.style.height, 10);
        this.F.x = a;
        this.F.y = b;
        this.va = b - c / 2
    } else {
        this.F.x = a;
        this.va = b;
        var c = pd(this.Ox(), W7(this)) + this.G.height * this.B,
            d = W7(this).scrollTop - this.F.y,
            e = W7(this),
            c = d + (e == document.body ? window.innerHeight : e.clientHeight) >= c,
            d = pd(this.Ox(), W7(this));
        W7(this).scrollTop - this.F.y <= d && c ? this.vm() : c ? (V7(this), c = parseInt(this.O().parentNode.parentNode.style.height, 10), this.F.y = c - this.G.height * this.B) : (V7(this),
        this.F.y = 0)
    }
};
t.Am = function () {
    wQ.M.Am.call(this, p)
};
t = z_.prototype;
t.ub = function () {
    var a = this.A,
        b = document.createElement("div");
    b.style.cssText = "position:absolute;top:" + a.offsetTop + "px;left:" + a.offsetLeft + "px;height:" + a.offsetHeight + "px;width:" + a.offsetWidth + "px;";
    b.addEventListener("touchstart", B(this.A6, this), p);
    b.addEventListener("touchend", B(this.z6, this), p);
    this.A.offsetParent.appendChild(b);
    this.D = b;
    this.F.O().addEventListener("f", B(this.g8, this), p);
    this.A.addEventListener("blur", B(this.l6, this), p)
};
t.A6 = function () {
    this.B = p
};
t.z6 = function () {
    this.B || F(this.D, p)
};
t.g8 = function () {
    this.B = k
};
t.l6 = function () {
    F(this.D, k)
};
LP.prototype.B = function (a) {
    a = Math.abs(t7(90, q7(180 * Math.atan2(Math.abs(te(a.F) || 0) - 0, (ue(a.F) || 0) - 0) / Math.PI)));
    return this.F ? a <= this.D : a < this.D
};
LP.prototype.A = y;
t = IP.prototype;
t.MC = 500;
t.kca = 0.5;
t.FI = 0.5;
t.IQ = p;
t.ub = function () {
    this.G = sv(this.Je) ? -1 : 1;
    X7(this);
    a8(this);
    this.L.enable(p);
    this.F = xe(this.L, 0, this)
};
t.Waa = function () {
    this.IQ = k
};
t.Oaa = function (a, b) {
    this.B = a;
    X7(this);
    $7(this, b)
};
t.O = q("Je");
t.Qw = r(k);
t.iw = function (a) {
    if (!this.IQ && Math.abs(ue(this.F)) <= Math.abs(te(this.F))) return p;
    for (var b = 0, c; c = this.K[b]; ++b) if (!c.F(this, a)) return p;
    for (b = 0; c = this.K[b]; ++b) c.D(this, a);
    this.ho && this.ho(p);
    Ad(this.Je, "h", this);
    this.I = this.D = -1 * this.Je.parentNode.offsetWidth * this.A * this.G;
    a8(this);
    return k
};
t.hw = function () {
    Z7(this);
    a8(this);
    Y7(this)
};
t.gw = function () {
    Z7(this);
    Y7(this);
    this.Je.style.webkitTransform = b8(100 * this.D / this.Je.offsetWidth, k);
    var a = this.D * this.G,
        b = Math.round(-1 * a / this.Je.parentNode.offsetWidth);
    this.I = this.D = j;
    var c = this.F.Ia,
        c = c ? c.x * this.G : 0,
        d = a + this.A * this.Je.parentNode.offsetWidth;
    if (Math.abs(c) > this.kca) {
        var e = 0 > c;
        0 != d && e != 0 > d ? b = this.A : b == this.A && (b += e ? 1 : -1)
    }
    d = b = Math.max(0, Math.min(b, this.B.length - 1));
    a = Math.abs(a + b * this.Je.parentNode.offsetWidth);
    c ? (a = a !== j ? a : this.Je.parentNode.offsetWidth, c = !a ? 0 : !this.A && 0 < c || this.A == this.B.length - 1 && 0 > c ? this.MC : Math.max(0, Math.min(this.MC, a / (0.6259995851410399 * Math.abs(c))))) : c = this.MC;
    $7(this, d, k, k, c)
};
t.Wr = y;
t.Maa = function () {
    this.FI = 0.08
};
t.wV = function (a) {
    this.K.push(a)
};
JP.prototype.F = function (a) {
    a = Math.abs(t7(0, q7(180 * Math.atan2((te(a.F) || 0) - 0, Math.abs(ue(a.F) || 0) - 0) / Math.PI)));
    return this.B ? a <= this.A : a < this.A
};
JP.prototype.D = y;
KP.prototype.B = function (a) {
    return 0 > ue(a.F) ? H7(a) && a.A.x > a.D.x : H7(a) && a.A.x < a.B.x
};
KP.prototype.A = function (a, b) {
    b._zitsggehp = k
};
KP.prototype.F = function (a, b) {
    return !b._zitsggehp
};
KP.prototype.D = y;
var Eaa = D("Checking for messages...");

function c8(a, b, c, d) {
    Q7.call(this, a, c, d);
    this.D = b;
    this.Bb = this.D.ia.A[0]
}
function Tka(a, b) {
    var c = b + a.G.height * a.B,
        d = a.A.A.L.offsetHeight,
        e = b + d,
        g = a.D.L.offsetHeight,
        h = 0;
    if (0 < b) if (c < g) {
        if (c != e) return
    } else {
        if (e < g) return
    } else if (c < g) {
        if (h = c - e, 0 < b + h) return
    } else if (d >= g) h = -b;
    else return;
    return h
}
function CP(a, b, c, d, e, g) {
    this.Qa = c;
    this.Lb = g;
    c8.call(this, a, b, d, e)
}
E(c8, Q7);
t = c8.prototype;
t.oo = function () {
    var a = this.D;
    a.K = a.A.xb();
    c8.M.oo.call(this)
};
t.ub = function () {
    c8.M.ub.call(this);
    this.D.VF()
};
t.Vs = function () {
    c8.M.Vs.call(this);
    D7(this.D)
};
t.Js = function () {
    c8.M.Js.call(this);
    D7(this.D, j, this.Dd - this.ia * this.G.height + this.B * this.G.height)
};
t.km = function (a) {
    return !c8.M.km.call(this, a) ? p : this.Bb.L = k
};
t.yv = function (a, b, c, d) {
    c8.M.yv.call(this, a, b, c, d);
    this.Bc = pd(this.O(), this.D.L) + this.D.K.y;
    this.Dd = this.D.O().scrollHeight;
    this.Ia = p
};
t.mE = function () {
    G7(this.D, 0, Math.round(this.va), k)
};
t.Dy = function (a, b) {
    this.F.x = a;
    this.F.y = 0;
    this.va = b;
    if (this.Ia) this.vm();
    else {
        var c = Tka(this, this.Bc + this.va);
        x(c) ? (this.va += c, this.F.y -= c) : this.vm()
    }
};
t.Am = function (a) {
    c8.M.Am.call(this, a);
    a ? Ae(this.D.O(), 500, "-webkit-transform", "ease-out") : this.YI()
};
t.YI = function () {
    Be(this.D.O())
};
t.Sx = function (a, b) {
    this.Ia = k;
    c8.M.Sx.call(this, a, b);
    D7(this.D);
    J7(this.D)
};
t.sr = function (a) {
    this.Ia = k;
    c8.M.sr.call(this, a);
    this.Bb.reset()
};
t.Ox = function () {
    return this.D.L
};
t.yV = function () {
    return this.D.Nx()
};
t.cL = function () {
    return this.D.K.y
};
t.xV = function () {
    return this.D.A.y
};
var d8, e8;
E(CP, c8);
t = CP.prototype;
t.km = function (a) {
    var b = this.Lb,
        c;
    e8 || (e8 = {});
    10 <= Zb(e8) && (e8 = {});
    c = e8;
    (!b || !c[b]) && this.Qa.A("sp-z-s");
    b && (c[b] = 1);
    return CP.M.km.call(this, a)
};
t.oo = function () {
    this.Qa.A("sp-z-o");
    CP.M.oo.call(this)
};
t.ub = function () {
    this.Qa.A("sp-z-a");
    CP.M.ub.call(this);
    this.Ca = d8
};
t.jp = function () {
    var a = k;
    0 > this.I.y && (a = p);
    this.I.y > this.G.height * this.B && (a = p);
    var b;
    this.Ca = !this.Ca;
    d8 != this.Ca ? (d8 = this.Ca, b = k) : b = j;
    this.Hb = !b;
    CP.M.jp.call(this, a);
    this.Hb = p
};
t.YI = function () {
    this.Hb || Be(this.D.O())
};
Hh("scrollbase");
T.A("scrollbase");

//@ sourceURL=scrollbase.js
