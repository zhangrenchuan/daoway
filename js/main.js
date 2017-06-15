!
function(a) {
    "use strict";
    var b = {
        initialised: !1,
        mobile: !1,
        container: a("#portfolio-item-container,#portfolio-item-container2"),
        blogContainer: a("#blog-container"),
        portfolioItemsAnimated: !1,
        init: function() {
            if (!this.initialised) {
                this.initialised = !0,
                this.queryLoad(),
                this.checkMobile(),
                this.videoBg(),
                this.checkPlaceholder(),
                this.fitTexts(),
                this.scrollAnimations(),
                this.homeSectionHeight(),
                this.menuScrollToAnimation(),
                this.stickyMenu(),
                this.collapseIcons(),
                this.countdowns(),
                this.owlCarousels(),
                this.singlePortfolioOwl(),
                this.scrollToTopAnimation(),
                this.scrollToClass(),
                this.selectBox(),
                this.bootstrapSwitch(),
                this.tooltip(),
                this.popover(),
                this.countTo(),
                this.progressBars(),
                this.registerKnob(),
                this.prettyPhoto(),
                this.flickerFeed(),
                this.contactForm(),
                this.parallax(),
                this.twitterFeed(),
                this.contactFormFixes();
                var a = this;
                "function" == typeof imagesLoaded && (imagesLoaded(a.container,
                function() {
                    a.calculateWidth(),
                    a.isotopeActivate(),
                    a.scrollTriggerforPortfolioAnim(),
                    a.prettyPhoto(),
                    a.hoverAnimation(),
                    a.isotopeFilter(),
                    a.openProject()
                }), imagesLoaded(a.blogContainer,
                function() {
                    a.masonryBlog()
                }))
            }
        },
        queryLoad: function() {
            a.fn.queryLoader2 && a("body").queryLoader2({
                barColor: "#ffb400",
                backgroundColor: "#fff",
                percentage: !0,
                barHeight: 5,
                minimumTime: 200,
                fadeOutTime: 1000,
                onComplete: function() {
                    a(".geass-loader-overlay").animate({
                        height: "hide",
                        opacity: .25
                    },
                    450,
                    function() {
                        a(this).remove()
                    })
                }
            })
        },
        checkMobile: function() {
            this.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? !0 : !1
        },
        videoBg: function() {
            if (this.mobile) a("#home").hasClass("videobg") && a("#home").addClass("homebg"),
            a("#videobg-container").addClass("videobg");
            else {
                if (!a.fn.mb_YTPlayer) return;
                a(".player").mb_YTPlayer()
            }
        },
        checkPlaceholder: function() {
            a.support.placeholder = function() {
                var a = document.createElement("input");
                return "placeholder" in a
            } (),
            !a.support.placeholder && a.fn.placeholder && a("input, textarea").placeholder()
        },
        fitTexts: function() {
            a.fn.fitText && (a(".section-title").fitText(1.3, {
                minFontSize: "40px",
                maxFontSize: "75px"
            }), a(".parallax-title").fitText(1.4, {
                minFontSize: "22px",
                maxFontSize: "36px"
            }), a(".page-title").fitText(1.2, {
                minFontSize: "50px",
                maxFontSize: "120px"
            }))
        },
        homeSectionHeight: function() {
            if (a("#wrapper").hasClass("boxed") || a("#wrapper").hasClass("boxed-long")) {
                var b = a(window).height();
                a("#home").height(b)
            }
        },
        stickyMenu: function() {
            if (a.fn.waypoint && a(window).outerWidth() > 767) {
                var b, c = "navbar-fixed-top";
                b = a("#header").find(".navbar").hasClass("navbar-transparent") ? -80 : 0,
                a("#header").hasClass("fixed-bottom") && (c = "navbar-fixed-bottom"),
                a("#header").find(".navbar").waypoint("sticky", {
                    stuckClass: c + " fixed-animated",
                    offset: b
                })
            }
        },
        destroyStickyMenu: function() {
            a.fn.waypoint && a(window).width() < 767 && a("#header").find(".navbar").waypoint("unsticky")
        },
        twitterFeed: function() {
            a.fn.tweet && a(".twitter_feed").length && (a(".twitter_feed").tweet({
                modpath: "./js/twitter/",
                avatar_size: 48,
                count: 4,
                query: "wrapbootstrap",
                loading_text: "searching twitter...",
                join_text: "",
                template: "{join}{text}{time}"
            }), a(".tweet_list").owlCarousel({
                singleItem: !0,
                slideSpeed: 600,
                autoPlay: 8200,
                stopOnHover: !0,
                navigation: !0,
                navigationText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
                pagination: !1,
                responsive: !0,
                autoHeight: !1,
                transitionStyle: "backSlide"
            }))
        },
        collapseIcons: function() {
            a(".panel").each(function() {
                var b = a(this),
                c = b.find(".accordion-btn"),
                d = b.find(".accordion-body");
                c.length && d.on("shown.bs.collapse",
                function() {
                    c.hasClass("open") || c.addClass("open")
                }).on("hidden.bs.collapse",
                function() {
                    c.hasClass("open") && c.removeClass("open")
                })
            })
        },
        countdowns: function() {
            if (a.fn.countdown) {
                var b = new Date;
                b = new Date(b.getFullYear() + 1, 2, 1),
                a("#event-countdown").countdown({
                    until: b
                })
            }
        },
        checkSupport: function(a, b) {
            return a.length && b ? !0 : !1
        },
        owlCarousels: function() {
            var b = this,
            c = a(".owl-carousel.testimonials-carousel");
            b.checkSupport(c, a.fn.owlCarousel) && c.owlCarousel({
                singleItem: !0,
                slideSpeed: 600,
                autoPlay: 9e3,
                stopOnHover: !0,
                navigation: !0,
                navigationText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
                pagination: !1,
                responsive: !0,
                autoHeight: !1,
                transitionStyle: "backSlide"
            })
        },
        singlePortfolioOwl: function() {
            function b() {
                var b = this.currentItem;
                a(".slider-thumb-nav.owl-carousel").find(".owl-item").removeClass("active").eq(b).addClass("active"),
                void 0 !== a(".slider-thumb-nav.owl-carousel").data("owlCarousel") && c(b)
            }
            function c(a) {
                var b, c = f.data("owlCarousel").owl.visibleItems,
                d = a,
                e = !1;
                for (b in c) d === c[b] && (e = !0);
                e === !1 ? d > c[c.length - 1] ? f.trigger("owl.goTo", d - c.length + 2) : (d - 1 === -1 && (d = 0), f.trigger("owl.goTo", d)) : d === c[c.length - 1] ? f.trigger("owl.goTo", c[1]) : d === c[0] && f.trigger("owl.goTo", d - 1)
            }
            var d = this,
            e = a(".single-portfolio-slider.owl-carousel");
            d.checkSupport(e, a.fn.owlCarousel) && e.owlCarousel({
                singleItem: !0,
                slideSpeed: 400,
                autoPlay: 8800,
                stopOnHover: !0,
                navigation: !0,
                navigationText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
                pagination: !0,
                responsive: !0,
                mouseDrag: !0,
                autoHeight: !1,
                transitionStyle: "goDown",
                afterAction: b,
                responsiveRefreshRate: 100
            });
            var f = a(".slider-thumb-nav.owl-carousel");
            d.checkSupport(f, a.fn.owlCarousel) && f.owlCarousel({
                items: 4,
                itemsDesktop: [1199, 4],
                itemsDesktopSmall: [979, 4],
                itemsTablet: [768, 3],
                itemsMobile: [479, 2],
                slideSpeed: 400,
                autoPlay: 8800,
                stopOnHover: !0,
                navigation: !1,
                pagination: !1,
                responsive: !0,
                mouseDrag: !0,
                autoHeight: !1,
                responsiveRefreshRate: 100,
                afterInit: function(a) {
                    a.find(".owl-item").eq(0).addClass("active")
                }
            }),
            (e.length || f.length) && a(".slider-thumb-nav.owl-carousel").on("click", ".owl-item",
            function(b) {
                b.preventDefault();
                var c = a(this).data("owlItem");
                e.trigger("owl.goTo", c)
            })
        },
        scrollTopBtnAppear: function() {
            var b = a(window).scrollTop(),
            c = a("#scroll-top");
            b >= 200 ? c.addClass("fixed") : c.removeClass("fixed")
        },
        scrollToAnimation: function(b, c, d) {
            var e = a(this).attr("href"),
            f = !1;
            if (a(e).length) var g = a(e),
            h = c ? g.offset().top + c: g.offset().top;
            else {
                if ("#home" !== e && "#top" !== e) return;
                h = 0,
                f = !0
            } (e || f) && (a("html, body").animate({
                scrollTop: h
            },
            b || 1200), d.preventDefault())
        },
        menuScrollToAnimation: function() {
            var b = this;
            a("#main-menu").find("a").on("click",
            function(c) {
                b.scrollToAnimation.call(this, 1e3, 0, c),
                a(this).closest("li").addClass("active").siblings().removeClass("active")
            })
        },
        scrollToTopAnimation: function() {
            var b = this;
            a("#scroll-top").on("click",
            function(a) {
                b.scrollToAnimation.call(this, 1200, 0, a)
            })
        },
        scrollToClass: function() {
            var b = this;
            a(".scrollto").on("click",
            function(a) {
                b.scrollToAnimation.call(this, 1200, 0, a)
            })
        },
        selectBox: function() {
            a.fn.selectbox && a(".selectbox").selectbox({
                effect: "fade"
            })
        },
        bootstrapSwitch: function() {
            a.fn.bootstrapSwitch && a(".switch").bootstrapSwitch()
        },
        tooltip: function() {
            a.fn.tooltip && a(".add-tooltip").tooltip()
        },
        popover: function() {
            a.fn.popover && a(".add-popover").popover({
                trigger: "focus"
            })
        },
        countTo: function() {
            a.fn.countTo ? a.fn.waypoint ? a(".count").waypoint(function() {
                a(this).countTo()
            },
            {
                offset: function() {
                    return a(window).height() - 100
                },
                triggerOnce: !0
            }) : a(".count").countTo() : a(".count").each(function() {
                var b = a(this),
                c = b.data("to");
                b.text(c)
            })
        },
        progressBars: function() {
            var b = this;
            a.fn.waypoint ? a(".progress-animate").waypoint(function() {
                if (a(this).hasClass("circle-progress")) b.animateKnob();
                else {
                    var c = a(this),
                    d = a(this).data("width"),
                    e = c.find(".progress-text");
                    c.css({
                        width: d + "%"
                    },
                    400),
                    e.fadeIn(500,
                    function() {
                        a(this).removeClass("progress-animate")
                    })
                }
            },
            {
                offset: function() {
                    return a(window).height() - 10
                }
            }) : a(".progress-animate").each(function() {
                var b = a(this),
                c = a(this).data("width"),
                d = b.find(".progress-text");
                b.css({
                    width: c + "%"
                },
                400),
                d.fadeIn(500)
            })
        },
        registerKnob: function() {
            a.fn.knob && a(".knob").knob({
                bgColor: "#fff"
            })
        },
        animateKnob: function() {
            a.fn.knob && a(".knob").each(function() {
                var b = a(this),
                c = b.closest(".progress-animate"),
                d = b.data("animateto"),
                e = b.data("animatespeed");
                b.animate({
                    value: d
                },
                {
                    duration: e,
                    easing: "swing",
                    progress: function() {
                        b.val(Math.round(this.value)).trigger("change")
                    },
                    complete: function() {
                        c.removeClass("progress-animate")
                    }
                })
            })
        },
        scrollAnimations: function() {
            "function" == typeof WOW && new WOW({
                boxClass: "wow",
                animateClass: "animated",
                offset: 0
            }).init()
        },
        prettyPhoto: function() {
            a.fn.prettyPhoto && a("a[data-rel^='prettyPhoto']").prettyPhoto({
                hook: "data-rel",
                animation_speed: "fast",
                slideshow: 6e3,
                autoplay_slideshow: !0,
                show_title: !1,
                deeplinking: !1,
                social_tools: "",
                overlay_gallery: !0
            })
        },
        flickerFeed: function() {
            a.fn.jflickrfeed && a("ul.sidebar-flickr-widget").jflickrfeed({
                limit: 8,
                qstrings: {
                    id: "52617155@N08"
                },
                itemTemplate: '<li><a href="{{image}}" title="{{title}}"><img src="{{image_s}}" alt="{{title}}" /></a></li>'
            })
        },
        contactForm: function() {
            a.fn.validate && a("#contact-form").validate({
                rules: {
                    contactname: "required",
                    contactemail: {
                        required: !0,
                        email: !0
                    },
                    contactmessage: {
                        required: !0,
                        minlength: 50
                    }
                },
                messages: {
                    contactname: "This field is required. Please enter your name.",
                    contactemail: {
                        required: "This field is required. Please enter your email address.",
                        email: "Please enter a valid email address."
                    },
                    contactmessage: {
                        required: "This field is required. Please enter your message.",
                        minlength: "Your message must be at least 50 characters long."
                    }
                },
                submitHandler: function(b) {
                    return a.ajax({
                        type: "post",
                        url: "php/mail.php",
                        data: a(b).serialize()
                    }).done(function(a) {
                        alert("success" == a ? "Email has been sent successfully!": "already" == a ? "You already sent a message. Please try again later": "There is an error please try again later!")
                    }).error(function() {
                        alert("There is an error please try again later!")
                    }),
                    !1
                }
            })
        },
        contactFormFixes: function() {
            var b = a("#contact-form");
            b.find("input, textarea").on("blur",
            function() {
                var b = a(this),
                c = b.val(),
                d = b.siblings(".animated-label");
                "" !== c ? d.addClass("not-empty") : d.removeClass("not-empty")
            }),
            b.find('input[type="reset"]').on("click",
            function() {
                b.find(".animated-label").removeClass("not-empty")
            })
        },
        scrollSpyRefresh: function() {
            a('[data-spy="scroll"]').each(function() {
                a(this).scrollspy("refresh")
            })
        },
        parallax: function() { ! b.mobile && a.fn.stellar && a(window).stellar({
                verticalOffset: 0,
                horizontalOffset: 0,
                horizontalScrolling: !1
            })
        },
        masonryBlog: function() {
            a.fn.isotope && this.blogContainer.isotope({
                itemSelector: ".article",
                layoutMode: "masonry"
            })
        },
        calculateWidth: function() {
            var b, c = a(window).width(),
            d = this.container.width(),
            e = this.container.data("maxcolumn");
            b = c > 1170 ? e ? e: 5 : c > 960 ? e ? e > 4 ? 4 : 3 : 4 : c > 767 ? 3 : c > 540 ? 2 : 2;
            var f = this.container.find(".portfolio-item");
            b >= 4 && f.hasClass("wide") ? (this.container.find(".wide").css("width", 2 * Math.floor(d / b)), f.not(".wide").css("width", Math.floor(d / b))) : f.css("width", Math.floor(d / b))
        },
        isotopeActivate: function() {
            if (a.fn.isotope) {
                var b = this.container,
                c = b.data("layoutmode");
                b.isotope({
                    itemSelector: ".portfolio-item",
                    layoutMode: c ? c: "masonry",
                    transitionDuration: 0
                }).data("isotope")
            }
        },
        isotopeReinit: function() {
            a.fn.isotope && (this.container.isotope("destroy"), this.isotopeActivate())
        },
        isotopeFilter: function() {
            var b = this,
            c = a("#portfolio-filter");
            c.find("a").on("click",
            function(d) {
                var e = a(this),
                f = e.attr("data-filter"),
                g = b.container.data("animationclass"),
                h = g ? g: "fadeInUp";
                c.find(".active").removeClass("active"),
                b.container.find(".portfolio-item").removeClass("animate-item " + h),
                b.container.isotope({
                    filter: f,
                    transitionDuration: "0.8s"
                }),
                e.addClass("active"),
                d.preventDefault()
            })
        },
        elementsAnimate: function() {
            var b = this.container.data("animationclass"),
            c = b ? b: "fadeInUp",
            d = this.container.find(".animate-item").length,
            e = 0;
            this.container.find(".animate-item").each(function() {
                var b = a(this),
                f = b.data("animate-time"); ++e,
                setTimeout(function() {
                    b.addClass("animated " + c)
                },
                f),
                e === d && (this.portfolioItemsAnimated = !0)
            }),
            a.fn.isotope && this.portfolioItemsAnimated && this.container.isotope("layout")
        },
        scrollTriggerforPortfolioAnim: function() {
            a.fn.waypoint ? this.container.waypoint(b.elementsAnimate.bind(this), {
                offset: "90%",
                triggerOnce: !0
            }) : b.elementsAnimate()
        },
        hoverAnimation: function() {
            var b = this.container.data("rotateanimation"),
            c = b ? b: !1;
            a.fn.hoverdir && this.container.find("li").each(function() {
                a(this).hoverdir({
                    speed: 400,
                    hoverDelay: 0,
                    hoverElem: ".portfolio-overlay",
                    rotate3d: c
                })
            })
        },
        openProject: function() {
            {
                var b = this,
                c = a("#portfolio-single-content,#portfolio-single-content2");
                c.find(".single-portfolio")
            }
            a(".open-btn").on("click",
            function(d) {
                d.preventDefault();
                var e = a(this),
                f = e.closest(".portfolio-item");
                c.is(":hidden") ? b.loadProject.call(this, c, f) : (b.container.find(".portfolio-item.active").removeClass("active"), b.loadProject.call(e, c, f))
            })
        },
        loadProject: function(c, d) {
            var e = a(this),
            f = e.attr("href");
            if ("" === f) return void alert("Path is empyt! Please use right path for the project!");
            if ( - 1 == f.indexOf(".html")) return void alert("Not a valid path! Please use right path for the project!");
            var g = new a.Deferred;
            a.when(g).done(function() {
                c.animate({
                    height: "show"
                },
                600,
                function() {
                    var b = c.offset().top - 110;
                    a("html, body").animate({
                        scrollTop: b
                    },
                    700),
                    a('[data-spy="scroll"]').each(function() {
                        a(this).scrollspy("refresh")
                    }),
                    d.addClass("active")
                }),
                b.closeProject(),
                b.singlePortfolioOwl()
            }),
            c.load(f + " #project-content",
            function() {
                g.resolve()
            })
        },
        closeProject: function() {
            {
                var b = this,
                c = a("#portfolio-single-content,#portfolio-single-content2");
                c.find(".single-portfolio")
            }
            a(".portfolio-close").on("click",
            function(d) {
                a(c).animate({
                    height: "hide"
                },
                400,
                function() {
                    b.container.find(".portfolio-item.active").removeClass("active"),
                    a(this).html("")
                }),
                d.preventDefault()
            })
        }
    };
    b.init(),
    a(window).on("load",
    function() {}),
    a(window).on("scroll",
    function() {
        b.scrollTopBtnAppear()
    }),
    a.event.special.debouncedresize ? a(window).on("debouncedresize",
    function() {
        b.homeSectionHeight(),
        b.calculateWidth(),
        b.isotopeReinit(),
        b.scrollSpyRefresh()
    }) : a(window).on("resize",
    function() {
        b.homeSectionHeight(),
        b.calculateWidth(),
        b.isotopeReinit(),
        b.scrollSpyRefresh()
    })
} (jQuery),
function(a, b, c, d, e, f, g) {
    a.GoogleAnalyticsObject = e,
    a[e] = a[e] ||
    function() { (a[e].q = a[e].q || []).push(arguments)
    },
    a[e].l = 1 * new Date,
    f = b.createElement(c),
    g = b.getElementsByTagName(c)[0],
    f.async = 1,
    f.src = d,
    g.parentNode.insertBefore(f, g)
} (window, document, "script", "", "ga"),
ga("create", "UA-57177726-2", "auto"),
ga("require", "displayfeatures"),
ga("send", "pageview");
