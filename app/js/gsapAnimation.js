const timeLine = gsap.timeline();

timeLine
  .from(".main__title", { x: 50, opacity: 0 })
  .from(".customers__title", { opacity: 0, scale: 0.5 })
  .from(".customers__subtitle", { opacity: 0, scale: 0.5 });
