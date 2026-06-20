// Инициализация GSAP модулей из твоего старого проекта
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
	wrapper: '#smooth-wrapper',
	content: '#smooth-content',
	smooth: 1.5,
	effects: true
});

// Базовый параллакс леса через CSS переменную
window.addEventListener("scroll", e => {
	document.body.style.cssText += `--scrollTOP: ${window.scrollY}px`;
});

// Дополнительная анимация: красивое появление карточек в подземелье при скролле
gsap.fromTo('.main-article .max-w-5xl > *',
	{ opacity: 0, y: 80 },
	{
		opacity: 1,
		y: 0,
		duration: 1.2,
		stagger: 0.3,
		ease: "power2.out",
		scrollTrigger: {
			trigger: '.main-article',
			start: 'top 85%',
			toggleActions: 'play none none reverse'
		}
	}
);
// ==========================================
// Мониторинг серверов (Связь с Go-бэкендом)
// ==========================================
async function fetchServerStatus() {
	try {
		// Стучимся к нашему бэкенду
		const response = await fetch('/api/status');
		const data = await response.json();

		// Функция для красивого переключения Tailwind-классов
		const updateStatusElement = (elementId, isOnline) => {
			const el = document.getElementById(elementId);
			if (!el) return;

			const indicator = el.querySelector('.indicator');
			const text = el.querySelector('.text');

			if (isOnline) {
				// Сервер активен: Изумрудный цвет + пульсация + неоновое свечение
				el.className = "text-emerald-500 flex items-center gap-2 transition-all duration-500";
				indicator.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981] indicator transition-all duration-500";
				text.textContent = "Активен";
			} else {
				// Сервер выключен: Приглушенный серый цвет
				el.className = "text-slate-600 flex items-center gap-2 transition-all duration-500";
				indicator.className = "w-2.5 h-2.5 rounded-full bg-slate-600 indicator transition-all duration-500";
				text.textContent = "Сон";
			}
		};

		// Обновляем статусы, используя ключи из твоего Go models.ServerStatus
		updateStatusElement('mc-status', data.minecraft);
		updateStatusElement('dnd-status', data.dnd);

	} catch (error) {
		console.error("Ошибка при получении статуса Древа Жизни:", error);
	}
}

// Запускаем проверку при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
	fetchServerStatus();
	// Настраиваем периодический опрос каждые 30 секунд
	setInterval(fetchServerStatus, 30000);
});

// ==========================================
// Анимация светлячков (GSAP)
// ==========================================
function createFireflies() {
	const container = document.querySelector('.fireflies-container');
	if (!container) return;

	const firefliesCount = 50; // Количество светлячков

	for (let i = 0; i < firefliesCount; i++) {
		let firefly = document.createElement('div');
		firefly.classList.add('firefly');
		container.appendChild(firefly);

		// Раскидываем их в случайные координаты по экрану
		let startX = Math.random() * window.innerWidth;
		let startY = Math.random() * window.innerHeight;

		gsap.set(firefly, { x: startX, y: startY });

		// Запускаем бесконечный полет
		animateFirefly(firefly);
	}
}

function animateFirefly(firefly) {
	let currentX = gsap.getProperty(firefly, "x");
	let currentY = gsap.getProperty(firefly, "y");

	// Светлячок выбирает новую случайную точку в радиусе 300px
	let newX = currentX + (Math.random() - 0.5) * 300;
	let newY = currentY + (Math.random() - 0.5) * 300;

	let duration = 3 + Math.random() * 4; // Случайная скорость полета (3-7 сек)

	gsap.to(firefly, {
		x: newX,
		y: newY,
		opacity: Math.random() * 0.8 + 0.2, // Случайное мерцание (0.2 - 1.0)
		duration: duration,
		ease: "sine.inOut",
		onComplete: animateFirefly, // Когда долетел — запускаем новый маршрут
		onCompleteParams: [firefly]
	});
}

// Запускаем генерацию светлячков при загрузке документа
document.addEventListener("DOMContentLoaded", () => {
	createFireflies();

	// Если у тебя осталась функция fetchServerStatus() из Древа Жизни,
	// не забудь вызвать и её здесь же:
	// fetchServerStatus();
	// setInterval(fetchServerStatus, 30000);
});