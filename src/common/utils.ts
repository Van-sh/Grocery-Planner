export function debounce<T extends (...args: any[]) => any>(
   this: any,
   func: T,
   timeout: number = 1000,
) {
   let timer: NodeJS.Timeout;
   let context = this;
   return function (...args: Parameters<T>) {
      clearTimeout(timer);
      timer = setTimeout(() => {
         console.log("debounce", args);
         return func.apply(context, args);
      }, timeout);
   };
}
