// MM2 Vault — deterministic market engine (no external AI required)
(function(){
  const MAX_HISTORY=60, LARGE_CHANGE_PERCENT=35;
  const finite=n=>Number.isFinite(Number(n))?Number(n):0;
  function percent(oldValue,newValue){oldValue=finite(oldValue);newValue=finite(newValue);return oldValue?((newValue-oldValue)/oldValue)*100:0}
  function signal(changePercent){return changePercent>2?'rising':changePercent<-2?'falling':'stable'}
  function historyFor(item){
    const current=finite(item?.value);
    const raw=Array.isArray(item?.valueHistory)?item.valueHistory:[];
    const history=raw.map((x,i)=>({value:finite(x?.value),date:x?.changedAt||x?.date||null,source:x?.source||'unknown',index:i})).filter(x=>x.value>=0);
    if(!history.length || history[history.length-1].value!==current) history.push({value:current,date:item?.valueUpdatedAt?.toDate?.()?.toISOString?.()||new Date().toISOString(),source:'current',index:history.length});
    return history.slice(-MAX_HISTORY);
  }
  function trend(item,days=7){
    const h=historyFor(item); if(h.length<2) return {change:0,percent:0,signal:'stable',points:h.length};
    const latest=h[h.length-1];
    const cutoff=Date.now()-days*86400000;
    const candidates=h.filter(x=>!x.date || Date.parse(x.date)>=cutoff);
    const base=(candidates[0]||h[Math.max(0,h.length-2)]).value;
    const p=percent(base,latest.value);
    return {change:latest.value-base,percent:p,signal:signal(p),points:candidates.length,from:base,to:latest.value};
  }
  function summarizeItem(item){
    const t7=trend(item,7),t30=trend(item,30);
    const current=finite(item?.value), previous=finite(item?.previousValue);
    const p=current&&previous?percent(previous,current):t7.percent;
    const anomaly=Math.abs(p)>=LARGE_CHANGE_PERCENT;
    return {...item,value:current,valueChange:current-previous,valueChangePercent:p,marketSignal:signal(p),trend7d:t7,trend30d:t30,anomaly};
  }
  function matchItem(line,items){
    const text=String(line||'').toLowerCase();
    return [...items].sort((a,b)=>String(b.name||'').length-String(a.name||'').length).find(i=>text.includes(String(i.name||'').toLowerCase()));
  }
  function parseValueUpdateText(sourceText,items){
    const updates=[],unmatched=[];
    String(sourceText||'').split(/\n+/).map(x=>x.trim()).filter(Boolean).forEach(line=>{
      const item=matchItem(line,items);
      if(!item){unmatched.push(line);return;}
      const nums=[...line.matchAll(/[-+]?\d[\d,]*(?:\.\d+)?/g)].map(m=>Number(m[0].replace(/,/g,'')));
      const arrows=line.match(/(?:->|→|to|new|now|value|v:)\s*([\d,]+(?:\.\d+)?)/i);
      let newValue=arrows?Number(arrows[1].replace(/,/g,'')):NaN;
      const delta=line.match(/[+−-]\s*([\d,]+(?:\.\d+)?)/);
      const oldValue=finite(item.value);
      if(!Number.isFinite(newValue)&&delta)newValue=oldValue+(line.includes('−')?-1:1)*Number(delta[1].replace(/,/g,''));
      if(!Number.isFinite(newValue)&&nums.length>=2)newValue=nums[nums.length-1];
      if(!Number.isFinite(newValue)){unmatched.push(line);return;}
      newValue=Math.max(0,newValue);
      const change=newValue-oldValue, p=percent(oldValue,newValue), anomaly=Math.abs(p)>=LARGE_CHANGE_PERCENT;
      updates.push({id:item.id,name:item.name,oldValue,newValue,change,direction:change>0?'up':change<0?'down':'same',confidence:anomaly?'low':'high',anomaly,changePercent:p,reason:anomaly?'Large change — manual confirmation required':'Deterministic market parser'});
    });
    return {updates,unmatched,engine:'MM2 Market Engine'};
  }
  window.MM2MarketEngine=Object.freeze({percent,signal,historyFor,trend,summarizeItem,parseValueUpdateText,LARGE_CHANGE_PERCENT});
})();