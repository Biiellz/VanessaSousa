/* =========================================================
   LISO LUXO HAIR — Espaço Vanessa Sousa
   Interações da landing page
   ========================================================= */
(function () {
    'use strict';

    /* ---------- CONFIGURAÇÃO (edite aqui) ---------- */
    const CONFIG = {
        whatsappNumber: '5561999666337', // DDI+DDD+numero, somente dígitos
        whatsappMessage: 'Olá! Gostaria de agendar um horário no Espaço Vanessa Sousa.',
        instagramUrl: 'https://www.instagram.com/espacovansousa/',
        googleMapsUrl: 'https://www.google.com/maps/place/Est%C3%A9tica+VanSousa+(Liso+Luxo+Hair)/@-15.8273194,-48.0890395,17z/data=!3m1!4b1!4m6!3m5!1s0x935bcd117b6b9031:0x8ac29a57b4422f65!8m2!3d-15.8273194!4d-48.0890395!16s%2Fg%2F11h5s1plf_?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D'
    };

    /* ---------- LINKS DINÂMICOS (WhatsApp / Instagram / Maps) ---------- */
    function buildWhatsappLink() {
        const encoded = encodeURIComponent(CONFIG.whatsappMessage);
        return `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
    }

    function wireExternalLinks() {
        const waLink = buildWhatsappLink();
        ['navWhatsapp', 'heroWhatsapp', 'ctaWhatsapp', 'footerWhatsapp', 'fabWhatsapp']
            .forEach(id => {
                const el = document.getElementById(id);
                if (el) el.href = waLink;
            });

        const igLink = CONFIG.instagramUrl;
        ['footerInstagram', 'fabInstagram'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.href = igLink;
        });

        const mapsLink = CONFIG.googleMapsUrl;
        const mapsEl = document.getElementById('footerMaps');
        if (mapsEl) mapsEl.href = mapsLink;
    }

    /* ---------- HEADER: sombra ao rolar ---------- */
    function wireHeaderScroll() {
        const header = document.getElementById('header');
        const onScroll = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 20);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- MENU MOBILE ---------- */
    function wireMobileMenu() {
        const toggle = document.getElementById('menuToggle');
        const nav = document.getElementById('nav');

        toggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- FABs: aparecem após rolar a hero ---------- */
    function wireFabsVisibility() {
        const fabs = document.getElementById('fabs');
        const hero = document.querySelector('.hero');
        const threshold = hero ? hero.offsetHeight * 0.6 : 400;

        const onScroll = () => {
            fabs.classList.toggle('is-visible', window.scrollY > threshold);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- MODAL LOGIN / CADASTRO ---------- */
    function wireModal() {
        const overlay = document.getElementById('modalOverlay');
        const openButtons = [document.getElementById('openLoginBtn'), document.getElementById('heroLoginBtn')];
        const closeBtn = document.getElementById('modalClose');
        const tabs = document.querySelectorAll('.modal__tab');
        const forms = document.querySelectorAll('.modal__form');

        function openModal(tabName) {
            overlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            if (tabName) setTab(tabName);
        }
        function closeModal() {
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
        }
        function setTab(name) {
            tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === name));
            forms.forEach(f => f.classList.toggle('is-active', f.id === `form${name.charAt(0).toUpperCase()}${name.slice(1)}`));
        }

        openButtons.forEach(btn => btn && btn.addEventListener('click', () => openModal('login')));
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

        tabs.forEach(tab => {
            tab.addEventListener('click', () => setTab(tab.dataset.tab));
        });

        // Placeholder de submissão — substitua pela integração real (Firebase, backend próprio, etc.)
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Ambiente de demonstração: conecte este formulário a um provedor de autenticação para ativar o login/cadastro real.');
                closeModal();
            });
        });
    }

    /* ---------- CARROSSEL DE DEPOIMENTOS ---------- */
    function wireTestimonialCarousel() {
        const track = document.getElementById('testimonialTrack');
        const dotsWrap = document.getElementById('testimonialDots');
        const cards = Array.from(track.children);

        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
            if (i === 0) dot.classList.add('is-active');
            dot.addEventListener('click', () => {
                cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
            });
            dotsWrap.appendChild(dot);
        });
        const dots = Array.from(dotsWrap.children);

        function updateActiveDot() {
            const trackCenter = track.scrollLeft + track.clientWidth / 2;
            let closestIndex = 0;
            let closestDistance = Infinity;
            cards.forEach((card, i) => {
                const cardCenter = card.offsetLeft + card.clientWidth / 2;
                const distance = Math.abs(trackCenter - cardCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = i;
                }
            });
            dots.forEach((d, i) => d.classList.toggle('is-active', i === closestIndex));
        }

        track.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateActiveDot);
        }, { passive: true });

        // Auto-rotação suave a cada 6s (pausa ao interagir)
        function nextSlide() {
            const activeIndex = dots.findIndex(d => d.classList.contains('is-active'));
            const next = (activeIndex + 1) % cards.length;
            cards[next].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }
        ['pointerdown', 'wheel'].forEach(evt => {
            track.addEventListener(evt, () => clearInterval(autoplay), { passive: true });
        });
    }

    /* ---------- REVEAL ON SCROLL ---------- */
    function wireRevealOnScroll() {
        const items = document.querySelectorAll('[data-reveal]');
        if (!('IntersectionObserver' in window)) {
            items.forEach(el => el.classList.add('is-in-view'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        items.forEach(el => observer.observe(el));
    }

    /* ---------- ANO DINÂMICO NO RODAPÉ ---------- */
    function wireFooterYear() {
        const el = document.getElementById('year');
        if (el) el.textContent = new Date().getFullYear();
    }

    /* ---------- INIT ---------- */
    document.addEventListener('DOMContentLoaded', () => {
        wireExternalLinks();
        wireHeaderScroll();
        wireMobileMenu();
        wireFabsVisibility();
        wireModal();
        wireTestimonialCarousel();
        wireRevealOnScroll();
        wireFooterYear();
    });
})();