(function($) {
    'use strict';

    var pluginName = 'ScrollIt',
        pluginVersion = '1.0.3';

    var defaults = {
        upKey: 38,
        downKey: 40,
        easing: 'linear',
        scrollTime: 600,
        activeClass: 'active',
        onPageChange: null,
        topOffset: 0
    };

    $.scrollIt = function(options) {
        var settings = $.extend(defaults, options),
            active = 0,
            lastIndex = $('[data-scroll-index]:last').attr('data-scroll-index');

        var navigate = function(ndx) {
            if (ndx < 0 || ndx > lastIndex) return;

            var targetTop = $('[data-scroll-index=' + ndx + ']').offset().top + settings.topOffset + 1;
            $('html,body').animate({
                scrollTop: targetTop,
                easing: settings.easing
            }, settings.scrollTime);
        };

        var doScroll = function(e) {
            var target = $(e.target).closest("[data-scroll-nav]").attr('data-scroll-nav') ||
                $(e.target).closest("[data-scroll-goto]").attr('data-scroll-goto');
            navigate(parseInt(target));
        };

        var keyNavigation = function(e) {
            var key = e.which;
            if ($('html,body').is(':animated') && (key == settings.upKey || key == settings.downKey)) {
                return false;
            }
            if (key == settings.upKey && active > 0) {
                navigate(parseInt(active) - 1);
                return false;
            } else if (key == settings.downKey && active < lastIndex) {
                navigate(parseInt(active) + 1);
                return false;
            }
            return true;
        };

        var updateActive = function(ndx) {
            if (settings.onPageChange && ndx && (active != ndx)) settings.onPageChange(ndx);

            active = ndx;
            $('[data-scroll-nav]').removeClass(settings.activeClass);
            $('[data-scroll-nav=' + ndx + ']').addClass(settings.activeClass);
        };

        var watchActive = function() {
            var winTop = $(window).scrollTop();

            var visible = $('[data-scroll-index]').filter(function(ndx, div) {
                return winTop >= $(div).offset().top + settings.topOffset &&
                    winTop < $(div).offset().top + (settings.topOffset) + $(div).outerHeight();
            });
            var newActive = visible.first().attr('data-scroll-index');
            updateActive(newActive);
        };

        $(window).on('scroll', watchActive).scroll();
        $(window).on('keydown', keyNavigation);
        $('body').on('click', '[data-scroll-nav], [data-scroll-goto]', function(e) {
            e.preventDefault();
            doScroll(e);
        });

    };

}(jQuery));

$(document).ready(function() {
    $(window).on("scroll", function() {
        if ($(this).scrollTop() > 90) {
            $(".navbar").addClass("navbar-shrink");
        } else {
            $(".navbar").removeClass("navbar-shrink");
        }
    });

    // Parallax effect (Ensure the Parallax library is included)
    function parallaxMouse() {
        if ($("#parallax").length) {
            if (typeof Parallax !== 'undefined') {
                var scene = document.getElementById("parallax");
                var parallax = new Parallax(scene);
            } else {
                console.error('Parallax library is not loaded.');
            }
        }
    }
    parallaxMouse();

    // Skill bar animation on scroll (Trigger once)
    var skillBarAnimated = false;
    $(window).scroll(function() {
        var hT = $("#skill-bar-wrapper").offset().top;
        var hH = $("#skill-bar-wrapper").outerHeight();
        var wH = $(window).height();
        var wS = $(this).scrollTop();

        if (wS + wH > hT + hH / 2 && !skillBarAnimated) {
            skillBarAnimated = true; // Ensure it only triggers once
            jQuery('.skill-item').each(function() {
                var percent = jQuery(this).attr('data-percent');
                jQuery(this).find('.skills').animate({
                    width: percent
                }, 5000);
            });
        }
    });

    // Image gallery filtering (Ensure Isotope library is included)
    let $btns = $('.img-gallery .sortBtn .filter-btn');
    $btns.click(function(e) {
        $('.img-gallery .sortBtn .filter-btn').removeClass('active');
        e.target.classList.add('active');

        let selector = $(e.target).attr('data-filter');
        if (typeof $.fn.isotope !== 'undefined') {
            $('.img-gallery .grid').isotope({
                filter: selector
            });
        } else {
            console.error('Isotope library is not loaded.');
        }
        return false;
    });

    // Magnific popup for image popups (Ensure Magnific Popup library is included)
    if (typeof $.fn.magnificPopup !== 'undefined') {
        $('.image-popup').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    } else {
        console.error('Magnific Popup library is not loaded.');
    }

    // Testimonial slider (Ensure Owl Carousel library is included)
    if (typeof $.fn.owlCarousel !== 'undefined') {
        $('.testimonial-slider').owlCarousel({
            loop: true,
            margin: 0,
            autoplay: true,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                },
                600: {
                    items: 2,
                },
                1000: {
                    items: 3,
                }
            }
        });
    } else {
        console.error('Owl Carousel library is not loaded.');
    }

    // Initialize ScrollIt Plugin
    $.scrollIt({
        topOffset: -50
    });

    // Collapse navbar after clicking a link
    $(".nav-link").on("click", function() {
        $(".navbar-collapse").collapse("hide");
    });
});
