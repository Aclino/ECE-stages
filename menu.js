// Gestion du menu principal "Matière"
const menuItems = document.querySelectorAll('.menu-item > span');
menuItems.forEach((menuItem) => {
    menuItem.addEventListener('click', () => {
        const submenu = menuItem.nextElementSibling;
        if (submenu) {
            submenu.classList.toggle('open');
        }
    });
});

// Gestion des sous-menus
const submenuItems = document.querySelectorAll('.submenu-item > span');
submenuItems.forEach((submenuItem) => {
    submenuItem.addEventListener('click', (event) => {
        event.stopPropagation(); // Empêche la propagation
        const submenuContent = submenuItem.nextElementSibling;
        if (submenuContent) {
            submenuContent.classList.toggle('open');
        }
    });
});

// Fermer tous les menus si on clique ailleurs
document.addEventListener('click', (event) => {
    if (!event.target.closest('.menu')) {
        document.querySelectorAll('.submenu, .submenu-content').forEach((submenu) => {
            submenu.classList.remove('open');
        });
    }
});
