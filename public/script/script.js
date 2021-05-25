document.addEventListener('DOMContentLoaded', () => {
    M.updateTextFields()

    const question = document.querySelector('.svg-question'),
        form = document.querySelector('.form'),
        button = document.querySelector('#submit-btn'),
        checkBox = document.querySelector('.checkbox-consent'),
        inputs = document.querySelectorAll('input'),
        uniqueNick = document.querySelector('#unique-nick'),
        popupQuestion = document.querySelector('.popup-question');


    // Блокировка кнопки "отправить", если данные уже были отправлены
    if (localStorage.getItem('isSent')) {
        button.setAttribute('disabled', 'true')
        checkBox.setAttribute('disabled', 'true')
    }

    // Всплытие окошка помощи по нику телеграма
    question.addEventListener('mouseenter', () => {
        question.style.cursor = 'pointer'
        popupQuestion.style.display = 'block'
    });

    question.addEventListener('mouseleave', () => {
        popupQuestion.style.display = 'none'
    });

    question.addEventListener('touchstart', () => {
        if (popupQuestion.style.display === 'none') {
            popupQuestion.style.display = 'block'
        } else popupQuestion.style.display = 'none'
    });

    // Начальная @ в поле уникального ника
    const events = ['focus', 'input', 'blur']

    events.forEach(event => {
        uniqueNick.addEventListener(event, () => {
            switch (event) {
                case 'focus': if (!uniqueNick.value) uniqueNick.value = '@'
                    break
                case 'input': if (uniqueNick.value.length === 0) uniqueNick.value = '@'
                    break
                case 'blur': if (uniqueNick.value.length === 1) uniqueNick.value = ''
                    break
            }
        });
    });



    // Маска телефона
    const mask = (selector, matrix) => {

        let setCursorPosition = (pos, elem) => {
            elem.focus();

            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();

                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        };

        function createMask(event) {
            let i = 0,
                def = matrix.replace(/\D/g, ''),
                val = this.value.replace(/\D/g, '');

            if (def.length >= val.length) {
                val = def;
            }

            this.value = matrix.replace(/./g, function(a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
            });

            if (event.type === 'blur') {
                if (this.value.length === 2) {
                    this.value = '';
                }
            } else {
                setCursorPosition(this.value.length, this);
            }
        }

        let inputs = document.querySelectorAll(selector);

        inputs.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('blur', createMask);
        });
    };

    // Активация кнопки "отправить" при нажатии на чекбокс согласия
    const enableButton = (buttonSelector, checkBoxSelector) => {
        const btn = document.querySelector(buttonSelector),
            checkbox = document.querySelector(checkBoxSelector);

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                btn.removeAttribute('disabled');
            } else {
                btn.setAttribute('disabled', 'true');
            }

        });
    }


    mask('#tel', '+7 (___) ___ __ __');
    enableButton('#submit-btn', '.checkbox-consent');

    // Отправка формы
    button.addEventListener('click', async e => {
        e.preventDefault()
        try {
            const response = await fetch('/api/postform', {
                method: 'POST',
                body: new FormData(form)
            })
            const json = await response.json()
            button.setAttribute('disabled', 'true')
            checkBox.setAttribute('disabled', 'true')
            inputs.forEach(input => input.value = '')
            if (!localStorage.getItem('isSent')) {
                localStorage.setItem('isSent', 'true')
            }
            M.toast({html: json.message});

        } catch (e) {
            M.toast({html: e});
        }
    });
});

