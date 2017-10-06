// Components
import { timerTitle } from './timer-title';
import { countdown } from './countdown';
import { options } from './options';

export const App = {
	components: { timerTitle, countdown, options },
	template: `
		<div id="app" class="timer">
			<timer-title></timer-title>
			<section class="timer__body">
				<countdown></countdown>
				<options></options>
			</section>
		</div>
	`
};