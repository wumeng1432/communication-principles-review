/* =========================================================
   通信原理 · 期末复习站 —— 路由与渲染
   ========================================================= */

const LS_DONE = "ty_done_chapters";
const LS_SCORE = "ty_exam_scores";

function getDone() {
  try { return JSON.parse(localStorage.getItem(LS_DONE) || "[]"); } catch (e) { return []; }
}
function setDone(arr) { localStorage.setItem(LS_DONE, JSON.stringify(arr)); }
function toggleDone(n) {
  let d = getDone();
  if (d.includes(n)) d = d.filter(x => x !== n); else d.push(n);
  setDone(d); updateProgress();
}
function updateProgress() {
  const d = getDone().length;
  const pct = Math.round(d / CHAPTERS.length * 100);
  const bar = document.getElementById("pbar");
  const txt = document.getElementById("ptxt");
  if (bar) bar.style.width = pct + "%";
  if (txt) txt.textContent = d + "/" + CHAPTERS.length;
}
function getScores() {
  try { return JSON.parse(localStorage.getItem(LS_SCORE) || "{}"); } catch (e) { return {}; }
}
function setScore(id, s) {
  const o = getScores(); o[id] = s; localStorage.setItem(LS_SCORE, JSON.stringify(o));
}

/* ---------------- 导航 ---------------- */
function buildNav() {
  const nav = document.getElementById("nav");
  const hash = location.hash || "#/home";
  const isCh = hash.startsWith("#/ch/");
  const curCh = isCh ? parseInt(hash.split("/")[2]) : 0;
  const done = getDone();

  let h = "";
  h += `<div class="nav-group"><div class="nav-label">开始</div>`;
  h += navItem("#/home", "🏠", "首页 · 复习总览", hash === "#/home" || hash === "");
  h += navItem("#/analysis", "📊", "民大考情与重点", hash === "#/analysis");
  h += `</div>`;

  h += `<div class="nav-group"><div class="nav-label">教材精讲 · 13章</div>`;
  CHAPTERS.forEach(c => {
    const on = curCh === c.num;
    const ok = done.includes(c.num);
    h += `<div class="nav-item ${on ? "active" : ""}" onclick="go('#/ch/${c.num}')">
      <span class="idx">${String(c.num).padStart(2, "0")}</span>
      <span>${c.title}</span>
      ${ok ? '<span class="cnt" style="color:#15803d">✓</span>' : `<span class="dot"></span>`}
    </div>`;
  });
  h += `</div>`;

  h += `<div class="nav-group"><div class="nav-label">工具</div>`;
  h += navItem("#/formula", "🧮", "公式速查表", hash === "#/formula");
  h += navItem("#/exam", "📝", "模拟考试（3套）", hash.startsWith("#/exam"));
  h += navItem("#/tips", "💡", "速记手册与易错点", hash === "#/tips");
  h += `</div>`;

  nav.innerHTML = h;
}
function navItem(href, icon, label, on) {
  return `<div class="nav-item ${on ? "active" : ""}" onclick="go('${href}')">
    <span style="width:20px;text-align:center;font-size:13px">${icon}</span>
    <span>${label}</span>
  </div>`;
}
function go(hash) {
  location.hash = hash;
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------------- 首页 ---------------- */
function viewHome() {
  const done = getDone().length;
  const scores = getScores();
  const examDone = Object.keys(scores).length;
  return `
  <div class="banner">
    <h2>通信原理 · 期末复习站</h2>
    <p>${META.school} · ${META.course}。以 ${META.book}（${META.press}）13 章体系为骨架，
    结合公开试题题型与高频考点，梳理必考公式、典型例题与易错陷阱，助你一次通过。</p>
    <div class="chips">
      <span class="chip">教材 13 章</span>
      <span class="chip">3 套模拟卷</span>
      <span class="chip">36 条核心公式</span>
      <span class="chip">13 个章节精讲</span>
      <span class="chip">易错点专攻</span>
    </div>
  </div>

  <div class="grid g4" style="margin-top:20px">
    <div class="stat"><div class="n">${done}/13</div><div class="l">已复习章节</div></div>
    <div class="stat"><div class="n">${examDone}/3</div><div class="l">已完成模拟卷</div></div>
    <div class="stat"><div class="n">4</div><div class="l">必考大题章节</div></div>
    <div class="stat"><div class="n">${FORMULA_BANK.length}</div><div class="l">核心公式条目</div></div>
  </div>

  <div class="section" style="margin-top:26px">
    <h3 class="h-title" style="font-size:19px;margin-bottom:4px">快速入口</h3>
    <div class="h-sub" style="margin-bottom:14px">按你的复习阶段选择</div>
    <div class="grid g2">
      ${quick("#/analysis", "📊", "民大考情与重点", "题型分值、章节权重、复习优先级", "#eaf1fe", "#2563eb")}
      ${quick("#/ch/5", "🎯", "四大必考章节", "第5/6/7/10章，占分 50+", "#fef4e6", "#d97706")}
      ${quick("#/formula", "🧮", "公式速查表", "考前 30 分钟快速过一遍", "#e6f7fb", "#0891b2")}
      ${quick("#/exam", "📝", "模拟考试", "3 套卷子，即时判分与解析", "#f1ecfe", "#7c3aed")}
    </div>
  </div>

  <div class="section">
    <h3 class="h-title" style="font-size:19px;margin-bottom:4px">建议复习路线</h3>
    <div class="h-sub" style="margin-bottom:16px">按此顺序推进，性价比最高</div>
    <div class="card">
      <div class="stepper">
        ${step(1, "先看考情，明确重点", "花 10 分钟读「民大考情与重点」，知道哪几章值钱、哪些题型分值高，避免平均用力。")}
        ${step(2, "吃透 4 个必考大题章节", "第 5 章模拟调制、第 6 章数字基带、第 7 章数字带通、第 10 章信源编码。每章的公式卡片和例题都要动手算一遍。")}
        ${step(3, "补齐 3 个高频计算点", "香农公式（第4章）、匹配滤波器（第9章）、最小码距（第11章）。这三点各出一道题的概率很高。")}
        ${step(4, "扫基础题保底", "第 1、2、3 章的概念与换算，第 13 章同步的简答，属于背了就有分，别丢。")}
        ${step(5, "做模拟卷，专攻易错点", "3 套模拟卷限时完成，然后对照「速记手册 · 易错点」逐个纠偏。")}
      </div>
    </div>
  </div>

  <div class="section">
    <h3 class="h-title" style="font-size:19px;margin-bottom:4px">章节速览</h3>
    <div class="h-sub" style="margin-bottom:14px">点击进入任意章节</div>
    <div class="grid g3">
      ${CHAPTERS.map(c => `
        <div class="quick" onclick="go('#/ch/${c.num}')" style="align-items:flex-start">
          <div class="qi" style="background:linear-gradient(135deg,#2563eb,#0891b2);color:#fff;font-weight:800;font-family:var(--mono)">${c.num}</div>
          <div style="flex:1">
            <div class="qt">${c.title}</div>
            <div class="qd">${"★".repeat(c.stars)}<span style="color:#dde3ec">${"★".repeat(5 - c.stars)}</span> · ${c.freq}</div>
          </div>
        </div>`).join("")}
    </div>
  </div>
  `;
}
function quick(href, icon, t, d, bg, fg) {
  return `<div class="quick" onclick="go('${href}')">
    <div class="qi" style="background:${bg};color:${fg}">${icon}</div>
    <div><div class="qt">${t}</div><div class="qd">${d}</div></div>
  </div>`;
}
function step(n, t, d) {
  return `<div class="step-row"><div class="sd">${n}</div><div class="sb"><b>${t}</b><p>${d}</p></div></div>`;
}

/* ---------------- 考情分析 ---------------- */
function viewAnalysis() {
  const A = EXAM_ANALYSIS;
  return `
  <h1 class="h-title">民大考情与重点分析</h1>
  <p class="h-sub">先搞清楚“考什么、怎么考、什么最值钱”，再决定时间怎么花</p>

  <div class="note" style="margin-top:18px">
    <b>说明：</b>${A.intro}
  </div>

  <div class="section">
    <div class="card">
      <h3><span class="ic">📋</span>典型题型与分值分布</h3>
      <table class="tb">
        <thead><tr><th>题型</th><th>题量</th><th>分值</th><th>合计</th><th>命题特点</th></tr></thead>
        <tbody>
          ${A.pattern.map(p => `<tr><td><b>${p.type}</b></td><td>${p.num}</td><td>${p.score}</td><td>${p.total}</td><td>${p.note}</td></tr>`).join("")}
        </tbody>
      </table>
      <div class="note blue" style="margin-top:14px;margin-bottom:0">
        <b>规律：</b>选择题 + 填空题 + 简答题合计通常占 50～60 分，属于“记忆型得分”；计算题占 35～45 分，
        是拉开差距的关键。计算题集中出自第 5、6、7、10 章。
      </div>
    </div>
  </div>

  <div class="section">
    <div class="card">
      <h3><span class="ic">⚖️</span>各章考频权重</h3>
      <div class="h-sub" style="margin-top:-8px;margin-bottom:14px">条越长表示出题概率越高、分值越重</div>
      ${A.weights.map(w => `
        <div style="margin-bottom:13px">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span style="font-size:13.5px;font-weight:700;min-width:190px">${w.ch}</span>
            <span class="tag ${w.w >= 85 ? "r" : w.w >= 65 ? "a" : w.w >= 45 ? "b" : ""}">${w.lv}</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-top:6px">
            <div style="flex:1;height:8px;background:#eef2f8;border-radius:99px;overflow:hidden;min-width:120px">
              <div style="width:${w.w}%;height:100%;border-radius:99px;background:linear-gradient(90deg,#2563eb,#0891b2)"></div>
            </div>
            <span style="font-size:11.5px;color:var(--muted);font-family:var(--mono);width:30px">${w.w}</span>
          </div>
          <div style="font-size:12.5px;color:var(--muted);margin-top:4px">${w.desc}</div>
        </div>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="card green">
      <h3><span class="ic">✓</span>复习策略：四步走</h3>
      <div class="stepper">
        ${A.strategy.map((s, i) => step(i + 1, s.t, s.d)).join("")}
      </div>
    </div>
  </div>

  <div class="section">
    <div class="card red">
      <h3><span class="ic">⚠️</span>最高频的 4 个失分点</h3>
      <ul class="clean">
        <li><b>dB 与数值换算：</b>香农公式里必须用数值。30 dB = 1000，20 dB = 100。</li>
        <li><b>erfc 的系数：</b>2PSK 是 ½erfc(√r)，2FSK 是 ½erfc(√(r/2))，2ASK 是 ½erfc(√(r/4))。</li>
        <li><b>卡森公式的 +1：</b>B = 2(m_f + 1)f_H，漏掉 +1 直接错。</li>
        <li><b>抽样定理的 2f_H：</b>是最高频率的两倍，不是中心频率的两倍。</li>
      </ul>
    </div>
  </div>
  `;
}

/* ---------------- 章节 ---------------- */
function viewChapter(num) {
  const c = CHAPTERS.find(x => x.num === num);
  if (!c) return `<h1 class="h-title">章节不存在</h1>`;
  const done = getDone().includes(num);
  const prev = CHAPTERS.find(x => x.num === num - 1);
  const next = CHAPTERS.find(x => x.num === num + 1);

  return `
  <div class="chapter-head">
    <div class="cn">${c.num}</div>
    <div class="ct">
      <h2>第${c.num}章 · ${c.title}</h2>
      <div class="meta">
        <span class="tag a"><span class="stars">${"★".repeat(c.stars)}<span class="off">${"★".repeat(5 - c.stars)}</span></span> 重要度</span>
        <span class="tag b">题型：${c.freq}</span>
        <span class="tag">${c.points.length} 个考点 · ${c.formulas.length} 条公式</span>
      </div>
    </div>
    <div class="done-toggle ${done ? "on" : ""}" onclick="toggleDone(${num});render();">
      <span class="box">${done ? "✓" : ""}</span>${done ? "已掌握" : "标记已复习"}
    </div>
  </div>

  <div class="note blue">${c.intro}</div>

  <div class="section">
    <div class="card">
      <h3><span class="ic">🎯</span>考点框架</h3>
      <ul class="clean">${c.points.map(p => `<li>${p}</li>`).join("")}</ul>
    </div>
  </div>

  <div class="section">
    <div class="card cyan">
      <h3><span class="ic">🧮</span>核心公式（必背）</h3>
      ${c.formulas.map(f => `
        <div class="formula">
          <div class="fn">${f.n}</div>
          <div class="fe">${f.e}</div>
          <div class="fd">${f.d}</div>
        </div>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="card purple">
      <h3><span class="ic">📖</span>必背概念与原理</h3>
      ${c.concepts.map(x => `
        <div class="kv"><div class="kt">${x.t}</div><div class="kd">${x.d}</div></div>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="card green">
      <h3><span class="ic">✏️</span>典型例题（先自己算，再展开）</h3>
      ${c.examples.map((e, i) => `
        <details class="ex">
          <summary><span class="tag g">例${i + 1}</span> ${e.q}</summary>
          <div class="exbody">
            <p><span class="ans">${e.a}</span></p>
            <span class="step">${e.steps}</span>
          </div>
        </details>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="card red">
      <h3><span class="ic">⚠️</span>易错提醒</h3>
      <ul class="clean">${c.traps.map(t => `<li>${t}</li>`).join("")}</ul>
    </div>
  </div>

  <div class="chapter-nav">
    ${prev ? `<a href="#/ch/${prev.num}" class="prev"><span class="d">← 上一章</span><span class="t">${prev.num}. ${prev.title}</span></a>` : `<a style="visibility:hidden"></a>`}
    ${next ? `<a href="#/ch/${next.num}" class="next"><span class="d">下一章 →</span><span class="t">${next.num}. ${next.title}</span></a>` : `<a href="#/exam" class="next"><span class="d">学完了 →</span><span class="t">去做模拟卷</span></a>`}
  </div>
  `;
}

/* ---------------- 公式速查 ---------------- */
let formulaQuery = "";
function viewFormula() {
  const q = formulaQuery.trim().toLowerCase();
  const list = q
    ? FORMULA_BANK.filter(f => (f.n + f.e + f.d + f.cat + (CHAPTERS[f.ch - 1] || {}).title).toLowerCase().includes(q))
    : FORMULA_BANK;

  const cats = [];
  list.forEach(f => { if (!cats.includes(f.cat)) cats.push(f.cat); });

  return `
  <h1 class="h-title">公式速查表</h1>
  <p class="h-sub">共 ${FORMULA_BANK.length} 条核心公式。考前 30 分钟从上到下过一遍。</p>

  <div class="searchbox" style="margin-top:18px">
    <span class="si">🔍</span>
    <input id="fq" placeholder="搜索公式、章节或关键词，例如：卡森、抽样、误码率、香农" value="${formulaQuery.replace(/"/g, "&quot;")}"
      oninput="formulaQuery=this.value;renderFormulaList();">
    <span style="font-size:12px;color:var(--muted)">${list.length} 条</span>
  </div>

  <div id="flist">
    ${cats.map(cat => `
      <div class="section">
        <h3 style="font-size:14.5px;font-weight:800;margin-bottom:10px;color:var(--text-2)">${cat}</h3>
        ${list.filter(f => f.cat === cat).map(f => `
          <div class="formula">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap">
              <div class="fn">${f.n}</div>
              <span class="tag" style="cursor:pointer" onclick="go('#/ch/${f.ch}')">第${f.ch}章 ${(CHAPTERS[f.ch - 1] || {}).title || ""}</span>
            </div>
            <div class="fe">${f.e}</div>
            <div class="fd">${f.d}</div>
          </div>`).join("")}
      </div>`).join("")}
    ${list.length === 0 ? `<div class="note gray">没有匹配的公式，换个关键词试试。</div>` : ""}
  </div>
  `;
}
function renderFormulaList() {
  const view = document.getElementById("view");
  view.innerHTML = viewFormula();
  const inp = document.getElementById("fq");
  if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
}

/* ---------------- 模拟卷 ---------------- */
function viewExamList() {
  const scores = getScores();
  return `
  <h1 class="h-title">模拟考试</h1>
  <p class="h-sub">3 套试卷，选择题即时判分，填空 / 简答 / 计算题点击展开参考答案</p>
  <div class="note" style="margin-top:18px">
    <b>使用建议：</b>限时 90 分钟完成，中途不要看答案。做完后再逐题对照解析，把错题对应的章节重新过一遍。
  </div>
  <div class="grid g3" style="margin-top:6px">
    ${EXAMS.map(e => {
      const s = scores[e.id];
      const total = e.mcq.length * 2;
      return `
      <div class="quick" style="flex-direction:column;align-items:stretch;gap:10px" onclick="go('#/exam/${e.id}')">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="qi" style="background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff">📝</div>
          <div><div class="qt">${e.title}</div><div class="qd">选择题 ${e.mcq.length} 题 · 满分 100</div></div>
        </div>
        <div style="font-size:12.5px;color:var(--muted);line-height:1.6">${e.note}</div>
        ${s !== undefined
          ? `<span class="tag g">已完成 · 选择题 ${s}/${total}</span>`
          : `<span class="tag">未作答</span>`}
      </div>`;
    }).join("")}
  </div>
  `;
}

function viewExam(id) {
  const e = EXAMS.find(x => x.id === id);
  if (!e) return `<h1 class="h-title">试卷不存在</h1>`;
  return `
  <h1 class="h-title">${e.title}</h1>
  <p class="h-sub">${e.note}</p>

  <div class="scorebar" style="margin-top:18px">
    <div><div class="big" id="sc">0</div><div class="lbl">选择题得分</div></div>
    <div class="sep"></div>
    <div><div class="big" id="scn" style="font-size:18px">0 / ${e.mcq.length}</div><div class="lbl">答对题数</div></div>
    <div class="sep"></div>
    <div><div class="big" id="scp" style="font-size:18px">—</div><div class="lbl">正确率</div></div>
    <div style="margin-left:auto;display:flex;gap:8px">
      <button class="btn ghost sm" onclick="resetExam('${e.id}')">重做</button>
      <button class="btn sm" onclick="go('#/exam')">返回列表</button>
    </div>
  </div>

  <div class="section">
    <div class="card">
      <h3><span class="ic">①</span>单项选择题（每题 2 分，共 ${e.mcq.length * 2} 分）</h3>
      ${e.mcq.map((m, i) => `
        <div class="q" id="q-${e.id}-${i}">
          <div class="qh"><span class="num">${i + 1}.</span>${m.q}</div>
          <div class="opts">
            ${m.o.map((o, j) => `
              <div class="opt" data-q="${i}" data-o="${j}" onclick="pick('${e.id}',${i},${j})">
                <span class="ok">${"ABCD"[j]}</span><span>${o}</span>
              </div>`).join("")}
          </div>
          <div class="exp" id="exp-${e.id}-${i}"><b>正确答案：${"ABCD"[m.a]}。</b>${m.e}</div>
        </div>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="card cyan">
      <h3><span class="ic">②</span>填空题（每空 2 分）</h3>
      ${e.fill.map((f, i) => `
        <details class="ex">
          <summary><span class="tag b">填${i + 1}</span> ${f.q}</summary>
          <div class="exbody"><p><span class="ans">参考答案：</span>${f.a}</p></div>
        </details>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="card purple">
      <h3><span class="ic">③</span>简答题</h3>
      ${e.short.map((s, i) => `
        <details class="ex">
          <summary><span class="tag p">简答${i + 1}</span> ${s.q}</summary>
          <div class="exbody"><p>${s.a}</p></div>
        </details>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="card green">
      <h3><span class="ic">④</span>计算题（重点，先动笔再看解析）</h3>
      ${e.calc.map((c, i) => `
        <details class="ex">
          <summary><span class="tag g">计算${i + 1}</span> ${c.q}</summary>
          <div class="exbody"><span class="step">${c.a}</span></div>
        </details>`).join("")}
    </div>
  </div>
  `;
}

const examState = {};
function pick(examId, qi, oi) {
  const e = EXAMS.find(x => x.id === examId);
  if (!e) return;
  if (!examState[examId]) examState[examId] = {};
  if (examState[examId][qi] !== undefined) return;      // 已作答不可改
  const m = e.mcq[qi];
  examState[examId][qi] = oi;

  const box = document.getElementById(`q-${examId}-${qi}`);
  const opts = box.querySelectorAll(".opt");
  opts.forEach((el, j) => {
    el.classList.add("locked");
    if (j === m.a) el.classList.add("correct");
    else if (j === oi) el.classList.add("wrong");
  });
  document.getElementById(`exp-${examId}-${qi}`).classList.add("show");

  // 计分
  let right = 0, answered = 0;
  Object.keys(examState[examId]).forEach(k => {
    answered++;
    if (examState[examId][k] === e.mcq[k].a) right++;
  });
  const sc = right * 2;
  document.getElementById("sc").textContent = sc;
  document.getElementById("scn").textContent = right + " / " + e.mcq.length;
  document.getElementById("scp").textContent = Math.round(right / answered * 100) + "%";

  if (answered === e.mcq.length) setScore(examId, sc);
}
function resetExam(examId) {
  delete examState[examId];
  render();
}

/* ---------------- 速记手册 ---------------- */
function viewTips() {
  const T = TIPS;
  return `
  <h1 class="h-title">速记手册与易错点</h1>
  <p class="h-sub">考前最后一遍：口诀、对比表、易错清单</p>

  <div class="section" style="margin-top:18px">
    <div class="card amber">
      <h3><span class="ic">🗝️</span>记忆口诀</h3>
      ${T.mnemonics.map(m => `
        <div class="kv">
          <div class="kt">${m.t}　<span style="color:var(--amber);font-weight:600">「${m.c}」</span></div>
          <div class="kd">${m.d}</div>
        </div>`).join("")}
    </div>
  </div>

  <div class="section">
    ${T.compare.map(c => `
      <div class="card">
        <h3><span class="ic">⇄</span>${c.title}</h3>
        <div style="overflow-x:auto">
          <table class="tb">
            <thead><tr>${c.head.map(h => `<th>${h}</th>`).join("")}</tr></thead>
            <tbody>${c.rows.map(r => `<tr>${r.map((x, i) => `<td>${i === 0 ? "<b>" + x + "</b>" : x}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
      </div>`).join("")}
  </div>

  <div class="section">
    <div class="card red">
      <h3><span class="ic">⚠️</span>易错点清单（考前必看）</h3>
      ${T.mistakes.map((m, i) => `
        <div class="kv">
          <div class="kt"><span style="color:var(--red);font-family:var(--mono)">${String(i + 1).padStart(2, "0")}</span>　${m.t}</div>
          <div class="kd">${m.d}</div>
        </div>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="card green">
      <h3><span class="ic">✓</span>考场答题建议</h3>
      <ul class="clean check">
        <li>先做选择、填空、判断，把“记忆分”稳稳拿到手，再攻计算题。</li>
        <li>计算题一定写出公式再代入数据，即使最后算错，公式分也能拿到。</li>
        <li>凡是涉及 dB 的题目，先在草稿纸上把 dB 换成数值，再动笔。</li>
        <li>简答题分点作答（①②③），每点一个关键词，比一整段话更容易得分。</li>
        <li>单位不要丢：Baud、bit/s、Hz、dB、bit/s/Hz，写错单位同样扣分。</li>
        <li>留 10 分钟检查：重点核对公式系数（½、√ 内的系数、+1）和单位。</li>
      </ul>
    </div>
  </div>
  `;
}

/* ---------------- 路由 ---------------- */
function render() {
  const hash = location.hash || "#/home";
  const view = document.getElementById("view");
  const crumb = document.getElementById("crumb");
  let html = "", cr = "";

  if (hash === "#/home" || hash === "#") { html = viewHome(); cr = "<b>首页</b> · 复习总览"; }
  else if (hash === "#/analysis") { html = viewAnalysis(); cr = "<b>民大考情与重点</b>"; }
  else if (hash === "#/formula") { html = viewFormula(); cr = "<b>公式速查表</b>"; }
  else if (hash === "#/exam") { html = viewExamList(); cr = "<b>模拟考试</b>"; }
  else if (hash.startsWith("#/exam/")) {
    const id = hash.split("/")[2];
    const e = EXAMS.find(x => x.id === id);
    delete examState[id];
    html = viewExam(id); cr = `<b>模拟考试</b> / ${e ? e.title : ""}`;
  }
  else if (hash === "#/tips") { html = viewTips(); cr = "<b>速记手册与易错点</b>"; }
  else if (hash.startsWith("#/ch/")) {
    const n = parseInt(hash.split("/")[2]);
    const c = CHAPTERS.find(x => x.num === n);
    html = viewChapter(n); cr = `<b>教材精讲</b> / 第${n}章 ${c ? c.title : ""}`;
  }
  else { html = viewHome(); cr = "<b>首页</b>"; }

  view.innerHTML = html;
  crumb.innerHTML = cr;
  buildNav();
  updateProgress();
  if (hash === "#/exam" || hash.startsWith("#/exam/")) { /* scorebar 初始 */ }
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  render();
  // 恢复已完成的模拟卷计分（仅显示提示，不自动填充）
});
render();
