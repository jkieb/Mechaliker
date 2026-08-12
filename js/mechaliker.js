/* =========================================================================
   Mechaliker – Interaktionen
   Kein Framework, keine externen Abhängigkeiten.
   ========================================================================= */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Baustellen-Sperre ---------- */
    var gate = document.getElementById("ucGate");

    if (gate && !document.documentElement.classList.contains("uc-passed")) {
        var enterBtn = gate.querySelector("[data-uc-enter]");
        var lastFocus = document.activeElement;

        var openGate = function () {
            try { sessionStorage.setItem("mechaliker-baustelle", "ok"); } catch (e) { /* egal */ }
            document.documentElement.classList.add("uc-passed");
            document.removeEventListener("keydown", trapFocus, true);
            if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
        };

        /* Solange die Sperre steht, bleibt der Fokus in ihr. */
        function trapFocus(e) {
            if (e.key === "Tab") {
                e.preventDefault();
                if (enterBtn) { enterBtn.focus(); }
            }
        }

        if (enterBtn) {
            enterBtn.addEventListener("click", openGate);
            enterBtn.focus();
        }
        document.addEventListener("keydown", trapFocus, true);
    }

    /* ---------- Mobiles Menü ---------- */
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("mainNav");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
        });

        nav.addEventListener("click", function (e) {
            if (e.target.tagName === "A") {
                nav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && nav.classList.contains("is-open")) {
                nav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
                toggle.focus();
            }
        });
    }

    /* ---------- Schatten am Header + Nach-oben-Knopf ---------- */
    var header = document.getElementById("siteHeader");
    var toTop = document.getElementById("toTop");

    function onScroll() {
        var y = window.pageYOffset;
        if (header) { header.classList.toggle("is-stuck", y > 8); }
        if (toTop) { toTop.classList.toggle("is-shown", y > 600); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toTop) {
        toTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
    }

    /* ---------- Sichtbarkeit: Einblenden und Zähler ----------
       Bewusst über getBoundingClientRect statt IntersectionObserver:
       weniger Überraschungen, wenn eine Seite sehr lang ist oder das
       Fenster ungewöhnliche Maße hat. Nichts bleibt je unsichtbar. */
    var revealables = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));

    function inView(el, margin) {
        var r = el.getBoundingClientRect();
        var h = window.innerHeight || document.documentElement.clientHeight;
        return r.top < h - (margin || 0) && r.bottom > 0;
    }

    function runCounter(el) {
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var duration = 1400;
        var start = null;

        if (reduceMotion) {
            el.textContent = target.toLocaleString("de-AT") + suffix;
            return;
        }

        function tick(now) {
            if (start === null) { start = now; }
            var p = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString("de-AT") + suffix;
            if (p < 1) { window.requestAnimationFrame(tick); }
        }
        window.requestAnimationFrame(tick);
    }

    var ticking = false;

    function updateVisibility() {
        ticking = false;

        revealables = revealables.filter(function (el) {
            if (!inView(el, 60)) { return true; }
            el.classList.add("is-visible");
            return false;
        });

        counters = counters.filter(function (el) {
            if (!inView(el, 0)) { return true; }
            runCounter(el);
            return false;
        });
    }

    function requestVisibilityCheck() {
        if (ticking) { return; }
        ticking = true;
        window.requestAnimationFrame(updateVisibility);
    }

    if (reduceMotion) {
        revealables.forEach(function (el) { el.classList.add("is-visible"); });
        counters.forEach(runCounter);
        revealables = [];
        counters = [];
    } else {
        window.addEventListener("scroll", requestVisibilityCheck, { passive: true });
        window.addEventListener("resize", requestVisibilityCheck);
        window.addEventListener("load", updateVisibility);
        updateVisibility();
    }

    /* ---------- Kursfilter ---------- */
    var filterbar = document.querySelector("[data-filterbar]");

    if (filterbar) {
        var items = document.querySelectorAll("[data-kategorie]");

        filterbar.addEventListener("click", function (e) {
            var btn = e.target.closest("button[data-filter]");
            if (!btn) { return; }

            var filter = btn.getAttribute("data-filter");

            Array.prototype.forEach.call(filterbar.querySelectorAll("button"), function (b) {
                b.classList.toggle("is-active", b === btn);
                b.setAttribute("aria-pressed", b === btn ? "true" : "false");
            });

            Array.prototype.forEach.call(items, function (item) {
                var show = filter === "alle" || item.getAttribute("data-kategorie") === filter;
                item.hidden = !show;
            });
        });
    }

    /* ---------- Formularprüfung ---------- */
    var form = document.querySelector("[data-validate]");

    if (form) {
        var status = form.querySelector(".form-status");

        var showError = function (field, message) {
            var box = field.parentNode.querySelector(".error");
            field.setAttribute("aria-invalid", "true");
            if (box) {
                box.textContent = message;
                box.classList.add("is-shown");
            }
        };

        var clearError = function (field) {
            var box = field.parentNode.querySelector(".error");
            field.removeAttribute("aria-invalid");
            if (box) { box.classList.remove("is-shown"); }
        };

        var checkField = function (field) {
            var value = (field.value || "").trim();

            if (field.hasAttribute("required")) {
                if (field.type === "checkbox" && !field.checked) {
                    showError(field, "Bitte bestätige das noch kurz.");
                    return false;
                }
                if (field.type !== "checkbox" && value === "") {
                    showError(field, "Dieses Feld brauchen wir noch.");
                    return false;
                }
            }
            if (field.type === "email" && value !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
                showError(field, "Diese E-Mail-Adresse sieht noch nicht ganz richtig aus.");
                return false;
            }
            clearError(field);
            return true;
        };

        Array.prototype.forEach.call(form.querySelectorAll("input, select, textarea"), function (field) {
            field.addEventListener("blur", function () { checkField(field); });
            field.addEventListener("input", function () {
                if (field.getAttribute("aria-invalid") === "true") { checkField(field); }
            });
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            var fields = form.querySelectorAll("input, select, textarea");
            var firstBad = null;

            Array.prototype.forEach.call(fields, function (field) {
                if (!checkField(field) && !firstBad) { firstBad = field; }
            });

            if (firstBad) {
                firstBad.focus();
                return;
            }

            if (status) {
                status.textContent = "Danke! Deine Anfrage ist notiert – wir melden uns innerhalb von 24 Stunden. "
                    + "(Hinweis: Diese Demo verschickt noch nichts, hier gehört das Backend angebunden.)";
                status.classList.add("is-shown");
                status.setAttribute("role", "status");
                status.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
            }
            form.reset();
        });
    }

    /* ---------- Jahreszahl im Footer ---------- */
    var year = document.getElementById("year");
    if (year) { year.textContent = new Date().getFullYear(); }
}());
