'use strict';

/*===============================================================
          preloader scripts
 ==================================================================*/
document.addEventListener('DOMContentLoaded', function () {
   // makes sure that whole site is loaded, so the 3000ms preloader coincides with
   // the delay of 3000ms for the header content animation
   console.log('DOMContentLoaded for the preloader');

   const preloader = document.getElementById('preloader');
   const preloader_gif = document.getElementById('preloader-gif');


   if (preloader_gif) {
      preloader_gif.style.transition = 'opacity 3000ms ease-in-out';
      preloader_gif.style.opacity = '0';

   }
   if (preloader) {
      preloader.style.transition = 'opacity 3000ms ease-in-out';
      preloader.style.opacity = '0';
   }

   setTimeout(function () {
      preloader_gif.style.display = 'none';
      preloader.style.display = 'none';
   }, 3000);
});

/*===============================================================
          main scripts
 ==================================================================*/
document.addEventListener('DOMContentLoaded', () => {
   console.log('DOMContentLoaded and ready for use!');

   const slider = document.getElementById('testimonial-slider');
   const carousel = document.getElementById('testimonial-carousel');
   const cards = Array.from(carousel.querySelectorAll('.testimonial-card'));
   const prevButton = document.getElementById('prev-button');
   const nextButton = document.getElementById('next-button');

   if (!slider || !carousel || !cards.length || !prevButton || !nextButton) return;

   let isDragging = false;
   let startX = 0;
   let startScrollLeft = 0;
   let autoplayId = null;
   let dragMoved = false;

   function getPointerX(e) {
      return e.touches ? e.touches[0].clientX : e.clientX;
   }

   function getCardsPerView() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
   }

   function getCardPositions() {
      return cards.map((card) => card.offsetLeft);
   }

   function getClosestCardIndex() {
      const positions = getCardPositions();
      const current = carousel.scrollLeft;

      let closestIndex = 0;
      let minDiff = Math.abs(positions[0] - current);

      for (let i = 1; i < positions.length; i++) {
         const diff = Math.abs(positions[i] - current);
         if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
         }
      }

      return closestIndex;
   }

   function getLastStartIndex() {
      return Math.max(0, cards.length - getCardsPerView());
   }

   function scrollToCard(index, smooth = true) {
      const positions = getCardPositions();
      const safeIndex = Math.max(0, Math.min(index, getLastStartIndex()));

      carousel.scrollTo({
         left: positions[safeIndex],
         behavior: smooth ? 'smooth' : 'auto'
      });
   }

   function nextSlide() {
      const currentIndex = getClosestCardIndex();
      const nextIndex = currentIndex + 1;

      if (nextIndex > getLastStartIndex()) {
         scrollToCard(0);
      } else {
         scrollToCard(nextIndex);
      }
   }

   function prevSlide() {
      const currentIndex = getClosestCardIndex();
      const prevIndex = currentIndex - 1;

      if (prevIndex < 0) {
         scrollToCard(getLastStartIndex());
      } else {
         scrollToCard(prevIndex);
      }
   }

   function startAutoplay() {
      stopAutoplay();

      /*       if (window.innerWidth < 768) return; */

      autoplayId = setInterval(() => {
         if (!isDragging) {
            nextSlide();
         }
      }, 3500);
   }

   function stopAutoplay() {
      if (autoplayId) {
         clearInterval(autoplayId);
         autoplayId = null;
      }
   }

   function handleDragStart(e) {
      isDragging = true;
      dragMoved = false;
      startX = getPointerX(e);
      startScrollLeft = carousel.scrollLeft;
      carousel.classList.add('is-dragging');
      stopAutoplay();
   }

   function handleDragMove(e) {
      if (!isDragging) return;

      const currentX = getPointerX(e);
      const distance = currentX - startX;

      if (Math.abs(distance) > 5) {
         dragMoved = true;
      }

      carousel.scrollLeft = startScrollLeft - distance;

      if (e.cancelable) {
         e.preventDefault();
      }
   }

   function handleDragEnd() {
      if (!isDragging) return;

      isDragging = false;
      carousel.classList.remove('is-dragging');

      if (dragMoved) {
         scrollToCard(getClosestCardIndex());
      }

      startAutoplay();
   }

   prevButton.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
   });

   nextButton.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
   });

   carousel.addEventListener('mousedown', handleDragStart);
   carousel.addEventListener('mousemove', handleDragMove);
   carousel.addEventListener('mouseup', handleDragEnd);
   carousel.addEventListener('mouseleave', handleDragEnd);

   carousel.addEventListener('touchstart', handleDragStart, { passive: true });
   carousel.addEventListener('touchmove', handleDragMove, { passive: false });
   carousel.addEventListener('touchend', handleDragEnd);

   carousel.addEventListener('dragstart', (e) => e.preventDefault());

   slider.addEventListener('mouseenter', stopAutoplay);
   slider.addEventListener('mouseleave', startAutoplay);

   window.addEventListener('resize', () => {
      scrollToCard(getClosestCardIndex(), false);
      startAutoplay();
   });

   scrollToCard(0, false);
   startAutoplay();

});