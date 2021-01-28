export default function template(day = 'Tuesday', date = 1, month = 'January', year = 1970) {
	return `
        <div class="mc-calendar__display row">
            <div class="mc-display__header">
                <h3 class="mc-display__day">${day}</h3>
            </div>
            <div class="mc-display__body row">
                <div class="mc-display__data mc-display__data--primary row">
                    <h1 class="mc-display__date">${date}</h1>
                </div>
                <div class="mc-display__data mc-display__data--secondary row">
                    <h3 class="mc-display__month">${month}</h3>
                    <h2 class="mc-display__year">${year}</h2>
                </div>
            </div>
        </div>
        <div class="mc-calendar__picker row">
            <div class="mc-picker__header row container-m">
                <div class="mc-picker__select-month row">
                    <a id="mc-picker__month--prev" class="mc-picker__nav mc-picker__nav--prev" href="#">
                        <svg class="icon-angle icon-angle--left" viewBox="0 0 256 512" width='10px' height='100%'>
                            <path fill="currentColor" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z" />
                        </svg>
                    </a>
                    <div id="mc-current--month" class="mc-select__data mc-select__data--month"><span>${month}</span></div>
                    <a id="mc-picker__month--next" class="mc-picker__nav mc-picker__nav--next" href="#">
                        <svg class="icon-angle icon-angle--right" viewBox="0 0 256 512" width='10px' height='100%'>
                            <path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
                        </svg>
                    </a>
                </div>
                <div class="mc-picker__select-year row">
                    <a id="mc-picker__year--prev" class="mc-picker__nav mc-picker__nav--prev" href="#">
                        <svg class="icon-angle icon-angle--left" viewBox="0 0 256 512" width='10px' height='100%'>
                            <path fill="currentColor" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z" />
                        </svg>
                    </a>
                    <div id="mc-current--year" class="mc-select__data mc-select__data--year"><span>${year}</span></div>
                    <a id="mc-picker__year--next" class="mc-picker__nav mc-picker__nav--next" href="#">
                        <svg class="icon-angle icon-angle--right" viewBox="0 0 256 512" width='10px' height='100%'>
                            <path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
                        </svg>
                    </a>
                </div>
            </div>
            <div class="mc-picker__body">
                <table class="mc-picker__table container-s">
                    <thead class="mc-table__header">
                        <tr>
                            <th class="mc-table__weekday">S</th>
                            <th class="mc-table__weekday">M</th>
                            <th class="mc-table__weekday">T</th>
                            <th class="mc-table__weekday">W</th>
                            <th class="mc-table__weekday">T</th>
                            <th class="mc-table__weekday">F</th>
                            <th class="mc-table__weekday">S</th>
                        </tr>
                    </thead>
                    <tbody class="mc-table__body"></tbody>
                </table>
            </div>
            <div class="mc-picker__footer row container-m">
                <div class="mc-footer__section mc-footer__section--primary">
                    <a id="mc-btn__clear" class="mc-btn mc-btn--danger" href="#">Clear</a>
                </div>
                <div class="mc-footer__section mc-footer__section--secondary">
                    <a id="mc-btn__cancel" class="mc-btn mc-btn--success" href="#">CANCEL</a>
                    <a id="mc-btn__ok" class="mc-btn mc-btn--success" href="#">OK</a>
                </div>
            </div>
        </div>
	`;
}

// template(this.wDays[this.pickedDate.getDay()], this.pickedDate.getDate(), this.currentMonth, this.currentYear);
