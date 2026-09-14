'use strict';

document.addEventListener('DOMContentLoaded', () => {
   const testimonialSlider = document.getElementById('testimonial-slider');
   const testimonialCarousel = document.getElementById('testimonial-carousel');
   const testimonialCards = testimonialCarousel.querySelectorAll('.testimonial-card');
   const prevButton = document.getElementById('prev-button');
   const nextButton = document.getElementById('next-button');

   if (!testimonialSlider || !testimonialCarousel || !testimonialCards.length) return;

   let isDragging = false;
   let startX = 0;
   let startScrollLeft = 0;
   let autoPlayInterval = null;

   function getPointerX(e) {
      return e.touches ? e.touches[0].pageX : e.pageX;
   }

   function getCardStep() {
      const firstCard = testimonialCards[0];
      const cardStyle = window.getComputedStyle(firstCard);
      const marginRight = parseFloat(cardStyle.marginRight) || 0;
      const marginLeft = parseFloat(cardStyle.marginLeft) || 0;
      return firstCard.offsetWidth + marginLeft + marginRight;
   }

   function getMaxScrollLeft() {
      return testimonialCarousel.scrollWidth - testimonialCarousel.clientWidth;
   }

   function scrollByCard(direction) {
      const step = getCardStep();
      testimonialCarousel.scrollBy({
         left: direction * step,
         behavior: 'smooth'
      });
   }

   function startDragging(e) {
      isDragging = true;
      testimonialCarousel.classList.add('is-dragging');
      startX = getPointerX(e);
      startScrollLeft = testimonialCarousel.scrollLeft;
      stopAutoPlay();
   }

   function stopDragging() {
      isDragging = false;
      testimonialCarousel.classList.remove('is-dragging');
   }

   function drag(e) {
      if (!isDragging) return;

      e.preventDefault();
      const currentX = getPointerX(e);
      const walk = currentX - startX;
      testimonialCarousel.scrollLeft = startScrollLeft - walk;
   }

   function startAutoPlay() {
      stopAutoPlay();

      if (window.innerWidth < 768) return;

      autoPlayInterval = setInterval(() => {
         const step = getCardStep();
         const maxScroll = getMaxScrollLeft();

         if (testimonialCarousel.scrollLeft + step >= maxScroll) {
            testimonialCarousel.scrollTo({
               left: 0,
               behavior: 'smooth'
            });
         } else {
            testimonialCarousel.scrollBy({
               left: step,
               behavior: 'smooth'
            });
         }
      }, 3000);
   }

   function stopAutoPlay() {
      if (autoPlayInterval) {
         clearInterval(autoPlayInterval);
         autoPlayInterval = null;
      }
   }

   prevButton.addEventListener('click', () => {
      scrollByCard(-1);
   });

   nextButton.addEventListener('click', () => {
      scrollByCard(1);
   });

   testimonialCarousel.addEventListener('mousedown', startDragging);
   testimonialCarousel.addEventListener('mousemove', drag);
   testimonialCarousel.addEventListener('mouseup', stopDragging);
   testimonialCarousel.addEventListener('mouseleave', stopDragging);

   testimonialCarousel.addEventListener('touchstart', startDragging, { passive: true });
   testimonialCarousel.addEventListener('touchmove', drag, { passive: false });
   testimonialCarousel.addEventListener('touchend', stopDragging);

   testimonialCarousel.addEventListener('dragstart', (e) => e.preventDefault());

   testimonialSlider.addEventListener('mouseenter', stopAutoPlay);
   testimonialSlider.addEventListener('mouseleave', startAutoPlay);

   window.addEventListener('resize', startAutoPlay);

   startAutoPlay();
});