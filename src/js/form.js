/**
 * Класс делает валидацию полей на отсутствие значений, количество знаков. Подключает маску для инпута телефона. Метод validateInputs
 * возвращает длину массива с ошибками.
 * 
 * @param {string} form форма документа полученная методом querySelector
 */
import IMask from 'imask';

export default class Form {
    constructor(form) {
        this.form = form;
        this.inputTel = this.form.querySelector('.form__input--tel');
        this.inputFile = this.form.querySelector('.form__input--file input');
        this.filePreviews = this.form.querySelector('.form__input--file');
        this.inputValidate = this.form.querySelectorAll('.form__input--validate');
        this.boxFile = this.form.querySelector('.form__wrap--file');
        this.formLabelText = this.form.querySelector('.form__label-text');
        this.inputError = [];
        this.EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        this._inputClickHandler = this._inputClickHandler.bind(this);
        this._addFile = this._addFile.bind(this);
        this.mask = this._getMask();
    }

    init = () => {
        this.boxFile.addEventListener('change', this._addFile);
        // console.log(this.inputFile);

    }

    _addFile = () => {
        const files = this.inputFile.files;

        const htmlDefault = `<div class="review review--file">
            <div class="review__default">
            </div>
          </div>`;

        if (files.length) {
            if (this.formLabelText !== null && this.filePreviews.querySelector('.review__default') === null) {
                this.filePreviews.insertAdjacentHTML("beforeend", htmlDefault);
            }
        }
        Array.from(files).forEach((file) => {
        
            if (file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) {
                const src = URL.createObjectURL(file);
                const name = file.name;
                const html = `<div class="review review--file">
                <div class="review__photo">
                <button class="review__close">
                <svg class="review__svg" width="12" height="12">
                  <use xlink:href="img/icons/icons.svg#close"></use>
                </svg>
              </button>
                  <img src="${src}" alt="${name}" class="review__img" width="90" height="120">
                </div>
              </div>`;

                if (this.formLabelText !== null) {
                    this.formLabelText.remove();
                    this.filePreviews.classList.add('form__input--upload');
                }
                this.filePreviews.insertAdjacentHTML("beforeend", html);

            } else {
                this._getErrorAtributes(this.filePreviews);
                console.log('Пожалуйста, выберите изображение размером не более 10 МБ.');
            }

        })
    };

    _inputClickHandler = ({ target }) => {

        target.classList.contains('form__input--error')
            ? target.classList.remove('form__input--error')
            : '';
        target.removeEventListener('click', this._inputClickHandler);
    }

    _getMask = () => {
        const maskOptions = {
            mask: '+{7}(000)000-00-00'
        };
        return IMask(this.inputTel, maskOptions);
    }

    _getErrorAtributes = (el) => {
        el.classList.add('form__input--error');
        this.inputError.push(el);
    }

    _isEmailValid = (value) => {
        console.log('va', this.EMAIL_REGEXP.test(value));

        return this.EMAIL_REGEXP.test(value);
    }

    validateInputs = () => {
        this.inputError = [];
        this.inputValidate.forEach((i) => {
            i.addEventListener('input', this._inputClickHandler);

            if (i.id === 'name') {
                if (i.value.length && i.value.length < 2) {

                    this._getErrorAtributes(i);

                    console.log('минимум две буквы в имени');
                }
            }

            if (i.id === 'tel') {
                if (this.mask.unmaskedValue.length < 11 && i.value.length) {
                    this._getErrorAtributes(i);
                    console.log('мало цифр - надо 11');

                }
            }

            if (i.id === 'e-mail') {
                if (!this._isEmailValid(i.value)) {
                    this._getErrorAtributes(i);
                    console.log('неверно написана почта');

                }
            }

            if (!i.value) {
                this._getErrorAtributes(i);
            }
        });
        return this.inputError.length;
    }
}