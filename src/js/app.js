import Form from "./form.js";

if (document.querySelector('.form') !== null) {
  const formBox = document.querySelector('.form');
  const form = new Form(formBox);
  const formButton = formBox.querySelector('.form__button');
  const htmlOverlayForm = `<div class="form__overlay review">
  <p class="review__title review__title--overlay">Спасибо за ваш отзыв!</p>
  <p class="review__description review__description--overlay">Ваш отзыв будет опубликован сразу после того, как его проверят наши сотрудники.</p>
</div>`;
  form.init();

  formButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    const errorForm = form.validateInputs();
    if (!errorForm) {
      formBox.insertAdjacentHTML("beforeend", htmlOverlayForm);
    }

  });
}