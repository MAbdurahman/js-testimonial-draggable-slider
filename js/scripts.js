'use strict';

document.addEventListener('DOMContentLoaded', () => {
   console.log('DOMContentLoaded is loaded and ready to use');

   const testimonialSlider = document.getElementById('testimonial-slider');
   const testimonialCarousel = document.getElementById('testimonial-carousel');
   const prevButton = document.getElementById('prev-button');
   const nextButton = document.getElementById('next-button');

   const firstCard = testimonialCarousel.querySelector('.testimonial-card')
   const firstCardWidth = firstCard.offsetWidth;

   let isDragging = false;
   let startX;
   let startScrollLeft;

   function handleIsDraggingStart(e) {
      isDragging = true;
      testimonialCarousel.classList.add('is-dragging');
      startX = e.pageX;
      startScrollLeft = testimonialCarousel.scrollLeft;
   }

   function handleIsDraggingStop() {
      isDragging = false;
   }

   function handleIsDragging(e) {
      if (!isDragging) {
         return;
      }
      e.preventDefault();
      /*const x = e.pageX - testimonialCarousel.offsetLeft;
      const walk = (x - startX) * 2;
      testimonialCarousel.scrollLeft = startScrollLeft - walk;*/

      // calculate the new scroll position
      const newScrollLeft = startScrollLeft - (e.pageX - startX);

      // check if the new scroll position is within the bounds of the carousel
      if (newScrollLeft <= 0 ||
         newScrollLeft >= (testimonialCarousel.scrollWidth - testimonialCarousel.offsetWidth)) {

         // if so, prevent further dragging
         isDragging = false;
         return;
      }
      // otherwise, update the scroll position of the testimonialCarousel
      testimonialCarousel.scrollLeft = newScrollLeft;

   }

   function handleAutoPlay() {
      if (isDragging) return;
      testimonialCarousel.scrollLeft += 1;
   }

   testimonialCarousel.addEventListener('mousedown', handleIsDraggingStart);
   testimonialCarousel.addEventListener('mouseup', handleIsDraggingStop);
   testimonialCarousel.addEventListener('mousemove', handleIsDragging);
   testimonialCarousel.addEventListener('mouseleave', handleIsDraggingStop);
   testimonialCarousel.addEventListener('touchstart', handleIsDraggingStart);
   testimonialCarousel.addEventListener('touchend', handleIsDraggingStop);
   testimonialCarousel.addEventListener('touchmove', handleIsDragging);
   testimonialSlider.addEventListener('mouseleave', handleAutoPlay);

   testimonialCarousel.addEventListener('wheel', (e) => {
      e.preventDefault();
      testimonialCarousel.scrollLeft += e.deltaY;
   });

   testimonialCarousel.addEventListener('scroll', () => {
      prevButton.disabled = testimonialCarousel.scrollLeft === 0;
      nextButton.disabled =
         testimonialCarousel.scrollLeft + testimonialCarousel.offsetWidth >= testimonialCarousel.scrollWidth;
   });

   testimonialCarousel.addEventListener('dragstart', (e) => e.preventDefault());
   testimonialCarousel.addEventListener('drag', (e) => e.preventDefault());
});