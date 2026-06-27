document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.querySelector('.play-btn');
    const vinyl = document.querySelector('.vinyl-record');
    let isPlaying = false;

    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playBtn.innerHTML = '⏸';
            vinyl.classList.add('playing');
        } else {
            playBtn.innerHTML = '▶';
            vinyl.classList.remove('playing');
        }
    });

    // Simple scroll reveal animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('section > div');
    sections.forEach(sec => {
        sec.style.opacity = 0;
        sec.style.transform = 'translateY(40px)';
        sec.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(sec);
    });
});
