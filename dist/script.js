const programs=[[
['10:00–12:00','생성형 AI & Bedrock 핵심 · 프롬프트 엔지니어링'],['12:00–13:00','중식'],['13:00–14:00','AI Agent & Vibe Coding · Kiro 실습'],['14:00–15:30','RAG 빠른 구축법 · 미니 RAG 시스템 핸즈온'],['15:30–17:00','부산시 7개 내외 주제 브리핑 · 팀 편성 · 아키텍처 스케치'],['17:00–18:00','개발 환경 세팅 & Q&A']],[['09:00–10:00','개회식 & 과제 확인'],['10:00–13:00','Sprint 1 · 핵심 기능 개발'],['13:00–14:00','중식'],['14:00–18:00','Sprint 2 · 기능 확장 & 통합'],['19:00–20:00','중간 체크포인트 · 팀별 3분 발표'],['20:00–02:00','Sprint 3 · 야간 개발 & 기술 멘토링']],[['02:00–06:00','Sprint 4 · 솔루션 완성 & 테스트'],['06:00–09:00','발표 준비 & 데모 리허설'],['09:00–11:30','최종 발표 · 팀당 7분 피칭 + 3분 Q&A'],['11:30–14:00','우수팀 시상식 & 폐회']]];
const tabs=[...document.querySelectorAll('[role="tab"]')];
function selectDay(index){tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1});const panel=document.getElementById('program-content');panel.setAttribute('aria-labelledby','tab'+index);panel.replaceChildren(...programs[index].map(([time,label])=>{const row=document.createElement('div');row.className='program-row';const t=document.createElement('time');t.textContent=time;const text=document.createElement('span');text.textContent=label;row.append(t,text);return row}))}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectDay(i));tab.addEventListener('keydown',e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();selectDay(next);tabs[next].focus()})});selectDay(0);

// Explicit Korea time keeps the deadlines identical for visitors in every time zone.
const applicationRounds = [
  { name: '1차', deadline: Date.parse('2026-10-18T23:59:59+09:00'), period: '10.12-10.18' }
];
function getDeadlineState(now = Date.now()) {
  const round = applicationRounds.find(round => now < round.deadline);
  if (!round) return { closed: true };
  const remaining = Math.max(0, Math.ceil((round.deadline - now) / 1000));
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor(remaining % 86400 / 3600);
  const minutes = Math.floor(remaining % 3600 / 60);
  const seconds = remaining % 60;
  return { closed: false, round, text: `${days}일 ${[hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':')}` };
}
function updateDeadline() {
  const state = getDeadlineState();
  const label = document.getElementById('deadline-label');
  const timer = document.getElementById('deadline-timer');
  const suffix = document.getElementById('deadline-suffix');
  const note = document.getElementById('deadline-note');
  const link = document.getElementById('deadline-apply');
  label.textContent = state.closed ? '2026 해커톤' : `${state.round.name} 지원 마감까지`;
  timer.textContent = state.closed ? '지원이 마감되었습니다.' : state.text;
  suffix.textContent = state.closed ? '' : '남았어요.';
  note.textContent = state.closed ? '선발 및 행사 일정은 아래에서 확인해 주세요.' : `${state.round.name} 접수 ${state.round.period} · 23:59:59 마감 (한국 시간)`;
  link.textContent = state.closed ? '일정 보기' : '지원하기';
  link.href = state.closed ? '#schedule' : '#apply';
}
updateDeadline();
setInterval(updateDeadline, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateDeadline(); });
const deadlineBar = document.querySelector('.deadline-bar');
function syncDeadlineHeight() {
  document.documentElement.style.setProperty('--deadline-height', `${Math.ceil(deadlineBar.getBoundingClientRect().height)}px`);
}
syncDeadlineHeight();
if ('ResizeObserver' in window) new ResizeObserver(syncDeadlineHeight).observe(deadlineBar);
else window.addEventListener('resize', syncDeadlineHeight);
