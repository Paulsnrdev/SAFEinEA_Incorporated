document.addEventListener('DOMContentLoaded', function () {
    var menuButton = document.getElementById('mobile-menu-button');
    var closeButton = document.getElementById('close-menu-button');
    var dropdown = document.getElementById('services-dropdown');
    var overlay = document.getElementById('mobile-menu-overlay');
    var closedTransform = dropdown ? dropdown.dataset.closedTransform : null;
    var useHidden = !!(dropdown && dropdown.dataset.useHidden === 'true');

    function openMenu() {
        if (dropdown) {
            if (useHidden) dropdown.classList.remove('hidden');
            if (closedTransform) dropdown.classList.remove(closedTransform);
        }
        if (overlay) overlay.classList.remove('hidden');
    }

    function closeMenu() {
        if (dropdown) {
            if (useHidden) dropdown.classList.add('hidden');
            if (closedTransform) dropdown.classList.add(closedTransform);
        }
        if (overlay) overlay.classList.add('hidden');
    }

    if (menuButton) menuButton.addEventListener('click', openMenu);
    if (closeButton) closeButton.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    document.querySelectorAll('#services-dropdown a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // Mobile services accordion (mega nav variant only)
    var mobileServicesBtn = document.getElementById('mobile-services-btn');
    var mobileServicesMenu = document.getElementById('mobile-services-menu');
    var mobileServicesIcon = document.getElementById('mobile-services-icon');

    if (mobileServicesBtn && mobileServicesMenu) {
        mobileServicesBtn.addEventListener('click', function (e) {
            e.preventDefault();
            mobileServicesMenu.classList.toggle('hidden');
            if (mobileServicesIcon) mobileServicesIcon.classList.toggle('rotate-180');
        });
    }

    // Desktop dropdown auto-close (mega nav variant only)
    var desktopDropdown = document.getElementById('services-desktop-dropdown');
    if (desktopDropdown) {
        desktopDropdown.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                desktopDropdown.style.display = 'none';
                setTimeout(function () {
                    desktopDropdown.style.display = '';
                }, 500);
            });
        });
    }
});
