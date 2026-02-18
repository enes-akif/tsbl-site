const cards = document.querySelectorAll('.card');

window.addEventListener('scroll', () => {
  cards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    const height = window.innerHeight;

    if(top < height - 50) {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
      card.style.transition = "0.6s ease";
    }
  });
});
