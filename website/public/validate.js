document.querySelectorAll('form[data-check]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
        var messages = [];

        form.querySelectorAll('[data-required]').forEach(function (input) {
            var value = input.type === 'password' ? input.value : input.value.trim();
            if (value === '') {
                messages.push(input.dataset.required);
            }
        });

        var password = form.querySelector('[name="password"]');
        var confirmPassword = form.querySelector('[name="confirm_password"]');
        if (password && confirmPassword && password.value && confirmPassword.value
            && password.value !== confirmPassword.value) {
            messages.push('Passwords do not match');
        }

        form.querySelectorAll('[data-max]').forEach(function (input) {
            if (input.value.trim().length > Number(input.dataset.max)) {
                messages.push(input.dataset.maxmsg);
            }
        });

        form.querySelectorAll('[data-pattern]').forEach(function (input) {
            var value = input.value.trim();
            if (value !== '' && !new RegExp(input.dataset.pattern, 'u').test(value)) {
                messages.push(input.dataset.patternmsg);
            }
        });

        form.querySelectorAll('[data-min]').forEach(function (input) {
            if (input.value !== '' && input.value.length < Number(input.dataset.min)) {
                messages.push(input.dataset.minmsg);
            }
        });

        var box = document.querySelector('.js-errors');
        if (messages.length > 0) {
            event.preventDefault();
            box.innerHTML = '';
            messages.forEach(function (text) {
                var li = document.createElement('li');
                li.textContent = text;
                box.appendChild(li);
            });
            box.hidden = false;
        }
    });
});