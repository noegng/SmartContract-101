// Reusable quiz component.
// Multiple choice:  <div class="q" data-answer="2"> <div class="prompt">…</div>
//                     <div class="opts"><button class="opt">…</button>…</div>
//                     <div class="why">explanation</div> </div>   (data-answer is 0-based)
// Typed recall:     <div class="q" data-recall="accountsChanged|accountschanged"> <div class="prompt">…</div>
//                     <div class="why">…</div> </div>   (alternatives separated by |, case-insensitive)
// Optional score:   <p class="score" id="score"></p>
(function () {
  const quizzes = [...document.querySelectorAll(".q")];
  let answered = 0, correct = 0;

  function verdict(q, ok) {
    const v = document.createElement("div");
    v.className = "verdict " + (ok ? "ok" : "ko");
    v.textContent = ok ? "✓ Correct" : "✗ Pas tout à fait";
    q.querySelector(".why").before(v);
    q.classList.add("done");
    answered++; if (ok) correct++;
    const s = document.getElementById("score");
    if (s) s.textContent = `Score : ${correct} / ${answered} (sur ${quizzes.length})`;
  }

  for (const q of quizzes) {
    if (q.dataset.answer !== undefined) {
      const opts = [...q.querySelectorAll("button.opt")];
      opts.forEach((b, i) => b.addEventListener("click", () => {
        const right = Number(q.dataset.answer);
        opts.forEach((o) => (o.disabled = true));
        opts[right].classList.add("ok");
        if (i !== right) b.classList.add("ko");
        verdict(q, i === right);
      }));
    } else if (q.dataset.recall !== undefined) {
      const accepted = q.dataset.recall.split("|").map((s) => s.trim().toLowerCase());
      const row = document.createElement("div");
      row.innerHTML = '<input class="recall" placeholder="ta réponse, de mémoire"> <button class="check">Vérifier</button>';
      q.querySelector(".why").before(row);
      const input = row.querySelector("input"), btn = row.querySelector("button");
      const go = () => {
        if (!input.value.trim() || q.classList.contains("done")) return;
        input.disabled = btn.disabled = true;
        verdict(q, accepted.includes(input.value.trim().toLowerCase()));
      };
      btn.addEventListener("click", go);
      input.addEventListener("keydown", (e) => e.key === "Enter" && go());
    }
  }
})();
