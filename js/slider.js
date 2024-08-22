document.addEventListener('DOMContentLoaded', function() {
  function createSlider(sliderClass) {
    const sliderContainer = document.querySelector(`.${sliderClass}`).closest('.slider-container');
    const slider = sliderContainer.querySelector(`.${sliderClass}`);
    const prevButton = sliderContainer.querySelector('.prev');
    const nextButton = sliderContainer.querySelector('.next');
    let slideIndex = 0;

    function showSlide(index) {
      slider.style.transform = `translateX(-${index * 100}%)`;
    }

    prevButton.addEventListener('click', () => {
      slideIndex = (slideIndex - 1 + slider.children.length) % slider.children.length;
      showSlide(slideIndex);
    });

    nextButton.addEventListener('click', () => {
      slideIndex = (slideIndex + 1) % slider.children.length;
      showSlide(slideIndex);
    });
  }
  createSlider('place-slider');
  createSlider('work-slider');
  createSlider('team-slider');
});