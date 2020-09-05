import { Sound } from './Sound';
import PQueue from 'p-queue';

const ringtoneEventQueue = new PQueue({ concurrency: 1 });

class CallingTones {
  private ringtone?: Sound;

  async playEndCall() {
    const canPlayTone = await window.getCallRingtoneNotification();
    if (!canPlayTone) {
      return;
    }

    const tone = new Sound({
      src: 'sounds/navigation-cancel.ogg',
    });
    await tone.play();
  }

  async playRingtone() {
    await ringtoneEventQueue.add(async () => {
      if (this.ringtone) {
        this.ringtone.stop();
        this.ringtone = undefined;
      }

      const canPlayTone = await window.getCallRingtoneNotification();
      if (!canPlayTone) {
        return;
      }

      this.ringtone = new Sound({
        loop: true,
        src: 'sounds/ringtone_minimal.ogg',
      });

      await this.ringtone.play();
    });
  }

  async stopRingtone() {
    await ringtoneEventQueue.add(async () => {
      if (this.ringtone) {
        this.ringtone.stop();
        this.ringtone = undefined;
      }
    });
  }
}

export const callingTones = new CallingTones();
