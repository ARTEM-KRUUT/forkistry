// Сигнал окончания таймера: короткие звуковые сигналы (Web Audio) и вибрация.
// AudioContext создаётся по жесту пользователя (нажатие «Старт»), иначе браузер не разрешит звук.

let ctx = null;

/** Вызвать при нажатии «Старт»: разблокирует звук на iOS/Android. */
export function primeAudio() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!ctx) ctx = new Ctx();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    // звук недоступен — останется вибрация и визуальный сигнал
  }
}

export function playAlarm({ sound = true } = {}) {
  if (sound && ctx) {
    try {
      if (ctx.state === 'suspended') ctx.resume();
      // Компрессор поднимает громкость и не даёт сигналу хрипеть на максимуме
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -24;
      comp.knee.value = 6;
      comp.ratio.value = 8;
      comp.connect(ctx.destination);

      // Три серии по четыре сигнала, тона чередуются (как у кухонного таймера) — около 3,5 секунды
      const now = ctx.currentTime;
      const TONES = [1046, 1568]; // до и соль второй октавы — хорошо слышно сквозь шум кухни
      for (let series = 0; series < 3; series += 1) {
        for (let i = 0; i < 4; i += 1) {
          const t = now + series * 1.2 + i * 0.18;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.value = TONES[i % 2];
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.9, t + 0.01);
          gain.gain.setValueAtTime(0.9, t + 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
          osc.connect(gain).connect(comp);
          osc.start(t);
          osc.stop(t + 0.16);
        }
      }
    } catch {
      // игнорируем — ниже вибрация
    }
  }
  navigator.vibrate?.([400, 150, 400, 150, 400, 400, 400, 150, 400, 150, 400]);
}
