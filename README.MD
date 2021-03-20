# MCDatepicker

Framework-agnostic, highly-customizable Vanilla JavaScript datepicker with zero dependencies.

### Features

- 2 Modes: (modal, inline)
- Dependency free
- Custom weekday and month names
- Disable weekdays and specific dates
- Fully responsive/ Mobile friendly

## Installation

#### Via NPM

```
npm install mc-datepicker --save
```

#### Using CDN

Include CDN links in the `<head>`...

```html
<link href="https://cdn.jsdelivr.net/npm/mc-datepicker/dist/mc-calendar.min.css" rel="stylesheet" />

<script src="https://cdn.jsdelivr.net/npm/mc-datepicker/dist/mc-calendar.min.js"></script>
```

## Usage

```html
<input id="datepicker" type="text">
```

If you’re using a bundler, e.g. webpack, you’ll need to import ` MCDatepicker`

```javascript
import MCDatepicker from 'mc-datepicker';
```

1. Create a new instance, and attach it to an input field

```javascript
const picker = MCDatepicker.create({
	el: '#datepicker'
});
```

2. Customize the datepicker by adding more options

```javascript
const picker = MCDatepicker.create({
	el: '#datepicker',
	disableWeekends: true
});
```

3. Use methods to manipulate the datepicker

```javascript
btn.onclick = () => picker.open();
```

## Documentation

[Online Docs](https://mcdatepicker.netlify.app/docs/)

## License

[MIT](LICENSE)
