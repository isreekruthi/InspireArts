//Accordion in Services
document.querySelectorAll('.accordion-label').forEach(label => {
  label.addEventListener('click', () => {
    // Close other items
    document.querySelectorAll('.accordion-label').forEach(other => {
      if (other !== label) {
        other.classList.remove('active');
        other.nextElementSibling.style.maxHeight = null;
        other.nextElementSibling.style.padding = "0 1.5em";
      }
    });

    // Toggle current item
    label.classList.toggle('active');
    const content = label.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      content.style.padding = "0 1.5em";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.padding = "1em 1.5em";
    }
  });
});

//Carousel in Gallery
(() => {
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const items = document.querySelectorAll('.carousel-item');
  let currentIndex = 0;

  function showSlide(index) {
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? items.length - 1 : currentIndex - 1;
    showSlide(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === items.length - 1) ? 0 : currentIndex + 1;
    showSlide(currentIndex);
  });

  // Initialize first slide visible
  showSlide(currentIndex);
})();

//PopUp in Services
document.addEventListener('DOMContentLoaded', () => {
  const openModalBtn = document.getElementById('openModalBtn');
  const modal = document.getElementById('policyModal');
  const closeModal = modal.querySelector('.close-modal');

  openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
