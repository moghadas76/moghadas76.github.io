/* ============================================================
   SEYED MOHAMAD MOGHADAS - PhD Portfolio
   script.js - Minimal interactions
   ============================================================ */

(function () {
    'use strict';

    // ---- DOM Elements ----
    const html = document.documentElement;
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const themeToggle = document.getElementById('themeToggle');
    const sections = document.querySelectorAll('.section, .hero');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    // ============================================================
    // THEME TOGGLE (Dark / Light)
    // ============================================================
    function getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            // localStorage not available
        }
    }

    function initTheme() {
        var stored = getStoredTheme();
        if (stored === 'dark' || stored === 'light') {
            html.setAttribute('data-theme', stored);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            html.setAttribute('data-theme', 'dark');
        }
    }

    function toggleTheme() {
        var current = html.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        setStoredTheme(next);
    }

    initTheme();

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!getStoredTheme()) {
                html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }

    // ============================================================
    // MOBILE NAVIGATION TOGGLE
    // ============================================================
    function closeMobileNav() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    function openMobileNav() {
        navToggle.classList.add('active');
        navLinks.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            if (navLinks.classList.contains('active')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });
    }

    // Close mobile nav on link click
    navAnchors.forEach(function (anchor) {
        anchor.addEventListener('click', function () {
            if (navLinks.classList.contains('active')) {
                closeMobileNav();
            }
        });
    });

    // Close mobile nav on outside click
    document.addEventListener('click', function (e) {
        if (
            navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !navToggle.contains(e.target)
        ) {
            closeMobileNav();
        }
    });

    // Close mobile nav on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileNav();
            navToggle.focus();
        }
    });

    // ============================================================
    // NAVBAR SCROLL EFFECT
    // ============================================================
    var lastScrollY = 0;

    function onScroll() {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Add shadow when scrolled
        if (scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ============================================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ============================================================
    function updateActiveLink() {
        var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        var navHeight = navbar ? navbar.offsetHeight : 72;
        var current = '';

        sections.forEach(function (section) {
            var top = section.offsetTop - navHeight - 100;
            var bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(function (anchor) {
            anchor.classList.remove('active');
            if (anchor.getAttribute('href') === '#' + current) {
                anchor.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // ============================================================
    // SCROLL ANIMATIONS (IntersectionObserver)
    // ============================================================
    var animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px 0px -60px 0px',
                threshold: 0.1
            }
        );

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show all elements immediately
        animatedElements.forEach(function (el) {
            el.classList.add('is-visible');
        });
    }

    // ============================================================
    // SMOOTH SCROLL (fallback for browsers without CSS scroll-behavior)
    // ============================================================
    navAnchors.forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                var target = document.getElementById(href.slice(1));
                if (target) {
                    e.preventDefault();
                    var navHeight = navbar ? navbar.offsetHeight : 72;
                    var targetPos = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPos,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

})();
