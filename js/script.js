// Simplified JS: no animations. Keep minimal behavior.
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle: follow system preference and persist user choice
    const root = document.documentElement;
    const toggle = document.getElementById('theme-toggle');
    const stored = localStorage.getItem('theme');

    function applyTheme(theme){
        if(theme === 'light'){
            root.classList.add('light');
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
            toggle.setAttribute('aria-pressed','true');
        } else {
            root.classList.remove('light');
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
            toggle.setAttribute('aria-pressed','false');
        }
    }

    // Determine initial theme: stored -> system -> dark default
    if(stored === 'light' || stored === 'dark'){
        applyTheme(stored);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
        applyTheme('light');
    } else {
        applyTheme('dark');
    }

    if(toggle){
        toggle.addEventListener('click', ()=>{
            const isLight = root.classList.contains('light');
            const next = isLight ? 'dark' : 'light';
            localStorage.setItem('theme', next);
            applyTheme(next);
        });
    }

    // Keep nav anchors native; minimal JS otherwise.
});