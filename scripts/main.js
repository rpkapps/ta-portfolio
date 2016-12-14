(function($) {

    var $window = $(window),
        $htmlBody = $('html, body'),
        $body = $('body'),
        $navbar = $('#main-navbar'),
        $marquee = $('#marquee'),
        $footer = $('#footer'),
        nav = {},
        form = {},
        parallax = {},
        modal = {};

    function throttle(fn, threshhold, scope) {
        threshhold = threshhold || 250;
        var last,
            deferTimer;
        return function() {
            var context = scope || this,
                now = +new Date,
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function() {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }

    /*==========================
     * NAVIGATION
     *==========================*/
    function initNav() {
        var $navbarContainer = $('#main-navbar-container');

        $navbar.affix({
            offset: {
                top: $marquee.outerHeight(true),
                bottom: $footer.outerHeight(true)
            }
        });

        $navbar.on('click', 'a', function() {
            var $this = $(this),
                $target = $($this.attr('href'));

            if ($target.length > 0) {
                $htmlBody.animate({
                    scrollTop: $target.offset().top - $navbar.outerHeight(true) + 2
                }, 500);
            }
        });

        $navbar.on('affix.bs.affix', function() {
            $navbarContainer.addClass('child-affix');
            $navbarContainer.removeClass('child-affix-top');
        });

        $navbar.on('affix-top.bs.affix', function() {
            $navbarContainer.addClass('child-affix-top');
            $navbarContainer.removeClass('child-affix');
        });

        $body.scrollspy({
            target: '#main-navbar-container',
            offset: $navbar.outerHeight(true)
        });

        nav.resize = function() {
            // update navbar offset
            $navbar.data('bs.affix').options.offset.top = $marquee.outerHeight(true);
            $navbar.data('bs.affix').options.offset.bottom = $footer.outerHeight(true);
            $body.data('bs.scrollspy').options.offset = $navbar.outerHeight(true);
        };

        nav.udpateParent = function() {
            if ($navbar.hasClass('affix')) {
                $navbarContainer.addClass('child-affix');
            } else {
                $navbarContainer.addClass('child-affix-top');
            }
        }
    }

    /*==========================
     * PARALLAX
     *==========================*/
    function initParallax() {
        var $elements = $('.parallax');
        parallax.onScroll = throttle(function() {
            $elements.each(function() {
                var $this = $(this),
                    offsetTop = $this.offset().top,
                    top = -Math.round(((offsetTop - $window.scrollTop()) * 0.05));

                $this.css('transform', 'translate3d(0, ' + top + 'px, 0)');
            });
        }, 30);
    }

    /*==========================
     * FORM
     *==========================*/
    function initForm() {
        var $form = $('#contact-form'),
            $statusMsg = $('<h4 class="status-msg"></h4>'),
            $formTitle = $form.find('.modal-title'),
            $formBody = $form.find('.modal-body'),
            handleError,
            handleSuccess,
            showForm;

        $form.find('.modal-header').append($statusMsg);

        handleError = function() {
            $formBody.hide();
            $formTitle.hide();
            $statusMsg.show()
                .html('ERROR: Failed to Send Email')
                .removeClass('success')
                .addClass('error');
            modal.position()
        };

        handleSuccess = function() {
            $formBody.hide();
            $formTitle.hide();
            $statusMsg.show()
                .html('Contact Form Submitted!')
                .removeClass('error')
                .addClass('success');
            modal.position()
        };

        showForm = function() {
            $statusMsg.hide();
            $formBody.show();
            $formTitle.show();
        };

        $form.find('form').on('submit', function(event) {
            var dataString = 'name=' + $('#form-name').val() + '&company=' + $('#form-company').val() +
                '&phone_number=' + $('#form-phone-number').val() + '&email=' + $('#form-email').val() +
                '&message=' + $('#form-message').val();

            if (grecaptcha && grecaptcha.getResponse().length > 0) {
                $.ajax({
                    type: "POST",
                    url: "mail.php",
                    data: dataString,
                    success: function(data) {
                        if (data.status === 'success') {
                            handleSuccess();
                        } else {
                            handleError();
                        }
                    },
                    error: function(jqXHR, textStatus, error) {
                        console.log(error);
                        handleError();
                    }
                });
            }
            event.preventDefault();
        });

        $form.on('show.bs.modal', function() {
            showForm();
        });
    }

    function initModal() {
        var $modals = $('.modal');

        modal.position = function() {
            $modals.filter('.in').each(function() {
                var $this = $(this),
                    $contentBox = $this.find('.modal-content');

                if ($contentBox.outerHeight() > $window.height()) {
                    $this.addClass('taller-than-window');
                } else {
                    $this.removeClass('taller-than-window');
                }
            });
        };
    }

    $(document).ready(function() {
        initNav();
        initParallax();
        initForm();
        initModal();

        if ($window.width() > 767) {
            $window.on('scroll', function() {
                parallax.onScroll();
            });
            $window.on('load', function() {
                parallax.onScroll();
            });
        }

        $window.on('load', function() {
            nav.udpateParent();
        });

        $window.on('resize', function() {
            nav.resize();
            modal.position();
        });

        $window.on('shown.bs.modal', function() {
            modal.position();
        });
    });

})(jQuery);
