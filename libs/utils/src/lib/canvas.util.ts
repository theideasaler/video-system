import { BehaviorSubject } from 'rxjs';

export function preloadVideoThumbs(
  thumbs$: BehaviorSubject<any[]>,
  duration: number,
  video: any,
  options: any,
): any {
    const thumbs: any[] = [];
  document.body.appendChild(video);
  const canvasWidth = +options.width.replace(/\D/g, '') / 5;
  const canvasHeight = +options.height.replace(/\D/g, '') / 5;
  video.addEventListener(
    'loadeddata',
    async function () {
      for (let i = 0; i < duration; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        thumbs.push({ sec: i, canvas });

        const context = canvas.getContext('2d');
        video.currentTime = i;

        await new Promise(function (rsv) {
          const event = function () {
            context?.drawImage(video, 0, 0, canvasWidth, canvasHeight);
            thumbs[i].url = canvas.toDataURL('image/jpeg');
            video.removeEventListener('canplay', event);
            delete thumbs[i].canvas;
            rsv(null);
          };
          video.addEventListener('canplay', event);
        });
      }
      thumbs$.next(thumbs);
      setTimeout(() => document.body.removeChild(video));
      console.log('thumbnails loaded');
    },
    false
  );
}
