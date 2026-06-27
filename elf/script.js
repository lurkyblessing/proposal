document.addEventListener('DOMContentLoaded', () => {
    // Add simple scroll animation for masonry items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.masonry-item');
    items.forEach((item, index) => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(50px)';
        item.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 3 * 0.1}s`;
        observer.observe(item);
    });
});
