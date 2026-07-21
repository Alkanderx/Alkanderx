const defaults = {
  character:{bardLevel:5,warlockLevel:3,levelUpBard6Applied:false},
  settings:{reduceMotion:false,compactDialogs:false},
  hp:68,maxHp:68,tempHp:12,ac:16,initiative:5,speed:30,proficiency:3,spellAttack:9,saveDC:17,
  inspiration:6,pactSlots:2,spellSlots:{1:4,2:3,3:2},formOfDread:3,formOfDreadMax:3,concentration:9,
  abilities:{STR:[13,1,1],DEX:[18,4,7],CON:[15,2,2],INT:[17,3,3],WIS:[14,2,2],CHA:[22,6,9]},
  skills:[
    ['Acrobatics',5,'Dexterity',false],['Animal Handling',3,'Wisdom',false],['Arcana',4,'Intelligence',false],['Athletics',2,'Strength',false],['Deception',12,'Charisma',true],['History',4,'Intelligence',false],['Insight',5,'Wisdom',true],['Intimidation',9,'Charisma',true],['Investigation',4,'Intelligence',false],['Medicine',3,'Wisdom',false],['Nature',4,'Intelligence',false],['Perception',6,'Wisdom',true],['Performance',12,'Charisma',true],['Persuasion',12,'Charisma',true],['Religion',4,'Intelligence',false],['Sleight of Hand',7,'Dexterity',true],['Stealth',7,'Dexterity',true],['Survival',3,'Wisdom',false],['Fractured Mind',9,'Unknown',false]
  ],
  spells:[
    {name:'Eldritch Blast',level:0,school:'Evocation',casting:'1 action',range:'120 ft',desc:'Make two ranged spell attacks. On a hit, deal 1d10 + 5 force damage per beam.'},
    {name:'Vicious Mockery',level:0,school:'Enchantment',casting:'1 action',range:'60 ft',desc:'Target makes a Wisdom save or takes psychic damage and has disadvantage on its next attack.'},
    {name:'Healing Word',level:1,school:'Evocation',casting:'1 bonus action',range:'60 ft',desc:'A creature regains 1d4 + 6 hit points.'},
    {name:'Dissonant Whispers',level:1,school:'Enchantment',casting:'1 action',range:'60 ft',desc:'Wisdom save; psychic damage and the target must use its reaction to move away.'},
    {name:'Hex',level:1,school:'Enchantment',casting:'1 bonus action',range:'90 ft',desc:'Concentration. Deal an extra 1d6 necrotic damage when you hit the cursed target.'},
    {name:'Suggestion',level:2,school:'Enchantment',casting:'1 action',range:'30 ft',desc:'Magically influence a creature with a reasonable course of activity.'},
    {name:'Hypnotic Pattern',level:3,school:'Illusion',casting:'1 action',range:'120 ft',desc:'Concentration. Creatures in a 30-foot cube may become charmed and incapacitated.'}
  ],
  features:[
    {name:'Silver Tongue',source:'College of Eloquence 3',desc:'Master at saying the right thing at the right time. Persuasion and Deception check minimum 10.'},
    {name:'Unsettling Words',source:'College of Eloquence 3',desc:'As a bonus action, expend Bardic Inspiration and subtract the die from the target’s next saving throw.'},
    {name:'Font of Inspiration',source:'Bard 5',desc:'Regain all expended Bardic Inspiration uses when you finish a short or long rest.'},
    {name:'Form of Dread',source:'Undead Warlock 1',desc:'Transform for 1 minute, gaining temporary hit points, fear immunity, and the ability to frighten one creature.'},
    {name:'Agonizing Blast',source:'Eldritch Invocation',desc:'Add your Charisma modifier to the damage dealt by each Eldritch Blast beam.'},
    {name:'Repelling Blast',source:'Eldritch Invocation',desc:'When Eldritch Blast hits, push the creature up to 10 feet away.'}
  ],
  platinum:0,gold:100,silver:0,copper:0,
  attunedItems:['Echo of Perdition','Spell Ring','Cloak of Billowing'],
  inventory:[{qty:1,name:'Rapier',notes:'+7 to hit, 1d8+4 piercing'},{qty:1,name:'Lute',notes:'Spellcasting focus'},{qty:1,name:'Studded Leather',notes:'AC included'},{qty:2,name:'Potion of Healing',notes:'2d4+2 HP'}],
  rest:{bardHitDice:5,warlockHitDice:3,shortRestActive:false,songOfRestUsed:false},
  potions:{healing:0,greater:0,superior:0,supreme:0},
  journal:'ALKANDER — CAMPAIGN JOURNAL\n\nAdd notes, NPCs, quests, clues and session summaries here. Everything saves automatically to this browser.'
};
function readJsonStorage(key){
  try{return JSON.parse(localStorage.getItem(key)||'null');}catch(error){console.warn(`Unable to read ${key}`,error);return null;}
}
let state = readJsonStorage('alkanderSheet') || structuredClone(defaults);
function ensureCharacterState(){
  state.character=Object.assign({bardLevel:5,warlockLevel:3,levelUpBard6Applied:false},state.character||{});
  state.character.bardLevel=Math.max(1,Number(state.character.bardLevel)||5);
  state.character.warlockLevel=Math.max(0,Number(state.character.warlockLevel)||3);
  state.character.levelUpBard6Applied=Boolean(state.character.levelUpBard6Applied||state.character.bardLevel>=6);
  state.settings=Object.assign({reduceMotion:false,compactDialogs:false},state.settings||{});
  state.settings.reduceMotion=Boolean(state.settings.reduceMotion);
  state.settings.compactDialogs=Boolean(state.settings.compactDialogs);
}
ensureCharacterState();
function applySettingsClasses(){
  document.body.classList.toggle('reduce-motion',Boolean(state.settings?.reduceMotion));
  document.body.classList.toggle('compact-dialogs',Boolean(state.settings?.compactDialogs));
}
function ensureVitalityState(){
  if(typeof state.tempHp!=='number' || Number.isNaN(state.tempHp)) state.tempHp=0;
  state.rest=Object.assign({bardHitDice:5,warlockHitDice:3,shortRestActive:false,songOfRestUsed:false}, state.rest||{});
  state.rest.bardHitDice=Math.max(0,Math.min(5,Number(state.rest.bardHitDice??5)));
  state.rest.warlockHitDice=Math.max(0,Math.min(3,Number(state.rest.warlockHitDice??3)));
  state.rest.shortRestActive=Boolean(state.rest.shortRestActive);
  state.rest.songOfRestUsed=Boolean(state.rest.songOfRestUsed);
  state.potions=Object.assign({healing:0,greater:0,superior:0,supreme:0}, state.potions||{});
}
ensureVitalityState();
function ensureInventoryState(){
  if(typeof state.platinum!=='number' || Number.isNaN(state.platinum)) state.platinum=0;
  if(typeof state.gold!=='number' || Number.isNaN(state.gold)) state.gold=100;
  if(typeof state.silver!=='number' || Number.isNaN(state.silver)) state.silver=0;
  if(typeof state.copper!=='number' || Number.isNaN(state.copper)) state.copper=0;
  if(!Array.isArray(state.attunedItems)) state.attunedItems=['Echo of Perdition','Spell Ring','Cloak of Billowing'];
  while(state.attunedItems.length<3) state.attunedItems.push('');
  state.attunedItems=state.attunedItems.slice(0,3);
  if(!Array.isArray(state.inventory)) state.inventory=structuredClone(defaults.inventory||[]);
  const echoName="Echo of Perdition";
  state.attunedItems=state.attunedItems.map(name=>["Instrument of the Bards, Alkander's Echo of Perdition","Alkander's Echo of Perdition",'Echo of Perdition'].includes(name)?echoName:name);
  state.inventory.forEach(item=>{if(["Instrument of the Bards, Alkander's Echo of Perdition","Alkander's Echo of Perdition"].includes(String(item.name||'')))item.name=echoName;});
  if(!state.inventory.some(item=>String(item.name||'').toLowerCase()===echoName.toLowerCase())){
    state.inventory.push({
      uid:'custom-alkander-echo-of-perdition',qty:1,name:echoName,type:'Wondrous Item — Instrument',attunement:true,
      attunementText:'Requires attunement by a bard/warlock multiclass',rarity:'Uncommon',
      brief:'A damned-voice microphone staff that empowers warlock magic and casts powerful spells.',
      defaultBrief:'A damned-voice microphone staff that empowers warlock magic and casts powerful spells.',source:'Custom',
      details:`Alkander's Echo of Perdition is a dark, gleaming staff with a microphone at its end, imbued with the voices of the damned. Its twisted surface radiates with eerie, otherworldly power. A creature that attempts to play the instrument without being attuned to it must succeed on a DC 15 Wisdom saving throw or take 2d4 psychic damage.

While holding this instrument, you gain a +1 bonus to spell attack rolls and to the saving throw DCs of your warlock spells. In addition, you can regain one warlock spell slot as an action while holding the rod. You can't use this property again until you finish a long rest.

You can use an action to play the instrument and cast one of its spells. Once the instrument has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The spells use your spellcasting ability and spell save DC.

You can play the instrument while casting a spell that causes any of its targets to be charmed on a failed saving throw, thereby imposing disadvantage on the save. This effect applies only if the spell has a somatic or a material component.

Spells: Fly, Invisibility, Levitate, Protection from Evil and Good, Thaumaturgy, Command, Nystul's Magic Aura, and Speak with Dead.`,
      importedId:'custom-alkander-echo-of-perdition',favorite:false,attuned:true
    });
  }
  state.inventory=state.inventory.map((item,index)=>({
    uid:item.uid||`inventory-${Date.now()}-${index}-${Math.random().toString(36).slice(2,7)}`,
    qty:Math.max(1,Number(item.qty||1)),
    name:String(item.name||'Unnamed Item'),
    type:String(item.type||'Gear'),
    attunement:Boolean(item.attunement||item.attune||false),
    attunementText:String(item.attunementText||''),
    rarity:String(item.rarity||'None'),
    brief:String(item.brief||item.notes||''),
    defaultBrief:String(item.defaultBrief||item.brief||item.notes||''),
    source:String(item.source||'Custom'),
    details:String(item.details||item.description||item.notes||''),
    importedId:String(item.importedId||item.id||''),
    favorite:Boolean(item.favorite),
    attuned:Boolean(item.attuned || state.attunedItems.includes(String(item.name||'')))
  }));
  state.inventoryView=Object.assign({search:'',sort:'name-asc',type:'all',rarity:'all',attunement:'all'},state.inventoryView||{});
  const validAttunedNames=[];
  state.attunedItems.forEach(name=>{
    const clean=String(name||'');
    if(clean && state.inventory.some(item=>item.name===clean) && !validAttunedNames.includes(clean))validAttunedNames.push(clean);
    else validAttunedNames.push('');
  });
  state.attunedItems=validAttunedNames.slice(0,3);
  while(state.attunedItems.length<3)state.attunedItems.push('');
  state.inventory.forEach(item=>{
    if(state.attunedItems.includes(item.name))item.attuned=true;
    if(item.attuned && !state.attunedItems.includes(item.name)){
      const openSlot=state.attunedItems.findIndex(name=>!name);
      if(openSlot>=0)state.attunedItems[openSlot]=item.name;
      else item.attuned=false;
    }
  });
}
ensureInventoryState();
ensureSpellTrackingState();
const JOURNAL_CATEGORIES=[
  {id:'session',label:'Session Notes',color:'#A56DE2'},
  {id:'quest',label:'Quests',color:'#F5B942'},
  {id:'npc',label:'NPCs',color:'#22B8B5'},
  {id:'location',label:'Locations',color:'#3B82F6'},
  {id:'lore',label:'Lore & History',color:'#E83E8C'},
  {id:'clue',label:'Clues & Mysteries',color:'#9DE36F'},
  {id:'combat',label:'Combat & Encounters',color:'#F97316'},
  {id:'treasure',label:'Treasure & Items',color:'#D6B35A'},
  {id:'character',label:'Character & Party',color:'#C7B5FF'},
  {id:'plan',label:'Plans & To-Do',color:'#7C8794'}
];
function getJournalCategory(id){return JOURNAL_CATEGORIES.find(category=>category.id===id)||JOURNAL_CATEGORIES[0];}
const JOURNAL_STORAGE_KEY='alkanderJournalNotesV2';
function readDedicatedJournal(){
  const saved=readJsonStorage(JOURNAL_STORAGE_KEY);
  return saved&&Array.isArray(saved.notes)&&saved.notes.length?saved:null;
}
function persistJournalNow(){
  const payload={
    version:2,
    notes:Array.isArray(state.journalNotes)?state.journalNotes:[],
    activeNoteId:state.activeJournalNoteId||'',
    view:Object.assign({search:'',sort:'updated-desc'},state.journalView||{}),
    savedAt:new Date().toISOString()
  };
  try{
    localStorage.setItem(JOURNAL_STORAGE_KEY,JSON.stringify(payload));
    return true;
  }catch(error){
    console.error('Journal save failed',error);
    return false;
  }
}
function ensureJournalState(){
  const dedicated=readDedicatedJournal();
  if(dedicated){
    state.journalNotes=dedicated.notes;
    if(dedicated.activeNoteId)state.activeJournalNoteId=dedicated.activeNoteId;
    state.journalView=Object.assign({},state.journalView||{},dedicated.view||{});
  }
  const legacy=typeof state.journal==='string'?state.journal:'';
  if(!Array.isArray(state.journalNotes) || !state.journalNotes.length){
    const now=new Date().toISOString();
    state.journalNotes=[{
      id:`journal-${Date.now()}-main`,
      title:'Campaign Journal',
      content:legacy||defaults.journal,
      pinned:true,
      createdAt:now,
      updatedAt:now
    }];
  }
  state.journalNotes=state.journalNotes.map((note,index)=>({
    id:String(note.id||`journal-${Date.now()}-${index}-${Math.random().toString(36).slice(2,7)}`),
    title:String(note.title||'Untitled Note'),
    content:String(note.content??note.body??''),
    pinned:Boolean(note.pinned),
    category:getJournalCategory(note.category).id,
    createdAt:String(note.createdAt||new Date().toISOString()),
    updatedAt:String(note.updatedAt||note.createdAt||new Date().toISOString())
  }));
  if(!state.activeJournalNoteId || !state.journalNotes.some(note=>note.id===state.activeJournalNoteId)){
    state.activeJournalNoteId=state.journalNotes[0].id;
  }
  state.journalView=Object.assign({search:'',sort:'updated-desc'},state.journalView||{});
  // Search is an active view filter only; always reopen the Journal with every note visible.
  state.journalView.search='';
  state.journal=state.journalNotes.find(note=>note.id===state.activeJournalNoteId)?.content||'';
}
ensureJournalState();
const save=()=>{
  ensureCharacterState();ensureVitalityState();ensureInventoryState();ensureSpellTrackingState();ensureJournalState();
  persistJournalNow();
  try{localStorage.setItem('alkanderSheet',JSON.stringify(state));return true;}
  catch(error){console.warn('Main sheet save failed; journal remains safely stored separately.',error);return false;}
};
let videosFrozen=false;
const videoRestartTimers=new WeakMap();
function clearVideoRestartTimer(video){
  const timer=videoRestartTimers.get(video);
  if(timer) clearTimeout(timer);
  videoRestartTimers.delete(video);
}
function setVideoPlaybackRate(video){
  const rate=Number(video.dataset.playbackRate||1);
  video.defaultPlaybackRate=rate;
  video.playbackRate=rate;
}
function freezeVideoOnFirstFrame(video){
  if(!video) return;
  clearVideoRestartTimer(video);
  const freeze=()=>{
    try{
      video.pause();
      video.currentTime=0;
      video.classList.remove('sheet-video-fading');
      video.dataset.inFade='0';
      setVideoPlaybackRate(video);
    }catch(error){}
  };
  if(video.readyState>=1) freeze();
  else video.addEventListener('loadedmetadata',freeze,{once:true});
}
function restartSheetVideo(video){
  if(!video) return;
  clearVideoRestartTimer(video);
  const restart=()=>{
    try{
      setVideoPlaybackRate(video);
      video.currentTime=0;
      video.dataset.inFade='0';
      video.classList.remove('sheet-video-fading');
      const promise=video.play();
      if(promise && promise.catch) promise.catch(()=>{});
    }catch(error){}
  };
  if(video.readyState>=1) restart();
  else video.addEventListener('loadedmetadata',restart,{once:true});
}
function configureSheetVideo(video){
  if(!video || video.dataset.customLoopReady==='1') return;
  video.dataset.customLoopReady='1';
  video.loop=false;
  video.addEventListener('loadedmetadata',()=>setVideoPlaybackRate(video));
  video.addEventListener('timeupdate',()=>{
    if(videosFrozen || video.dataset.inFade==='1' || !Number.isFinite(video.duration)) return;
    if(video.duration-video.currentTime<=0.65){
      video.dataset.inFade='1';
      video.classList.add('sheet-video-fading');
    }
  });
  video.addEventListener('ended',()=>{
    if(videosFrozen) return;
    video.dataset.inFade='1';
    video.classList.add('sheet-video-fading');
    clearVideoRestartTimer(video);
    const timer=setTimeout(()=>{
      videoRestartTimers.delete(video);
      if(!videosFrozen && document.contains(video)) restartSheetVideo(video);
    },2000);
    videoRestartTimers.set(video,timer);
  });
  setVideoPlaybackRate(video);
}
function configureAllSheetVideos(){
  document.querySelectorAll('#combat video').forEach(video=>{
    configureSheetVideo(video);
    if(videosFrozen) freezeVideoOnFirstFrame(video);
  });
}
function toggleSheetVideos(){
  videosFrozen=!videosFrozen;
  const button=document.getElementById('resetBtn');
  if(videosFrozen){
    document.querySelectorAll('#combat video').forEach(freezeVideoOnFirstFrame);
    if(button){button.title='Restart videos';button.setAttribute('aria-label','Restart videos');}
    toast('Videos frozen on first frame');
  }else{
    document.querySelectorAll('#combat video').forEach(video=>{configureSheetVideo(video);restartSheetVideo(video);});
    if(button){button.title='Freeze videos on first frame';button.setAttribute('aria-label','Freeze videos on first frame');}
    toast('Videos restarted');
  }
}
function applyVideoFreezeState(){
  requestAnimationFrame(configureAllSheetVideos);
}
function capturePersistentCombatVideos(){
  const page=document.getElementById('combat');
  if(!page) return {};
  return {
    portrait:page.querySelector('.portrait-video'),
    vitality:page.querySelector('.vital-panel-video')
  };
}
function restorePersistentCombatVideos(saved){
  if(!saved) return false;
  let restored=false;
  const replacements=[
    ['portrait','.portrait-video'],
    ['vitality','.vital-panel-video']
  ];
  replacements.forEach(([key,selector])=>{
    const existing=saved[key];
    const fresh=document.querySelector(`#combat ${selector}`);
    if(existing && fresh && existing!==fresh){
      fresh.replaceWith(existing);
      restored=true;
    }
  });
  return restored;
}
function captureCombatVideoState(){
  return Array.from(document.querySelectorAll('#combat video')).map((video,index)=>({
    index,
    currentTime:Number.isFinite(video.currentTime)?video.currentTime:0,
    paused:video.paused,
    playbackRate:Number(video.playbackRate||video.dataset.playbackRate||1)
  }));
}
function restoreCombatVideoState(snapshot){
  if(!Array.isArray(snapshot) || !snapshot.length) return;
  const videos=Array.from(document.querySelectorAll('#combat video'));
  videos.forEach((video,index)=>{
    const saved=snapshot[index];
    if(!saved) return;
    const apply=()=>{
      try{
        setVideoPlaybackRate(video);
        if(Number.isFinite(saved.currentTime)) video.currentTime=Math.max(0,saved.currentTime);
        if(videosFrozen || saved.paused){
          video.pause();
        }else{
          const promise=video.play();
          if(promise && promise.catch) promise.catch(()=>{});
        }
      }catch(error){}
    };
    if(video.readyState>=1) apply();
    else video.addEventListener('loadedmetadata',apply,{once:true});
  });
}
let vitalityEntry='0';
function parseDiceFormula(formula){
  const cleaned=String(formula||'').replace(/\s+/g,'');
  const match=cleaned.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if(!match) return {count:0,sides:0,bonus:0};
  return {count:+match[1],sides:+match[2],bonus:match[3]?+match[3]:0};
}
function rollFormulaSimple(formula){
  const {count,sides,bonus}=parseDiceFormula(formula);
  let rolls=[];
  for(let i=0;i<count;i++) rolls.push(1+Math.floor(Math.random()*sides));
  return {total:rolls.reduce((a,b)=>a+b,0)+bonus,rolls,bonus};
}
function applyDamage(amount){
  amount=Math.max(0,Number(amount)||0);
  const absorbed=Math.min(state.tempHp,amount);
  state.tempHp=Math.max(0,state.tempHp-absorbed);
  const hpLoss=amount-absorbed;
  state.hp=Math.max(0,state.hp-hpLoss);
  return {amount,absorbed,hpLoss};
}
function applyHealing(amount){
  amount=Math.max(0,Number(amount)||0);
  const before=state.hp;
  state.hp=Math.min(state.maxHp,state.hp+amount);
  return state.hp-before;
}
function addTempHp(amount){
  amount=Math.max(0,Number(amount)||0);
  state.tempHp=Math.max(0,state.tempHp+amount);
  return state.tempHp;
}
function resetVitalityEntry(){ vitalityEntry='0'; }
function setVitalityEntry(next){
  next=String(next).replace(/[^0-9]/g,'');
  if(!next) next='0';
  vitalityEntry=String(parseInt(next,10)||0);
  renderVitalityDialog();
}
function openVitalityDialog(){
  ensureVitalityDialog();
  resetVitalityEntry();
  renderVitalityDialog();
  const d=document.getElementById('vitalityDialog');
  if(d && !d.open) d.showModal();
}
function closeVitalityDialog(){ const d=document.getElementById('vitalityDialog'); if(d && d.open) d.close(); }
function isVitalityDialogOpen(){ const d=document.getElementById('vitalityDialog'); return !!(d && d.open); }
function afterVitalityStateChange(message=''){
  save();
  renderCombat();
  renderSpells();
  if(isVitalityDialogOpen()) renderVitalityDialog();
  if(message) toast(message);
}
function ensureVitalityDialog(){
  if(document.getElementById('vitalityDialog')) return;
  const dialog=document.createElement('dialog');
  dialog.id='vitalityDialog';
  dialog.innerHTML='<div class="vitality-modal"></div>';
  document.body.appendChild(dialog);
  dialog.addEventListener('click',(event)=>{ if(event.target===dialog) closeVitalityDialog(); });
}
function usePotion(key,formula,label){
  const qty=Math.max(0,Number(state.potions[key]||0));
  if(qty<1){toast(`No ${label.toLowerCase()} potions remaining`);return;}
  state.potions[key]=qty-1;
  const result=rollFormulaSimple(formula);
  const healed=applyHealing(result.total);
  afterVitalityStateChange(`${label}: restored ${healed} HP`);
}
function beginShortRest(){
  state.rest.shortRestActive=true;
  state.rest.songOfRestUsed=false;
  afterVitalityStateChange('Short rest started');
}
function spendHitDie(forceHigh=false){
  const totalDice=(state.rest.bardHitDice||0)+(state.rest.warlockHitDice||0);
  if(!state.rest.shortRestActive){toast('Begin a short rest first');return;}
  if(totalDice<1){toast('No hit dice available');return;}
  // Spend green square hit dice first, then purple circle hit dice.
  const greenSquares=Math.max(0,Number(state.rest.warlockHitDice)||0);
  if(greenSquares>0){
    state.rest.warlockHitDice=greenSquares-1;
  } else {
    state.rest.bardHitDice=Math.max(0,(Number(state.rest.bardHitDice)||0)-1);
  }
  const conMod=Number(state.abilities?.CON?.[1]||0);
  const die=forceHigh ? (Math.random()<0.5?7:8) : 1+Math.floor(Math.random()*8);
  const total=Math.max(0,die+conMod);
  const healed=applyHealing(total);
  afterVitalityStateChange(`Hit die: ${die} ${conMod>=0?'+':'-'} ${Math.abs(conMod)} = ${total}; restored ${healed} HP`);
}
function useSongOfRest(){
  if(!state.rest.shortRestActive){toast('Begin a short rest first');return;}
  if(state.rest.songOfRestUsed){toast('Song of Rest has already been used this short rest');return;}
  const die=1+Math.floor(Math.random()*6);
  state.rest.songOfRestUsed=true;
  const healed=applyHealing(die);
  afterVitalityStateChange(`Song of Rest: rolled ${die}; restored ${healed} HP`);
}
function endShortRest(){
  state.rest.shortRestActive=false;
  state.inspiration=6;
  state.pactSlots=2;
  afterVitalityStateChange('Short rest finished; short-rest abilities restored');
}
function takeLongRest(){
  state.rest.shortRestActive=false;
  state.rest.songOfRestUsed=false;
  state.hp=state.maxHp;
  state.tempHp=0;
  state.rest.bardHitDice=5;
  state.rest.warlockHitDice=3;
  state.inspiration=6;
  state.pactSlots=2;
  state.spellSlots={1:4,2:3,3:2};
  state.formOfDread=3;
  state.formOfDreadMax=3;
  ensureSpellTrackingState();
  Object.keys(state.spellTrackers.weapon).forEach(key=>state.spellTrackers.weapon[key]=false);
  Object.keys(state.spellTrackers.race).forEach(key=>state.spellTrackers.race[key]=false);
  afterVitalityStateChange('Long rest complete; HP, hit dice, spell slots and abilities restored');
}
function renderVitalityDialog(){
  const dialog=document.getElementById('vitalityDialog');
  if(!dialog) return;
  ensureVitalityState();
  const shell=dialog.querySelector('.vitality-modal');
  const hpPct=Math.max(0,Math.min(100,(state.hp/state.maxHp)*100));
  const potions=[
    {key:'healing',label:'Healing',formula:'2d4+2',icon:'heal.png'},
    {key:'greater',label:'Greater Healing',formula:'4d4+4',icon:'heal.png'},
    {key:'superior',label:'Superior Healing',formula:'8d4+8',icon:'heal.png'},
    {key:'supreme',label:'Supreme Healing',formula:'10d4+20',icon:'heal.png'}
  ];
  shell.innerHTML=`
    <button class="vitality-close" type="button" aria-label="Close">×</button>
    <div class="vitality-titlebar">
      <div class="vitality-title-ornament"></div>
      <h2>Vitality &amp; Rest</h2>
      <div class="vitality-title-ornament"></div>
    </div>
    <div class="vitality-modal-grid">
      <section class="vitality-side-panel vitality-rest-panel">
        <div class="vitality-side-header"><span class="vitality-side-icon">☾</span><span>Rest</span></div>
        <div class="vitality-rest-card">
          <div class="vitality-rest-row"><div><strong>Hit Dice</strong><small>Healing Available</small></div><b>${(state.rest.bardHitDice||0)+(state.rest.warlockHitDice||0)} / 8</b></div>
          <div class="vitality-rest-row"><div><strong>Font of Inspiration</strong><small>Bardic Inspiration, Unsettling Words</small></div><b>${state.inspiration} / 6</b></div>
          <div class="vitality-rest-row"><div><strong>Pact Magic</strong><small>Second Level Warlock Spells</small></div><b class="mint">${state.pactSlots} / 2</b></div>
        </div>
        <div class="vitality-rest-actions">
          ${state.rest.shortRestActive?`
            <div class="short-rest-active">
              <div class="short-rest-formula">1d8 ${Number(state.abilities?.CON?.[1]||0)>=0?'+':'-'} ${Math.abs(Number(state.abilities?.CON?.[1]||0))}</div>
              <div class="hit-dice-pool" aria-label="Hit dice remaining">
                ${Array.from({length:5},(_,i)=>`<span class="hit-die-dot ${i<(state.rest.bardHitDice||0)?'available':'spent'}"></span>`).join('')}
                ${Array.from({length:3},(_,i)=>`<span class="hit-die-square ${i<(state.rest.warlockHitDice||0)?'available':'spent'}"></span>`).join('')}
              </div>
              <button type="button" data-rest-action="hitdie">Spend Hit Die</button>
              <button type="button" data-rest-action="song" ${state.rest.songOfRestUsed?'disabled':''}>Song of Rest</button>
              <button type="button" data-rest-action="endshort">End Short Rest</button>
            </div>`:`<button type="button" data-rest-action="begin">Begin Short Rest</button>`}
          <button class="long-rest-button" type="button" data-rest-action="long">Long Rest</button>
        </div>
      </section>
      <section class="vitality-center-panel">
        <div class="vitality-center-title">Health</div>
        <div class="vitality-health-scene">
          <div class="vitality-ring ${state.tempHp>0?'has-temp':''}" style="--hp-pct:${hpPct}">
            <div class="vitality-ring-inner">
              <div class="vitality-ring-value">${state.hp}<small> / ${state.maxHp}</small></div>
              <div class="vitality-ring-label">HP</div>
              ${state.tempHp>0?`<div class="vitality-ring-temp">${state.tempHp}</div>`:''}
            </div>
          </div>
        </div>
        <div class="vitality-entry-row vitality-entry-row-number-only">
          <div class="vitality-entry-value">${vitalityEntry}</div>
        </div>
        <div class="vitality-numpad">
          <button type="button" data-vital-key="1">1</button><button type="button" data-vital-key="2">2</button><button type="button" data-vital-key="3">3</button>
          <button type="button" data-vital-key="4">4</button><button type="button" data-vital-key="5">5</button><button type="button" data-vital-key="6">6</button>
          <button type="button" data-vital-key="7">7</button><button type="button" data-vital-key="8">8</button><button type="button" data-vital-key="9">9</button>
          <button type="button" data-vital-clear="1">Clear</button><button type="button" data-vital-key="0">0</button><button type="button" data-vital-back="1">⌫</button>
        </div>
        <div class="vitality-action-row">
          <button class="vitality-do damage" type="button" data-vital-action="damage">${icon('damage','resource-img')} Damage</button>
          <button class="vitality-do heal" type="button" data-vital-action="heal">${icon('heal','resource-img')} Heal</button>
          <button class="vitality-do temp" type="button" data-vital-action="temp">${icon('temp_hp','resource-img')} Temp HP</button>
        </div>
      </section>
      <section class="vitality-side-panel potions">
        <div class="vitality-side-header"><span class="vitality-side-icon">⚗</span><span>Potions</span></div>
        <div class="vitality-potions-list">
          ${potions.map(p=>`
            <div class="vitality-potion-card">
              <div class="vitality-potion-icon"><img src="assets/${p.icon}" alt=""></div>
              <div class="vitality-potion-info"><strong>${p.label}</strong><small>${p.formula}</small></div>
              <div class="vitality-potion-controls">
                <button type="button" data-potion-adjust="${p.key}" data-delta="-1">−</button>
                <span>${state.potions[p.key]||0}</span>
                <button type="button" data-potion-adjust="${p.key}" data-delta="1">+</button>
              </div>
              <button class="vitality-use-btn" type="button" data-potion-use="${p.key}">Use</button>
            </div>
          `).join('')}
        </div>
      </section>
    </div>`;
  shell.querySelector('.vitality-close').onclick=closeVitalityDialog;
  shell.querySelectorAll('[data-vital-key]').forEach(btn=>btn.onclick=()=>{
    const digit=btn.getAttribute('data-vital-key');
    setVitalityEntry(vitalityEntry==='0' ? digit : (vitalityEntry + digit).slice(0,4));
  });
  const clearBtn=shell.querySelector('[data-vital-clear]');
  if(clearBtn) clearBtn.onclick=()=>setVitalityEntry('0');
  const backBtn=shell.querySelector('[data-vital-back]');
  if(backBtn) backBtn.onclick=()=>setVitalityEntry(vitalityEntry.length>1 ? vitalityEntry.slice(0,-1) : '0');
  shell.querySelectorAll('[data-vital-action]').forEach(btn=>btn.onclick=()=>{
    const action=btn.getAttribute('data-vital-action');
    const amount=Math.max(0,Number(vitalityEntry)||0);
    if(!amount){toast('Enter a value first');return;}
    if(action==='damage'){
      const result=applyDamage(amount);
      resetVitalityEntry();
      afterVitalityStateChange(result.absorbed ? `${amount} damage dealt (${result.absorbed} absorbed by Temp HP)` : `${amount} damage dealt`);
    } else if(action==='heal'){
      const healed=applyHealing(amount);
      resetVitalityEntry();
      afterVitalityStateChange(`${healed} HP restored`);
    } else if(action==='temp'){
      addTempHp(amount);
      resetVitalityEntry();
      afterVitalityStateChange(`Added ${amount} Temp HP`);
    }
  });
  shell.querySelectorAll('[data-rest-action]').forEach(btn=>{
    const action=btn.getAttribute('data-rest-action');
    if(action==='hitdie'){
      btn.onclick=(event)=>{
        const rect=btn.getBoundingClientRect();
        const clickX=event.clientX-rect.left;
        const forceHigh=clickX>=rect.width*(2/3);
        spendHitDie(forceHigh);
      };
      return;
    }
    btn.onclick=()=>{
      if(action==='begin') beginShortRest();
      else if(action==='song') useSongOfRest();
      else if(action==='endshort') endShortRest();
      else if(action==='long') takeLongRest();
    };
  });
  shell.querySelectorAll('[data-potion-adjust]').forEach(btn=>btn.onclick=()=>{
    const key=btn.getAttribute('data-potion-adjust');
    const delta=Number(btn.getAttribute('data-delta'))||0;
    state.potions[key]=Math.max(0,(Number(state.potions[key])||0)+delta);
    save();
    renderVitalityDialog();
  });
  shell.querySelectorAll('[data-potion-use]').forEach(btn=>btn.onclick=()=>{
    const key=btn.getAttribute('data-potion-use');
    const lookup={healing:['2d4+2','Healing'],greater:['4d4+4','Greater Healing'],superior:['8d4+8','Superior Healing'],supreme:['10d4+20','Supreme Healing']};
    const [formula,label]=lookup[key];
    usePotion(key,formula,label);
  });
}
const tabs=[
  {label:'Main',id:'combat'},
  {label:'Skills',id:'skills'},
  {label:'Spells',id:'spells'},
  {label:'Features',id:'features'},
  {label:'Inventory',id:'inventory'},
  {label:'Journal',id:'journal'}
];
const $=s=>document.querySelector(s); const el=(tag,cls,html='')=>{const n=document.createElement(tag);if(cls)n.className=cls;if(html)n.innerHTML=html;return n};
const icon=(name,cls='ui-icon')=>`<img class="${cls}" src="assets/${name}.png" alt="">`;
function toast(msg){const t=el('div','floating-toast',msg);document.body.append(t);setTimeout(()=>t.remove(),2100)}
function roll(label,formula,bonus=0){let count=1,sides=20;const m=formula.match(/(\d+)d(\d+)/i);if(m){count=+m[1];sides=+m[2]}let rolls=[];for(let i=0;i<count;i++)rolls.push(1+Math.floor(Math.random()*sides));const total=rolls.reduce((a,b)=>a+b,0)+bonus;$('#diceTitle').textContent=label;$('#diceResult').textContent=total;$('#diceBreakdown').textContent=`${rolls.join(' + ')}${bonus?` ${bonus>=0?'+':'-'} ${Math.abs(bonus)}`:''}`;$('#diceDialog').showModal();return total}
function pipRow(current,max,type='circle',onClick){const d=el('div','pips');for(let i=0;i<max;i++){const p=el('button',`pip ${i<current?'on':''} ${type==='square'?'square':''}`);p.title=`Set to ${i+1}`;p.onclick=()=>onClick(i<current && i===current-1?i:i+1);d.append(p)}return d}
function resourceCard(title,icon,current,max,key,mint=false,type='circle'){const c=el('div',`resource-card ${mint?'mint':''}`);c.innerHTML=`<div class="resource-head"><span><span class="resource-icon">${icon}</span><span class="resource-title">${title}</span></span><strong>${current} / ${max}</strong></div>`;const b=el('div','resource-body');b.append(pipRow(current,max,type,v=>{state[key]=v;save();renderCombat()}));c.append(b);return c}
function initTabs(){const nav=$('#tabs');tabs.forEach((t,i)=>{const b=el('button',`tab-btn ${i===0?'active':''}`,t.label.toUpperCase());b.onclick=()=>{document.querySelectorAll('.tab-btn,.tab-page').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+t.id).classList.add('active');if(t.id==='journal')renderJournal()};nav.append(b)})}
function renderCombat(){const page=$('#combat');const persistentCombatVideos=capturePersistentCombatVideos();const combatVideoSnapshot=captureCombatVideoState();page.innerHTML='';const grid=el('div','grid-combat');
 const left=el('aside','panel character-card',`<div class="portrait-frame"><div class="portrait"><video class="portrait-video" autoplay muted playsinline preload="auto" data-playback-rate="0.6666666667"><source src="assets/alkander-portrait.mp4" type="video/mp4"></video></div></div><div class="name">ALKANDER</div><div class="subtitle">BARD ${state.character.bardLevel} • COLLEGE OF ELOQUENCE<br><span class="warlock">WARLOCK ${state.character.warlockLevel} • UNDEAD PATRON</span></div><div class="title-divider"><span>✦</span></div><div class="stat-list"></div>`);
 const stats=[['shield',icon('ac','stat-icon'),'AC',state.ac],['burst',icon('initiative','stat-icon'),'INITIATIVE',`+${state.initiative}`],['boot',icon('speed','stat-icon'),'SPEED',state.speed],['spark',icon('proficiency','stat-icon'),'PROFICIENCY',`+${state.proficiency}`]];
 stats.forEach(([cls,i,l,v])=>left.querySelector('.stat-list').insertAdjacentHTML('beforeend',`<div class="mini-stat ${cls}"><div class="mini-stat-frame"><span class="ico">${i}</span></div><span class="label">${l}</span><span class="value">${v}</span></div>`));
 const center=el('section','center-stack');const vital=el('div','panel vital-panel');const pct=Math.max(0,Math.min(100,state.hp/state.maxHp*100));state.tempHp=Math.max(0,Number(state.tempHp)||0);const tempHpMarkup=state.tempHp>0?`<div class="temp-hp-display active"><strong>${state.tempHp}</strong></div>`:'';vital.innerHTML=`<video class="vital-panel-video" autoplay muted playsinline preload="auto" data-playback-rate="0.6666666667" aria-hidden="true"><source src="assets/hp-background.mp4" type="video/mp4"></video><div class="vital-panel-video-shade"></div><div class="hp-ring ${state.tempHp>0?'has-temp':''}" style="--hp-pct:${pct}"><div class="hp-ring-inner"><div class="hp-main">${state.hp}<small> / ${state.maxHp}</small></div><div class="hp-label">HP</div>${tempHpMarkup}</div></div><div class="hp-quick-buttons" aria-label="Hit point quick controls"><div class="hp-quick-group hp-quick-damage"></div><div class="hp-quick-group hp-quick-middle"></div><div class="hp-quick-group hp-quick-heal"></div></div>`;
 const damageButtons=[['damage',1,'hp-damage-1'],['damage',5,'hp-damage-5'],['damage',10,'hp-damage-10'],['damage',20,'hp-damage-20']];
 const healButtons=[['heal',20,'hp-heal-20'],['heal',10,'hp-heal-10'],['heal',5,'hp-heal-5'],['heal',1,'hp-heal-1']];
 const hpQuickDamage=vital.querySelector('.hp-quick-damage');
 const hpQuickMiddle=vital.querySelector('.hp-quick-middle');
 const hpQuickHeal=vital.querySelector('.hp-quick-heal');
 const vitalityButton=el('button','hp-quick-button hp-vitality');
 vitalityButton.type='button';
 vitalityButton.title='Vitality Popup';
 vitalityButton.setAttribute('aria-label','Vitality Popup');
 vitalityButton.innerHTML=`<img src="assets/hp-vitality-popup.png" alt="">`;
 vitalityButton.onclick=()=>{
   vitalityButton.classList.remove('clicked');
   void vitalityButton.offsetWidth;
   vitalityButton.classList.add('clicked');
   openVitalityDialog();
 };
 hpQuickMiddle.append(vitalityButton);
 [...damageButtons,...healButtons].forEach(([type,amount,image])=>{
   const button=el('button',`hp-quick-button hp-${type}`);
   button.type='button';
   button.title=type==='damage'?`Take ${amount} damage`:`Heal ${amount} HP`;
   button.setAttribute('aria-label',button.title);
   button.innerHTML=`<img src="assets/${image}.png" alt="">`;
   button.onclick=()=>{
     if(type==='damage'){
       const absorbed=Math.min(state.tempHp,amount);
       state.tempHp-=absorbed;
       state.hp=Math.max(0,state.hp-(amount-absorbed));
       toast(absorbed?`${amount} damage: ${absorbed} absorbed by Temp HP`:`${amount} damage taken`);
     } else {
       const before=state.hp;
       state.hp=Math.min(state.maxHp,state.hp+amount);
       toast(`${state.hp-before} HP restored`);
     }
     button.classList.remove('clicked');
     void button.offsetWidth;
     button.classList.add('clicked');
     save();
     setTimeout(()=>renderCombat(),170);
   };
   (type==='damage'?hpQuickDamage:hpQuickHeal).append(button);
 });
 center.append(vital);
 const acts=el('div','actions-grid');
 const eldritch=el('div','panel action-card eldritch-card');
 eldritch.innerHTML=`<div class="action-name action-name-inline">${icon('eldritch_blast','action-name-icon')} <span>ELDRITCH BLAST</span></div><div class="action-subline">Cantrip ⛧ 120 ft ⛧ Warlock</div><div class="eldritch-details eldritch-grid-four ornate-grid"><button class="eldritch-detail ornate-mini-box" data-roll="beams"><strong>2</strong><span>Beams</span></button><button class="eldritch-detail ornate-mini-box" data-roll="attack"><strong>+9</strong><span>to hit</span></button><button class="eldritch-detail ornate-mini-box" data-roll="damage"><strong>1d10+6</strong><span>Force</span></button><button class="eldritch-detail ornate-mini-box" data-roll="hex"><strong>+1D6</strong><span>Hex</span></button></div>`;
 eldritch.querySelector('[data-roll="beams"]').onclick=()=>{roll('Eldritch Blast Beam 1','1d20',state.spellAttack);};
 eldritch.querySelector('[data-roll="attack"]').onclick=()=>roll('Eldritch Blast Attack','1d20',state.spellAttack);
 eldritch.querySelector('[data-roll="damage"]').onclick=()=>roll('Eldritch Blast Force Damage','1d10',6);
 eldritch.querySelector('[data-roll="hex"]').onclick=()=>roll('Hex Damage','1d6',0);
 acts.append(eldritch);
 const inspirationCard=el('div','panel action-card bardic-inspiration-card');
 inspirationCard.innerHTML=`<div class="action-name action-name-inline">${icon('bardic_inspiration','action-name-icon')} <span>BARDIC INSPIRATION</span></div><div class="bardic-pips-wrap"></div><div class="bardic-details bardic-grid-two ornate-grid"><button class="bardic-detail ornate-mini-box" data-use="inspiration"><strong>Bardic Inspiration</strong></button><button class="bardic-detail ornate-mini-box" data-use="unsettling"><strong>Unsettling Words</strong></button></div>`;
 inspirationCard.querySelector('.bardic-pips-wrap').append(pipRow(state.inspiration,6,'circle',v=>{state.inspiration=v;save();renderCombat()}));
 inspirationCard.querySelector('[data-use="inspiration"]').onclick=()=>{if(state.inspiration>0){state.inspiration--;save();renderCombat();toast('Bardic Inspiration used')}else toast('No inspiration remaining')};
 inspirationCard.querySelector('[data-use="unsettling"]').onclick=()=>{if(state.inspiration>0){state.inspiration--;save();renderCombat();toast('Unsettling Words used')}else toast('No inspiration remaining')};
 acts.append(inspirationCard);
 const inventoryCard=el('div','panel action-card inventory-card');
 inventoryCard.innerHTML=`<h3>${icon('history','reaction-heading-icon')} INVENTORY</h3><div class="quick-list inventory-quick-list"></div>`;
 [
   {label:'Gold',value:'100g',cls:'reaction-gold'},
   {label:'Echo of Perdition',value:'',cls:'reaction-purple'},
   {label:'Spell Ring',value:'',cls:'reaction-gold'},
   {label:'Cloak of Billowing',value:'',cls:'reaction-purple'}
 ].forEach(item=>{
   const box=el('button',`${item.cls} inventory-item-box`,item.value?`<span class="inventory-item-label">${item.label}</span><strong>${item.value}</strong>`:`<span class="inventory-item-label">${item.label}</span>`);
   box.type='button';
   box.onclick=()=>{};
   inventoryCard.querySelector('.inventory-quick-list').append(box);
 });
 acts.append(inventoryCard);
 const quick=el('div','panel action-card reactions-card');quick.innerHTML=`<h3>${icon('reaction-panel','reaction-heading-icon')} REACTIONS</h3><div class="quick-list"></div>`;[
   [`${icon('reaction-barbs','quick-icon')} Silvery Barbs`,()=>toast('Silvery Barbs'), 'reaction-purple'],
   [`${icon('reaction-rebuke','quick-icon')} Hellish Rebuke`,()=>roll('Hellish Rebuke','2d10',0), 'reaction-green'],
   [`${icon('reaction-shield','quick-icon')} Shield`,()=>toast('Shield: +5 AC until the start of your next turn'), 'reaction-gold'],
   [`${icon('reaction-opportunity','quick-icon')} Opportunity Attack`,()=>roll('Opportunity Attack','1d20',7), 'reaction-purple']
 ].forEach(([l,f,cls])=>{const b=el('button',cls,l);b.onclick=f;quick.querySelector('.quick-list').append(b)});acts.append(quick);center.append(acts);
 const strip=el('div','panel attack-strip');[[`${icon('attack','strip-icon')} ATTACK ROLL`,'+9',()=>roll('Attack Roll','1d20',9)],[`${icon('spell_attack','strip-icon')} SPELL ATTACK`,'+9',()=>roll('Spell Attack','1d20',9)],[`${icon('spell_save_dc','strip-icon')} SAVE DC`,'17',()=>toast('Spell Save DC 17')]].forEach(([l,v,f])=>{const b=el('button','',`${l}<strong>${v}</strong>`);b.onclick=f;strip.append(b)});center.append(strip);
 const right=el('aside','panel resources');right.innerHTML='';const slots=el('div','resource-card combined-slots-card');slots.innerHTML=`<div class="resource-head"><span><span class="resource-icon">${icon('spell_slots','resource-img')}</span><span class="resource-title">SPELL SLOTS <span class="resource-title-divider">/</span> <span class="resource-title-pact">PACT MAGIC</span></span></span></div>`;const pactRow=el('div','resource-body combined-pact-row');pactRow.innerHTML=`<span class="combined-slot-label">PACT MAGIC</span>`;pactRow.append(pipRow(state.pactSlots,2,'square',v=>{state.pactSlots=v;save();renderCombat()}));slots.append(pactRow);[1,2,3].forEach(l=>{const row=el('div','resource-body combined-spell-row');row.innerHTML=`<span class="combined-slot-label">${l}${l===1?'ST':l===2?'ND':'RD'}</span>`;row.append(pipRow(state.spellSlots[l],l===1?4:l===2?3:2,'circle',v=>{state.spellSlots[l]=v;save();renderCombat()}));slots.append(row)});right.append(slots);state.formOfDreadMax=3;
 const fd=el('div','feature-card mint',`<div class="resource-head"><span><span class="resource-icon">${icon('form_of_dread','resource-img')}</span>FORM OF DREAD</span><strong>${state.formOfDread} / 3 Long Rest</strong></div><p>Transform for 1 minute, gaining temporary hit points, fear immunity, and the ability to frighten one creature.</p>`);fd.onclick=()=>{state.formOfDread=state.formOfDread>0?state.formOfDread-1:3;save();renderCombat()};right.append(fd);
 const mainFeatureBoxes=[
  ['♫ SILVER TONGUE','Master at saying the right thing at the right time. Persuasion and Deception check minimum 10.'],
  ['♫ MAGICAL INSPIRATION','Spend Bardic Inspiration when healing or damaging spell, add the die healing or damage.'],
  ['♫ SONG OF REST','During a short rest, allies who spend Hit Dice regain an additional 1d6 hit points.'],
  ['DROW MAGIC','You know Dancing Lights and can cast Faerie Fire and Darkness once per long rest, using Charisma as your spellcasting ability.']
 ];
 mainFeatureBoxes.forEach(([title,description])=>right.insertAdjacentHTML('beforeend',`<div class="main-feature-summary"><strong>${title}</strong><p>${description}</p></div>`));
 grid.append(left,center,right);page.append(grid);const abs=el('section','ability-section');const ad=el('div','abilities');for(const [name,[score,mod,savev]] of Object.entries(state.abilities)){const displayName=name.charAt(0)+name.slice(1).toLowerCase();const abilityMedia='';const a=el('div',`ability ability-${name.toLowerCase()}`,`${abilityMedia}<div class="ability-overlay"><h3>${displayName}</h3><button class="score">${score}</button><button class="mod">${mod>=0?'+':''}${mod}</button><button class="save">Save ${savev>=0?'+':''}${savev}</button></div>`);a.querySelector('.score').onclick=()=>roll(`${name} Check`,'1d20',mod);a.querySelector('.save').onclick=()=>roll(`${name} Save`,'1d20',savev);ad.append(a)}abs.append(ad);page.append(abs);const reusedCombatVideos=restorePersistentCombatVideos(persistentCombatVideos);if(!reusedCombatVideos) restoreCombatVideoState(combatVideoSnapshot);applyVideoFreezeState();
}
function actionCard(title,name,sub,desc,fn,btn='USE',a='',d=''){const c=el('div','panel action-card');c.innerHTML=`${title?`<h3>${title}</h3>`:''}<div class="action-name">${name}</div><div class="action-desc">${sub}<br>${desc}</div>${a?`<div class="roll-pair"><div class="roll-box">${a}<br><small>TO HIT</small></div><div class="roll-box">${d}<br><small>DAMAGE</small></div></div>`:''}<button class="purple-btn action-main-button">${btn}</button>`;c.querySelector('.action-main-button').onclick=fn;return c}

function getSlotMax(level){return ({1:4,2:3,3:2})[Number(level)]||0;}
function ensureSpellTrackingState(){
  state.spellSlots=Object.assign({1:4,2:3,3:2},state.spellSlots||{});
  [1,2,3].forEach(level=>{const max=getSlotMax(level);state.spellSlots[level]=Math.max(0,Math.min(max,Number(state.spellSlots[level]??max)));});
  state.pactSlots=Math.max(0,Math.min(2,Number(state.pactSlots??2)));
  const tracker=state.spellTrackers||{};
  if(!Array.isArray(state.importedSpells)) state.importedSpells=[];
  if(!Array.isArray(state.preparedBardSpells)) state.preparedBardSpells=['Hypnotic Pattern'];
  state.importedSpells=state.importedSpells.filter(spell=>spell&&spell.name).map(spell=>Object.assign({},spell));
  state.preparedBardSpells=[...new Set(state.preparedBardSpells.map(String))].slice(0,10);
  state.spellTrackers={
    ring:{'Shield':Math.max(0,Math.min(5,Number((tracker.ring||{}).Shield ?? 5)) )},
    weapon:{
      'Protection from Evil and Good':Boolean((tracker.weapon||{})['Protection from Evil and Good']),
      'Command':Boolean((tracker.weapon||{})['Command']),
      'Levitate':Boolean((tracker.weapon||{})['Levitate']),
      'Invisibility':Boolean((tracker.weapon||{})['Invisibility']),
      'Nystul’s Magic Aura':Boolean((tracker.weapon||{})['Nystul’s Magic Aura']),
      'Fly':Boolean((tracker.weapon||{})['Fly']),
      'Speak with Dead':Boolean((tracker.weapon||{})['Speak with Dead'])
    },
    scroll:{
      'Bindings of Icarus':Boolean((tracker.scroll||{})['Bindings of Icarus'])
    },
    race:{
      'Faerie Fire':Boolean((tracker.race||{})['Faerie Fire']),
      'Darkness':Boolean((tracker.race||{})['Darkness'])
    }
  };
}
function afterSpellStateChange(message=''){
  save();
  renderCombat();
  renderSpells();
  if(message) toast(message);
}
const spellPageSpells=[
  {name:'Mage Hand',level:0,source:'Bard',theme:'bard',casting:'1 action',range:'30 ft',desc:'Creates a spectral hand that can manipulate objects at a distance.',full:'You conjure a floating magical hand that can interact with small unattended objects at range. It can lift, move, or manipulate light items, but it cannot attack or activate complex magic.'},
  {name:'Prestidigitation',level:0,source:'Bard',theme:'bard',casting:'1 action',range:'10 ft',desc:'Produces a small harmless magical effect, trick, or sensory flourish.',full:'You create a minor magical flourish such as cleaning, soiling, lighting, snuffing, flavouring, or producing a tiny sensory effect. It is flexible utility magic intended for roleplay and small tricks rather than combat power.'},
  {name:'Vicious Mockery',level:0,source:'Bard',theme:'bard',casting:'1 action',range:'60 ft',desc:'A cutting insult deals psychic damage and hinders the target’s next attack.',full:'You unleash a magically charged insult at a creature that can hear you. It takes psychic damage on a failed Wisdom save and its next attack becomes less reliable as the distraction lingers.'},
  {name:'Minor Illusion',level:0,source:'Bard',theme:'bard',casting:'1 action',range:'30 ft',desc:'Creates a brief sound or image illusion to distract or deceive.',full:'You create a small sensory illusion, usually a sound or a static image, to misdirect or deceive. The illusion is best used for distraction, concealment, or bait rather than direct offense.'},
  {name:'Eldritch Blast',level:0,source:'Warlock',theme:'warlock',casting:'1 action',range:'120 ft',desc:'Fires two beams of crackling force at creatures within range.',full:'You hurl force beams at one or more targets within range. Alkander fires two beams, each making its own attack roll, and Agonizing Blast adds Charisma-based force to each hit.'},
  {name:'Mind Sliver',level:0,source:'Warlock',theme:'warlock',casting:'1 action',range:'60 ft',desc:'Pierces a creature’s thoughts and weakens its next saving throw.',full:'You lance a creature’s mind with psychic static. On a failed Intelligence save it takes psychic damage and becomes more vulnerable to the next saving throw it must make before the end of your next turn.'},
  {name:'Dancing Lights',level:0,source:'Drow Magic',theme:'drow',casting:'1 action',range:'120 ft',desc:'Creates floating lights that can move and illuminate nearby darkness.',full:'You summon small floating lights that can glow like lanterns, torches, or eerie motes. They provide illumination and can be repositioned to guide allies or shape a scene.'},
  {name:'Thaumaturgy',level:0,source:'Weapon',theme:'weapon',casting:'1 action',range:'30 ft',desc:'Creates a minor supernatural sign such as a booming voice or flickering flames.',full:'You create a brief supernatural display such as amplified voice, trembling ground, fluttering flames, or dramatic environmental effects. It is ideal for intimidation, theatre, or ominous magical flavour.'},
  {name:'Find Familiar',level:1,source:'Warlock',theme:'warlock',casting:'1 hour',range:'10 ft',desc:'Summons a magical familiar that scouts, assists, and delivers touch spells.',full:'You summon a spirit that takes the form of a familiar. It can scout, deliver touch spells, and provide utility, and Pact of the Chain expands your familiar options and makes it notably more effective.'},
  {name:'Hellish Rebuke',level:1,source:'Warlock',theme:'warlock',casting:'1 reaction',range:'60 ft',desc:'Ghostly fire lashes back at a creature that has just harmed you.',full:'When a creature damages you, you can answer instantly with infernal retaliation. The attacker is engulfed by punishing spectral fire and must resist the blast or take significant damage.'},
  {name:'Hex',level:1,source:'Warlock',theme:'warlock',casting:'1 bonus action',range:'90 ft',desc:'Curses a target, adding necrotic damage when you hit it.',full:'You place a lingering curse on a target, making your successful attacks bite harder with extra necrotic harm. The curse also hampers one chosen ability, making certain checks harder for the victim.'},
  {name:'Misty Step',level:2,source:'Warlock',theme:'warlock',casting:'1 bonus action',range:'Self',desc:'Teleports you up to 30 feet in a swirl of mist.',full:'You vanish in a swirl of magic and reappear a short distance away. It is quick repositioning magic that can break engagement, reach safety, or set up a new angle instantly.'},
  {name:'Phantasmal Force',level:2,source:'Warlock',theme:'warlock',casting:'1 action',range:'60 ft',desc:'Creates a convincing illusion that exists only in one creature’s mind.',full:'You weave a tailored illusion directly into one creature’s perception. It experiences the imagined threat or obstacle as real, and the spell is strongest when the illusion plays into context and believable danger.'},
  {name:'Shadow Blade',level:2,source:'Warlock',theme:'warlock',casting:'1 bonus action',range:'Self',desc:'Forms a blade of solid shadow that deals psychic damage.',full:'You forge a weapon of darkness in your hand. The blade excels in dim conditions, cuts with psychic force, and gives you a deadly melee option when you need close-quarters pressure.'},
  {name:'Hypnotic Pattern',level:3,source:'Bard',theme:'bard',casting:'1 action',range:'120 ft',desc:'Creates twisting colours that charm and incapacitate creatures in an area.',full:'You conjure a dazzling field of shifting colours that captures attention and freezes creatures in place. It is one of your strongest control tools, turning a dangerous battlefield into a manageable one when enemies fail their saves.'}
];
const grantedSpellGroups=[
  {key:'ring',title:'RING',subtitle:'Click circles to set charges',theme:'ring',spells:[
    {name:'Shield',level:'Ring Spell',levelValue:1,casting:'1 reaction',range:'Self',desc:'A magical barrier flashes into place, granting +5 AC until your next turn.',full:'You react to danger by creating a sudden arcane barrier around yourself. The shield sharply boosts your protection for the moment and can turn a hit aside before it lands.',chargesMax:5}
  ]},
  {key:'weapon',title:'WEAPON',subtitle:'',theme:'weapon',spells:[
    {name:'Protection from Evil and Good',level:'Level 1',levelValue:1,casting:'1 action',range:'Touch',desc:'Wards a creature against several supernatural creature types.',full:'You place a ward on a creature that protects it from aberrations, celestials, elementals, fey, fiends, and undead. The protection makes hostile influence and attacks from those creatures harder to land cleanly.'},
    {name:'Command',level:'Level 1',levelValue:1,casting:'1 action',range:'60 ft',desc:'Speaks a one-word command that a creature must attempt to obey.',full:'You issue a magically empowered one-word order. A creature that fails to resist must follow the command on its next turn as best it can, making the spell excellent for momentary control.'},
    {name:'Levitate',level:'Level 2',levelValue:2,casting:'1 action',range:'60 ft',desc:'Raises a creature or object vertically into the air.',full:'You lift a creature or object into the air and hold it suspended. Used cleverly, it can remove a target from a fight, create vertical movement, or solve positional problems.'},
    {name:'Invisibility',level:'Level 2',levelValue:2,casting:'1 action',range:'Touch',desc:'Makes a creature invisible until the spell ends or it attacks or casts a spell.',full:'You veil a creature from sight, letting it move unseen until the magic ends or it breaks the effect by acting aggressively. It is powerful for infiltration, repositioning, and ambush.'},
    {name:'Nystul’s Magic Aura',level:'Level 2',levelValue:2,casting:'1 action',range:'Touch',desc:'Masks or alters how a creature or object appears to magical detection.',full:'You disguise a target’s magical identity, letting it appear mundane or present a false magical signature. The spell is especially useful for deception, smuggling, and hiding true enchantments.'},
    {name:'Fly',level:'Level 3',levelValue:3,casting:'1 action',range:'Touch',desc:'Grants a creature a flying speed for the spell’s duration.',full:'You grant the target true aerial movement, opening access to space, height, and escape routes that ground-bound foes cannot easily match.'},
    {name:'Speak with Dead',level:'Level 3',levelValue:3,casting:'1 action',range:'10 ft',desc:'Allows a corpse to answer a limited number of questions.',full:'You briefly animate the echoes of a dead creature’s knowledge, letting it answer a small number of questions. The corpse is not restored to life, but it may still reveal valuable clues.'}
  ]},
  {key:'scroll',title:'SCROLL',subtitle:'',theme:'scroll',spells:[
    {name:'Bindings of Icarus',level:'Scroll Spell',levelValue:6,casting:'1 action',range:'90 ft',desc:'Summons infernal chains that seize a creature, pinning it in place and burning it.',full:'You unleash infernal chains that erupt upward and coil around a creature you can see. The victim is dragged to the ground, restrained by searing bindings, and scorched by hellfire until it escapes.'}
  ]},
  {key:'race',title:'RACE',subtitle:'',theme:'drow',spells:[
    {name:'Faerie Fire',level:'Level 1',levelValue:1,casting:'1 action',range:'60 ft',desc:'Outlines creatures in light, making them easier to see and strike.',full:'You splash a glowing magical outline over creatures in an area, exposing them in dim places and making them easier for your allies to pin down accurately.'},
    {name:'Darkness',level:'Level 2',levelValue:2,casting:'1 action',range:'60 ft',desc:'Creates a sphere of magical darkness that blocks ordinary sight.',full:'You create a heavy sphere of supernatural darkness that obscures sight. Properly placed, it can deny vision, cover movement, and disrupt ranged threats.'}
  ]}
];
function renderSpellPips(current,max,shape='circle',clickable=false){
  const safeCurrent=Math.max(0,Math.min(max,Number(current||0)));
  return `<div class="spell-pips ${shape}${clickable?' clickable-pips':''}">${Array.from({length:max},(_,i)=>`<span class="pip ${i<safeCurrent?'filled':''}" data-pip-index="${i}"></span>`).join('')}</div><div class="slot-count">${safeCurrent} / ${max}</div>`;
}
function setSpellSlotTracker(kind,level,value){
  const safeValue=Math.max(0,Number(value)||0);
  if(kind==='pact') state.pactSlots=Math.max(0,Math.min(2,safeValue));
  if(kind==='bard'){
    const max=getSlotMax(level);
    state.spellSlots[level]=Math.max(0,Math.min(max,safeValue));
  }
  save();
  renderCombat();
  renderSpells();
}
function createInlineSlotGroup(label,current,max,shape,kind,level){
  const classes=['inline-slot-group', kind==='pact'?'pact-inline':'bard-inline'];
  if(!label) classes.push('label-free');
  const wrap=el('div',classes.join(' '),'');
  if(label) wrap.innerHTML=`<span class="inline-label">${label}</span>`;
  wrap.append(pipRow(current,max,shape,v=>setSpellSlotTracker(kind,level,v)));
  return wrap;
}
function createLevelHeaderElement(label,level){
  const header=el('div','section-mini-title level-title-row level-title-row-interactive','');
  if(level===0){
    header.innerHTML=`<span>${label.toUpperCase()}</span>`;
    return header;
  }
  header.innerHTML=`<div class="level-title-main">${label.toUpperCase()}</div>${level<=3?'<div class="level-inline-slots"></div>':''}`;
  const slotWrap=header.querySelector('.level-inline-slots');
  if(slotWrap) slotWrap.append(createInlineSlotGroup('',state.spellSlots[level],getSlotMax(level),'circle','bard',level));
  return header;
}
function buildSpellSlotsSummaryCard(){
  const card=el('div','resource-card slot-summary-top combined-slots-card spell-page-slots-card','');
  card.setAttribute('aria-label','Spell slot summary');
  card.innerHTML=`<div class="resource-head"><span><span class="resource-icon">${icon('spell_slots','resource-img')}</span><span class="resource-title">SPELL SLOTS <span class="resource-title-divider">/</span> <span class="resource-title-pact">PACT MAGIC</span></span></span></div>`;
  const pactRow=el('div','resource-body combined-pact-row','<span class="combined-slot-label">PACT MAGIC</span>');
  pactRow.append(pipRow(state.pactSlots,2,'square',v=>setSpellSlotTracker('pact',2,v)));
  card.append(pactRow);
  [1,2,3].forEach(level=>{
    const row=el('div','resource-body combined-spell-row',`<span class="combined-slot-label">${level}${level===1?'ST':level===2?'ND':'RD'}</span>`);
    row.append(pipRow(state.spellSlots[level],getSlotMax(level),'circle',v=>setSpellSlotTracker('bard',level,v)));
    card.append(row);
  });
  return card;
}
function buildLevelHeader(label,level){
  return createLevelHeaderElement(label,level).outerHTML;
}

function normalizeSpellKey(value){
  return String(value||'').toLowerCase().replace(/[’']/g,'').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
}
function getSpellArt(name){
  const key=normalizeSpellKey(name);
  return `assets/spells/${key}.png`;
}
const SPELL_META={
  'Mage Hand':{school:'Conjuration',ritual:false,components:'Verbal, Somatic',duration:'1 minute',full:`A spectral hand appears at a point you choose within range and can manipulate small unattended objects from a distance. It can open or close containers, stow or retrieve small items, and move light objects with careful control.

The hand cannot attack, activate powerful magic, or carry significant weight, but it is excellent for utility, misdirection, and interacting with the environment safely from afar.`},
  'Prestidigitation':{school:'Transmutation',ritual:false,components:'Verbal, Somatic',duration:'Up to 1 hour',full:`You perform a minor magical trick that creates a harmless sensory effect or small supernatural flourish. It can clean, soil, warm, chill, flavour, mark, or briefly animate tiny details to support performance or utility.

Prestidigitation is flexible, theatrical magic that shines in roleplay, atmosphere, and creative problem-solving rather than direct combat impact.`},
  'Vicious Mockery':{school:'Enchantment',ritual:false,components:'Verbal',duration:'Instantaneous',full:`You lace an insult with bardic magic and hurl it at a creature that can hear you. On a failed Wisdom save, the target takes psychic damage and its composure is shaken.

The creature's next attack becomes less reliable before the end of its next turn, making this a useful cantrip for both disruption and chip damage.`},
  'Minor Illusion':{school:'Illusion',ritual:false,components:'Somatic, Material',duration:'1 minute',full:`You create either a simple sound or a static visual illusion within range. The effect is small and limited, but it can distract, lure, conceal, or create a believable false detail in the scene.

Creative use makes Minor Illusion one of the most versatile tools for deception, stealth, and battlefield misdirection.`},
  'Eldritch Blast':{school:'Evocation',ritual:false,components:'Verbal, Somatic',duration:'Instantaneous',full:`A beam of crackling force streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the blast deals force damage, and Alkander's Agonizing Blast makes each successful beam hit even harder.

As Alkander is above 5th level overall, this spell creates two separate beams. Each beam can strike the same target or different targets, and each beam requires its own attack roll.`},
  'Mind Sliver':{school:'Enchantment',ritual:false,components:'Verbal',duration:'Instantaneous',full:`You drive a splinter of psychic interference into the mind of a creature you can see. On a failed Intelligence save, the target takes psychic damage and its thoughts become unstable.

Before the end of your next turn, the creature is slightly worse at resisting the next saving throw it makes, letting you set up stronger follow-up spells.`},
  'Dancing Lights':{school:'Evocation',ritual:false,components:'Verbal, Somatic, Material',duration:'Concentration, up to 1 minute',full:`You conjure up to four floating lights that resemble torches, lanterns, or eerie coloured motes. They can hover, move, and illuminate darkness across the battlefield or a scene.

The lights can also combine into a glowing humanoid shape, making them useful both practically and theatrically.`},
  'Thaumaturgy':{school:'Transmutation',ritual:false,components:'Verbal',duration:'Up to 1 minute',full:`You produce a brief supernatural manifestation such as tremors, ominous sounds, booming voice, flickering flames, or dramatic changes in unlocked doors and windows.

Thaumaturgy is ideal for intimidation, dramatic entrances, eerie atmosphere, or divine and occult flair.`},
  'Find Familiar':{school:'Conjuration',ritual:true,components:'Verbal, Somatic, Material',duration:'Instantaneous',full:`You summon a spirit that takes an animal form and serves as your familiar. It acts independently, can scout, assist, and deliver touch spells, and can be resummoned when needed.

As a Pact of the Chain warlock, Alkander can call on stronger familiar options and empower that companion with additional utility and combat value.`},
  'Hellish Rebuke':{school:'Evocation',ritual:false,components:'Verbal, Somatic',duration:'Instantaneous',full:`When a creature harms you, you answer with immediate supernatural retaliation. Ghostly infernal fire lashes back at the attacker, forcing it to resist the burst or suffer punishing damage.

This is a fast, reactive spell that turns an enemy's successful hit into a painful mistake.`},
  'Hex':{school:'Enchantment',ritual:false,components:'Verbal, Somatic, Material',duration:'Concentration, up to 1 hour',full:`You place a curse on a creature within range. While the curse lasts, your successful attacks against that target deal additional necrotic damage.

You also choose one ability, making the target worse at checks based on that ability. Hex is a strong setup spell for sustained pressure, especially alongside Eldritch Blast.`},
  'Misty Step':{school:'Conjuration',ritual:false,components:'Verbal',duration:'Instantaneous',full:`You briefly dissolve into silver or shadowy mist and reappear in an unoccupied space nearby. The teleport is swift, reliable, and perfect for repositioning.

Use it to escape danger, bypass obstacles, or instantly claim a stronger location on the battlefield.`},
  'Phantasmal Force':{school:'Illusion',ritual:false,components:'Verbal, Somatic, Material',duration:'Concentration, up to 1 minute',full:`You craft a believable illusion directly inside one creature's mind. The target experiences the phantasm as if it were real, responding to it with fear, caution, or pain.

The spell rewards creativity, especially when the illusion fits the environment and pressures the creature into wasting actions or misjudging reality.`},
  'Shadow Blade':{school:'Illusion',ritual:false,components:'Verbal, Somatic',duration:'Concentration, up to 1 minute',full:`You weave shadow into a solid blade and hold it in your hand as a weapon of magical darkness. It is light, deadly, and especially potent when fighting in dim light or darkness.

Shadow Blade gives Alkander a strong close-range option when melee presence matters more than ranged casting.`},
  'Hypnotic Pattern':{school:'Illusion',ritual:false,components:'Somatic, Material',duration:'Concentration, up to 1 minute',full:`You create a twisting tapestry of colour and motion that captures the attention of creatures in an area. Those who fail to resist are charmed, slowed to stillness, and left temporarily incapacitated.

Hypnotic Pattern is one of Alkander's strongest control spells, letting you neutralise multiple threats at once when the battlefield needs breathing room.`},
  'Shield':{school:'Abjuration',ritual:false,components:'Verbal, Somatic',duration:'1 round',full:`A sudden magical barrier flashes into place around you when danger closes in. The ward sharply improves your protection until the start of your next turn and can turn a hit aside in the moment it matters.

It is one of the best panic-button defenses available, especially when combined with strong positioning.`},
  'Protection from Evil and Good':{school:'Abjuration',ritual:false,components:'Verbal, Somatic, Material',duration:'Concentration, up to 10 minutes',full:`You ward a willing creature against aberrations, celestials, elementals, fey, fiends, and undead. The protected target becomes harder for those creatures to influence or assault effectively.

This spell is a specialised but powerful defensive tool when facing supernatural threats.`},
  'Command':{school:'Enchantment',ritual:false,components:'Verbal',duration:'1 round',full:`You speak a single forceful word that compels obedience. On a failed Wisdom save, the target must follow the command as best it can on its next turn.

The spell shines when the chosen word creates a tactical opening, denies actions, or disrupts an enemy at a key moment.`},
  'Levitate':{school:'Transmutation',ritual:false,components:'Verbal, Somatic, Material',duration:'Concentration, up to 10 minutes',full:`You cause a creature or object to rise vertically and hang suspended in the air. If used on an unwilling target, it can remove them from melee or leave them stranded in a vulnerable position.

Levitate also doubles as a useful exploration and mobility tool outside combat.`},
  'Invisibility':{school:'Illusion',ritual:false,components:'Verbal, Somatic, Material',duration:'Concentration, up to 1 hour',full:`You turn a creature invisible until the magic ends or the subject attacks or casts a spell. The spell is excellent for infiltration, ambush, escapes, and subtle repositioning.

Because the effect ends when aggressive action begins, it rewards timing and intent.`},
  'Nystul’s Magic Aura':{school:'Illusion',ritual:false,components:'Verbal, Somatic, Material',duration:'24 hours',full:`You alter how magic perceives a creature or object, concealing or falsifying its magical identity. It can appear nonmagical, magical, or even as though it belongs to a different school of magic.

This is a deceptively useful spell for concealment, smuggling, deception, and layered intrigue.`},
  'Fly':{school:'Transmutation',ritual:false,components:'Verbal, Somatic, Material',duration:'Concentration, up to 10 minutes',full:`You grant a creature the power of true flight for the duration. That mobility opens dramatic new options for scouting, repositioning, escape, and aerial dominance.

In the right terrain, Fly can completely reshape how an encounter is approached.`},
  'Speak with Dead':{school:'Necromancy',ritual:false,components:'Verbal, Somatic, Material',duration:'10 minutes',full:`You briefly awaken the lingering awareness of a corpse and ask it questions. The body is not restored to life, but it can answer based on what it knew in life.

Speak with Dead is invaluable for investigation, uncovering secrets, and drawing useful information from the fallen.`},
  'Faerie Fire':{school:'Evocation',ritual:false,components:'Verbal',duration:'Concentration, up to 1 minute',full:`You bathe creatures in a soft magical glow, outlining them in visible light. Hidden or hard-to-track foes become easier to see and easier for allies to strike accurately.

Faerie Fire is especially strong when you need to reveal threats or swing accuracy in the party's favour.`},
  'Darkness':{school:'Evocation',ritual:false,components:'Verbal, Material',duration:'Concentration, up to 10 minutes',full:`You create a sphere of magical darkness that swallows ordinary sight. The area becomes heavily obscured, allowing you to hide movement, disrupt ranged attacks, or split the battlefield.

Used carefully, Darkness can be a powerful defensive and controlling tool rather than simple concealment.`}
};
function getSpellDetails(spell){
  // The bundled spell library is the source of truth. Legacy SPELL_META is
  // retained only as a fallback for custom spells that are not in the file.
  return Object.assign({school:'Unknown',ritual:false}, SPELL_META[spell.name]||{}, spell);
}
function getSpellSchoolLine(details){
  return details.school + (details.ritual ? ' • Ritual' : '');
}
function ensureSpellDialogs(){
  if(!document.getElementById('spellInfoDialog')){
    const dialog=document.createElement('dialog');
    dialog.id='spellInfoDialog';
    dialog.innerHTML='<div class="dialog-card spell-dialog-card"><button class="dialog-close" type="button" aria-label="Close">×</button><div class="spell-dialog-body"></div></div>';
    document.body.appendChild(dialog);
    dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
    dialog.addEventListener('click',e=>{if(e.target===dialog) dialog.close();});
  }
  if(!document.getElementById('spellCastDialog')){
    const dialog=document.createElement('dialog');
    dialog.id='spellCastDialog';
    dialog.innerHTML='<div class="dialog-card spell-dialog-card"><button class="dialog-close" type="button" aria-label="Close">×</button><div class="spell-dialog-body spell-cast-dialog-body"></div></div>';
    document.body.appendChild(dialog);
    dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
    dialog.addEventListener('click',e=>{if(e.target===dialog) dialog.close();});
  }
}
function syncSpellPopupLayout(dialog){
  if(!dialog)return;
  const thumb=dialog.querySelector('.spell-popup-thumb-tall');
  const lines=dialog.querySelector('.spell-popup-lines');
  const layout=dialog.querySelector('.spell-popup-layout');
  if(!thumb || !lines || !layout)return;
  const linesHeight=Math.max(120, Math.round(lines.getBoundingClientRect().height));
  const targetSize=Math.max(180, Math.round(linesHeight*2));
  thumb.style.width=targetSize+'px';
  thumb.style.height=targetSize+'px';
  layout.style.minHeight=Math.max(targetSize+8, linesHeight)+'px';
}

function normalizeSpellLibraryText(value){
  let text=String(value||'').replace(/\r\n?/g,'\n').trim();
  if(/(?:\b[A-Za-z0-9]\s){5,}/.test(text)){
    const marker='\uE000';
    text=text.replace(/\s{2,}/g,marker);
    let previous='';
    while(previous!==text){
      previous=text;
      text=text.replace(/([A-Za-z0-9]) ([A-Za-z0-9])/g,'$1$2');
    }
    text=text.replace(new RegExp(marker,'g'),' ');
  }
  return text.replace(/[ \t]+\n/g,'\n').replace(/\n[ \t]+/g,'\n').trim();
}
function spellParagraphsHtml(value){
  return normalizeSpellLibraryText(value).split(/\n\n+/).map(part=>part.trim()).filter(Boolean).map(part=>`<p>${escapeItemHtml(part).replace(/\n/g,'<br>')}</p>`).join('');
}
async function openSpellInfoDialog(spell,sectionLabel){
  ensureSpellDialogs();
  const dialog=document.getElementById('spellInfoDialog');
  const body=dialog.querySelector('.spell-dialog-body');
  let sourceSpell=spell||{};

  // Older saved imports may not contain the full description fields. Rehydrate
  // them from the bundled spell library before rendering the shared dialog.
  if(sourceSpell.libraryId || Number(sourceSpell.level)===0 || (!sourceSpell.description && sourceSpell.name)){
    const library=await loadSpellLibrary();
    const match=library.find(entry=>
      (sourceSpell.libraryId && entry.libraryId===sourceSpell.libraryId) ||
      (entry.name===sourceSpell.name && Number(entry.level)===Number(sourceSpell.level))
    );
    if(match) sourceSpell=Object.assign({},sourceSpell,match);
  }

  const details=getSpellDetails(sourceSpell);
  const levelText=details.level===0?'Cantrip':(typeof details.level==='number'?'Level '+details.level:details.level);
  const description=normalizeSpellLibraryText(details.description||'');
  const higherLevels=normalizeSpellLibraryText(details.higherLevels??details.higher_levels??'')
    .replace(/^\s*at higher levels\s*:\s*/i,'')
    .trim();
  const descriptionHtml=spellParagraphsHtml(description);

  const higherLevelsHtml=higherLevels?`<section class="spell-higher-levels"><h3>AT HIGHER LEVELS</h3>${spellParagraphsHtml(higherLevels)}</section>`:'';
  const accessText=spellAccessDisplay(details);
  body.innerHTML=`<div class="spell-popup-layout spell-popup-layout-no-art">
    <div class="spell-popup-lines">
      <div class="feature-dialog-kicker">${escapeItemHtml(sectionLabel||accessText||'SPELL')}</div>
      <h2>${escapeItemHtml(details.name)}</h2>
      <div class="spell-school-line">${escapeItemHtml(getSpellSchoolLine(details))}</div>
      <div class="spell-dialog-meta">${escapeItemHtml(levelText)} • ${escapeItemHtml(details.casting||'—')} • ${escapeItemHtml(details.range||'—')}</div>
      <div class="spell-dialog-meta">${escapeItemHtml(details.components||'—')} • ${escapeItemHtml(details.duration||'—')}</div>
    </div>
  </div><div class="spell-dialog-text"><section class="spell-description-section"><h3>DESCRIPTION</h3>${descriptionHtml}</section>${higherLevelsHtml}</div>`;
  syncSpellPopupLayout(dialog);
  if(!dialog.open) dialog.showModal();
}
function getSpellCastOptions(spell){
  const base=Number(spell.level);
  if(!Number.isFinite(base) || base===0) return [];
  const options=[];
  for(let lvl=base; lvl<=3; lvl++){
    if((state.spellSlots[lvl]||0)>0){
      options.push({kind:'spell',slotLevel:lvl,label:lvl===base?`Cast with Bard Magic (Level ${lvl})`:`Upcast with Bard Magic (Level ${lvl})`});
    }
  }
  if(base<=2 && state.pactSlots>0){
    options.push({kind:'pact',slotLevel:2,label:base<2?'Upcast with Pact Magic (Level 2)':'Cast with Pact Magic (Level 2)'});
  }
  return options;
}
function spendSpellCastOption(spell,option){
  if(option.kind==='pact') state.pactSlots=Math.max(0,state.pactSlots-1);
  if(option.kind==='spell') state.spellSlots[option.slotLevel]=Math.max(0,(state.spellSlots[option.slotLevel]||0)-1);
  const dialog=document.getElementById('spellCastDialog'); if(dialog && dialog.open) dialog.close();
  afterSpellStateChange(`${spell.name} cast using ${option.kind==='pact'?'Pact Magic':'Bard Magic'}${option.slotLevel?` (Level ${option.slotLevel})`:''}`);
}
function openSpellCastDialog(spell){
  const base=Number(spell.level);
  if(!Number.isFinite(base) || base===0){toast(`${spell.name} cast (cantrip)`);return;}
  const options=getSpellCastOptions(spell);
  if(!options.length){toast('No available spell slots for this spell');return;}
  ensureSpellDialogs();
  const dialog=document.getElementById('spellCastDialog');
  const body=dialog.querySelector('.spell-cast-dialog-body');
  const details=getSpellDetails(spell);
  const art=getSpellArt(details.name);
  body.innerHTML=`<div class="spell-popup-layout spell-popup-layout-cast">
    <div class="spell-popup-thumb spell-popup-thumb-tall"><img src="${art}" alt=""></div>
    <div class="spell-popup-lines">
      <div class="feature-dialog-kicker">Choose Casting Method</div>
      <h2>${details.name}</h2>
      <div class="spell-school-line">${getSpellSchoolLine(details)}</div>
      <div class="spell-dialog-meta">Level ${base} • ${details.casting} • ${details.range}</div>
      <div class="spell-dialog-meta">${details.components||'—'} • ${details.duration||'—'}</div>
    </div>
  </div><div class="spell-cast-options"></div>`;
  syncSpellPopupLayout(dialog);
  const wrap=body.querySelector('.spell-cast-options');
  options.forEach(option=>{const btn=el('button','gold-btn spell-cast-option',option.label);btn.type='button';btn.onclick=()=>spendSpellCastOption(spell,option);wrap.append(btn);});
  if(!dialog.open) dialog.showModal();
}
function castGrantedSpell(groupKey,spell){
  ensureSpellTrackingState();
  if(groupKey==='weapon'){
    if(state.spellTrackers.weapon[spell.name]){toast(`${spell.name} is already spent until a long rest`);return;}
    state.spellTrackers.weapon[spell.name]=true;
    afterSpellStateChange(`${spell.name} cast from weapon magic`);
    return;
  }
  if(groupKey==='race'){
    if(state.spellTrackers.race[spell.name]){toast(`${spell.name} is already spent until a long rest`);return;}
    state.spellTrackers.race[spell.name]=true;
    afterSpellStateChange(`${spell.name} cast from racial magic`);
    return;
  }
  if(groupKey==='ring'){
    const current=Number(state.spellTrackers.ring[spell.name] ?? spell.chargesMax ?? 0);
    if(current<1){toast(`${spell.name} has no charges remaining`);return;}
    state.spellTrackers.ring[spell.name]=current-1;
    afterSpellStateChange(`${spell.name} cast from the ring (${current-1}/${spell.chargesMax||5} charges remaining)`);
    return;
  }
  if(groupKey==='scroll'){
    state.spellTrackers.scroll[spell.name]=!state.spellTrackers.scroll[spell.name];
    afterSpellStateChange(`${spell.name} ${state.spellTrackers.scroll[spell.name]?'marked used':'marked ready'}`);
  }
}
function getGrantedSpellState(groupKey,spell){
  ensureSpellTrackingState();
  if(groupKey==='weapon') return {spent:Boolean(state.spellTrackers.weapon[spell.name]),mode:'binary'};
  if(groupKey==='race') return {spent:Boolean(state.spellTrackers.race[spell.name]),mode:'binary'};
  if(groupKey==='ring') return {spent:Number(state.spellTrackers.ring[spell.name] ?? 0)===0,mode:'charges',current:Number(state.spellTrackers.ring[spell.name] ?? 0),max:spell.chargesMax||5};
  if(groupKey==='scroll') return {spent:Boolean((state.spellTrackers.scroll||{})[spell.name]),mode:'binary'};
  return {spent:false,mode:'none'};
}
function setRingCharges(spellName,value,max=5){
  ensureSpellTrackingState();
  state.spellTrackers.ring[spellName]=Math.max(0,Math.min(max,Number(value)||0));
  afterSpellStateChange(`${spellName} charges set to ${state.spellTrackers.ring[spellName]} / ${max}`);
}

let spellLibraryCache=null;
let spellImporterState={search:'',classNames:new Set(),levels:new Set(),level:'all',school:'all',special:'all',sort:'name-asc',selected:new Set(),mode:'all'};
function spellComponentsText(components={}){
  const parts=[];
  if(components.verbal)parts.push('V');
  if(components.somatic)parts.push('S');
  if(components.material)parts.push(components.material_description?`M (${components.material_description})`:'M');
  return parts.join(', ')||'—';
}
function normalizeImportedSpell(raw){
  const classes=Array.isArray(raw.classes)?raw.classes.map(String):[];
  const subclassAccess=Array.isArray(raw.subclass_access)?raw.subclass_access.filter(Boolean).map(entry=>({
    class:String(entry.class||''),subclass:String(entry.subclass||''),source:String(entry.source||''),
    subclassOptions:Array.isArray(entry.subclass_options)?entry.subclass_options.map(String):[]
  })).filter(entry=>entry.class&&entry.subclass):[];
  const level=Math.max(0,Math.min(9,Number(raw.level)||0));
  const source=classes.includes('Bard')?'Bard':classes.includes('Warlock')?'Warlock':(classes[0]||subclassAccess[0]?.class||'Imported');
  const subclassLabels=subclassAccess.map(entry=>`${entry.class} — ${entry.subclass}${entry.subclassOptions.length?` (${entry.subclassOptions.join(', ')})`:''}`);
  const accessLabels=[...classes,...subclassLabels];
  return {
    name:String(raw.name||'Unnamed Spell'),level,school:String(raw.school||'Unknown'),casting:String(raw.casting_time||raw.casting||'—'),
    range:String(raw.range||'—'),components:spellComponentsText(raw.components),duration:String(raw.duration||'—'),
    concentration:Boolean(raw.concentration),ritual:Boolean(raw.ritual),classes,subclassAccess,accessLabels,
    source,theme:classes.includes('Warlock')?'warlock':classes.includes('Bard')?'bard':'drow',
    desc:String(raw.Breif||raw.brief||raw.description||''),brief:String(raw.Breif||raw.brief||raw.description||''),
    description:normalizeSpellLibraryText(raw.description||''),higherLevels:normalizeSpellLibraryText(raw.higher_levels||''),
    full:[normalizeSpellLibraryText(raw.description||''),normalizeSpellLibraryText(raw.higher_levels||'')].filter(Boolean).join('\n\n'),libraryId:`${String(raw.name||'').toLowerCase()}::${level}::${String(raw.source||'')}`,bookSource:String(raw.source||'Unknown')
  };
}
function spellMatchesAccessFilter(spell,filterValue){
  if(filterValue.startsWith('class:')){
    const className=filterValue.slice(6);
    return spell.classes.includes(className)||spell.subclassAccess.some(entry=>entry.class===className);
  }
  if(filterValue.startsWith('subclass:')){
    const key=filterValue.slice(9);
    return spell.subclassAccess.some(entry=>`${entry.class}::${entry.subclass}`===key);
  }
  return false;
}
function spellAccessDisplay(spell){
  return (spell.accessLabels&&spell.accessLabels.length?spell.accessLabels:spell.classes).join(', ')||'—';
}
async function loadSpellLibrary(){
  if(spellLibraryCache)return spellLibraryCache;
  try{
    const response=await fetch('assets/spells-all.json',{cache:'no-store'});
    if(!response.ok)throw new Error('Unable to load spell library');
    const data=await response.json();
    spellLibraryCache=(Array.isArray(data)?data:[]).map(normalizeImportedSpell);
  }catch(error){console.error(error);spellLibraryCache=[];}
  return spellLibraryCache;
}
function getImportedSpellNames(){return new Set((state.importedSpells||[]).map(spell=>spell.name));}
function getDisplayedSpellPageSpells(){
  const seen=new Set();
  return [...spellPageSpells,...(state.importedSpells||[])].filter(spell=>{const key=spell.name.toLowerCase();if(seen.has(key))return false;seen.add(key);return true;});
}
function ensureSpellImporterDialog(){
  let dialog=document.getElementById('spellImporterDialog');
  if(dialog)return dialog;
  dialog=document.createElement('dialog');dialog.id='spellImporterDialog';
  dialog.innerHTML='<div class="dialog-card item-importer-card spell-importer-card"><button class="dialog-close" type="button" aria-label="Close">×</button><div class="spell-importer-body"><div class="item-importer-loading">Loading spell library…</div></div></div>';
  document.body.appendChild(dialog);dialog.querySelector('.dialog-close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});return dialog;
}
function spellMatchesCastingType(spell,type){
  const casting=String(spell.casting||'').toLowerCase();
  if(type==='reaction')return casting.includes('reaction');
  if(type==='bonus-action')return casting.includes('bonus action');
  if(type==='action')return casting.includes('action')&&!casting.includes('bonus action')&&!casting.includes('reaction');
  return true;
}
function filterSpellLibrary(spells,mode){
  const q=spellImporterState.search.trim().toLowerCase();
  let list=spells.filter(spell=>{
    if(mode==='prep' && !(spell.classes.includes('Bard')&&spell.level>=1&&spell.level<=3))return false;
    if(q&&!`${spell.name} ${spell.school} ${spell.classes.join(' ')} ${(spell.accessLabels||[]).join(' ')} ${spell.bookSource} ${spell.desc}`.toLowerCase().includes(q))return false;
    if(mode!=='prep'&&spellImporterState.classNames.size&&![...spellImporterState.classNames].some(filterValue=>spellMatchesAccessFilter(spell,filterValue)))return false;
    if(mode!=='prep'&&spellImporterState.levels.size&&!spellImporterState.levels.has(spell.level))return false;
    if(mode==='prep'&&spellImporterState.level!=='all'&&spell.level!==Number(spellImporterState.level))return false;
    if(spellImporterState.school!=='all'&&spell.school!==spellImporterState.school)return false;
    if(spellImporterState.special==='ritual'&&!spell.ritual)return false;
    if(spellImporterState.special==='concentration'&&!spell.concentration)return false;
    if(['action','bonus-action','reaction'].includes(spellImporterState.special)&&!spellMatchesCastingType(spell,spellImporterState.special))return false;
    return true;
  });
  const sort=spellImporterState.sort;
  list.sort((a,b)=>sort==='name-desc'?b.name.localeCompare(a.name):sort==='level-asc'?(a.level-b.level||a.name.localeCompare(b.name)):sort==='level-desc'?(b.level-a.level||a.name.localeCompare(b.name)):sort==='school'?a.school.localeCompare(b.school)||a.name.localeCompare(b.name):sort==='class'?spellAccessDisplay(a).localeCompare(spellAccessDisplay(b))||a.name.localeCompare(b.name):a.name.localeCompare(b.name));
  return list;
}
function renderSpellImporterResults(spells,dialog,mode){
  const body=dialog.querySelector('.spell-importer-body'),results=body.querySelector('.spell-library-results');if(!results)return;
  const filtered=filterSpellLibrary(spells,mode),imported=getImportedSpellNames(),prepared=new Set(state.preparedBardSpells||[]),scrollTop=results.scrollTop;results.innerHTML='';
  filtered.forEach(spell=>{
    const alreadyImported=imported.has(spell.name)||spellPageSpells.some(existing=>existing.name===spell.name);
    const active=mode==='prep'?spellImporterState.selected.has(spell.name):alreadyImported||spellImporterState.selected.has(spell.libraryId);
    const row=el('div',`spell-library-row ${active?'selected':''} ${mode!=='prep'&&alreadyImported?'already-imported':''}`,`<input type="checkbox" ${active?'checked':''} ${mode!=='prep'&&alreadyImported?'disabled':''} aria-label="Select ${escapeItemHtml(spell.name)}"><button type="button" class="spell-library-name"><strong>${escapeItemHtml(spell.name)}</strong>${prepared.has(spell.name)?'<em>PREPARED</em>':''}</button><span>${spell.level===0?'Cantrip':'Level '+spell.level}</span><span>${escapeItemHtml(spell.school)}</span><span class="spell-ritual-cell ${spell.ritual?'is-ritual':''}">${spell.ritual?'YES':'—'}</span><span class="spell-access-cell">${escapeItemHtml(spellAccessDisplay(spell))}</span><span>${escapeItemHtml(spell.casting)}</span><span class="spell-library-brief">${escapeItemHtml(spell.brief||spell.desc||'')}</span>`);
    const checkbox=row.querySelector('input');
    const toggle=()=>{
      if(mode==='prep'){
        if(spellImporterState.selected.has(spell.name))spellImporterState.selected.delete(spell.name);else if(spellImporterState.selected.size<10)spellImporterState.selected.add(spell.name);else{toast('You can prepare a maximum of 10 Bard spells');return;}
      }else{
        if(alreadyImported){renderSpellImporterResults(spells,dialog,mode);return;}
        if(spellImporterState.selected.has(spell.libraryId))spellImporterState.selected.delete(spell.libraryId);else spellImporterState.selected.add(spell.libraryId);
      }
      renderSpellImporterResults(spells,dialog,mode);renderSpellImporterActions(spells,dialog,mode);
    };
    checkbox.onclick=e=>e.stopPropagation();checkbox.onchange=toggle;row.onclick=e=>{if(e.target.closest('.spell-library-name')||e.target===checkbox)return;toggle();};row.querySelector('.spell-library-name').onclick=e=>{e.stopPropagation();openSpellInfoDialog(spell,spellAccessDisplay(spell)||'IMPORTED SPELL');};results.append(row);
  });results.scrollTop=scrollTop;const count=body.querySelector('[data-spell-result-count]');if(count)count.textContent=`${filtered.length.toLocaleString()} results`;
}
function renderSpellImporterActions(spells,dialog,mode){
  const body=dialog.querySelector('.spell-importer-body'),button=body.querySelector('[data-spell-import]');if(!button)return;
  if(mode==='prep'){button.disabled=spellImporterState.selected.size>10;button.textContent=`SAVE PREPARED (${spellImporterState.selected.size} / 10)`;}
  else{button.disabled=spellImporterState.selected.size===0;button.textContent=spellImporterState.selected.size?`IMPORT SELECTED (${spellImporterState.selected.size})`:'IMPORT SELECTED';}
}
function spellMultiFilterMarkup(kind,label,options,formatter=value=>value){
  return `<details class="spell-multi-filter" data-spell-multi="${kind}"><summary>${label}</summary><div class="spell-multi-menu">${options.map(value=>`<label><input type="checkbox" value="${escapeItemHtml(String(value))}"><span>${escapeItemHtml(formatter(value))}</span></label>`).join('')}</div></details>`;
}
function updateSpellMultiSummary(details,label,selected,formatter=value=>value){
  const summary=details.querySelector('summary');
  if(!summary)return;
  if(!selected.size){summary.textContent=label;return;}
  const values=[...selected];
  summary.textContent=values.length<=2?values.map(formatter).join(', '):`${values.length} selected`;
}
function renderSpellImporter(spells,dialog,mode){
  const body=dialog.querySelector('.spell-importer-body');
  const baseClasses=[...new Set(spells.flatMap(s=>[...s.classes,...s.subclassAccess.map(entry=>entry.class)]))].sort();
  const subclassOptions=[...new Map(spells.flatMap(s=>s.subclassAccess.map(entry=>[`${entry.class}::${entry.subclass}`,{value:`subclass:${entry.class}::${entry.subclass}`,label:`${entry.class} — ${entry.subclass}`}]))).values()].sort((a,b)=>a.label.localeCompare(b.label));
  const accessOptions=[...baseClasses.map(name=>({value:`class:${name}`,label:name})),...subclassOptions];
  const schools=[...new Set(spells.map(s=>s.school))].sort();
  const levelOptions=Array.from({length:10},(_,i)=>i);
  const classControl=mode==='prep'?'':spellMultiFilterMarkup('classes','All classes & subclasses',accessOptions.map(option=>option.value),value=>accessOptions.find(option=>option.value===value)?.label||value);
  const levelControl=mode==='prep'?`<select class="field" data-spell-level><option value="all">All levels</option>${[1,2,3].map(i=>`<option value="${i}">Level ${i}</option>`).join('')}</select>`:spellMultiFilterMarkup('levels','All levels',levelOptions,value=>value===0?'Cantrip':`Level ${value}`);
  body.innerHTML=`<div class="spell-importer-heading"><h2>${mode==='prep'?'PREPARE BARD SPELLS':'SPELL IMPORTER'}</h2><span>${mode==='prep'?'Choose up to 10 Bard spells of levels 1–3. Cantrips do not count.':'Import spells from the bundled spell library.'}</span></div><div class="spell-importer-controls ${mode==='prep'?'prep-controls':''}"><input class="field" data-spell-search placeholder="Search spells…">${classControl}${levelControl}<select class="field" data-spell-school><option value="all">All schools</option>${schools.map(v=>`<option>${escapeItemHtml(v)}</option>`).join('')}</select><select class="field" data-spell-special><option value="all">All spell types</option><option value="action">Action</option><option value="bonus-action">Bonus Action</option><option value="reaction">Reaction</option><option value="ritual">Ritual</option><option value="concentration">Concentration</option></select><select class="field" data-spell-sort><option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option><option value="level-asc">Level low–high</option><option value="level-desc">Level high–low</option><option value="school">School</option><option value="class">Class</option></select></div><div class="item-importer-actions spell-importer-actions"><button class="purple-btn" data-spell-clear>CLEAR SELECTION</button><button class="gold-btn" data-spell-import>${mode==='prep'?'SAVE PREPARED':'IMPORT SELECTED'}</button><span data-spell-result-count></span></div><div class="spell-library-table"><div class="spell-library-header"><span></span><span>Name</span><span>Level</span><span>School</span><span>Ritual</span><span>Classes / Subclasses</span><span>Casting</span><span>Brief</span></div><div class="spell-library-results"></div></div>`;
  const rerender=()=>renderSpellImporterResults(spells,dialog,mode);
  const search=body.querySelector('[data-spell-search]');search.value=spellImporterState.search;search.oninput=e=>{spellImporterState.search=e.target.value;rerender();};
  const school=body.querySelector('[data-spell-school]');school.value=spellImporterState.school;school.onchange=e=>{spellImporterState.school=e.target.value;rerender();};
  const special=body.querySelector('[data-spell-special]');special.value=spellImporterState.special;special.onchange=e=>{spellImporterState.special=e.target.value;rerender();};
  const sort=body.querySelector('[data-spell-sort]');sort.value=spellImporterState.sort;sort.onchange=e=>{spellImporterState.sort=e.target.value;rerender();};
  if(mode==='prep'){
    const level=body.querySelector('[data-spell-level]');level.value=spellImporterState.level;level.onchange=e=>{spellImporterState.level=e.target.value;rerender();};
  }else{
    const classDetails=body.querySelector('[data-spell-multi="classes"]');
    classDetails.querySelectorAll('input').forEach(input=>{input.checked=spellImporterState.classNames.has(input.value);input.onchange=()=>{input.checked?spellImporterState.classNames.add(input.value):spellImporterState.classNames.delete(input.value);updateSpellMultiSummary(classDetails,'All classes & subclasses',spellImporterState.classNames,value=>accessOptions.find(option=>option.value===value)?.label||value);rerender();};});
    updateSpellMultiSummary(classDetails,'All classes & subclasses',spellImporterState.classNames,value=>accessOptions.find(option=>option.value===value)?.label||value);
    const levelDetails=body.querySelector('[data-spell-multi="levels"]');
    levelDetails.querySelectorAll('input').forEach(input=>{const value=Number(input.value);input.checked=spellImporterState.levels.has(value);input.onchange=()=>{input.checked?spellImporterState.levels.add(value):spellImporterState.levels.delete(value);updateSpellMultiSummary(levelDetails,'All levels',spellImporterState.levels,value=>value===0?'Cantrip':`Level ${value}`);rerender();};});
    updateSpellMultiSummary(levelDetails,'All levels',spellImporterState.levels,value=>value===0?'Cantrip':`Level ${value}`);
  }
  body.querySelector('[data-spell-clear]').onclick=()=>{spellImporterState.selected.clear();rerender();renderSpellImporterActions(spells,dialog,mode);};
  body.querySelector('[data-spell-import]').onclick=()=>{
    if(mode==='prep'){
      state.preparedBardSpells=[...spellImporterState.selected];const byName=new Map(spells.map(s=>[s.name,s]));state.preparedBardSpells.forEach(name=>{if(!state.importedSpells.some(s=>s.name===name)&&!spellPageSpells.some(s=>s.name===name)){const spell=byName.get(name);if(spell)state.importedSpells.push(spell);}});save();dialog.close();renderSpells();toast(`${state.preparedBardSpells.length} Bard spells prepared`);
    }else{
      const selected=spells.filter(s=>spellImporterState.selected.has(s.libraryId));let added=0;selected.forEach(spell=>{if(!state.importedSpells.some(s=>s.name===spell.name)&&!spellPageSpells.some(s=>s.name===spell.name)){state.importedSpells.push(spell);added++;}});spellImporterState.selected.clear();save();dialog.close();renderSpells();toast(`${added} spell${added===1?'':'s'} imported`);
    }
  };
  renderSpellImporterResults(spells,dialog,mode);renderSpellImporterActions(spells,dialog,mode);
}
async function openSpellImporter(mode='all'){
  ensureSpellTrackingState();const dialog=ensureSpellImporterDialog();const body=dialog.querySelector('.spell-importer-body');body.innerHTML='<div class="item-importer-loading">Loading spell library…</div>';if(!dialog.open)dialog.showModal();
  const spells=await loadSpellLibrary();if(!spells.length){body.innerHTML='<div class="item-importer-loading">No spells could be loaded. Launch the sheet through Launch.bat.</div>';return;}
  spellImporterState={search:'',classNames:new Set(),levels:new Set(),level:'all',school:'all',special:'all',sort:mode==='prep'?'level-asc':'name-asc',selected:new Set(mode==='prep'?(state.preparedBardSpells||[]):[]),mode};renderSpellImporter(spells,dialog,mode);
}

function renderSpells(){
  ensureSpellTrackingState();
  const p=$('#spells');
  const attackBonus=9;
  const displayedSpells=getDisplayedSpellPageSpells();
  const levels=[...new Set(displayedSpells.map(s=>Number(s.level)).filter(Number.isFinite))].sort((a,b)=>a-b);
  const groups=levels.map(level=>[level===0?'Cantrip':'Level '+level,level]);
  p.innerHTML=`<section class="panel content-card spells-page-panel custom-spells-page">
    <div class="spells-top-grid compact-four">
      <button class="spell-top-card" data-kind="attack">${icon('attack','strip-icon')}<div><span>ATTACK ROLL</span><strong>+${attackBonus}</strong></div></button>
      <button class="spell-top-card" data-kind="spell">${icon('spell_attack','strip-icon')}<div><span>SPELL ATTACK</span><strong>+${state.spellAttack}</strong></div></button>
      <button class="spell-top-card" data-kind="save">${icon('spell_save_dc','strip-icon')}<div><span>SAVE DC</span><strong>${state.saveDC}</strong></div></button>
      <div class="slot-summary-host"><div class="slot-card-mount"></div><div class="spell-manager-buttons"><button type="button" class="gold-btn" data-open-spells>Spells</button><button type="button" class="purple-btn" data-open-prep>Prep</button></div></div>
    </div>
    <section class="spell-groups-wrap"></section>
  </section>`;
  p.querySelector('[data-kind="attack"]').onclick=()=>roll('Attack Roll','1d20',attackBonus);
  p.querySelector('[data-kind="spell"]').onclick=()=>roll('Spell Attack','1d20',state.spellAttack);
  p.querySelector('[data-kind="save"]').onclick=()=>toast(`Spell Save DC ${state.saveDC}`);
  p.querySelector('.slot-card-mount').append(buildSpellSlotsSummaryCard());
  p.querySelector('[data-open-spells]').onclick=()=>openSpellImporter('all');
  p.querySelector('[data-open-prep]').onclick=()=>openSpellImporter('prep');
  const wrap=p.querySelector('.spell-groups-wrap');
  const buildSpellCard=(s,levelText,theme=s.theme,groupKey='standard')=>{
    const details=getSpellDetails(s);
    const article=el('article',`spell-card compact-spell-card theme-${theme}`,'');
    const grantedState=groupKey==='standard'?{spent:false,mode:'none'}:getGrantedSpellState(groupKey,s);
    if(grantedState.spent) article.classList.add('spent');
    article.innerHTML=`<button class="spell-card-art compact-spell-art spell-cast-art" type="button"><img src="${getSpellArt(details.name)}" alt="${details.name}" onerror="this.onerror=null;this.src='assets/spell_placeholder_all.png'"></button><div class="compact-spell-copy"><h3>${details.name}</h3><div class="compact-spell-meta">${levelText} <span>•</span> ${details.casting} <span>•</span> ${details.range}</div><p class="compact-spell-brief">${escapeItemHtml(details.brief||details.desc||'')}</p></div>`;
    article.onclick=()=>openSpellInfoDialog(s,groupKey==='standard'?(s.source||levelText):groupKey.toUpperCase()+' MAGIC');
    const castButton=article.querySelector('.spell-cast-art');
    if(groupKey==='scroll') castButton.onclick=(event)=>{event.stopPropagation();castGrantedSpell(groupKey,s);};
    else castButton.onclick=(event)=>{event.stopPropagation();groupKey==='standard'?openSpellCastDialog(s):castGrantedSpell(groupKey,s);};
    if(groupKey==='ring'){
      const tracker=getGrantedSpellState(groupKey,s);
      const chargeRow=el('div','ring-charge-row','');
      const pips=el('div','ring-charge-pips','');
      for(let i=0;i<tracker.max;i++){
        const pip=el('button',`ring-charge-pip ${i<tracker.current?'filled':''}`,'');
        pip.type='button';
        pip.title=`Set charges to ${i+1}`;
        pip.onclick=(event)=>{event.stopPropagation();setRingCharges(s.name,i+1,tracker.max);};
        pips.append(pip);
      }
      const zeroBtn=el('button','ring-charge-reset','0'); zeroBtn.type='button'; zeroBtn.title='Set charges to 0'; zeroBtn.onclick=(event)=>{event.stopPropagation();setRingCharges(s.name,0,tracker.max);};
      chargeRow.append(pips,zeroBtn);
      article.querySelector('.compact-spell-copy').append(chargeRow);
    }
    return article;
  };
  groups.forEach(([label,level])=>{
    const section=el('section','spell-level-group','');
    section.append(createLevelHeaderElement(label,level));
    const grid=el('div','spell-cards-grid spell-cards-grid-themed compact-spell-grid','');
    displayedSpells.filter(s=>Number(s.level)===level).forEach(s=>grid.append(buildSpellCard(s,level===0?'Cantrip':'Level '+level,s.theme||'drow','standard')));
    section.append(grid);
    wrap.append(section);
  });
  grantedSpellGroups.forEach(group=>{
    const section=el('section','spell-level-group granted-spell-group','');
    section.innerHTML=`<div class="section-mini-title granted-title">${group.title}</div><div class="spell-cards-grid spell-cards-grid-themed compact-spell-grid"></div>`;
    const grid=section.querySelector('.spell-cards-grid');
    group.spells.forEach(s=>grid.append(buildSpellCard(s,s.level,group.theme,group.key)));
    wrap.append(section);
  });
}
function renderFeatures(){
  const bardItems=['Bardic Inspiration','Jack of All Trades','Bard College','Song of Rest','Expertise','Font of Inspiration'];
  const eloquenceItems=['Silver Tongue','Unsettling Words'];
  if(state.character?.bardLevel>=6){
    bardItems.push('Countercharm');
    eloquenceItems.push('Unfailing Inspiration','Universal Speech');
  }
  const featureSections=[
    {title:'Bard',items:bardItems},
    {title:'College of Eloquence',items:eloquenceItems},
    {title:'Warlock',items:['Otherworldly Patron','Pact Magic','Eldritch Invocations','Pact Boon','Pact of the Chain']},
    {title:'Undead Patron',items:['Expanded Spell List','Form of Dread']},
    {title:'Eldritch Invocations',items:['Agonizing Blast','Mask of Many Faces','Investment of the Chain Master']},
    {title:'Half-Elf-Drow',items:['Darkvision','Fey Ancestry','Drow Magic']}
  ];
  const p=$('#features');
  p.innerHTML=`<section class="panel content-card features-page-panel"><div class="features-page-top"><h1 class="panel-title">FEATURES & TRAITS</h1></div><div class="features-sections feature-sections-rows"></div></section>`;
  const wrap=p.querySelector('.features-sections');
  featureSections.forEach(sectionData=>{
    const section=el('section','feature-section feature-row-section','');
    section.innerHTML=`<div class="feature-section-header">${sectionData.title}</div><div class="feature-grid feature-grid-three"></div>`;
    const grid=section.querySelector('.feature-grid');
    sectionData.items.forEach(name=>{
      const card=el('button','feature-entry-card feature-entry-button',`<div class="feature-entry-art"><img src="${featureIconMap[name]||'assets/feature_placeholder.png'}" alt=""></div><div class="feature-entry-text"><h3>${name}</h3><p>${sectionData.title}</p></div>`);
      card.type='button';
      card.onclick=()=>openFeatureDialog(name,sectionData.title);
      grid.append(card);
    });
    wrap.append(section);
  });
}
const skillIconMap={
  'Acrobatics':'assets/acrobatics.png',
  'Animal Handling':'assets/animal_handling.png',
  'Arcana':'assets/arcana.png',
  'Athletics':'assets/athletics.png',
  'Deception':'assets/deception.png',
  'History':'assets/history.png',
  'Insight':'assets/insight.png',
  'Intimidation':'assets/intimidation.png',
  'Investigation':'assets/investigation.png',
  'Medicine':'assets/medicine.png',
  'Nature':'assets/nature.png',
  'Perception':'assets/perception.png',
  'Performance':'assets/performance.png',
  'Persuasion':'assets/persuasion.png',
  'Religion':'assets/religion.png',
  'Sleight of Hand':'assets/sleight_of_hand.png',
  'Stealth':'assets/stealth.png',
  'Survival':'assets/survival.png',
  'Fractured Mind':'assets/fractured_mind.png'
};

const featureIconMap={
  'Bardic Inspiration':'assets/bardic_inspiration_feature.png',
  'Jack of All Trades':'assets/jack_of_all_trades_feature.png',
  'Bard College':'assets/bard_college_feature.png',
  'Song of Rest':'assets/song_of_rest_feature.png',
  'Expertise':'assets/expertise_feature.png',
  'Font of Inspiration':'assets/font_of_inspiration_feature.png',
  'Silver Tongue':'assets/silver_tongue_feature.png',
  'Unsettling Words':'assets/unsettling_words_feature.png',
  'Otherworldly Patron':'assets/otherworldly_patron_feature.png',
  'Pact Magic':'assets/pact_magic_feature.png',
  'Eldritch Invocations':'assets/eldritch_invocations_feature.png',
  'Pact Boon':'assets/pact_boon_feature.png',
  'Pact of the Chain':'assets/pact_of_the_chain_feature.png',
  'Expanded Spell List':'assets/expanded_spell_list_feature.png',
  'Form of Dread':'assets/form_of_dread_feature.png',
  'Agonizing Blast':'assets/agonizing_blast_feature.png',
  'Mask of Many Faces':'assets/mask_of_many_faces_feature.png',
  'Investment of the Chain Master':'assets/investment_of_the_chain_master_feature.png',
  'Darkvision':'assets/darkvision_feature.png',
  'Fey Ancestry':'assets/fey_ancestry_feature.png',
  'Drow Magic':'assets/drow_magic_feature.png',
  'Countercharm':'assets/bardic_inspiration_feature.png',
  'Unfailing Inspiration':'assets/unsettling_words_feature.png',
  'Universal Speech':'assets/silver_tongue_feature.png'
};
const featureDescriptionMap={
  'Bardic Inspiration':`You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6.

Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.

You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest.

Your Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level.`,
  'Jack of All Trades':`Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus.`,
  'Bard College':`At 3rd level, you delve into the advanced techniques of a bard college of your choice from the list of available colleges. Your choice grants you features at 3rd level and again at 6th and 14th level.`,
  'Song of Rest':`Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points by spending Hit Dice at the end of the short rest, each of those creatures regains an extra 1d6 hit points.

The extra hit points increase when you reach certain levels in this class: to 1d8 at 9th level, to 1d10 at 13th level, and to 1d12 at 17th level.`,
  'Expertise':`At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.

At 10th level, you can choose another two skill proficiencies to gain this benefit.`,
  'Font of Inspiration':`Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.`,
  'Silver Tongue':`You are a master at saying the right thing at the right time. When you make a Charisma (Persuasion) or Charisma (Deception) check, you can treat a d20 roll of 9 or lower as a 10.`,
  'Unsettling Words':`You can spin words laced with magic that unsettle a creature and cause it to doubt itself. As a bonus action, you can expend one use of your Bardic Inspiration and choose one creature you can see within 60 feet of you. Roll the Bardic Inspiration die. The creature must subtract the number rolled from the next saving throw it makes before the start of your next turn.`,
  'Otherworldly Patron':`You have struck a bargain with an otherworldly being. Your chosen patron grants you additional features at 1st, 6th, 10th, and 14th level. Your patron is The Undead, a deathless being that has escaped the natural cycle of life and death.`,
  'Pact Magic':`Your patron grants you the ability to cast warlock spells using Charisma as your spellcasting ability. All your warlock spell slots are the same level, and you regain every expended spell slot when you finish a short or long rest.`,
  'Eldritch Invocations':`You have uncovered fragments of forbidden occult knowledge that grant you permanent magical abilities. You can select invocations for which you meet the prerequisites and replace one whenever you gain a warlock level.`,
  'Pact Boon':`At 3rd level, your patron rewards your loyal service with a supernatural gift. You have chosen the Pact of the Chain.`,
  'Pact of the Chain':`You learn the find familiar spell and can cast it as a ritual without it counting against your spells known. Your familiar can take a normal form or the form of an imp, pseudodragon, quasit, or sprite. When you take the Attack action, you can forgo one attack to allow your familiar to use its reaction to make an attack.`,
  'Expanded Spell List':`Your Undead patron adds additional spells to the warlock spell list for you:

1st level: bane, false life
2nd level: blindness/deafness, phantasmal force
3rd level: phantom steed, speak with dead
4th level: death ward, greater invisibility
5th level: antilife shell, cloudkill`,
  'Form of Dread':`As a bonus action, you transform into a frightening aspect of your patron for 1 minute. You gain temporary hit points equal to 1d10 + your warlock level, become immune to the frightened condition, and once during each of your turns when you hit a creature with an attack, you can force it to make a Wisdom saving throw or become frightened of you until the end of your next turn. You can transform a number of times equal to your proficiency bonus and regain all uses after a long rest.`,
  'Agonizing Blast':`Prerequisite: eldritch blast cantrip

When you cast eldritch blast, add your Charisma modifier to the damage it deals on a hit.`,
  'Mask of Many Faces':`You can cast disguise self at will, without expending a spell slot.`,
  'Investment of the Chain Master':`Prerequisite: Pact of the Chain

When you cast find familiar, you infuse the summoned familiar with a measure of your eldritch power, granting the creature the following benefits:

• The familiar gains either a flying speed or a swimming speed (your choice) of 40 feet.
• As a bonus action, you can command the familiar to take the Attack action.
• The familiar's weapon attacks are considered magical for the purpose of overcoming immunity and resistance to nonmagical attacks.
• If the familiar forces a creature to make a saving throw, it uses your spell save DC.
• When the familiar takes damage, you can use your reaction to grant it resistance against that damage.`,
  'Darkvision':`Thanks to your elf blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.`,
  'Fey Ancestry':`You have advantage on saving throws against being charmed, and magic can't put you to sleep.`,
  'Drow Magic':`You know the dancing lights cantrip. When you reach 3rd level, you can cast the faerie fire spell once per day; you must finish a long rest in order to cast the spell again using this trait. When you reach 5th level, you can also cast the darkness spell once per day; you must finish a long rest in order to cast the spell again using this trait. Charisma is your spellcasting ability for these spells.`,
  'Countercharm':`At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed. A creature must be able to hear you to gain this benefit. The performance ends early if you are incapacitated or silenced or if you voluntarily end it (no action required).`,
  'Unfailing Inspiration':`Your inspiring words are so persuasive that others feel driven to succeed. When a creature adds one of your Bardic Inspiration dice to its ability check, attack roll, or saving throw and the roll fails, the creature can keep the Bardic Inspiration die.`,
  'Universal Speech':`You have gained the ability to make your speech intelligible to any creature. As an action, choose one or more creatures within 60 feet of you, up to a number equal to your Charisma modifier (minimum of one creature). The chosen creatures can magically understand you, regardless of the language you speak, for 1 hour.

Once you use this feature, you can't use it again until you finish a long rest, unless you expend a spell slot to use it again.`
};
function openFeatureDialog(name,section){
  let dialog=document.getElementById('featureDialog');
  if(!dialog){
    dialog=document.createElement('dialog');
    dialog.id='featureDialog';
    dialog.innerHTML='<div class="dialog-card feature-dialog-card"><button class="dialog-close" aria-label="Close">×</button><div class="feature-dialog-body"></div></div>';
    document.body.appendChild(dialog);
    dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
    dialog.addEventListener('click',e=>{if(e.target===dialog) dialog.close();});
  }
  const body=dialog.querySelector('.feature-dialog-body');
  body.innerHTML=`<div class="feature-dialog-head"><div class="feature-dialog-art"><img src="${featureIconMap[name]||'assets/feature_placeholder.png'}" alt=""></div><div class="feature-dialog-copy"><div class="feature-dialog-kicker">${section}</div><h2>${name}</h2></div></div><div class="feature-dialog-description"></div>`;
  body.querySelector('.feature-dialog-description').textContent=featureDescriptionMap[name]||'Feature description coming soon.';
  if(!dialog.open) dialog.showModal();
}

function ensureSkillsState(){if(!Array.isArray(state.skills)) state.skills=structuredClone(defaults.skills);if(!state.skills.some(([n])=>n==='Fractured Mind')) state.skills.push(['Fractured Mind',9,'Unknown',false]);}
ensureSkillsState();
function renderSkills(){
  const p=$('#skills');
  const nonFractured=state.skills.filter(([n])=>n!=='Fractured Mind').sort((a,b)=>a[0].localeCompare(b[0]));
  const fractured=state.skills.find(([n])=>n==='Fractured Mind');
  const sortedSkills=fractured?[...nonFractured,fractured]:nonFractured;
  const proficientCount=sortedSkills.filter(([, , ,prof])=>prof).length;
  p.innerHTML=`<section class="panel content-card skills-page-panel skills-page-panel-three"><div class="skills-page-top skills-page-top-compact"><h1 class="panel-title">SKILLS</h1><div class="skills-page-pills"><span>${sortedSkills.length} Skills</span><span>${proficientCount} Proficient</span></div></div><div class="skills-card-grid all-skills-grid"></div></section>`;
  const grid=p.querySelector('.all-skills-grid');
  sortedSkills.forEach(([n,b,a,prof])=>{
    const isExpertise=(n==='Deception'||n==='Persuasion');
    const card=el('button',`skill-card compact alpha-layout ${isExpertise?'expertise':(prof?'proficient':'')}`,'');
    card.type='button';
    card.innerHTML=`<div class="skill-card-art compact alpha-art"><img src="${skillIconMap[n]||'assets/skill-placeholder.png'}" alt="${n}"></div><div class="skill-card-body"><div class="skill-card-top"><h3>${n}</h3><span class="skill-bonus-wrap"><span class="skill-bonus">${b>=0?'+':''}${b}</span>${isExpertise?'<small class="skill-minimum">Min 10</small>':''}</span></div><div class="skill-card-meta"><span class="skill-ability">${a}</span>${isExpertise?'<span class="skill-prof expertise-pill">Expertise</span>':(prof?'<span class="skill-prof">Proficient</span>':'')}</div></div>`;
    card.onclick=()=>{let r=roll(n,'1d20',b);if((n==='Deception'||n==='Persuasion') && r-b<10){$('#diceResult').textContent=10+b;$('#diceBreakdown').textContent=`Silver Tongue: d20 treated as 10 + ${b}`}};
    grid.append(card);
  });
}
const ITEM_TYPE_LABELS={
  A:'Ammunition',AF:'Ammunition',AIR:'Vehicle',AT:'Artisan tools',EXP:'Explosive',G:'Adventuring gear',GS:'Gaming set',HA:'Heavy armor',INS:'Instrument',LA:'Light armor',M:'Weapon',MA:'Medium armor',MNT:'Mount',OTH:'Other',P:'Potion',RD:'Rod',RG:'Ring',S:'Shield',SC:'Scroll',SCF:'Spellcasting focus',T:'Tool',TAH:'Tack and harness',TG:'Trade good',VEH:'Vehicle',WD:'Wand'
};
let itemLibraryCache=null;
let itemImporterState={search:'',type:'all',rarity:'all',attunement:'all',source:'all',sort:'name-asc',page:0,pageSize:80,selected:new Set()};
function titleCase(value){return String(value||'').replace(/\b\w/g,c=>c.toUpperCase());}
function cleanItemText(value){
  return String(value||'')
    .replace(/\{@(?:item|spell|condition|skill|book|quickref|dice|damage|dc|table)\s+([^}|]+)(?:\|[^}]*)?\}/gi,'$1')
    .replace(/\{#?[^}]+\}/g,'')
    .replace(/\*\*/g,'')
    .replace(/\s+/g,' ')
    .trim();
}
function flattenItemEntries(value,out=[]){
  if(value==null)return out;
  if(typeof value==='string' || typeof value==='number'){out.push(cleanItemText(value));return out;}
  if(Array.isArray(value)){value.forEach(v=>flattenItemEntries(v,out));return out;}
  if(typeof value==='object'){
    if(value.name && typeof value.name==='string') out.push(cleanItemText(value.name)+':');
    if(value.entry) flattenItemEntries(value.entry,out);
    if(value.entries) flattenItemEntries(value.entries,out);
    if(value.items) flattenItemEntries(value.items,out);
    if(value.rows) flattenItemEntries(value.rows,out);
  }
  return out;
}
function inferItemType(raw){
  const code=String(raw.type||'').split('|')[0].toUpperCase();
  if(code==='M'){
    if(raw.weaponCategory==='simple' || raw.weapon?.weaponCategory==='simple') return 'Simple weapon';
    if(raw.weaponCategory==='martial' || raw.weapon?.weaponCategory==='martial') return 'Martial weapon';
    return 'Weapon';
  }
  if(ITEM_TYPE_LABELS[code]) return ITEM_TYPE_LABELS[code];
  if(raw.flags?.tattoo || raw.tattoo) return 'Wondrous item';
  if(raw.flags?.wondrous || raw.wondrous) return 'Wondrous item';
  return titleCase(code||'Wondrous item');
}
function getItemAttunement(raw){
  const structured=raw.attunement;
  if(structured && typeof structured==='object') return {required:Boolean(structured.required),text:String(structured.prereq||'')};
  if(raw.reqAttune) return {required:true,text:typeof raw.reqAttune==='string'?raw.reqAttune:''};
  return {required:false,text:''};
}
function generateItemBrief(raw,details){
  const supplied=cleanItemText(raw.description?.brief||raw.brief||'');
  if(supplied && supplied.length>12 && !supplied.startsWith('{')) return supplied.replace(/[,:;]$/,'')+(supplied.match(/[.!?]$/)?'':'.');
  const cleaned=cleanItemText(details);
  if(!cleaned) return `${inferItemType(raw)}.`;
  const sentence=(cleaned.match(/^.*?[.!?](?:\s|$)/)||[cleaned])[0].trim();
  return sentence.length>220?sentence.slice(0,217).trimEnd()+'...':sentence;
}
function normaliseLibraryItem(raw,dataset,index){
  const entryText=raw.description?.md || flattenItemEntries(raw.entries||raw.additionalEntries||[]).join('\n\n');
  const attune=getItemAttunement(raw);
  const name=String(raw.name||`Unnamed Item ${index+1}`);
  return {
    libraryId:String(raw.id||`${dataset}-${raw.source||'unknown'}-${name}-${index}`).toLowerCase().replace(/\s+/g,'-'),
    name,
    type:inferItemType(raw),
    attunement:attune.required,
    attunementText:attune.text,
    rarity:titleCase(raw.rarity||'none'),
    brief:generateItemBrief(raw,entryText),
    details:cleanItemText(entryText),
    source:String(raw.source||dataset),
    dataset
  };
}
async function loadItemLibrary(){
  if(itemLibraryCache)return itemLibraryCache;
  const sources=[['Normalised','assets/items-phb.json'],['Original','assets/items-all.json']];
  const all=[];
  for(const [dataset,url] of sources){
    try{
      const response=await fetch(url,{cache:'no-store'});
      if(!response.ok)throw new Error(`${response.status}`);
      const data=await response.json();
      (data.item||[]).forEach((raw,index)=>all.push(normaliseLibraryItem(raw,dataset,index)));
    }catch(error){console.warn('Unable to load item library',url,error);}
  }
  const deduped=new Map();
  all.forEach(item=>{
    const key=`${item.name.toLowerCase()}|${item.source.toLowerCase()}`;
    const previous=deduped.get(key);
    if(!previous || (item.details.length>previous.details.length)) deduped.set(key,item);
  });
  itemLibraryCache=Array.from(deduped.values());
  return itemLibraryCache;
}
function compareItems(a,b,sort){
  if(sort==='favorites')return a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:'base'});
  const [field,direction]=String(sort||'name-asc').split('-');
  const av=String(a[field]??'').toLowerCase(),bv=String(b[field]??'').toLowerCase();
  const result=av.localeCompare(bv,undefined,{numeric:true,sensitivity:'base'});
  return direction==='desc'?-result:result;
}
function filterLibraryItems(items){
  const q=itemImporterState.search.trim().toLowerCase();
  return items.filter(item=>{
    if(q && !`${item.name} ${item.type} ${item.rarity} ${item.source} ${item.brief}`.toLowerCase().includes(q))return false;
    if(itemImporterState.type!=='all' && item.type!==itemImporterState.type)return false;
    if(itemImporterState.rarity!=='all' && item.rarity!==itemImporterState.rarity)return false;
    if(itemImporterState.source!=='all' && item.source!==itemImporterState.source)return false;
    if(itemImporterState.attunement==='yes' && !item.attunement)return false;
    if(itemImporterState.attunement==='no' && item.attunement)return false;
    return true;
  }).sort((a,b)=>compareItems(a,b,itemImporterState.sort));
}
function importLibraryItems(items){
  const existing=new Set(state.inventory.map(item=>`${item.name.toLowerCase()}|${item.source.toLowerCase()}`));
  let added=0;
  items.forEach(item=>{
    const key=`${item.name.toLowerCase()}|${item.source.toLowerCase()}`;
    if(existing.has(key))return;
    state.inventory.push({uid:`inventory-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,qty:1,name:item.name,type:item.type,attunement:item.attunement,attunementText:item.attunementText,rarity:item.rarity,brief:item.brief,defaultBrief:item.brief,source:item.source,details:item.details,importedId:item.libraryId});
    existing.add(key);added++;
  });
  save();
  return added;
}

function escapeItemHtml(value){
  return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}
function itemRarityClass(value){
  const key=String(value||'').trim().toLowerCase();
  if(key==='common')return 'rarity-common';
  if(key==='uncommon')return 'rarity-uncommon';
  if(key==='rare')return 'rarity-rare';
  if(key==='very rare')return 'rarity-very-rare';
  if(key==='legendary')return 'rarity-legendary legendary';
  if(key==='artifact')return 'rarity-artifact artifact';
  return 'rarity-none';
}
function formatItemDetails(value){
  const clean=String(value||'No further description is available.').trim();
  return clean.split(/\n\n+/).filter(Boolean).map(paragraph=>`<p>${escapeItemHtml(paragraph)}</p>`).join('');
}
function getCoinTotalGold(){
  return Math.round(((Number(state.platinum)||0)*10)+(Number(state.gold)||0)+((Number(state.silver)||0)/10)+((Number(state.copper)||0)/100));
}
function ensureSimpleNoticeDialog(){
  let dialog=document.getElementById('simpleNoticeDialog');
  if(dialog)return dialog;
  dialog=document.createElement('dialog');
  dialog.id='simpleNoticeDialog';
  dialog.innerHTML='<div class="dialog-card simple-notice-card"><button class="dialog-close" type="button">×</button><h2></h2><p></p><button class="gold-btn" type="button" data-notice-close>OK</button></div>';
  document.body.appendChild(dialog);
  dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
  dialog.querySelector('[data-notice-close]').onclick=()=>dialog.close();
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  return dialog;
}
function showSimpleNotice(title,message){
  const dialog=ensureSimpleNoticeDialog();
  dialog.querySelector('h2').textContent=title;
  dialog.querySelector('p').textContent=message;
  if(!dialog.open)dialog.showModal();
}
function ensureCoinPurseDialog(){
  let dialog=document.getElementById('coinPurseDialog');
  if(dialog)return dialog;
  dialog=document.createElement('dialog');
  dialog.id='coinPurseDialog';
  dialog.innerHTML='<div class="dialog-card coin-purse-dialog-card"><button class="dialog-close" type="button">×</button><div class="coin-purse-dialog-body"></div></div>';
  document.body.appendChild(dialog);
  dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  return dialog;
}
function openCoinPurseDialog(){
  ensureInventoryState();
  const dialog=ensureCoinPurseDialog();
  const body=dialog.querySelector('.coin-purse-dialog-body');
  const denominations=['platinum','gold','silver','copper'];
  const dropdownOrder=['gold','silver','copper','platinum'];
  body.innerHTML=`<div class="coin-popup-shell coin-popup-shell-v3">
    <div class="coin-popup-title-v4">COIN PURSE</div>
    <div class="coin-popup-ledger coin-popup-ledger-v3">
      ${denominations.map(type=>`<div class="coin-ledger-chip ${type}" data-coin-ledger="${type}"><div class="coin-ledger-art"><img src="assets/coin_${type}.png" alt="${type} coin"></div><div class="coin-ledger-copy"><span>${type.toUpperCase()}</span><strong data-coin-count="${type}">${state[type]||0}</strong></div></div>`).join('')}
    </div>
    <div class="coin-controls-v3">
      <div class="coin-input-row-v3">
        <input class="field coin-amount-input coin-amount-input-v3" type="text" inputmode="numeric" pattern="[0-9]*" value="0" aria-label="Coin value" data-coin-amount>
        <div class="coin-dropdown-wrap coin-dropdown-wrap-v3">
          <button type="button" class="coin-dropdown-button gold" data-coin-dropdown-toggle aria-haspopup="listbox" aria-expanded="false"><img data-selected-coin-image src="assets/coin_gold.png" alt="Selected coin"></button>
          <div class="coin-dropdown-menu hidden" data-coin-dropdown-menu role="listbox">${dropdownOrder.map(type=>`<button type="button" class="coin-dropdown-option ${type}" data-coin-option="${type}" role="option" aria-label="${type}"><img src="assets/coin_${type}.png" alt="${type} coin"><span>${type}</span></button>`).join('')}</div>
        </div>
      </div>
      <div class="coin-numpad coin-numpad-v3">${['7','8','9','4','5','6','1','2','3','0','00','⌫'].map(key=>`<button type="button" class="coin-key" data-coin-key="${key}">${key}</button>`).join('')}</div>
      <div class="coin-action-row-v3">
        <button class="gold-btn coin-action-btn add" type="button" data-coin-apply="add">ADD</button>
        <button class="coin-key coin-clear-btn-v3" type="button" data-coin-clear>CLEAR</button>
        <button class="purple-btn coin-action-btn subtract" type="button" data-coin-apply="subtract">REMOVE</button>
      </div>
    </div>
  </div>`;
  let selectedCoin='gold';
  const amountInput=body.querySelector('[data-coin-amount]');
  const dropdownToggle=body.querySelector('[data-coin-dropdown-toggle]');
  const dropdownMenu=body.querySelector('[data-coin-dropdown-menu]');
  const selectedCoinImage=body.querySelector('[data-selected-coin-image]');
  const sanitize=()=>{amountInput.value=String(amountInput.value||'').replace(/\D+/g,'')||'0';};
  const getAmount=()=>Math.max(0,parseInt(String(amountInput.value||'0').replace(/\D+/g,'' )||'0',10)||0);
  const coinClassName=(coin)=>dropdownOrder.includes(coin)?coin:'gold';
  const syncCoinUi=()=>{
    denominations.forEach(type=>{
      body.querySelectorAll(`[data-coin-count="${type}"]`).forEach(node=>{node.textContent=String(state[type]||0);});
    });
  };
  const closeDropdown=()=>{
    dropdownMenu.classList.add('hidden');
    dropdownToggle.setAttribute('aria-expanded','false');
  };
  const openDropdown=()=>{
    dropdownMenu.classList.remove('hidden');
    dropdownToggle.setAttribute('aria-expanded','true');
  };
  const updateSelectedCoinUi=()=>{
    const cls=coinClassName(selectedCoin);
    dropdownToggle.className=`coin-dropdown-button ${cls}`;
    selectedCoinImage.src=`assets/coin_${selectedCoin}.png`;
    selectedCoinImage.alt=`${selectedCoin} coin`;
    body.querySelectorAll('[data-coin-option]').forEach(btn=>btn.classList.toggle('selected',btn.dataset.coinOption===selectedCoin));
  };
  const setSelectedCoin=(coin)=>{
    selectedCoin=coinClassName(coin);
    updateSelectedCoinUi();
    closeDropdown();
  };
  const applyToSelectedCoin=(mode)=>{
    sanitize();
    const amount=getAmount();
    if(amount<=0){toast('Enter an amount first');return;}
    const current=Math.max(0,Number(state[selectedCoin])||0);
    state[selectedCoin]=Math.max(0,current + (mode==='add'?amount:-amount));
    amountInput.value='0';
    save();
    syncCoinUi();
    if(mode==='add'){
      const addedCoin=body.querySelector(`[data-coin-ledger="${selectedCoin}"]`);
      if(addedCoin){
        addedCoin.classList.remove('coin-added-spin');
        void addedCoin.offsetWidth;
        addedCoin.classList.add('coin-added-spin');
        window.setTimeout(()=>addedCoin.classList.remove('coin-added-spin'),1000);
      }
    }
    renderInventory();
    toast(`${mode==='add'?'Added':'Removed'} ${amount} ${selectedCoin}`);
  };
  dropdownToggle.onclick=(event)=>{
    event.stopPropagation();
    if(dropdownMenu.classList.contains('hidden')) openDropdown();
    else closeDropdown();
  };
  body.querySelectorAll('[data-coin-option]').forEach(btn=>btn.onclick=(event)=>{
    event.stopPropagation();
    setSelectedCoin(btn.dataset.coinOption);
  });
  amountInput.addEventListener('input',sanitize);
  body.querySelectorAll('[data-coin-key]').forEach(btn=>btn.onclick=()=>{
    const key=btn.dataset.coinKey;
    if(key==='⌫') amountInput.value=(String(amountInput.value||'').slice(0,-1) || '0');
    else amountInput.value=((String(amountInput.value||'')==='0') ? '' : String(amountInput.value||'')) + key;
    sanitize();
  });
  body.querySelector('[data-coin-clear]').onclick=()=>{amountInput.value='0';};
  body.querySelectorAll('[data-coin-apply]').forEach(btn=>btn.onclick=()=>applyToSelectedCoin(btn.dataset.coinApply));
  dialog.onclick=(event)=>{if(event.target===dialog)dialog.close();};
  document.addEventListener('click',function coinDropClose(event){
    if(!dialog.open){document.removeEventListener('click',coinDropClose);return;}
    if(!body.contains(event.target))return;
    if(!dropdownMenu.contains(event.target) && !dropdownToggle.contains(event.target))closeDropdown();
  });
  updateSelectedCoinUi();
  syncCoinUi();
  if(!dialog.open)dialog.showModal();
}
function ensureItemDetailDialog(){
  let dialog=document.getElementById('itemDetailDialog');
  if(dialog)return dialog;
  dialog=document.createElement('dialog');
  dialog.id='itemDetailDialog';
  dialog.innerHTML=`<div class="dialog-card item-detail-card"><button class="dialog-close" type="button" aria-label="Close">×</button><div class="item-detail-body"></div></div>`;
  document.body.appendChild(dialog);
  dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  return dialog;
}
function setInventoryItemAttuned(item,shouldAttune){
  ensureInventoryState();
  const inventoryItem=state.inventory.find(candidate=>candidate.uid===item.uid);
  if(!inventoryItem)return false;
  if(shouldAttune){
    if(!inventoryItem.attunement){toast('This item does not require attunement');return false;}
    const existingSlot=state.attunedItems.findIndex(name=>name===inventoryItem.name);
    if(existingSlot<0){
      const openSlot=state.attunedItems.findIndex(name=>!name);
      if(openSlot<0){
        showSimpleNotice('No Attunement Slots','All three attunement slots are currently occupied. Unattune an item before attuning another.');
        return false;
      }
      state.attunedItems[openSlot]=inventoryItem.name;
    }
    inventoryItem.attuned=true;
  }else{
    inventoryItem.attuned=false;
    state.attunedItems=state.attunedItems.map(name=>name===inventoryItem.name?'':name);
  }
  item.attuned=inventoryItem.attuned;
  save();
  return true;
}
function openItemDetail(item,options={}){
  const dialog=ensureItemDetailDialog();
  const body=dialog.querySelector('.item-detail-body');
  const inInventory=Boolean(options.inventory);
  const attuneLabel=item.attuned?'UNATTUNE':'ATTUNE';
  const defaultBrief=String(item.defaultBrief||item.brief||generateItemBrief({},item.details||'')||'').trim();
  const rarityClass=itemRarityClass(item.rarity);
  body.innerHTML=`<div class="item-detail-hero ${rarityClass}">
    <div class="item-detail-copy">
      <div class="item-detail-name-row"><h2>${item.favorite?`<span class="favorite-star" aria-label="Favorite">★</span> `:''}${escapeItemHtml(item.name)}</h2></div>
      <div class="item-detail-meta"><em>${escapeItemHtml(item.type)}${String(item.rarity||'').toLowerCase()!=='none'?`, <span class="item-rarity-text ${rarityClass}">${escapeItemHtml(item.rarity)}</span>`:''}</em>${item.attunement?`<span>Requires Attunement${item.attunementText?` • ${escapeItemHtml(item.attunementText)}`:''}</span>`:''}</div>
    </div>
  </div>
  <div class="item-detail-rule"></div>
  <div class="item-detail-description">${formatItemDetails(item.details||item.brief)}</div>
  <section class="item-brief-editor subtle-brief-editor">
    <label>BRIEF</label>
    <div id="itemBriefEditor" class="item-brief-editable" contenteditable="true" role="textbox" aria-label="Custom item brief">${escapeItemHtml(item.brief||defaultBrief)}</div>
  </section>
  ${inInventory?`<div class="item-detail-actions">
    <div class="item-quantity-control"><span>QUANTITY</span><button type="button" data-item-minus>−</button><strong>${item.qty}</strong><button type="button" data-item-plus>+</button></div>
    <div class="item-action-pair item-action-pair-right">
      <button type="button" class="item-remove-action ornate-danger-button" data-item-remove>REMOVE</button>
      ${item.attunement?`<button type="button" class="purple-btn ${item.attuned?'item-attuned-action':''}" data-item-attune>${attuneLabel}</button>`:''}
      <button type="button" class="favorite-item-button ${item.favorite?'is-favorite':''}" data-item-favorite>${item.favorite?'FAVORITED':'FAVORITE'}</button>
    </div>
  </div>`:''}`;
  const briefEditor=body.querySelector('#itemBriefEditor');
  const saveBrief=()=>{
    const typed=briefEditor.textContent.trim();
    item.defaultBrief=defaultBrief;
    item.brief=typed||defaultBrief;
    briefEditor.textContent=item.brief;
    if(inInventory){save();renderInventory();}
  };
  briefEditor.addEventListener('blur',saveBrief);
  briefEditor.addEventListener('keydown',event=>{if(event.key==='Enter' && !event.shiftKey){event.preventDefault();briefEditor.blur();}});
  if(inInventory){
    const refresh=()=>{dialog.close();renderInventory();openItemDetail(item,{inventory:true});};
    body.querySelector('[data-item-minus]').onclick=()=>{item.qty=Math.max(1,item.qty-1);save();refresh();};
    body.querySelector('[data-item-plus]').onclick=()=>{item.qty+=1;save();refresh();};
    const attuneButton=body.querySelector('[data-item-attune]');
    if(attuneButton)attuneButton.onclick=()=>{if(setInventoryItemAttuned(item,!item.attuned))refresh();};
    body.querySelector('[data-item-favorite]').onclick=()=>{
      const inventoryItem=state.inventory.find(candidate=>candidate.uid===item.uid);
      if(!inventoryItem)return;
      inventoryItem.favorite=!inventoryItem.favorite;
      item.favorite=inventoryItem.favorite;
      save();
      refresh();
    };
    body.querySelector('[data-item-remove]').onclick=()=>{state.inventory=state.inventory.filter(candidate=>candidate.uid!==item.uid);state.attunedItems=state.inventory.filter(candidate=>candidate.attuned).slice(0,3).map(candidate=>candidate.name);while(state.attunedItems.length<3)state.attunedItems.push('');save();dialog.close();renderInventory();toast(`${item.name} removed`);};
  }
  if(!dialog.open)dialog.showModal();
}
function ensureCustomItemDialog(){
  let dialog=document.getElementById('customItemDialog');
  if(dialog)return dialog;
  dialog=document.createElement('dialog');
  dialog.id='customItemDialog';
  dialog.innerHTML=`<form method="dialog" class="dialog-card custom-item-card"><button class="dialog-close" type="button" aria-label="Close">×</button><h2>CREATE CUSTOM ITEM</h2><div class="custom-item-grid"><label>Name<input class="field" name="name" required></label><label>Type<input class="field" name="type" value="Wondrous Item"></label><label>Rarity<select class="field" name="rarity"><option>None</option><option>Common</option><option selected>Uncommon</option><option>Rare</option><option>Very Rare</option><option>Legendary</option><option>Artifact</option></select></label><label class="custom-item-check"><input type="checkbox" name="attunement"> Requires attunement</label><label class="custom-item-wide">Brief<input class="field" name="brief" maxlength="240"></label><label class="custom-item-wide">Description<textarea class="field" name="details" rows="10"></textarea></label></div><div class="custom-item-actions"><button type="button" class="purple-btn" data-custom-cancel>CANCEL</button><button type="submit" class="gold-btn">GENERATE & IMPORT</button></div></form>`;
  document.body.appendChild(dialog);
  const form=dialog.querySelector('form');
  const close=()=>dialog.close();
  dialog.querySelector('.dialog-close').onclick=close;
  dialog.querySelector('[data-custom-cancel]').onclick=close;
  dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form);
    const name=String(data.get('name')||'').trim();
    if(!name){toast('Enter an item name');return;}
    const details=String(data.get('details')||'').trim();
    const brief=String(data.get('brief')||'').trim()||generateItemBrief({},details)||'Custom item';
    state.inventory.push({uid:`custom-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,qty:1,name,type:String(data.get('type')||'Custom Item'),attunement:data.get('attunement')==='on',attunementText:data.get('attunement')==='on'?'Requires attunement':'',rarity:String(data.get('rarity')||'None'),brief,defaultBrief:brief,source:'Custom',details,importedId:'',favorite:false,attuned:false});
    save();close();renderInventory();toast(`${name} imported`);form.reset();
  });
  return dialog;
}
function openCustomItemGenerator(){const dialog=ensureCustomItemDialog();if(!dialog.open)dialog.showModal();}
function ensureItemImporterDialog(){
  let dialog=document.getElementById('itemImporterDialog');
  if(dialog)return dialog;
  dialog=document.createElement('dialog');
  dialog.id='itemImporterDialog';
  dialog.innerHTML=`<div class="dialog-card item-importer-card"><button class="dialog-close" type="button" aria-label="Close">×</button><div class="item-importer-body"><div class="item-importer-loading">Loading item library…</div></div></div>`;
  document.body.appendChild(dialog);
  dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  return dialog;
}
async function openItemImporter(){
  const dialog=ensureItemImporterDialog();
  if(!dialog.open)dialog.showModal();
  const body=dialog.querySelector('.item-importer-body');
  body.innerHTML='<div class="item-importer-loading">Loading item library…</div>';
  const items=await loadItemLibrary();
  if(!items.length){body.innerHTML='<div class="item-importer-loading">No items could be loaded. Launch the sheet through Launch.bat so the bundled JSON files can be read.</div>';return;}
  renderItemImporter(items,dialog);
}
function renderItemImporterResults(items,dialog){
  const body=dialog.querySelector('.item-importer-body');
  const results=body.querySelector('.item-library-results');
  if(!results)return;
  const filtered=filterLibraryItems(items);
  const scrollTop=results.scrollTop;
  results.innerHTML='';
  filtered.forEach(item=>{
    const selected=itemImporterState.selected.has(item.libraryId);
    const row=el('div',`item-library-row ${selected?'selected':''} ${itemRarityClass(item.rarity)}`,`<input type="checkbox" aria-label="Select ${escapeItemHtml(item.name)}" ${selected?'checked':''}><button type="button" class="item-library-name"><strong>${escapeItemHtml(item.name)}</strong></button><span>${escapeItemHtml(item.type)}</span><span class="item-attune-mark" title="${escapeItemHtml(item.attunementText)}">${item.attunement?'×':''}</span><span class="item-rarity-cell ${itemRarityClass(item.rarity)}">${String(item.rarity||'').toLowerCase()==='none'?'':escapeItemHtml(item.rarity)}</span><span class="item-library-brief">${escapeItemHtml(item.brief)}</span>`);
    const checkbox=row.querySelector('input');
    const toggle=()=>{const isSelected=itemImporterState.selected.has(item.libraryId);if(isSelected)itemImporterState.selected.delete(item.libraryId);else itemImporterState.selected.add(item.libraryId);row.classList.toggle('selected',!isSelected);checkbox.checked=!isSelected;renderItemImporterActions(items,dialog);};
    checkbox.onclick=event=>event.stopPropagation();
    checkbox.onchange=()=>{checkbox.checked?itemImporterState.selected.add(item.libraryId):itemImporterState.selected.delete(item.libraryId);row.classList.toggle('selected',checkbox.checked);renderItemImporterActions(items,dialog);};
    row.onclick=event=>{if(event.target.closest('.item-library-name')||event.target===checkbox)return;toggle();};
    row.querySelector('.item-library-name').onclick=event=>{event.stopPropagation();openItemDetail(item);};
    results.append(row);
  });
  results.scrollTop=scrollTop;
  const count=body.querySelector('[data-result-count]');
  if(count)count.textContent=`${filtered.length.toLocaleString()} results`;
}
function renderItemImporterActions(items,dialog){
  const body=dialog.querySelector('.item-importer-body');
  const importButton=body.querySelector('[data-import-selected]');
  if(importButton){importButton.disabled=itemImporterState.selected.size===0;importButton.textContent=itemImporterState.selected.size?`IMPORT SELECTED (${itemImporterState.selected.size})`:'IMPORT SELECTED';}
}
function renderItemImporter(items,dialog){
  const body=dialog.querySelector('.item-importer-body');
  const types=[...new Set(items.map(i=>i.type))].sort();
  const rarities=[...new Set(items.map(i=>i.rarity))].sort();
  body.innerHTML=`<div class="item-importer-controls"><input class="field" data-library-search placeholder="Search name, type, rarity or description…" value="${escapeItemHtml(itemImporterState.search)}"><select class="field" data-library-type><option value="all">All types</option>${types.map(v=>`<option ${v===itemImporterState.type?'selected':''}>${escapeItemHtml(v)}</option>`).join('')}</select><select class="field" data-library-rarity><option value="all">All rarities</option>${rarities.map(v=>`<option ${v===itemImporterState.rarity?'selected':''}>${escapeItemHtml(v)}</option>`).join('')}</select><select class="field" data-library-attune><option value="all">All attunement</option><option value="yes" ${itemImporterState.attunement==='yes'?'selected':''}>Attunement required</option><option value="no" ${itemImporterState.attunement==='no'?'selected':''}>No attunement</option></select><select class="field" data-library-sort><option value="name-asc" ${itemImporterState.sort==='name-asc'?'selected':''}>Name A–Z</option><option value="name-desc" ${itemImporterState.sort==='name-desc'?'selected':''}>Name Z–A</option><option value="type-asc" ${itemImporterState.sort==='type-asc'?'selected':''}>Type</option><option value="rarity-asc" ${itemImporterState.sort==='rarity-asc'?'selected':''}>Rarity</option></select></div><div class="item-importer-actions"><button class="purple-btn" data-custom-item>GENERATE CUSTOM ITEM</button><button class="purple-btn" data-clear-selected>CLEAR SELECTION</button><button class="gold-btn" data-import-selected>IMPORT SELECTED</button><span data-result-count></span></div><div class="item-library-table"><div class="item-library-header"><span></span><span>Name</span><span>Type</span><span>Attune</span><span>Rarity</span><span>Brief</span></div><div class="item-library-results"></div></div>`;
  const search=body.querySelector('[data-library-search]');
  search.oninput=event=>{itemImporterState.search=event.target.value;renderItemImporterResults(items,dialog);};
  [['type','[data-library-type]'],['rarity','[data-library-rarity]'],['attunement','[data-library-attune]'],['sort','[data-library-sort]']].forEach(([key,selector])=>body.querySelector(selector).onchange=event=>{itemImporterState[key]=event.target.value;renderItemImporterResults(items,dialog);});
  body.querySelector('[data-custom-item]').onclick=()=>openCustomItemGenerator();
  body.querySelector('[data-clear-selected]').onclick=()=>{itemImporterState.selected.clear();renderItemImporterResults(items,dialog);renderItemImporterActions(items,dialog);};
  body.querySelector('[data-import-selected]').onclick=()=>{const selected=items.filter(item=>itemImporterState.selected.has(item.libraryId));const added=importLibraryItems(selected);itemImporterState.selected.clear();dialog.close();renderInventory();toast(`${added} item${added===1?'':'s'} imported`);};
  renderItemImporterResults(items,dialog);
  renderItemImporterActions(items,dialog);
}
function getInventoryFilteredItems(){
  ensureInventoryState();
  const view=state.inventoryView;
  const q=view.search.trim().toLowerCase();
  return state.inventory.filter(item=>{
    if(q && !`${item.name} ${item.type} ${item.rarity} ${item.brief}`.toLowerCase().includes(q))return false;
    if(view.type!=='all' && item.type!==view.type)return false;
    if(view.rarity!=='all' && item.rarity!==view.rarity)return false;
    if(view.attunement==='yes' && !item.attunement)return false;
    if(view.attunement==='no' && item.attunement)return false;
    if(view.sort==='favorites' && !item.favorite)return false;
    return true;
  }).sort((a,b)=>compareItems(a,b,view.sort));
}
function renderInventory(){
  ensureInventoryState();
  const p=$('#inventory');
  const types=[...new Set(state.inventory.map(i=>i.type))].sort();
  const rarities=[...new Set(state.inventory.map(i=>i.rarity))].sort();
  const items=getInventoryFilteredItems();
  const attuned=state.attunedItems.map(name=>name?state.inventory.find(item=>item.name===name && item.attuned):null);
  p.innerHTML=`<section class="panel content-card inventory-page-panel inventory-page-redesign"><div class="inventory-attunement-grid inventory-attunement-display">${[0,1,2].map(index=>{const item=attuned[index];return `<button type="button" class="inventory-top-box magical-attunement-slot ${item?'attuned-glow':''}" data-attuned-item="${item?escapeItemHtml(item.uid):''}"><span class="inventory-top-label">ATTUNEMENT SLOT ${index+1}</span><strong>${item?escapeItemHtml(item.name):'Empty Slot'}</strong><span class="attunement-rune-line"></span></button>`;}).join('')}<button type="button" class="inventory-top-box magical-coin-purse coin-purse-box" id="coinPurseButton"><span class="inventory-top-label">COIN PURSE</span><div class="coin-purse-total"><strong>${getCoinTotalGold()} GP</strong><span>Rounded total value</span></div><div class="coin-purse-breakdown">${[['platinum','pp'],['gold','g'],['silver','s'],['copper','c']].map(([type,abbr])=>`<span class="coin-purse-chip ${type}"><img src="assets/coin_${type}.png" alt="${type} coin"><b>${state[type]||0}</b><em>${abbr}</em></span>`).join('')}</div><span class="coin-rune-line"></span></button></div><div class="inventory-list-panel inventory-list-redesign"><div class="inventory-toolbar"><input class="field" id="inventorySearch" placeholder="Search inventory…" value="${escapeItemHtml(state.inventoryView.search)}"><select class="field" id="inventoryType"><option value="all">All types</option>${types.map(v=>`<option ${v===state.inventoryView.type?'selected':''}>${escapeItemHtml(v)}</option>`).join('')}</select><select class="field" id="inventoryRarity"><option value="all">All rarities</option>${rarities.map(v=>`<option ${v===state.inventoryView.rarity?'selected':''}>${escapeItemHtml(v)}</option>`).join('')}</select><select class="field" id="inventoryAttunement"><option value="all">All attunement</option><option value="yes" ${state.inventoryView.attunement==='yes'?'selected':''}>Attunement</option><option value="no" ${state.inventoryView.attunement==='no'?'selected':''}>No attunement</option></select><select class="field" id="inventorySort"><option value="name-asc" ${state.inventoryView.sort==='name-asc'?'selected':''}>Name A–Z</option><option value="name-desc" ${state.inventoryView.sort==='name-desc'?'selected':''}>Name Z–A</option><option value="favorites" ${state.inventoryView.sort==='favorites'?'selected':''}>Favorites</option><option value="type-asc" ${state.inventoryView.sort==='type-asc'?'selected':''}>Type</option><option value="rarity-asc" ${state.inventoryView.sort==='rarity-asc'?'selected':''}>Rarity</option></select><button id="importItems" class="purple-btn inventory-import-inline">IMPORT ITEMS</button></div><div class="inventory-card-list" id="items"></div><div class="inventory-count">${items.length} of ${state.inventory.length} items</div></div></section>`;
  p.querySelectorAll('[data-attuned-item]').forEach(slot=>{const item=state.inventory.find(candidate=>candidate.uid===slot.dataset.attunedItem);slot.onclick=()=>{if(item)openItemDetail(item,{inventory:true});};});
  p.querySelector('#coinPurseButton').onclick=openCoinPurseDialog;
  p.querySelector('#importItems').onclick=openItemImporter;
  const search=p.querySelector('#inventorySearch');
  search.oninput=event=>{state.inventoryView.search=event.target.value;save();renderInventoryListOnly();};
  [['type','#inventoryType'],['rarity','#inventoryRarity'],['attunement','#inventoryAttunement'],['sort','#inventorySort']].forEach(([key,selector])=>p.querySelector(selector).onchange=event=>{state.inventoryView[key]=event.target.value;save();renderInventory();});
  function renderInventoryListOnly(){
    const list=p.querySelector('#items');
    if(!list)return;
    const filtered=getInventoryFilteredItems();
    list.innerHTML='';
    filtered.forEach(item=>{
      const rarityClass=itemRarityClass(item.rarity);
      const row=el('article',`inventory-item-card ${rarityClass} ${item.attuned?'attuned-inventory-card':''}`,`<button type="button" class="inventory-item-name-button"><strong>${item.favorite?`<span class="favorite-star" aria-label="Favorite">★</span> `:''}${escapeItemHtml(item.name)}</strong><span>${escapeItemHtml(item.type)}${String(item.rarity||'').toLowerCase()!=='none'?` • <span class="item-rarity-text ${rarityClass}">${escapeItemHtml(item.rarity)}</span>`:''}${item.attunement?' • Attunement':''}</span></button><p>${escapeItemHtml(item.brief)}</p><div class="inventory-quantity-display"><span>QTY</span><strong>${item.qty}</strong></div>`);
      row.querySelector('.inventory-item-name-button').onclick=()=>openItemDetail(item,{inventory:true});
      list.append(row);
    });
    const count=p.querySelector('.inventory-count');
    if(count)count.textContent=`${filtered.length} of ${state.inventory.length} items`;
  }
  renderInventoryListOnly();
}
function renderJournal(){
  ensureJournalState();
  persistJournalNow();
  const p=$('#journal');
  const formatDate=value=>{
    const date=new Date(value);
    return Number.isNaN(date.getTime())?'':date.toLocaleString(undefined,{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
  };
  const safeFileName=value=>String(value||'Journal').replace(/[\\/:*?"<>|]+/g,'-').trim()||'Journal';
  const downloadText=(filename,text)=>{
    const blob=new Blob([text],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;link.download=filename;link.click();URL.revokeObjectURL(url);
  };
  p.innerHTML=`<section class="journal-page panel content-card">
    <aside class="journal-sidebar">
      <div class="journal-brand">
        <span class="journal-brand-icon">${icon('history','journal-brand-img')}</span>
        <div><span>ALKANDER'S</span><h2>JOURNAL</h2></div>
      </div>
      <div class="journal-search-wrap"><input class="journal-search" type="search" placeholder="Search all notes..." autocomplete="off"><span class="journal-search-glyph">⌕</span></div>
      <div class="journal-sidebar-actions">
        <button type="button" class="journal-action-btn primary" data-journal-new>NEW NOTE</button>
        <select class="journal-sort" aria-label="Sort notes">
          <option value="updated-desc">Recently updated</option>
          <option value="created-desc">Newest created</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
          <option value="favorites">★ Favorites only</option>
        </select>
      </div>
      <div class="journal-note-list" role="list"></div>
      <div class="journal-sidebar-footer">
        <span class="journal-note-count"></span>
        <span class="journal-footer-actions">
          <button type="button" class="journal-text-btn" data-journal-import>IMPORT</button>
          <button type="button" class="journal-text-btn" data-journal-export-all>EXPORT ALL</button>
        </span>
        <input type="file" class="journal-import-input" accept=".txt,.md,.json,text/plain,application/json" multiple hidden>
      </div>
    </aside>
    <div class="journal-workspace">
      <header class="journal-editor-head">
        <div class="journal-title-wrap">
          <input class="journal-title-input" maxlength="100" aria-label="Note title">
          <div class="journal-title-details">
            <label class="journal-category-wrap"><span>CATEGORY</span><select class="journal-category-select" aria-label="Note category">${JOURNAL_CATEGORIES.map(category=>`<option value="${category.id}">${category.label}</option>`).join('')}</select></label>
            <div class="journal-note-meta"></div>
          </div>
        </div>
        <div class="journal-editor-actions">
          <button type="button" class="journal-save-btn" data-journal-save>SAVE NOTE</button>
          <button type="button" class="journal-icon-btn" data-journal-pin title="Pin note">☆</button>
          <button type="button" class="journal-icon-btn" data-journal-duplicate title="Duplicate note">⧉</button>
          <button type="button" class="journal-icon-btn" data-journal-export title="Export note">⇩</button>
          <button type="button" class="journal-icon-btn danger" data-journal-delete title="Delete note">×</button>
        </div>
      </header>
      <div class="journal-search-highlights" hidden></div>
      <div class="journal-editor-shell">
        <div class="journal-editor-runes" aria-hidden="true"></div>
        <textarea class="journal-editor" placeholder="Write session notes, quests, NPCs, clues, locations, treasure, and plans..."></textarea>
      </div>
      <footer class="journal-statusbar"><span class="journal-save-status">Saved locally</span><span class="journal-word-count">0 words</span></footer>
    </div>
  </section>`;
  const list=p.querySelector('.journal-note-list');
  const search=p.querySelector('.journal-search');
  const sort=p.querySelector('.journal-sort');
  const titleInput=p.querySelector('.journal-title-input');
  const editor=p.querySelector('.journal-editor');
  const categorySelect=p.querySelector('.journal-category-select');
  const meta=p.querySelector('.journal-note-meta');
  const count=p.querySelector('.journal-note-count');
  const wordCount=p.querySelector('.journal-word-count');
  const saveStatus=p.querySelector('.journal-save-status');
  const highlights=p.querySelector('.journal-search-highlights');
  const importInput=p.querySelector('.journal-import-input');
  search.value=state.journalView.search||'';
  sort.value=state.journalView.sort||'updated-desc';
  let saveTimer=null;
  const current=()=>state.journalNotes.find(note=>note.id===state.activeJournalNoteId)||state.journalNotes[0];
  const noteMatches=(note,term)=>!term||`${note.title} ${note.content}`.toLowerCase().includes(term);
  const sortedNotes=()=>{
    const term=search.value.trim().toLowerCase();
    const mode=sort.value;
    const notes=state.journalNotes.filter(note=>noteMatches(note,term) && (mode!=='favorites' || note.pinned));
    notes.sort((a,b)=>{
      if(a.pinned!==b.pinned)return a.pinned?-1:1;
      if(mode==='title-asc')return a.title.localeCompare(b.title);
      if(mode==='title-desc')return b.title.localeCompare(a.title);
      if(mode==='created-desc')return new Date(b.createdAt)-new Date(a.createdAt);
      if(mode==='favorites')return new Date(b.updatedAt)-new Date(a.updatedAt);
      return new Date(b.updatedAt)-new Date(a.updatedAt);
    });
    return notes;
  };
  const updateWordCount=()=>{
    const words=editor.value.trim()?editor.value.trim().split(/\s+/).length:0;
    wordCount.textContent=`${words} word${words===1?'':'s'} • ${editor.value.length} characters`;
  };
  const renderList=()=>{
    try{
      ensureJournalState();
      const notes=sortedNotes();
      list.innerHTML='';
      notes.forEach(note=>{
        const category=getJournalCategory(note.category);
        const preview=String(note.content||'').replace(/\s+/g,' ').trim()||'Empty note';
        const item=document.createElement('div');
        item.className=`journal-note-item${note.id===state.activeJournalNoteId?' active':''}`;
        item.dataset.noteId=note.id;
        item.setAttribute('role','button');
        item.setAttribute('tabindex','0');
        item.style.setProperty('--journal-category',category.color);
        item.innerHTML=`<span class="journal-note-top"><strong>${escapeItemHtml(note.title||'Untitled Note')}</strong>${note.pinned?'<span class="journal-pin-mark">★</span>':''}</span><span class="journal-note-category"><i></i>${escapeItemHtml(category.label)}</span><span class="journal-note-preview">${escapeItemHtml(preview.slice(0,72))}</span><span class="journal-note-time">${formatDate(note.updatedAt)}</span>`;
        const openNote=()=>{
          clearTimeout(saveTimer);
          state.activeJournalNoteId=note.id;
          persistJournalNow();
          loadCurrent();
          renderList();
        };
        item.addEventListener('click',openNote);
        item.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openNote();}});
        list.appendChild(item);
      });
      if(!notes.length){
        const empty=document.createElement('div');
        empty.className='journal-empty-search';
        empty.textContent=sort.value==='favorites'?'No favorite notes yet.':(search.value.trim()?'No notes match your search.':'No notes saved yet.');
        list.appendChild(empty);
      }
      list.dataset.noteCount=String(notes.length);
      count.textContent=`${state.journalNotes.length} note${state.journalNotes.length===1?'':'s'}`;
      list.style.display='flex';
      list.style.visibility='visible';
      list.style.opacity='1';
    }catch(error){
      console.error('Journal sidebar render failed',error);
      list.innerHTML='<div class="journal-empty-search">Journal sidebar could not render. Save or reopen the Journal to retry.</div>';
    }
  };
  const renderSearchHighlights=()=>{
    const note=current();
    const term=search.value.trim();
    if(!term){highlights.hidden=true;highlights.innerHTML='';return;}
    const escapedTerm=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const regex=new RegExp(`(${escapedTerm})`,'gi');
    const markText=value=>escapeItemHtml(String(value||'')).replace(regex,'<mark>$1</mark>').replace(/\n/g,'<br>');
    highlights.innerHTML=`<strong>SEARCH MATCHES</strong><div class="journal-highlight-title">${markText(note.title)}</div><div class="journal-highlight-content">${markText(note.content)}</div>`;
    highlights.hidden=false;
  };
  const loadCurrent=()=>{
    const note=current();
    titleInput.value=note.title;
    editor.value=note.content;
    categorySelect.value=getJournalCategory(note.category).id;
    categorySelect.style.setProperty('--journal-category',getJournalCategory(note.category).color);
    meta.textContent=`Updated ${formatDate(note.updatedAt)}`;
    p.querySelector('[data-journal-pin]').textContent=note.pinned?'★':'☆';
    p.querySelector('[data-journal-pin]').classList.toggle('active',note.pinned);
    updateWordCount();
    renderSearchHighlights();
  };
  const commitCurrent=()=>{
    const note=current();
    note.title=titleInput.value.trim()||'Untitled Note';
    note.content=editor.value;
    note.category=getJournalCategory(categorySelect.value).id;
    note.updatedAt=new Date().toISOString();
    state.journal=note.content;
    persistJournalNow();
    save();
    meta.textContent=`Updated ${formatDate(note.updatedAt)}`;
    saveStatus.textContent='Saved locally';
    saveStatus.classList.remove('saving');
    renderList();
  };
  const scheduleSave=()=>{
    saveStatus.textContent='Saving...';saveStatus.classList.add('saving');
    clearTimeout(saveTimer);saveTimer=setTimeout(commitCurrent,160);
  };
  const createNote=(seed={})=>{
    const now=new Date().toISOString();
    const note={id:`journal-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,title:seed.title||'New Note',content:seed.content||'',pinned:false,category:getJournalCategory(seed.category).id,createdAt:now,updatedAt:now};
    state.journalNotes.unshift(note);state.activeJournalNoteId=note.id;persistJournalNow();save();search.value='';state.journalView.search='';loadCurrent();renderList();titleInput.focus();titleInput.select();
  };
  search.oninput=()=>{state.journalView.search=search.value;save();renderList();renderSearchHighlights();};
  sort.onchange=()=>{state.journalView.sort=sort.value;save();renderList();};
  titleInput.oninput=scheduleSave;
  editor.oninput=()=>{updateWordCount();scheduleSave();};
  categorySelect.onchange=()=>{categorySelect.style.setProperty('--journal-category',getJournalCategory(categorySelect.value).color);commitCurrent();};
  titleInput.onblur=commitCurrent;
  editor.onblur=commitCurrent;
  p.querySelector('[data-journal-new]').onclick=()=>createNote();
  p.querySelector('[data-journal-save]').onclick=()=>{
    clearTimeout(saveTimer);
    search.value='';
    state.journalView.search='';
    commitCurrent();
    persistJournalNow();
    renderList();
    requestAnimationFrame(renderList);
    saveStatus.textContent='Saved to journal';
    toast('Note saved');
  };
  p.querySelector('[data-journal-pin]').onclick=()=>{const note=current();note.pinned=!note.pinned;note.updatedAt=new Date().toISOString();save();loadCurrent();renderList();toast(note.pinned?'Added to favorites':'Removed from favorites');};
  p.querySelector('[data-journal-duplicate]').onclick=()=>{const note=current();createNote({title:`${note.title} Copy`,content:note.content,category:note.category});};
  p.querySelector('[data-journal-export]').onclick=()=>{const note=current();downloadText(`${safeFileName(note.title)}.txt`,`${note.title}\n${'='.repeat(note.title.length)}\n\n${note.content}`);};
  p.querySelector('[data-journal-import]').onclick=()=>importInput.click();
  importInput.onchange=async()=>{
    const files=[...importInput.files];
    if(!files.length)return;
    let imported=0;
    for(const file of files){
      try{
        const text=await file.text();
        if(file.name.toLowerCase().endsWith('.json')){
          const parsed=JSON.parse(text);
          const candidates=Array.isArray(parsed)?parsed:(Array.isArray(parsed.notes)?parsed.notes:[parsed]);
          candidates.forEach(entry=>{
            if(!entry||typeof entry!=='object')return;
            createNote({title:String(entry.title||entry.name||file.name.replace(/\.json$/i,'')),content:String(entry.content??entry.body??entry.description??''),category:entry.category});
            const note=current();note.pinned=Boolean(entry.pinned||entry.favorite);persistJournalNow();imported++;
          });
        }else{
          createNote({title:file.name.replace(/\.(txt|md)$/i,''),content:text,category:'session'});
          imported++;
        }
      }catch(error){console.error('Unable to import journal note',file.name,error);}
    }
    importInput.value='';
    persistJournalNow();save();loadCurrent();renderList();
    toast(`${imported} note${imported===1?'':'s'} imported`);
  };
  p.querySelector('[data-journal-export-all]').onclick=()=>{const text=state.journalNotes.map(note=>`${note.title}\n${'='.repeat(note.title.length)}\nUpdated: ${formatDate(note.updatedAt)}\n\n${note.content}`).join('\n\n\n---\n\n\n');downloadText('Alkander-Journal-All-Notes.txt',text);};
  p.querySelector('[data-journal-delete]').onclick=()=>{
    clearTimeout(saveTimer);
    const note=current();
    if(!note)return;
    if(!confirm(`Delete "${note.title}"?`))return;
    state.journalNotes=state.journalNotes.filter(entry=>entry.id!==note.id);
    if(!state.journalNotes.length){
      const now=new Date().toISOString();
      state.journalNotes=[{
        id:`journal-${Date.now()}-main`,
        title:'New Note',
        content:'',
        pinned:false,
        category:'session',
        createdAt:now,
        updatedAt:now
      }];
    }
    state.activeJournalNoteId=state.journalNotes[0].id;
    state.journalView.search='';
    search.value='';
    persistJournalNow();
    save();
    loadCurrent();
    renderList();
    toast('Note deleted');
  };
  loadCurrent();renderList();
}
function levelUpToBard6(){
  ensureCharacterState();
  if(state.character.bardLevel>=6 || state.character.levelUpBard6Applied){
    toast('Alkander is already Bard level 6');
    return;
  }
  state.character.bardLevel=6;
  state.character.levelUpBard6Applied=true;
  state.maxHp=Math.max(1,Number(state.maxHp)||0)+10;
  state.hp=Math.min(state.maxHp,(Number(state.hp)||0)+10);
  state.rest=state.rest||{};
  state.rest.bardHitDice=6;
  save();
  renderCombat();
  renderFeatures();
  renderSettingsDialog();
  toast('Level up complete: Bard 6, +10 HP');
}
function ensureSettingsDialog(){
  let dialog=document.getElementById('settingsDialog');
  if(dialog)return dialog;
  dialog=document.createElement('dialog');
  dialog.id='settingsDialog';
  dialog.innerHTML='<div class="dialog-card settings-dialog-card"><button class="dialog-close" aria-label="Close">×</button><div class="settings-dialog-body"></div></div>';
  document.body.appendChild(dialog);
  dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  return dialog;
}
function renderSettingsDialog(){
  ensureCharacterState();
  const dialog=ensureSettingsDialog();
  const body=dialog.querySelector('.settings-dialog-body');
  const levelled=state.character.bardLevel>=6 || state.character.levelUpBard6Applied;
  body.innerHTML=`<div class="settings-heading"><div><div class="settings-kicker">ALKANDER</div><h2>SETTINGS</h2></div><div class="settings-level">Bard ${state.character.bardLevel} / Warlock ${state.character.warlockLevel}</div></div>
    <section class="settings-section"><h3>Display</h3>
      <label class="settings-toggle"><span><strong>Reduce Motion</strong><small>Freeze animated portrait and vitality backgrounds.</small></span><input type="checkbox" data-setting="reduceMotion" ${state.settings.reduceMotion?'checked':''}></label>
      <label class="settings-toggle"><span><strong>Compact Dialogs</strong><small>Use tighter spacing in spell and feature popups.</small></span><input type="checkbox" data-setting="compactDialogs" ${state.settings.compactDialogs?'checked':''}></label>
    </section>
    <section class="settings-section"><h3>Character Statistics</h3>
      <div class="settings-stat-grid">
        ${[['AC','ac'],['Initiative','initiative'],['Speed','speed'],['Proficiency','proficiency']].map(([label,key])=>`<label><span>${label}</span><input type="number" data-character-stat="${key}" value="${Number(state[key])||0}"></label>`).join('')}
      </div>
      <div class="settings-ability-grid">
        ${Object.entries(state.abilities).map(([key,value])=>`<label><span>${key}</span><input type="number" min="1" max="30" data-ability-score="${key}" value="${Number(value[0])||10}"></label>`).join('')}
      </div>
    </section>
    <section class="settings-section"><h3>Skill Proficiencies & Modifiers</h3><div class="settings-skill-list">
      ${state.skills.map(([name,bonus,ability,proficient])=>`<div class="settings-skill-row"><span><strong>${name}</strong><small>${ability}</small></span><label class="settings-skill-prof"><input type="checkbox" data-skill-prof="${name}" ${proficient?'checked':''}> Proficient</label><label class="settings-skill-mod">Modifier <input type="number" data-skill-bonus="${name}" value="${Number(bonus)||0}"></label></div>`).join('')}
    </div></section>
    <section class="settings-section level-up-section ${levelled?'complete':''}"><div class="level-up-copy"><h3>Level Up to Bard 6</h3><p>${levelled?'Level up completed. Countercharm, Unfailing Inspiration, and Universal Speech are unlocked.':'Increase maximum and current HP by 10, increase Bard Hit Dice to 6, and unlock the new Bard and College of Eloquence features.'}</p></div><button class="gold-btn level-up-button" data-level-up ${levelled?'disabled':''}>${levelled?'BARD 6 UNLOCKED':'LEVEL UP'}</button></section>
    <section class="settings-section settings-actions"><h3>Character Data</h3><button class="settings-action-button" data-export-save>Export Save Data</button><button class="settings-action-button danger" data-reset-sheet>Reset Character Sheet</button></section>`;
  body.querySelectorAll('[data-setting]').forEach(input=>input.onchange=()=>{
    state.settings[input.dataset.setting]=input.checked;
    if(input.dataset.setting==='reduceMotion'){
      videosFrozen=input.checked;
      document.querySelectorAll('#combat video').forEach(video=>input.checked?freezeVideoOnFirstFrame(video):restartSheetVideo(video));
    }
    applySettingsClasses();save();
  });
  body.querySelectorAll('[data-character-stat]').forEach(input=>input.onchange=()=>{
    const key=input.dataset.characterStat;
    state[key]=Number(input.value)||0;
    save();renderCombat();renderSkills();
  });
  body.querySelectorAll('[data-ability-score]').forEach(input=>input.onchange=()=>{
    const key=input.dataset.abilityScore;
    const prior=state.abilities[key]||[10,0,0];
    const score=Math.max(1,Math.min(30,Number(input.value)||10));
    const modifier=Math.floor((score-10)/2);
    const saveTraining=(Number(prior[2])||0)-(Number(prior[1])||0);
    state.abilities[key]=[score,modifier,modifier+saveTraining];
    save();renderCombat();
  });
  body.querySelectorAll('[data-skill-prof]').forEach(input=>input.onchange=()=>{
    const skill=state.skills.find(entry=>entry[0]===input.dataset.skillProf);
    if(skill)skill[3]=input.checked;
    save();renderSkills();
  });
  body.querySelectorAll('[data-skill-bonus]').forEach(input=>input.onchange=()=>{
    const skill=state.skills.find(entry=>entry[0]===input.dataset.skillBonus);
    if(skill)skill[1]=Number(input.value)||0;
    save();renderSkills();
  });
  const levelButton=body.querySelector('[data-level-up]');
  if(levelButton)levelButton.onclick=levelUpToBard6;
  body.querySelector('[data-export-save]').onclick=()=>downloadText('Alkander-Character-Save.json',JSON.stringify(state,null,2));
  body.querySelector('[data-reset-sheet]').onclick=()=>{
    if(!confirm('Reset all character-sheet data? This cannot be undone.'))return;
    localStorage.removeItem('alkanderSheet');
    localStorage.removeItem(JOURNAL_STORAGE_KEY);
    location.reload();
  };
}
function openSettingsDialog(){
  renderSettingsDialog();
  const dialog=ensureSettingsDialog();
  if(!dialog.open)dialog.showModal();
}
function renderAll(){applySettingsClasses();renderCombat();renderSpells();renderFeatures();renderSkills();renderInventory();renderJournal()}
initTabs();renderAll();ensureVitalityDialog();$('#resetBtn').onclick=toggleSheetVideos;$('#layoutModeToggle').onclick=openSettingsDialog;


// Keep the sheet at a fixed 1368 x 801 layout and block common browser zoom shortcuts.
(function lockSheetZoom(){
  const stop = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  window.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey) stop(event);
  }, { passive:false, capture:true });

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if ((event.ctrlKey || event.metaKey) && (key === '+' || key === '-' || key === '=' || key === '0')) {
      stop(event);
    }
  }, true);

  ['gesturestart','gesturechange','gestureend'].forEach((name) => {
    window.addEventListener(name, stop, { passive:false, capture:true });
  });
})();
