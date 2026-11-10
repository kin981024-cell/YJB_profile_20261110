(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 토스트 */
  const toast = document.querySelector(".toast");
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  };

  /* 이메일 복사 */
  document.querySelectorAll("[data-copy]").forEach((el) => {
    el.addEventListener("click", async () => {
      const text = el.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        showToast("이메일 주소를 복사했어요");
      } catch {
        window.location.href = `mailto:${text}`;
      }
    });
  });

  /* 다크/라이트 토글 */
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const syncIcon = () => { toggle.textContent = root.dataset.theme === "dark" ? "☀" : "☾"; };
  syncIcon();
  toggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncIcon();
  });

  /* 인쇄·PDF는 항상 라이트로 */
  let themeBeforePrint;
  window.addEventListener("beforeprint", () => { themeBeforePrint = root.dataset.theme; root.dataset.theme = "light"; });
  window.addEventListener("afterprint", () => { if (themeBeforePrint) root.dataset.theme = themeBeforePrint; });

  /* PDF 저장 */
  document.getElementById("printBtn")?.addEventListener("click", () => window.print());

  /* 숫자 카운트업 */
  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toLocaleString("ko-KR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* 스크롤 등장 */
  const targets = document.querySelectorAll(".stats, .block");
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  targets.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        entry.target.querySelectorAll("[data-count]").forEach(countUp);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((el) => io.observe(el));
})();
