document.addEventListener('DOMContentLoaded', () => {
    M.updateTextFields()

    const question = document.querySelector('.svg-question'),
        form = document.querySelector('.form'),
        button = document.querySelector('#submit-btn'),
        checkBox = document.querySelector('.checkbox-consent')
        inputs = document.querySelectorAll('input');

    if (localStorage.getItem('isSent')) {
        button.setAttribute('disabled', 'true')
        checkBox.setAttribute('disabled', 'true')
    }

    question.addEventListener('mouseenter', () => {
        question.style.cursor = 'pointer'
        const div = document.createElement('div')
        div.classList.add('popup-question')
        div.innerText = `Уникальный ник находится в настройках аккаунта, в графе "Имя пользователя", и начинается со знака @. Его желательно создать, если ещё не сделали этого.`
        question.append(div)
    });

    question.addEventListener('mouseleave', () => {
        question.removeChild(document.querySelector('.popup-question'))
    });

    const mask = (selector) => {

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
            let matrix = '+7 (___) ___ __ __',
                i = 0,
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


    mask('#tel');
    enableButton('#submit-btn', '.checkbox-consent');

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

