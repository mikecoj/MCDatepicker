# Vanilla JS Datepicker

This package is written from scratch as ECMAScript modules/[Sass](https://sass-lang.com) stylesheets to reproduce similar usability to bootstrap-datepicker.  

The package also includes pre-built js/css files for those who like to use it directly on browser.

### Features

- Date picker (input-dropdown, inline), date range picker
- Keyboard operation support (navigation by arrow keys, editing on input field)
- i18n support (locales, CSS-based text direction detection)
- Easily customizable to adapt stylesheet for various CSS frameworks
- Dependency free
- Made for modern browsers — no IE support
- Lightweight (well, relatively…) — 31kB (minified, uncompressed)

## Usage

> Initiating new Datepicker object
```
const picker = new Dateicker();

    picker.init({
        el: '#box',
    });
```

