document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.product-btn');
    const focusBox = document.querySelector('.focus-box');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            
            // Change lip color focus box
            const color = btn.getAttribute('data-color');
            focusBox.style.background = color;
            focusBox.style.boxShadow = `0 0 20px ${color}`;
            focusBox.style.borderColor = color;
        });
    });
});
