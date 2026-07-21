(() => {
  'use strict';

  const STORAGE_KEY = 'alkanderFullLayoutEditorV10';
  const toggle = document.getElementById('layoutModeToggle');
  if (!toggle) return;

  const STYLE_KEYS = ['position','left','top','width','height','zIndex','fontSize','opacity','display'];
  const state = {
    active:false, selected:null, drag:null, counter:0,
    records:loadRecords(), baseline:{}, history:[], historyIndex:-1,
    snap:true, grid:5, closingPopup:false
  };

  const ui = buildUI();

  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('pointermove', onPointerMove, true);
  document.addEventListener('pointerup', onPointerUp, true);
  document.addEventListener('dblclick', onDoubleClick, true);
  document.addEventListener('contextmenu', onContextMenu, true);
  document.addEventListener('pointerdown', e => {
    if (!e.target.closest('#layoutContextMenuV6')) hideContextMenu();
  }, true);

  window.addEventListener('keydown', e => {
    const key = String(e.key || '');
    const lower = key.toLowerCase();
    if (key === 'F2') { e.preventDefault(); setMode(!state.active); return; }
    if (!state.active) return;
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && lower === 'z') { e.preventDefault(); undo(); return; }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && lower === 'z') { e.preventDefault(); redo(); return; }
    if (key === 'Escape') { e.preventDefault(); select(null); hideContextMenu(); return; }
    if (!state.selected) return;
    if (key === 'Delete') { e.preventDefault(); hideSelected(); return; }
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key)) {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      moveBy(state.selected,
        key === 'ArrowLeft' ? -step : key === 'ArrowRight' ? step : 0,
        key === 'ArrowUp' ? -step : key === 'ArrowDown' ? step : 0);
      saveSelected(); commit(); updateFields();
    }
  }, true);

  function setMode(enabled) {
    state.active = !!enabled;
    document.body.classList.toggle('layout-edit-mode-v6', state.active);
    toggle.classList.toggle('active', state.active);
    toggle.setAttribute('aria-pressed', String(state.active));
    hideContextMenu();

    if (state.active) {
      if (!ui.openPopup()) {
        state.active = false;
        document.body.classList.remove('layout-edit-mode-v6');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-pressed', 'false');
        toast('Allow popups for this page, then click the music icon again');
        return;
      }
      scan();
      refreshOutput();
    } else {
      finishTextEditing();
      select(null);
      copyOutput(exportData(), true);
      ui.closePopup();
    }
  }

  function scan() {
    const items = [...document.querySelectorAll('.topbar, .topbar *, .tab-page.active, .tab-page.active *')];
    let count = 0;
    for (const el of items) {
      if (!isCandidate(el)) continue;
      const id = ensureId(el);
      if (!state.baseline[id]) state.baseline[id] = snapshot(el);
      el.classList.add('layout-editable-v6');
      if (state.records[id]) restore(el, state.records[id]);
      count++;
    }
    if(ui.count) ui.count.textContent = `${count} editable items`;
    if (state.historyIndex < 0) commit(true);
  }

  function isCandidate(el) {
    if (!(el instanceof HTMLElement)) return false;
    if (el === toggle || el.closest('#layoutEditorToolbarV6,#layoutCopyOverlayV6,#layoutContextMenuV6')) return false;
    if (el.matches('script,style,link,meta,title,html,body')) return false;
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    return s.display !== 'none' && s.visibility !== 'hidden' && r.width >= 2 && r.height >= 2;
  }

  function ensureId(el) {
    if (el.dataset.layoutIdV6) return el.dataset.layoutIdV6;
    state.counter++;
    const base = ([el.id,...el.classList].filter(Boolean).join('-') || el.tagName.toLowerCase())
      .replace(/[^a-zA-Z0-9_-]/g,'').slice(0,60);
    el.dataset.layoutIdV6 = `${base}-${state.counter}`;
    return el.dataset.layoutIdV6;
  }

  function deepestEditableAtPoint(x, y, fallbackTarget) {
    const stack = document.elementsFromPoint(x, y);
    for (const element of stack) {
      if (!(element instanceof HTMLElement)) continue;
      if (element.closest('#layoutEditorToolbarV6,#layoutCopyOverlayV6,#layoutContextMenuV6')) continue;
      if (element.matches('[data-layout-id-v6]')) return element;
      const nested = element.closest('[data-layout-id-v6]');
      if (nested) return nested;
    }
    return fallbackTarget?.closest?.('[data-layout-id-v6]') || null;
  }

  function onPointerDown(e) {
    if (!state.active || e.button !== 0) return;
    if (e.target === toggle || e.target.closest('#layoutEditorToolbarV6,#layoutCopyOverlayV6,#layoutContextMenuV6')) return;
    const handle = e.target.closest('.layout-resize-handle-v6');
    const target = handle ? state.selected : deepestEditableAtPoint(e.clientX, e.clientY, e.target);
    if (!target) return;
    e.preventDefault(); e.stopImmediatePropagation();
    select(target);
    if (isLocked(target)) { toast('Element is locked'); return; }
    const rect = target.getBoundingClientRect();
    const parentRect = target.offsetParent?.getBoundingClientRect() || {left:0,top:0};
    state.drag = {
      target, mode:handle ? 'resize':'move', edge:handle?.dataset.edge || 'se',
      startX:e.clientX,startY:e.clientY,left:rect.left-parentRect.left,top:rect.top-parentRect.top,
      width:rect.width,height:rect.height,aspect:rect.width/Math.max(1,rect.height),
      activated:!!handle, fonts:null
    };
    if (handle) activateDrag(state.drag);
  }

  function activateDrag(drag) {
    if (drag.activated && drag.fonts) return;
    drag.activated = true;
    makeAbsolute(drag.target);
    drag.fonts = captureFonts(drag.target);
  }

  function onPointerMove(e) {
    if (!state.active || !state.drag) return;
    const d = state.drag;
    const rawDx = e.clientX-d.startX, rawDy = e.clientY-d.startY;
    if (!d.activated && Math.hypot(rawDx,rawDy) < 4) return;
    if (!d.activated) activateDrag(d);
    e.preventDefault(); e.stopImmediatePropagation();

    if (d.mode === 'move') {
      d.target.style.left = `${snap(d.left+rawDx,e.altKey)}px`;
      d.target.style.top = `${snap(d.top+rawDy,e.altKey)}px`;
    } else {
      const box = resizeBox(d, rawDx, rawDy, e.ctrlKey || e.metaKey);
      d.target.style.left = `${snap(box.left,e.altKey)}px`;
      d.target.style.top = `${snap(box.top,e.altKey)}px`;
      d.target.style.width = `${Math.max(8,snap(box.width,e.altKey))}px`;
      d.target.style.height = `${Math.max(8,snap(box.height,e.altKey))}px`;
      d.target.style.maxWidth='none'; d.target.style.maxHeight='none';
      d.target.style.minWidth='0'; d.target.style.minHeight='0';
      scaleFonts(d, box.width, box.height);
    }
    updateFields();
  }

  function onPointerUp() {
    const d = state.drag;
    if (!d) return;
    if (d.activated) { saveSelected(); commit(); }
    state.drag = null;
  }

  function resizeBox(d, dx, dy, keepAspect) {
    let left=d.left, top=d.top, width=d.width, height=d.height;
    if (d.edge.includes('e')) width=Math.max(8,d.width+dx);
    if (d.edge.includes('s')) height=Math.max(8,d.height+dy);
    if (d.edge.includes('w')) { width=Math.max(8,d.width-dx); left=d.left+d.width-width; }
    if (d.edge.includes('n')) { height=Math.max(8,d.height-dy); top=d.top+d.height-height; }
    if (keepAspect) {
      const horizontal = Math.abs(width-d.width) >= Math.abs(height-d.height);
      if (horizontal) height=width/d.aspect; else width=height*d.aspect;
      if (d.edge.includes('w')) left=d.left+d.width-width;
      if (d.edge.includes('n')) top=d.top+d.height-height;
      if (d.edge === 'n' || d.edge === 's') left=d.left+(d.width-width)/2;
      if (d.edge === 'e' || d.edge === 'w') top=d.top+(d.height-height)/2;
    }
    return {left,top,width,height};
  }

  function captureFonts(target) {
    return [target,...target.querySelectorAll('*')].filter(el => {
      const s=getComputedStyle(el); return parseFloat(s.fontSize)>0 && s.display!=='none';
    }).map(el => ({el,size:parseFloat(getComputedStyle(el).fontSize)}));
  }

  function scaleFonts(d, width, height) {
    if (!d.fonts) return;
    const factor = Math.sqrt(Math.max(.01,width/d.width)*Math.max(.01,height/d.height));
    d.fonts.forEach(x => x.el.style.fontSize=`${Math.max(5,Math.round(x.size*factor*10)/10)}px`);
  }

  function onDoubleClick(e) {
    if (!state.active || e.target.closest('#layoutEditorToolbarV6,#layoutCopyOverlayV6,#layoutContextMenuV6')) return;
    const target=deepestEditableAtPoint(e.clientX, e.clientY, e.target);
    if (!target) return;
    e.preventDefault();e.stopImmediatePropagation();select(target);beginTextEditing(target);
  }

  function onContextMenu(e) {
    if (!state.active) return;
    const target=deepestEditableAtPoint(e.clientX, e.clientY, e.target);
    if (!target || target.closest('#layoutEditorToolbarV6,#layoutCopyOverlayV6')) return;
    e.preventDefault();e.stopImmediatePropagation();select(target);showContextMenu(e.clientX,e.clientY,target);
  }

  function showContextMenu(x,y,target) {
    ui.context.innerHTML = `
      <button data-act="front">Bring to front</button>
      <button data-act="forward">Move forward</button>
      <button data-act="backward">Move backward</button>
      <button data-act="back">Send to back</button>
      <hr>
      <button data-act="lock">${isLocked(target)?'Unlock':'Lock'} element</button>
      <button data-act="reset">Reset this element</button>
      <button data-act="hide">Hide element</button>`;
    ui.context.style.display='block';
    const maxX=window.innerWidth-ui.context.offsetWidth-8, maxY=window.innerHeight-ui.context.offsetHeight-8;
    ui.context.style.left=`${Math.max(8,Math.min(x,maxX))}px`;
    ui.context.style.top=`${Math.max(8,Math.min(y,maxY))}px`;
  }
  function hideContextMenu(){ui.context.style.display='none';}

  function zValues(){return [...document.querySelectorAll('[data-layout-id-v6]')].map(el=>parseInt(getComputedStyle(el).zIndex,10)).filter(Number.isFinite);}
  function changeZ(kind){
    if(!state.selected)return; const vals=zValues(); let z=parseInt(getComputedStyle(state.selected).zIndex,10)||0;
    if(kind==='front')z=(vals.length?Math.max(...vals):0)+1;
    if(kind==='back')z=(vals.length?Math.min(...vals):0)-1;
    if(kind==='forward')z++;
    if(kind==='backward')z--;
    state.selected.style.zIndex=String(z);saveSelected();commit();updateFields();
  }

  function createPlaceholder(el) {
    if(el.__layoutPlaceholderV6||!el.parentNode)return;
    const r=el.getBoundingClientRect(),s=getComputedStyle(el),ph=document.createElement('div');
    ph.className='layout-placeholder-v6';ph.style.visibility='hidden';ph.style.pointerEvents='none';ph.style.boxSizing='border-box';
    ph.style.width=`${Math.round(r.width)}px`;ph.style.height=`${Math.round(r.height)}px`;ph.style.margin=s.margin;
    ph.style.display=s.display==='inline'?'inline-block':s.display;ph.style.flex=s.flex;ph.style.alignSelf=s.alignSelf;ph.style.justifySelf=s.justifySelf;
    ph.style.gridColumn=s.gridColumn;ph.style.gridRow=s.gridRow;el.parentNode.insertBefore(ph,el);el.__layoutPlaceholderV6=ph;
  }
  function removePlaceholder(el){const ph=el.__layoutPlaceholderV6;if(ph?.parentNode)ph.remove();delete el.__layoutPlaceholderV6;}
  function makeAbsolute(el){
    const s=getComputedStyle(el);if(s.position==='absolute'&&el.style.left&&el.style.top)return;
    createPlaceholder(el);const r=el.getBoundingClientRect(),p=el.offsetParent||el.parentElement||document.body,pr=p.getBoundingClientRect();
    el.style.position='absolute';el.style.left=`${Math.round(r.left-pr.left)}px`;el.style.top=`${Math.round(r.top-pr.top)}px`;
    el.style.width=`${Math.round(r.width)}px`;el.style.height=`${Math.round(r.height)}px`;el.style.margin='0';el.style.transform='none';
  }
  function moveBy(el,dx,dy){if(isLocked(el))return;makeAbsolute(el);el.style.left=`${(parseFloat(el.style.left)||0)+dx}px`;el.style.top=`${(parseFloat(el.style.top)||0)+dy}px`;}
  function snap(value,disable){if(!state.snap||disable)return Math.round(value);return Math.round(value/state.grid)*state.grid;}

  function select(el){finishTextEditing();if(state.selected)state.selected.classList.remove('layout-selected-v6');removeHandles();state.selected=el;
    if(!el){if(ui.selected)ui.selected.textContent='Nothing selected';updateFields();return;}
    el.classList.add('layout-selected-v6');createHandles();if(ui.selected)ui.selected.textContent=describe(el);updateFields();
  }
  function createHandles(){if(!state.selected||isLocked(state.selected))return;for(const edge of ['nw','n','ne','e','se','s','sw','w']){const h=document.createElement('span');h.className=`layout-resize-handle-v6 edge-${edge}`;h.dataset.edge=edge;state.selected.appendChild(h);}}
  function removeHandles(){document.querySelectorAll('.layout-resize-handle-v6').forEach(h=>h.remove());}
  function beginTextEditing(el){if(!canEditText(el)){toast('Select a text element');return;}el.contentEditable='true';el.classList.add('layout-text-editing-v6');el.focus();const r=document.createRange();r.selectNodeContents(el);const s=window.getSelection();s.removeAllRanges();s.addRange(r);}
  function finishTextEditing(){const el=document.querySelector('.layout-text-editing-v6');if(!el)return;el.contentEditable='false';el.classList.remove('layout-text-editing-v6');saveElement(el);commit();}
  function canEditText(el){return el.childElementCount===0||['BUTTON','H1','H2','H3','H4','P','SPAN','STRONG','SMALL','LABEL','DIV'].includes(el.tagName);}

  function isLocked(el){return el?.dataset.layoutLockedV6==='true';}
  function toggleLock(){if(!state.selected)return;state.selected.dataset.layoutLockedV6=String(!isLocked(state.selected));state.selected.classList.toggle('layout-locked-v6',isLocked(state.selected));removeHandles();createHandles();saveSelected();commit();}
  function hideSelected(){if(!state.selected)return;state.selected.style.display='none';saveSelected();commit();select(null);}
  function resetSelected(){if(!state.selected)return;const id=ensureId(state.selected),base=state.baseline[id];if(!base)return;restore(state.selected,base);delete state.records[id];commit();select(state.selected);}

  function applyField(name,value){const el=state.selected;if(!el||!Number.isFinite(value)||isLocked(el))return;makeAbsolute(el);
    if(name==='x')el.style.left=`${value}px`;if(name==='y')el.style.top=`${value}px`;if(name==='w')el.style.width=`${Math.max(1,value)}px`;if(name==='h')el.style.height=`${Math.max(1,value)}px`;
    if(name==='z')el.style.zIndex=String(Math.round(value));if(name==='font')el.style.fontSize=`${Math.max(1,value)}px`;if(name==='opacity')el.style.opacity=String(Math.max(0,Math.min(1,value)));
    saveSelected();commit();updateFields();
  }
  function updateFields(){const el=state.selected,r=el?.getBoundingClientRect(),vals={x:el?(parseFloat(el.style.left)||Math.round(r.left)):'',y:el?(parseFloat(el.style.top)||Math.round(r.top)):'',w:el?Math.round(r.width):'',h:el?Math.round(r.height):'',z:el?(parseInt(getComputedStyle(el).zIndex,10)||0):'',font:el?(parseFloat(getComputedStyle(el).fontSize)||16):'',opacity:el?parseFloat(getComputedStyle(el).opacity):''};
    if(!ui.toolbar)return;Object.entries(vals).forEach(([k,v])=>{const input=ui.toolbar.querySelector(`[data-field="${k}"]`);if(input)input.value=v;});
  }

  function snapshot(el){const id=ensureId(el);return {id,selectorHint:describe(el),position:el.style.position||null,left:el.style.left||null,top:el.style.top||null,width:el.style.width||null,height:el.style.height||null,zIndex:el.style.zIndex||null,fontSize:el.style.fontSize||null,opacity:el.style.opacity||null,display:el.style.display||null,text:el.childElementCount===0?el.textContent:null,locked:isLocked(el)};}
  function captureAll(){const out={};document.querySelectorAll('[data-layout-id-v6]').forEach(el=>out[ensureId(el)]=snapshot(el));return out;}
  function saveElement(el){state.records[ensureId(el)]=snapshot(el);}
  function saveSelected(){if(state.selected)saveElement(state.selected);saveRecords();refreshOutput();}
  function restore(el,rec){if(!rec)return;if(rec.position==='absolute')createPlaceholder(el);else removePlaceholder(el);STYLE_KEYS.forEach(k=>el.style[k]=rec[k]??'');if(rec.text!==null&&el.childElementCount===0)el.textContent=rec.text;el.dataset.layoutLockedV6=String(!!rec.locked);el.classList.toggle('layout-locked-v6',!!rec.locked);}
  function applyRecords(){const sid=state.selected?.dataset.layoutIdV6;document.querySelectorAll('[data-layout-id-v6]').forEach(el=>restore(el,state.records[ensureId(el)]||state.baseline[ensureId(el)]));select(sid?document.querySelector(`[data-layout-id-v6="${sid}"]`):null);saveRecords();refreshOutput();}
  function commit(force=false){state.records=captureAll();const text=JSON.stringify(state.records);if(!force&&state.historyIndex>=0&&JSON.stringify(state.history[state.historyIndex])===text)return;state.history=state.history.slice(0,state.historyIndex+1);state.history.push(JSON.parse(text));state.historyIndex=state.history.length-1;saveRecords();refreshOutput();}
  function undo(){finishTextEditing();if(state.historyIndex<=0){toast('Nothing to undo');return;}state.historyIndex--;state.records=structuredClone(state.history[state.historyIndex]);applyRecords();toast('Undo applied');}
  function redo(){if(state.historyIndex>=state.history.length-1){toast('Nothing to redo');return;}state.historyIndex++;state.records=structuredClone(state.history[state.historyIndex]);applyRecords();toast('Redo applied');}

  function changed(){state.records=captureAll();const out={};for(const[id,rec]of Object.entries(state.records)){const base=state.baseline[id]||{},diff={};for(const k of ['position','left','top','width','height','zIndex','fontSize','opacity','display','text','locked'])if((rec[k]??null)!==(base[k]??null))diff[k]=rec[k]??null;if(Object.keys(diff).length)out[id]={selectorHint:rec.selectorHint,changes:diff};}return out;}
  function exportData(){const changes=changed();return JSON.stringify({format:'Alkander full layout editor v8',viewport:{width:1368,height:801},generatedAt:new Date().toISOString(),changedElementCount:Object.keys(changes).length,changes},null,2);}
  function refreshOutput(){if(ui.output)ui.output.value=exportData();}
  function loadRecords(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return{}}}
  function saveRecords(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state.records))}catch{}}
  function resetAll(){localStorage.removeItem(STORAGE_KEY);location.reload();}
  function describe(el){const text=(el.innerText||el.textContent||'').trim().replace(/\s+/g,' ').slice(0,55);return `${el.tagName.toLowerCase()}${el.id?'#'+el.id:''}${el.classList.length?'.'+[...el.classList].slice(0,3).join('.'):''}${text?' — '+text:''}`;}
  function toast(message){const t=document.createElement('div');t.className='layout-toast-v6';t.textContent=message;document.body.appendChild(t);setTimeout(()=>t.remove(),1800);}

  async function copyOutput(text,turnOff=false){if(ui.output)ui.output.value=text;try{await navigator.clipboard.writeText(text);toast(turnOff?'Layout changes copied':'Layout output copied');}catch{showCopyOverlay(text);}}
  function showCopyOverlay(text){let o=document.getElementById('layoutCopyOverlayV6');if(o)o.remove();o=document.createElement('div');o.id='layoutCopyOverlayV6';o.innerHTML=`<div class="layout-copy-card-v6"><div class="layout-copy-head-v6"><strong>LAYOUT CHANGES</strong><button data-close>×</button></div><p>Copy this output and paste it into chat.</p><textarea readonly></textarea><div><button data-copy>Copy</button><button data-close>Close</button></div></div>`;document.body.appendChild(o);const a=o.querySelector('textarea');a.value=text;a.focus();a.select();o.addEventListener('click',async e=>{if(e.target.closest('[data-close]'))o.remove();if(e.target.closest('[data-copy]')){try{await navigator.clipboard.writeText(a.value);toast('Copied');}catch{a.select();document.execCommand('copy');}}});}

  function buildUI(){
    const context=document.createElement('div');
    context.id='layoutContextMenuV6';
    document.body.appendChild(context);

    const api={
      popup:null,
      toolbar:null,
      context,
      count:null,
      selected:null,
      output:null,
      openPopup,
      closePopup
    };

    context.addEventListener('click',e=>{
      const a=e.target.closest('[data-act]')?.dataset.act;
      if(!a)return;
      if(['front','forward','backward','back'].includes(a))changeZ(a);
      if(a==='lock')toggleLock();
      if(a==='reset')resetSelected();
      if(a==='hide')hideSelected();
      hideContextMenu();
    });

    function openPopup(){
      if(api.popup && !api.popup.closed){
        api.popup.focus();
        return true;
      }

      const pop=window.open('', 'AlkanderLayoutEditorPopup', 'popup=yes,width=390,height=760,resizable=yes,scrollbars=yes');
      if(!pop) return false;
      api.popup=pop;
      const doc=pop.document;
      doc.open();
      doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>Alkander Layout Editor</title><style>
        *{box-sizing:border-box}html,body{margin:0;min-height:100%;background:#080a10;color:#eee4d5;font-family:Arial,sans-serif}
        body{padding:12px;background:linear-gradient(155deg,#171322,#080a10)}
        #layoutEditorToolbarV6{width:100%;min-height:100%;padding:0;background:transparent;color:#eee4d5}
        .layout-editor-head-v6{display:flex;justify-content:space-between;align-items:center;color:#e4c78f;font-family:Georgia,serif;font-size:17px;border-bottom:1px solid #70512e;padding-bottom:8px}
        .layout-editor-head-v6 button{border:0;background:none;color:#fff;font-size:24px;cursor:pointer}
        .layout-count-v6{margin:9px 0;color:#8fe5cb;font-size:12px}
        p{font-size:11px;line-height:1.45;color:#c6bba9}
        .layout-selected-v6{padding:8px;margin:9px 0;border:1px solid #65502f;background:#090b12;color:#dbb2ee;font-size:10px;word-break:break-word;min-height:34px}
        .layout-options-v6{display:flex;gap:18px;align-items:center;margin:8px 0;font-size:11px}.layout-options-v6 input[type=number]{width:55px}
        .layout-fields-v6{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.layout-fields-v6 label{font-size:9px;color:#d4b376}
        input{display:block;width:100%;margin-top:3px;padding:6px 3px;background:#06080d;border:1px solid #5f4930;color:#fff;text-align:center}
        .layout-buttons-v6{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px}.layout-buttons-v6 button{padding:8px 4px;border:1px solid #72522e;background:#17141e;color:#eee2d0;border-radius:4px;font-size:11px;cursor:pointer}
        .layout-buttons-v6 button:hover{background:#2c1d3a;border-color:#aa77cc}
        textarea{width:100%;height:170px;margin-top:9px;resize:vertical;background:#05070b;border:1px solid #5c462e;color:#b9ead7;padding:7px;font:9px/1.35 Consolas,monospace}
      </style></head><body><aside id="layoutEditorToolbarV6">
        <div class="layout-editor-head-v6"><strong>FULL LAYOUT EDITOR</strong><button data-action="close" title="Close editor">×</button></div>
        <div class="layout-count-v6">0 editable items</div>
        <p>This editor is a separate window. Click items on the character sheet to select them. Drag to move. Resize handles scale text. Hold Ctrl while resizing to preserve aspect ratio. Alt temporarily disables grid snapping.</p>
        <div class="layout-selected-v6">Nothing selected</div>
        <div class="layout-options-v6"><label><input data-snap type="checkbox" checked> Snap</label><label>Grid <input data-grid type="number" min="1" value="5"></label></div>
        <div class="layout-fields-v6"><label>X<input data-field="x" type="number"></label><label>Y<input data-field="y" type="number"></label><label>W<input data-field="w" type="number"></label><label>H<input data-field="h" type="number"></label><label>Z<input data-field="z" type="number"></label><label>Font<input data-field="font" type="number"></label><label>Opacity<input data-field="opacity" type="number" min="0" max="1" step=".05"></label></div>
        <div class="layout-buttons-v6"><button data-action="front">Front</button><button data-action="back">Back</button><button data-action="lock">Lock</button><button data-action="reset-item">Reset item</button><button data-action="text">Edit text</button><button data-action="rescan">Rescan</button><button data-action="undo">Undo</button><button data-action="redo">Redo</button><button data-action="copy">Copy output</button><button data-action="download">Download JSON</button><button data-action="reset">Reset layout</button><button data-action="close">Done</button></div>
        <textarea readonly></textarea>
      </aside></body></html>`);
      doc.close();

      api.toolbar=doc.getElementById('layoutEditorToolbarV6');
      api.count=api.toolbar.querySelector('.layout-count-v6');
      api.selected=api.toolbar.querySelector('.layout-selected-v6');
      api.output=api.toolbar.querySelector('textarea');

      api.toolbar.addEventListener('click',e=>{
        const a=e.target.closest('[data-action]')?.dataset.action;
        if(!a)return;
        if(a==='close')setMode(false);
        if(a==='front')changeZ('front');
        if(a==='back')changeZ('back');
        if(a==='lock')toggleLock();
        if(a==='reset-item')resetSelected();
        if(a==='text'&&state.selected)beginTextEditing(state.selected);
        if(a==='rescan'){scan();toast('Page rescanned')}
        if(a==='undo')undo();
        if(a==='redo')redo();
        if(a==='copy')copyOutput(exportData());
        if(a==='download'){
          const b=new Blob([exportData()],{type:'application/json'}),u=URL.createObjectURL(b),l=document.createElement('a');
          l.href=u;l.download='Alkander-layout-output-v8.json';l.click();URL.revokeObjectURL(u)
        }
        if(a==='reset')resetAll();
      });
      api.toolbar.querySelectorAll('[data-field]').forEach(i=>i.addEventListener('change',()=>applyField(i.dataset.field,Number(i.value))));
      api.toolbar.querySelector('[data-snap]').addEventListener('change',e=>state.snap=e.target.checked);
      api.toolbar.querySelector('[data-grid]').addEventListener('change',e=>state.grid=Math.max(1,Number(e.target.value)||1));

      pop.addEventListener('beforeunload',()=>{
        if(state.closingPopup) return;
        if(state.active){
          state.active=false;
          document.body.classList.remove('layout-edit-mode-v6');
          toggle.classList.remove('active');
          toggle.setAttribute('aria-pressed','false');
          finishTextEditing();
          select(null);
          copyOutput(exportData(),true);
        }
      });
      pop.focus();
      return true;
    }

    function closePopup(){
      if(api.popup && !api.popup.closed){
        state.closingPopup=true;
        api.popup.close();
        state.closingPopup=false;
      }
      api.popup=null;api.toolbar=null;api.count=null;api.selected=null;api.output=null;
    }

    return api;
  }

  window.toggleAlkanderLayoutMode=()=>{ setMode(!state.active); return false; };
  window.AlkanderLayoutEditor={toggle:window.toggleAlkanderLayoutMode,rescan:scan,export:exportData,undo,redo,isActive:()=>state.active};
})();