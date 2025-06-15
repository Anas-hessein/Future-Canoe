            // Dark mode functionality
            const enableDarkMode = () => {
                document.body.classList.add('darkmode');
                currentDarkMode = true;
            };

            const disableDarkMode = () => {
                document.body.classList.remove('darkmode');
                currentDarkMode = false;
            };

            themeSwitch.addEventListener('click', () => {
                currentDarkMode ? disableDarkMode() : enableDarkMode();
            });