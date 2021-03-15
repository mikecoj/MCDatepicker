# MCDatepicker

Framework-agnostic, highly-customizable Vanilla JavaScript datepicker with zero dependencies.

### Features

- 2 Modes: (modal, inline)
- Dependency free
- Custom weekday and month names
- Disable weekdays and specific dates
- Fully responsive/ Mobile friendly

## Installation

#### Using CDN

Include CDN links in the `<head>`...

```html
<link href="https://cdn.jsdelivr.net/gh/mikecoj/MCDatepicker@0.1.0/dist/mc-calendar.min.css"	rel="stylesheet"/>

<script src="https://cdn.jsdelivr.net/gh/mikecoj/MCDatepicker@0.1.0/dist/mc-calendar.min.js"></script>
```

## Usage

1. Create a new instance, and attach it to an input field

```html
<input id="datepicker" type="text" />
```

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

## License

[MIT](LICENSE)
